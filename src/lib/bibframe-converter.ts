import type {
  Agent,
  BasedOnReference,
  BibliographicReactionObjectBROV10,
  EntityIri,
  IdentifierValue,
  ListElement,
  TargetReference,
  WorkReference,
} from "../validator/schema-types";

export interface BibframeContribution {
  "@type": "bf:Contribution";
  "bf:agent": {
    "@type": string;
    "@id"?: string;
    "rdfs:label": string;
  };
  "bf:role"?: {
    "@type": "bf:Role";
    "rdfs:label": string;
  };
}

export interface BibframeIdentifier {
  "@type": "bf:Identifier";
  "rdf:value": string;
}

export interface BibframeInstance {
  "@type": "bf:Instance";
  "bf:identifiedBy"?: BibframeIdentifier | BibframeIdentifier[];
  "bf:instanceOf"?: { "@id": string; "@type": string };
  "rdfs:label"?: string;
}

export interface BibframeNote {
  "@type": "bf:Note";
  "rdfs:label": string;
}

export interface BibframeWork {
  "@context": {
    bf: string;
    rdf: string;
    rdfs: string;
    schema: string;
    bro: string;
  };
  "@type": string[];
  "@id": string;
  "bf:originDate": string;
  "bf:changeDate"?: string;
  "bf:contribution": BibframeContribution[];
  "bf:title"?: {
    "@type": "bf:Title";
    "bf:mainTitle": string;
  };
  "bf:note"?: BibframeNote;
  [key: string]: unknown;
}

function agentLabel(agent: Agent): string {
  if (agent["@type"] === "Role") return agent.roleName || agentLabel(agent.agent);
  if ("name" in agent && agent.name) return agent.name;
  return "Unknown agent";
}

function agentType(agent: Agent): string {
  const concreteAgent = agent["@type"] === "Role" ? agent.agent : agent;
  switch (concreteAgent["@type"]) {
    case "Person":
    case "UnknownAgent":
      return "bf:Person";
    case "Organization":
      return "bf:Organization";
    case "SoftwareApplication":
      return "bf:Agent";
    default:
      return "bf:Agent";
  }
}

function agentId(agent: Agent): string | undefined {
  const concreteAgent = agent["@type"] === "Role" ? agent.agent : agent;
  return "@id" in concreteAgent ? concreteAgent["@id"] : undefined;
}

function contributionFromAgent(agent: Agent): BibframeContribution {
  const contribution: BibframeContribution = {
    "@type": "bf:Contribution",
    "bf:agent": {
      "@type": agentType(agent),
      "rdfs:label": agentLabel(agent),
    },
  };

  const id = agentId(agent);
  if (id) contribution["bf:agent"]["@id"] = id;

  if (agent["@type"] === "Role" && agent.roleName) {
    contribution["bf:role"] = {
      "@type": "bf:Role",
      "rdfs:label": agent.roleName,
    };
  }

  return contribution;
}

function isEntityReference(
  reference: TargetReference | BasedOnReference | ListElement,
): reference is { readonly "@id": EntityIri; readonly "@type"?: string } {
  return "@id" in reference;
}

function identifierLabel(identifier: IdentifierValue): string {
  if (typeof identifier === "string") return identifier;
  const authority = identifier.propertyID ?? identifier.name ?? "PropertyValue";
  return `${authority}:${String(identifier.value)}`;
}

function identifierValues(reference: WorkReference): string[] {
  const identifier = reference.identifier;
  if (!identifier) return [];
  if (Array.isArray(identifier)) return (identifier as readonly IdentifierValue[]).map(identifierLabel);
  return [identifierLabel(identifier as IdentifierValue)];
}

function instanceFromWorkReference(reference: WorkReference): BibframeInstance {
  const identifiers = identifierValues(reference);
  const instance: BibframeInstance = {
    "@type": "bf:Instance",
    ...(reference.name ? { "rdfs:label": reference.name } : {}),
    ...(identifiers.length > 0
      ? {
          "bf:identifiedBy": identifiers.map((identifier) => ({
            "@type": "bf:Identifier" as const,
            "rdf:value": identifier,
          })),
        }
      : {}),
  };

  if (identifiers[0]) {
    instance["bf:instanceOf"] = {
      "@id": identifiers[0],
      "@type": `schema:${reference["@type"]}`,
    };
  }

  return instance;
}

function instanceFromReference(reference: TargetReference | BasedOnReference | ListElement): BibframeInstance {
  if (isEntityReference(reference)) {
    return {
      "@type": "bf:Instance",
      "bf:instanceOf": {
        "@id": reference["@id"],
        "@type": reference["@type"] ? `bro:${reference["@type"]}` : "bf:Work",
      },
    };
  }

  return instanceFromWorkReference(reference);
}

function itemNodeFromReference(reference: ListElement) {
  if (isEntityReference(reference)) {
    return {
      "@id": reference["@id"],
      "@type": reference["@type"] ? `bro:${reference["@type"]}` : "bf:Work",
    };
  }

  return {
    ...instanceFromWorkReference(reference),
    "@type": "bf:Instance" as const,
  };
}

export function convertBroToBibframe(payload: BibliographicReactionObjectBROV10): BibframeWork {
  const base: BibframeWork = {
    "@context": {
      bf: "http://id.loc.gov/ontologies/bibframe/",
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      schema: "https://schema.org/",
      bro: "https://schema.slat.or.kr/bro/v1.0/vocab#",
    },
    "@type": ["bf:Work"],
    "@id": payload["@id"],
    "bf:originDate": payload.dateCreated,
    ...(payload.dateModified ? { "bf:changeDate": payload.dateModified } : {}),
    "bf:contribution": payload.creator.map(contributionFromAgent),
    ...(payload.name
      ? {
          "bf:title": {
            "@type": "bf:Title" as const,
            "bf:mainTitle": payload.name,
          },
        }
      : {}),
  };

  if (payload["@type"] === "Reaction") {
    return {
      ...base,
      "@type": ["bf:Work", "bf:Review", "bro:Reaction"],
      "bf:reviewOf": payload.about.map(instanceFromReference),
      "bro:reactionType": `bro:${payload.reactionType}`,
      "bf:note": {
        "@type": "bf:Note",
        "rdfs:label": payload.text,
      },
    };
  }

  if (payload["@type"] === "ReactionAbstract") {
    return {
      ...base,
      "@type": ["bf:Work", "bf:Summary", "bro:ReactionAbstract"],
      "bf:summaryOf": payload.isBasedOn.map(instanceFromReference),
      "bf:note": {
        "@type": "bf:Note",
        "rdfs:label": payload.text,
      },
    };
  }

  return {
    ...base,
    "@type": ["bf:Work", "bf:Collection", "bro:ReactionList"],
    "bf:hasItem": payload.itemListElement.map(itemNodeFromReference),
  };
}
