import type {
  Agent,
  BasedOnReference,
  BibliographicReactionObjectBROV10,
  IdentifierValue,
  ListElement,
  PropertyValue,
  TargetReference,
  WorkReference,
} from "../validator/schema-types";

function yamlScalar(value: unknown): string {
  if (value === null || value === undefined) return '""';
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  const text = String(value);
  if (text === "" || text.trim() !== text || /[:#[\]{}&*!|>'"%@`,\n]/.test(text)) {
    return JSON.stringify(text);
  }
  return text;
}

function yamlStringArray(key: string, values: readonly string[] | undefined): string[] {
  if (!values || values.length === 0) return [];
  return [key, ...values.map((value) => `  - ${yamlScalar(value)}`)];
}

function yamlValueArray(key: string, value: string | readonly string[] | undefined): string[] {
  if (!value) return [];
  if (!Array.isArray(value)) return [`${key} ${yamlScalar(value)}`];
  const indent = key.match(/^\s*/)?.[0] ?? "";
  return [key, ...value.map((item) => `${indent}  - ${yamlScalar(item)}`)];
}

function renderIdentifierValue(identifier: IdentifierValue, indent: string): string[] {
  if (typeof identifier === "string") return [`${indent}- ${yamlScalar(identifier)}`];
  const lines = [`${indent}- type: ${yamlScalar(identifier["@type"])}`];
  if (identifier.name) lines.push(`${indent}  name: ${yamlScalar(identifier.name)}`);
  if (identifier.propertyID) lines.push(`${indent}  propertyID: ${yamlScalar(identifier.propertyID)}`);
  lines.push(`${indent}  value: ${yamlScalar(identifier.value)}`);
  if (identifier.valueReference) lines.push(`${indent}  valueReference: ${yamlScalar(identifier.valueReference)}`);
  return lines;
}

function renderIdentifierSet(reference: WorkReference, indent: string): string[] {
  if (!reference.identifier) return [];
  const identifiers = Array.isArray(reference.identifier) ? reference.identifier : [reference.identifier];
  return [`${indent}identifier:`, ...identifiers.flatMap((identifier) => renderIdentifierValue(identifier, `${indent}  `))];
}

function renderWorkReference(reference: WorkReference, indent: string): string[] {
  const lines = [`${indent}- type: ${yamlScalar(reference["@type"])}`];
  lines.push(...renderIdentifierSet(reference, `${indent}  `));
  if (reference.name) lines.push(`${indent}  name: ${yamlScalar(reference.name)}`);
  if (reference.creatorName) {
    lines.push(...yamlValueArray(`${indent}  creatorName:`, reference.creatorName));
  }
  if (reference.publisherName) lines.push(`${indent}  publisherName: ${yamlScalar(reference.publisherName)}`);
  if (reference.datePublished) lines.push(`${indent}  datePublished: ${yamlScalar(reference.datePublished)}`);
  if (reference.bookEdition) lines.push(`${indent}  bookEdition: ${yamlScalar(reference.bookEdition)}`);
  if (reference.bibliographicLevel) lines.push(`${indent}  bibliographicLevel: ${yamlScalar(reference.bibliographicLevel)}`);
  if (reference.url) lines.push(...yamlValueArray(`${indent}  url:`, reference.url));
  return lines;
}

function renderReferences(key: string, references: readonly (TargetReference | BasedOnReference)[] | undefined): string[] {
  if (!references || references.length === 0) return [];
  const lines = [`${key}:`];
  for (const reference of references) {
    if ("@id" in reference) {
      lines.push(`  - id: ${yamlScalar(reference["@id"])}`);
      if (reference["@type"]) lines.push(`    type: ${yamlScalar(reference["@type"])}`);
    } else {
      lines.push(...renderWorkReference(reference, "  "));
    }
  }
  return lines;
}

function renderAgent(agent: Agent, indent = "  "): string[] {
  const lines = [`${indent}- type: ${yamlScalar(agent["@type"])}`];

  if ("name" in agent && agent.name) lines.push(`${indent}  name: ${yamlScalar(agent.name)}`);
  if ("@id" in agent && agent["@id"]) lines.push(`${indent}  id: ${yamlScalar(agent["@id"])}`);
  if (agent["@type"] === "SoftwareApplication" && agent.softwareVersion) {
    lines.push(`${indent}  softwareVersion: ${yamlScalar(agent.softwareVersion)}`);
  }
  if (agent["@type"] === "Role") {
    if (agent.roleName) lines.push(`${indent}  roleName: ${yamlScalar(agent.roleName)}`);
    if (agent.startDate) lines.push(`${indent}  startDate: ${yamlScalar(agent.startDate)}`);
    if (agent.endDate) lines.push(`${indent}  endDate: ${yamlScalar(agent.endDate)}`);
    lines.push(`${indent}  agent:`);
    const nested = renderAgent(agent.agent, `${indent}    `);
    lines.push(...nested.map((line) => line.replace(`${indent}    - `, `${indent}    `)));
  }

  return lines;
}

function renderCreators(creators: readonly Agent[]): string[] {
  return ["creator:", ...creators.flatMap((creator) => renderAgent(creator))];
}

function renderAdditionalProperty(properties: readonly PropertyValue[] | undefined): string[] {
  if (!properties || properties.length === 0) return [];
  const lines = ["additionalProperty:"];
  for (const property of properties) {
    lines.push(`  - name: ${yamlScalar(property.name)}`);
    lines.push(`    value: ${yamlScalar(JSON.stringify(property.value))}`);
    if (property.propertyID) lines.push(`    propertyID: ${yamlScalar(property.propertyID)}`);
    if (property.valueReference) lines.push(`    valueReference: ${yamlScalar(property.valueReference)}`);
    if (property.unitCode) lines.push(`    unitCode: ${yamlScalar(property.unitCode)}`);
    if (property.unitText) lines.push(`    unitText: ${yamlScalar(property.unitText)}`);
  }
  return lines;
}

export function renderBroToMarkdown(payload: BibliographicReactionObjectBROV10): string {
  const frontmatter: string[] = [
    `id: ${yamlScalar(payload["@id"])}`,
    `type: ${yamlScalar(payload["@type"])}`,
    `dateCreated: ${yamlScalar(payload.dateCreated)}`,
  ];

  if (payload.name) frontmatter.push(`name: ${yamlScalar(payload.name)}`);
  if (payload.byline) frontmatter.push(`byline: ${yamlScalar(payload.byline)}`);
  if (payload.dateModified) frontmatter.push(`dateModified: ${yamlScalar(payload.dateModified)}`);
  if (payload.license) frontmatter.push(`license: ${yamlScalar(payload.license)}`);

  if (payload["@type"] === "Reaction") {
    frontmatter.push(`reactionType: ${yamlScalar(payload.reactionType)}`);
    if (payload.datePublished) frontmatter.push(`datePublished: ${yamlScalar(payload.datePublished)}`);
    frontmatter.push(...renderReferences("about", payload.about));
  }

  if (payload["@type"] === "ReactionAbstract") {
    if (payload.datePublished) frontmatter.push(`datePublished: ${yamlScalar(payload.datePublished)}`);
    frontmatter.push(...renderReferences("isBasedOn", payload.isBasedOn));
  }

  if (payload["@type"] === "ReactionList") {
    frontmatter.push("itemListElement:");
    for (const element of payload.itemListElement as readonly ListElement[]) {
      if ("@id" in element) {
        frontmatter.push(`  - id: ${yamlScalar(element["@id"])}`);
        if (element["@type"]) frontmatter.push(`    type: ${yamlScalar(element["@type"])}`);
      } else {
        frontmatter.push(...renderWorkReference(element, "  "));
      }
    }
  }

  frontmatter.push(...renderCreators(payload.creator));
  frontmatter.push(...yamlStringArray("inLanguage:", payload.inLanguage));
  frontmatter.push(...yamlStringArray("keywords:", payload.keywords));
  if ("image" in payload) frontmatter.push(...yamlStringArray("image:", payload.image));
  if ("citation" in payload) frontmatter.push(...yamlStringArray("citation:", payload.citation));
  frontmatter.push(...renderAdditionalProperty(payload.additionalProperty));

  const metadata = `---\n${frontmatter.join("\n")}\n---`;
  const body = "text" in payload ? payload.text : "";
  return body ? `${metadata}\n\n${body}` : metadata;
}
