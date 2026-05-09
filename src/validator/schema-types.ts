// This file is maintained from the BRO v1.0 README schema.
// Keep it synchronized with worker/assets/bro-v1-schema.json.

export const BRO_CONTEXT_IRI = "https://schema.slat.or.kr/bro/v1.0/context.jsonld" as const;
export const BRO_SCHEMA_IRI = "https://schema.slat.or.kr/bro/v1.0/schema.json" as const;
export const BRO_VOCAB_IRI = "https://schema.slat.or.kr/bro/v1.0/vocab#" as const;

export type BroContext =
  | typeof BRO_CONTEXT_IRI
  | readonly [typeof BRO_CONTEXT_IRI, ...Array<string | Record<string, unknown>>];

export type EntityIri = `urn:uuid:${string}` | `https://${string}`;
export type WebIri = `http://${string}` | `https://${string}`;
export type AgentIri = EntityIri | `mailto:${string}`;
export type Rfc3339DateTime = string;
export type Rfc3339Date = string;
export type BibliographicDate = Rfc3339DateTime | Rfc3339Date | string;
export type LanguageTag = string;
export type TextFormat = string;
export type BoundedJsonValue = string | number | boolean | null | readonly unknown[] | Record<string, unknown>;

export type ReactionType = "Response" | "Listing" | "Unspecified";
export type BroEntityType = "Reaction" | "ReactionAbstract" | "ReactionList";
export type BibliographicLevel = "Work" | "Edition" | "Item" | "Unspecified";
export type WorkType =
  | "CreativeWork"
  | "Book"
  | "Article"
  | "ScholarlyArticle"
  | "WebPage"
  | "Chapter"
  | "Periodical"
  | "Collection"
  | "Dataset"
  | "Report"
  | (string & {});

export interface IdentifierPropertyValue {
  readonly "@type": "PropertyValue";
  name?: string;
  propertyID?: string;
  value: string | number;
  valueReference?: string;
}

export type IdentifierValue = string | IdentifierPropertyValue;
export type IdentifierSet = IdentifierValue | readonly [IdentifierValue, ...IdentifierValue[]];

export interface PropertyValue {
  readonly "@type": "PropertyValue";
  name: string;
  propertyID?: string;
  value: BoundedJsonValue;
  valueReference?: string;
  unitCode?: string;
  unitText?: string;
}

export type AdditionalPropertyArray = PropertyValue[];

export interface WorkIdentityReference {
  readonly "@type": "CreativeWork";
  identifier?: IdentifierSet;
  name?: string;
  creatorName?: string | readonly [string, ...string[]];
}

export interface WorkReference {
  readonly "@type": WorkType;
  identifier?: IdentifierSet;
  name?: string;
  creatorName?: string | readonly [string, ...string[]];
  publisherName?: string;
  datePublished?: BibliographicDate;
  bookEdition?: string;
  inLanguage?: readonly [LanguageTag, ...LanguageTag[]];
  keywords?: string[];
  image?: string[];
  additionalProperty?: AdditionalPropertyArray;
  bibliographicLevel?: BibliographicLevel;
  url?: WebIri | readonly [WebIri, ...WebIri[]];
  exampleOfWork?: WorkIdentityReference;
}

export interface BroReference {
  readonly "@id": EntityIri;
  readonly "@type"?: "Reaction" | "ReactionAbstract";
}

export interface ListEntityReference {
  readonly "@id": EntityIri;
  readonly "@type"?: "Reaction" | "ReactionAbstract";
}

export interface BasedOnEntityReference {
  readonly "@id": EntityIri;
  readonly "@type"?: BroEntityType;
}

export type TargetReference = WorkReference | BroReference;
export type ListElement = WorkReference | ListEntityReference;
export type BasedOnReference = WorkReference | BasedOnEntityReference;

export interface AgentPerson {
  readonly "@type": "Person";
  readonly "@id"?: AgentIri;
  name: string;
}

export interface AgentUnknown {
  readonly "@type": "UnknownAgent";
  name?: string;
}

export interface AgentOrganization {
  readonly "@type": "Organization";
  readonly "@id"?: `urn:uuid:${string}` | WebIri;
  name: string;
}

export interface AgentSoftware {
  readonly "@type": "SoftwareApplication";
  readonly "@id": `https://${string}`;
  name: string;
  softwareVersion?: string;
}

export type AgentInRole = AgentPerson | AgentUnknown | AgentOrganization | AgentSoftware;

export interface AgentRole {
  readonly "@type": "Role";
  roleName?: string;
  startDate?: Rfc3339Date;
  endDate?: Rfc3339Date;
  agent: AgentInRole;
}

export type Agent = AgentInRole | AgentRole;
export type CreatorRoot = Agent;

export interface BroBase {
  readonly "@context": BroContext;
  readonly "@id": EntityIri;
  name?: string;
  byline?: string;
  creator: [Agent, ...Agent[]];
  dateCreated: Rfc3339DateTime;
  dateModified?: Rfc3339DateTime;
  datePublished?: Rfc3339DateTime;
  license?: `https://${string}`;
  inLanguage?: [LanguageTag, ...LanguageTag[]];
  keywords?: string[];
  image?: string[];
  citation?: string[];
  additionalProperty?: AdditionalPropertyArray;
  [extensionKey: `${Lowercase<string>}:${string}`]: unknown;
}

export interface Reaction extends BroBase {
  readonly "@type": "Reaction";
  reactionType: ReactionType;
  about: [TargetReference, ...TargetReference[]];
  text: string;
  textFormat?: TextFormat;
}

export interface ReactionAbstract extends BroBase {
  readonly "@type": "ReactionAbstract";
  text: string;
  textFormat?: TextFormat;
  isBasedOn: [BasedOnReference, ...BasedOnReference[]];
}

export interface ReactionList extends BroBase {
  readonly "@type": "ReactionList";
  itemListElement: ListElement[];
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
 * Compatibility aliases for earlier public API names.
 * New code should use Reaction, ReactionAbstract, ReactionList, and WorkReference.
 */
export type ExternalReference = WorkReference;
export type ElementReference = ListEntityReference;
export type AgentGovernment = AgentOrganization;
export type AgentCorporation = AgentOrganization;
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
