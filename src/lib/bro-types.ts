import type {
  Agent,
  AgentCorporation,
  AgentGovernment,
  AgentOrganization,
  AgentPerson,
  AgentRole,
  AgentSoftware,
  AgentUnknown,
  // BibliographicReactionObjectBROV10,
  BroPayload,
  BroReaction,
  BroReactionAbstract,
  BroReactionList,
  ExternalReference,
  ReactionType,
} from "../validator/schema-types";

export const BRO_CONTEXT_IRI = "https://schema.slat.or.kr/bro/v1.0/context.jsonld" as const;
export const BRO_SCHEMA_IRI = "https://schema.slat.or.kr/bro/v1.0/schema.json" as const;
export const BRO_VOCAB_IRI = "https://schema.slat.or.kr/bro/v1.0/vocab#" as const;

export const BRO_ENTITY_TYPES = [
  "Reaction",
  "ReactionAbstract",
  "ReactionList",
] as const;

export const REACTION_TYPES = [
  "Response",
  "Listing",
  "Unspecified",
] as const satisfies readonly ReactionType[];

export const AGENT_TYPES = [
  "Person",
  "UnknownAgent",
  "GovernmentOrganization",
  "Corporation",
  "Organization",
  "SoftwareApplication",
  "Role",
] as const;

export type AgentType = (typeof AGENT_TYPES)[number];
export type CreatorType = AgentType;
export type Creator = Agent;
export type CreatorPerson = AgentPerson;
export type CreatorUnknown = AgentUnknown;
export type CreatorAnonymous = AgentUnknown;
export type CreatorGovernment = AgentGovernment;
export type CreatorCorporation = AgentCorporation;
export type CreatorOrganization = AgentOrganization;
export type CreatorSoftware = AgentSoftware;
export type CreatorRole = AgentRole;
export type TerminalIdentifier = ExternalReference;

export function isBroPayload(value: unknown): value is BroPayload {
  if (!value || typeof value !== "object") return false;
  const type = (value as Record<string, unknown>)["@type"];
  return type === "Reaction" || type === "ReactionAbstract" || type === "ReactionList";
}

export function isReaction(value: unknown): value is BroReaction {
  return isBroPayload(value) && value["@type"] === "Reaction";
}

export function isReactionAbstract(value: unknown): value is BroReactionAbstract {
  return isBroPayload(value) && value["@type"] === "ReactionAbstract";
}

export function isReactionList(value: unknown): value is BroReactionList {
  return isBroPayload(value) && value["@type"] === "ReactionList";
}

export type {
  Agent,
  AgentCorporation,
  AgentGovernment,
  AgentOrganization,
  AgentPerson,
  AgentRole,
  AgentSoftware,
  AgentUnknown,
  BibliographicReactionObjectBROV10 as BibliographicReactionObjectBRO,
  BroPayload,
  BroReaction,
  BroReactionAbstract,
  BroReactionList,
  ExternalReference,
  ReactionType,
} from "../validator/schema-types";

export { AGENT_TYPES as CREATOR_TYPES };
