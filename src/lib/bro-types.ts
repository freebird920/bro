/**
 * BRO v1.0 — 수동 작성 Discriminated Union 타입
 * 
 * json-schema-to-typescript가 allOf + if/then discriminator 패턴을
 * 정확한 Union Type으로 변환하지 못하는 한계를 보완합니다.
 * 이 파일의 타입은 bro-v1-schema.json의 $defs와 1:1 동기화되어야 합니다.
 */

// ─── Creator Entities (Polymorphic, Mutually Exclusive) ───

export interface CreatorPerson {
  readonly "@type": "Person";
  readonly "@id"?: string;
  name: string;
}

export interface CreatorAnonymous {
  readonly "@type": "Anonymous";
  name?: string;
}

export interface CreatorGovernment {
  readonly "@type": "GovernmentOrganization";
  readonly "@id": string;
  name: string;
}

export interface CreatorCorporation {
  readonly "@type": "Corporation";
  readonly "@id": string;
  name: string;
}

export interface CreatorOrganization {
  readonly "@type": "Organization";
  readonly "@id": string;
  name: string;
}

export interface CreatorSoftware {
  readonly "@type": "SoftwareApplication";
  readonly "@id": string;
  name: string;
  softwareVersion?: string;
}

/**
 * 6가지 작성자 타입의 Discriminated Union.
 * `@type` 필드를 discriminator로 사용합니다.
 */
export type Creator =
  | CreatorPerson
  | CreatorAnonymous
  | CreatorGovernment
  | CreatorCorporation
  | CreatorOrganization
  | CreatorSoftware;

/**
 * 지원하는 Creator @type 값들
 */
export const CREATOR_TYPES = [
  "Person",
  "Anonymous",
  "GovernmentOrganization",
  "Corporation",
  "Organization",
  "SoftwareApplication",
] as const;

export type CreatorType = (typeof CREATOR_TYPES)[number];

// ─── Terminal Identifier ───

export interface TerminalIdentifier {
  readonly "@type": "Article" | "CreativeWork";
  identifier: string;
}

// ─── Re-export auto-generated top-level types for convenience ───
export type {
  BibliographicReactionObjectBROV10 as BibliographicReactionObjectBRO,
  BroItemList,
  BroArticle,
  BroAbstract,
} from "../validator/schema-types";
