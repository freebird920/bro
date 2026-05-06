// This file is maintained from the BRO v1.0 README schema.
// Keep it synchronized with worker/assets/bro-v1-schema.json.

export const BRO_CONTEXT_IRI = "https://schema.slat.or.kr/bro/v1.0/context.jsonld" as const;
export const BRO_SCHEMA_IRI = "https://schema.slat.or.kr/bro/v1.0/schema.json" as const;
export const BRO_VOCAB_IRI = "https://schema.slat.or.kr/bro/v1.0/vocab#" as const;

export type BroContext =
  | typeof BRO_CONTEXT_IRI
  | readonly [typeof BRO_CONTEXT_IRI, ...Array<string | Record<string, unknown>>]
  | readonly [...Array<string | Record<string, unknown>>, typeof BRO_CONTEXT_IRI];

export type EntityIri = `urn:uuid:${string}` | `https://${string}`;
export type AgentIri = EntityIri | `mailto:${string}`;
export type AnyIri = AgentIri | `urn:isbn:${string}`;
export type Rfc3339DateTime = string;
export type Rfc3339Date = string;
export type LanguageTag = string;
export type TextFormat = string;

export type ReactionType = "Response" | "Listing" | "Unspecified";
export type BroEntityType = "Reaction" | "ReactionAbstract" | "ReactionList";
export type ExternalReferenceType =
  | "Article"
  | "CreativeWork"
  | "Book"
  | "ScholarlyArticle"
  | "Reaction"
  | "ReactionAbstract";

export interface ExternalReference {
  readonly "@type": ExternalReferenceType;
  identifier: string;
}

export interface ElementReference {
  readonly "@id": EntityIri;
  readonly "@type"?: BroEntityType;
}

export interface AgentPerson {
  readonly "@type": "Person";
  readonly "@id"?: AgentIri;
  name: string;
}

export interface AgentUnknown {
  readonly "@type": "UnknownAgent";
  name?: string;
}

export interface AgentGovernment {
  readonly "@type": "GovernmentOrganization";
  readonly "@id"?: EntityIri;
  name: string;
}

export interface AgentCorporation {
  readonly "@type": "Corporation";
  readonly "@id"?: EntityIri;
  name: string;
}

export interface AgentOrganization {
  readonly "@type": "Organization";
  readonly "@id"?: EntityIri;
  name: string;
}

export interface AgentSoftware {
  readonly "@type": "SoftwareApplication";
  readonly "@id": `https://${string}`;
  name: string;
  softwareVersion?: string;
}

export type AgentInRole =
  | AgentPerson
  | AgentUnknown
  | AgentGovernment
  | AgentCorporation
  | AgentOrganization
  | AgentSoftware;

export interface AgentRole {
  readonly "@type": "Role";
  roleName?: string;
  startDate?: Rfc3339Date;
  endDate?: Rfc3339Date;
  agent: AgentInRole;
}

export type Agent = AgentInRole | AgentRole;
export type CreatorRoot = Agent;

export interface PropertyValue {
  readonly "@type": "PropertyValue";
  name: string;
  propertyID?: string;
  value: unknown;
  valueReference?: string;
  unitCode?: string;
  unitText?: string;
}

export type AdditionalPropertyArray = PropertyValue[];

export interface BroBase {
  readonly "@context": BroContext;
  readonly "@id": EntityIri;
  name?: string;
  byline?: string;
  creator: [Agent, ...Agent[]];
  dateCreated: Rfc3339DateTime;
  dateModified?: Rfc3339DateTime;
  license?: `https://${string}`;
  inLanguage?: [LanguageTag, ...LanguageTag[]];
  keywords?: string[];
  additionalProperty?: AdditionalPropertyArray;
  [extensionKey: `${Lowercase<string>}:${string}`]: unknown;
}

export interface Reaction extends BroBase {
  readonly "@type": "Reaction";
  reactionType: ReactionType;
  about: [ExternalReference, ...ExternalReference[]];
  text: string;
  textFormat?: TextFormat;
  datePublished?: Rfc3339DateTime;
  image?: string[];
  citation?: string[];
}

export interface ReactionAbstract extends BroBase {
  readonly "@type": "ReactionAbstract";
  text: string;
  textFormat?: TextFormat;
  datePublished?: Rfc3339DateTime;
  isBasedOn: [ExternalReference, ...ExternalReference[]];
  image?: string[];
  citation?: string[];
}

export interface ReactionList extends BroBase {
  readonly "@type": "ReactionList";
  itemListElement: ElementReference[];
}

export type BibliographicReactionObjectBROV10 =
  | Reaction
  | ReactionAbstract
  | ReactionList;

export type BroPayload = BibliographicReactionObjectBROV10;
export type BroReaction = Reaction;
export type BroReactionAbstract = ReactionAbstract;
export type BroReactionList = ReactionList;

/**
 * Deprecated compatibility aliases for earlier internal code.
 * New code should use Reaction, ReactionAbstract, and ReactionList.
 */
export type BroArticle = Reaction;
export type BroAbstract = ReactionAbstract;
export type BroItemList = ReactionList;

export interface BroValidationError {
  location: string;
  keyword?: string;
  message: string;
  error?: string;
  instanceLocation?: string;
}

export interface BroValidationResult<T = unknown> {
  valid: boolean;
  errors: BroValidationError[];
  normalizedPayload?: T;
}
