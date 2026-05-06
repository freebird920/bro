import type {
  Agent,
  BibliographicReactionObjectBROV10,
  ExternalReference,
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
  "bf:identifiedBy": BibframeIdentifier;
  "bf:instanceOf"?: { "@id": string; "@type": string };
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
    case "GovernmentOrganization":
    case "Corporation":
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

function instanceFromReference(reference: ExternalReference): BibframeInstance {
  return {
    "@type": "bf:Instance",
    "bf:identifiedBy": {
      "@type": "bf:Identifier",
      "rdf:value": reference.identifier,
    },
    "bf:instanceOf": {
      "@id": reference.identifier,
      "@type": `schema:${reference["@type"]}`,
    },
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
    "bf:hasItem": payload.itemListElement.map((element) => ({
      "@id": element["@id"],
      "@type": element["@type"] ? `bro:${element["@type"]}` : "bf:Work",
    })),
  };
}
