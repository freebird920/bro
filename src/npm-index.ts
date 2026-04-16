// Unified entry point for the NPM package
export * from './validator/schema-types';
import BroV1Schema from '../worker/assets/bro-v1-schema.json';
export { BroV1Schema };

// Export validation logic and utilities
export { validateBroSchema, broV1Schema } from './validator/index';

// BIBFRAME 2.0 Conversion utilities
export { convertBroToBibframe } from './lib/bibframe-converter';
export type { BibframeWork, BibframeContribution, BibframeInstance, BibframeNote, BibframeIdentifier } from './lib/bibframe-converter';

// AI RAG Markdown Renderer
export { renderBroToMarkdown } from './lib/markdown-renderer';

// KOMARC Conversion utilities
export * from './lib/komarc-converter';

// URN Normalization utilities
export { normalizePayload, normalizeUrnScheme } from './lib/normalize';

// Manual Discriminated Union types for Creator polymorphism
export type {
  Creator,
  CreatorType,
  CreatorPerson,
  CreatorAnonymous,
  CreatorGovernment,
  CreatorCorporation,
  CreatorOrganization,
  CreatorSoftware,
} from './lib/bro-types';
export { CREATOR_TYPES } from './lib/bro-types';
