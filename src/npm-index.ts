// Unified entry point for the NPM package
export * from './validator/schema-types';
import BroV1Schema from '../worker/assets/bro-v1-schema.json';
export { BroV1Schema };

// Export validation logic and utilities
export { validateBroSchema, broV1Schema } from './validator/index';
export * from './lib/frontmatter';

// KOMARC Conversion utilities
export * from './lib/komarc-converter';

// URN Normalization utilities
export { normalizePayload, normalizeUrnScheme } from './lib/normalize';

// Manual Discriminated Union types for Creator polymorphism
export type {
  Creator,
  CreatorType,
  CreatorPerson,
  CreatorGovernment,
  CreatorCorporation,
  CreatorOrganization,
  CreatorSoftware,
  // TerminalIdentifier는 validator/schema-types에서 이미 export 되므로 생략
} from './lib/bro-types';
export { CREATOR_TYPES } from './lib/bro-types';
