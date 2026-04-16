import { Validator } from '@cfworker/json-schema';
// Import the schema file (tsup will automatically bundle this JSON during the build)
import schema from '../../worker/assets/bro-v1-schema.json';

const validator = new Validator(schema as any);

/**
 * Validates data against the Bibliographic Reaction Object (BRO) schema.
 */
export function validateBroSchema(data: unknown) {
  const result = validator.validate(data);
  return {
    valid: result.valid,
    errors: result.errors
  };
}

// Export the original schema data just in case it is needed by the consumer
export { schema as broV1Schema };

// Export generated TypeScript types for consumers
export * from './schema-types';

// Export normalization utilities
export { normalizePayload, normalizeUrnScheme } from '../lib/normalize';

// Export manual discriminated union types
export type {
  Creator,
  CreatorType,
  CreatorPerson,
  CreatorAnonymous,
  CreatorGovernment,
  CreatorCorporation,
  CreatorOrganization,
  CreatorSoftware,
} from '../lib/bro-types';
export { CREATOR_TYPES } from '../lib/bro-types';
