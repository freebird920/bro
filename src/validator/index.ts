import { Validator, type Schema } from "@cfworker/json-schema";
import schema from "../../worker/assets/bro-v1-schema.json";
import { cloneAndNormalizePayload, normalizePayload, normalizeUrnScheme } from "../lib/normalize";
import type {
  BibliographicReactionObjectBROV10,
  BroValidationError,
  BroValidationResult,
} from "./schema-types";

const validator = new Validator(schema as Schema, "2020-12", false);

export interface ValidateBroOptions {
  normalize?: boolean;
  mutate?: boolean;
  includeNormalizedPayload?: boolean;
}

function getTextPayload(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  return typeof record.text === "string" ? record.text : null;
}

function hasForbiddenFrontMatter(text: string): boolean {
  const withoutBom = text.replace(/^\uFEFF/, "");
  return /^(---|\+\+\+)\s*(?:\r?\n|$)/.test(withoutBom);
}

function collectApplicationErrors(payload: unknown): BroValidationError[] {
  const errors: BroValidationError[] = [];
  const text = getTextPayload(payload);

  if (text !== null && hasForbiddenFrontMatter(text)) {
    errors.push({
      location: "/text",
      instanceLocation: "/text",
      keyword: "bro-no-frontmatter",
      message: "BRO text MUST NOT begin with a YAML/TOML front-matter block.",
      error: "BRO text MUST NOT begin with a YAML/TOML front-matter block.",
    });
  }

  return errors;
}

function normalizeSchemaError(error: unknown): BroValidationError {
  const record = error as Record<string, unknown>;
  const location =
    typeof record.instanceLocation === "string"
      ? record.instanceLocation
      : typeof record.location === "string"
        ? record.location
        : "/";
  const message =
    typeof record.error === "string"
      ? record.error
      : typeof record.message === "string"
        ? record.message
        : "Schema validation failed.";

  return {
    location,
    instanceLocation: location,
    keyword: typeof record.keyword === "string" ? record.keyword : undefined,
    message,
    error: message,
  };
}

export function validateBroSchema<T = BibliographicReactionObjectBROV10>(
  data: unknown,
  options: ValidateBroOptions = {},
): BroValidationResult<T> {
  const shouldNormalize = options.normalize !== false;
  const payload = shouldNormalize
    ? options.mutate
      ? normalizePayload(data)
      : cloneAndNormalizePayload(data)
    : data;

  const result = validator.validate(payload);
  const schemaErrors = result.valid ? [] : result.errors.map(normalizeSchemaError);
  const applicationErrors = result.valid ? collectApplicationErrors(payload) : [];
  const errors = [...schemaErrors, ...applicationErrors];

  return {
    valid: errors.length === 0,
    errors,
    ...(options.includeNormalizedPayload ? { normalizedPayload: payload as T } : {}),
  };
}

export function assertBroSchema(
  data: unknown,
  options: ValidateBroOptions = {},
): asserts data is BibliographicReactionObjectBROV10 {
  const result = validateBroSchema(data, options);
  if (!result.valid) {
    const first = result.errors[0];
    throw new Error(first ? `${first.location}: ${first.message}` : "Invalid BRO payload.");
  }
}

export { schema as broV1Schema };
export { normalizePayload, normalizeUrnScheme, cloneAndNormalizePayload };
export * from "./schema-types";
export type {
  Agent,
  AgentType,
  Creator,
  CreatorType,
  CreatorPerson,
  CreatorUnknown,
  CreatorAnonymous,
  CreatorGovernment,
  CreatorCorporation,
  CreatorOrganization,
  CreatorSoftware,
  CreatorRole,
} from "../lib/bro-types";
export { AGENT_TYPES, BRO_CONTEXT_IRI, BRO_SCHEMA_IRI, BRO_VOCAB_IRI, CREATOR_TYPES, REACTION_TYPES } from "../lib/bro-types";
