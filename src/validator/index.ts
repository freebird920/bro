import { Validator } from '@cfworker/json-schema';
// Import the schema file (tsup will automatically bundle this JSON during the build)
import schema from '../../worker/assets/bro-v1-schema.json';

const validator = new Validator(schema as any);

/**
 * Validates data against the Book Article List Ontology (BRO) schema.
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

import * as v from 'valibot';
import { 
  StrictFrontmatterSchema, 
  OthersBundleSchema, 
  type StrictFrontmatter, 
  type DynamicField 
} from '../lib/schema-types';

/**
 * Executes rigorous Valibot pipeline validation to intercept anomalous data injections.
 * Bypasses the overhead of Zod's deep cloning mechanisms, performing direct memory inspection.
 */
export function validateStrictFrontmatter(payload: unknown): StrictFrontmatter {
  try {
    return v.parse(StrictFrontmatterSchema, payload);
  } catch (error) {
    throw new Error(`CRITICAL [Valibot Error]: Frontmatter validation failed. Unauthorized structural anomalies detected in the first-class data object.\n${error}`);
  }
}

/**
 * Validates the topological integrity of the extracted dynamic fields matrix.
 */
export function validateOthersBundle(payload: unknown): DynamicField[] {
  try {
    return v.parse(OthersBundleSchema, payload);
  } catch (error) {
    throw new Error(`CRITICAL [Valibot Error]: Dynamic bundle validation failed. Invalid schema topology detected.\n${error}`);
  }
}

// Export normalization utilities
export { normalizePayload, normalizeUrnScheme } from '../lib/normalize';

// Export manual discriminated union types
export type {
  Creator,
  CreatorType,
  CreatorPerson,
  CreatorGovernment,
  CreatorCorporation,
  CreatorOrganization,
  CreatorSoftware,
} from '../lib/bro-types';
export { CREATOR_TYPES } from '../lib/bro-types';
