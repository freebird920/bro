import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { Validator, type Schema } from "@cfworker/json-schema";
import broSchema from "./assets/bro-v1-schema.json";
import { broV1Context } from "../src/lib/bro-context";
import { broV1VocabTurtle } from "../src/lib/bro-vocab";
import { normalizePayload } from "../src/lib/normalize";

const validator = new Validator(broSchema as Schema, "2020-12", false);
const app = new Hono();

const VERSIONED_CACHE = "public, max-age=31536000, s-maxage=31536000, immutable";
const NO_STORE = "no-store";

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Accept"],
  }),
);

function schemaResponse(c: Context) {
  c.header("Content-Type", "application/schema+json; charset=utf-8");
  c.header("Cache-Control", VERSIONED_CACHE);
  return c.body(JSON.stringify(broSchema, null, 2));
}

function contextResponse(c: Context) {
  c.header("Content-Type", "application/ld+json; charset=utf-8");
  c.header("Cache-Control", VERSIONED_CACHE);
  return c.body(JSON.stringify(broV1Context, null, 2));
}

function vocabResponse(c: Context) {
  c.header("Content-Type", "text/turtle; charset=utf-8");
  c.header("Cache-Control", VERSIONED_CACHE);
  return c.body(broV1VocabTurtle);
}

function hasForbiddenFrontMatter(text: string): boolean {
  const withoutBom = text.replace(/^\uFEFF/, "");
  return /^(---|\+\+\+)\s*(?:\r?\n|$)/.test(withoutBom);
}

function collectApplicationErrors(payload: unknown) {
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  if (typeof record.text === "string" && hasForbiddenFrontMatter(record.text)) {
    return [
      {
        location: "/text",
        keyword: "bro-no-frontmatter",
        message: "BRO text MUST NOT begin with a YAML/TOML front-matter block.",
      },
    ];
  }
  return [];
}

app.get("/", (c) =>
  c.json({
    name: "Bibliographic Reaction Object (BRO) v1.0",
    schema: "https://schema.slat.or.kr/bro/v1.0/schema.json",
    context: "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
    vocab: "https://schema.slat.or.kr/bro/v1.0/vocab#",
  }),
);

app.get("/bro/v1.0/schema.json", schemaResponse);
app.get("/bro/v1/schema.json", schemaResponse);
app.get("/bro/v1.0/context.jsonld", contextResponse);
app.get("/bro/v1/context.jsonld", contextResponse);
app.get("/bro/v1.0/vocab", vocabResponse);
app.get("/bro/v1.0/vocab.ttl", vocabResponse);
app.get("/bro/v1/vocab", vocabResponse);
app.get("/bro/v1/vocab.ttl", vocabResponse);

async function validateRequest(c: Context) {
  const requestStartTime = Date.now();
  c.header("Cache-Control", NO_STORE);

  try {
    const payload = await c.req.json();
    normalizePayload(payload);

    const schemaResult = validator.validate(payload);
    if (!schemaResult.valid) {
      return c.json(
        {
          status: "REJECTED",
          message: "The provided payload does not meet the BRO v1.0 schema requirements.",
          timestamp: new Date().toISOString(),
          latencyMs: Date.now() - requestStartTime,
          errors: schemaResult.errors.map((error) => ({
            location: error.instanceLocation,
            keyword: error.keyword,
            message: error.error,
          })),
        },
        400,
      );
    }

    const applicationErrors = collectApplicationErrors(payload);
    if (applicationErrors.length > 0) {
      return c.json(
        {
          status: "REJECTED",
          message: "The payload is structurally valid but violates BRO v1.0 application-layer requirements.",
          timestamp: new Date().toISOString(),
          latencyMs: Date.now() - requestStartTime,
          errors: applicationErrors,
        },
        400,
      );
    }

    return c.json(
      {
        status: "VERIFIED",
        message: "Payload successfully validated against BRO v1.0 specifications.",
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - requestStartTime,
      },
      200,
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return c.json(
        {
          status: "FATAL_PARSE_ERROR",
          message: "Malformed JSON: Failed to parse request body.",
          timestamp: new Date().toISOString(),
          latencyMs: Date.now() - requestStartTime,
        },
        400,
      );
    }

    console.error("Critical worker error:", error);
    return c.json(
      {
        status: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred during processing.",
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - requestStartTime,
      },
      500,
    );
  }
}

app.post("/api/v1/validate", validateRequest);
app.post("/bro/v1.0/validate", validateRequest);
app.post("/bro/v1/validate", validateRequest);

export default app;
