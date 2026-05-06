import type {
  Agent,
  BibliographicReactionObjectBROV10,
  ExternalReference,
  PropertyValue,
} from "../validator/schema-types";

function yamlScalar(value: unknown): string {
  if (value === null || value === undefined) return '""';
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  const text = String(value);
  if (text === "" || text.trim() !== text || /[:#\[\]{}&*!|>'"%@`,\n]/.test(text)) {
    return JSON.stringify(text);
  }
  return text;
}

function yamlStringArray(key: string, values: readonly string[] | undefined): string[] {
  if (!values || values.length === 0) return [];
  return [key, ...values.map((value) => `  - ${yamlScalar(value)}`)];
}

function renderExternalReference(key: string, references: readonly ExternalReference[] | undefined): string[] {
  if (!references || references.length === 0) return [];
  const lines = [`${key}:`];
  for (const reference of references) {
    lines.push(`  - type: ${yamlScalar(reference["@type"])}`);
    lines.push(`    identifier: ${yamlScalar(reference.identifier)}`);
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
    frontmatter.push(...renderExternalReference("about", payload.about));
  }

  if (payload["@type"] === "ReactionAbstract") {
    if (payload.datePublished) frontmatter.push(`datePublished: ${yamlScalar(payload.datePublished)}`);
    frontmatter.push(...renderExternalReference("isBasedOn", payload.isBasedOn));
  }

  if (payload["@type"] === "ReactionList") {
    frontmatter.push("itemListElement:");
    for (const element of payload.itemListElement) {
      frontmatter.push(`  - id: ${yamlScalar(element["@id"])}`);
      if (element["@type"]) frontmatter.push(`    type: ${yamlScalar(element["@type"])}`);
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
