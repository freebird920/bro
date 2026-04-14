/**
 * BRO v1 — 수동 작성 Discriminated Union 타입
 * 
 * json-schema-to-typescript가 allOf + if/then discriminator 패턴을
 * 정확한 Union Type으로 변환하지 못하는 한계를 보완합니다.
 * 이 파일의 타입은 bro-v1-schema.json의 $defs와 1:1 동기화되어야 합니다.
 */

// ─── Author Entities (Polymorphic, Mutually Exclusive) ───

export interface AuthorPerson {
  readonly "@type": "Person";
  readonly "@id": string;
  name: string;
}

export interface AuthorGovernment {
  readonly "@type": "GovernmentOrganization";
  readonly "@id": string;
  name: string;
}

export interface AuthorCorporation {
  readonly "@type": "Corporation";
  readonly "@id": string;
  name: string;
}

export interface AuthorOrganization {
  readonly "@type": "Organization";
  readonly "@id": string;
  name: string;
}

export interface AuthorSoftware {
  readonly "@type": "SoftwareApplication";
  readonly "@id": string;
  name: string;
  softwareVersion?: string;
}

/**
 * 5가지 저자 타입의 Discriminated Union.
 * `@type` 필드를 discriminator로 사용합니다.
 */
export type Author =
  | AuthorPerson
  | AuthorGovernment
  | AuthorCorporation
  | AuthorOrganization
  | AuthorSoftware;

/**
 * 지원하는 Author @type 값들
 */
export const AUTHOR_TYPES = [
  "Person",
  "GovernmentOrganization",
  "Corporation",
  "Organization",
  "SoftwareApplication",
] as const;

export type AuthorType = (typeof AUTHOR_TYPES)[number];

// ─── Terminal Identifier ───

export interface TerminalIdentifier {
  readonly "@type": "Article" | "CreativeWork";
  identifier: string;
}

// ─── Re-export auto-generated top-level types for convenience ───

export type {
  BibliographicReactionObjectBRO,
  BroItemList,
  BroArticle,
  BroAbstract,
} from "../validator/schema-types";
