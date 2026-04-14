import { Hono } from "hono";
import { cors } from "hono/cors";
import { Validator, type Schema } from "@cfworker/json-schema";
import broSchema from "./assets/bro-v1-schema.json";
import { normalizePayload } from "../src/lib/normalize";
import { parseFrontmatter } from "../src/lib/frontmatter";

// Cold Start 단계: 스키마 AST 변환 1회 한정 실행
const validator = new Validator(broSchema as Schema, "2020-12", false);
const app = new Hono();

// 글로벌 CORS 미들웨어 적용 (외부 서비스 및 프론트엔드 접근 허용)
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

// 엔드포인트 A: 정적 스키마 제공 (인메모리 서빙)
app.get("/bro/v1/schema.json", (c) => {
  c.header("Content-Type", "application/schema+json; charset=utf-8");
  c.header("Cache-Control", "public, max-age=86400, s-maxage=86400"); // 엣지 24시간 캐싱
  return c.body(JSON.stringify(broSchema, null, 2));
});

/**
 * text 필드에서 Frontmatter를 추출하여 2차 검증합니다.
 * @returns 검증 결과 배열 (에러가 있으면 에러 객체, 없으면 빈 배열)
 */
function performFrontmatterValidation(payload: any): { location: string; error: string }[] {
  const errors: { location: string; error: string }[] = [];

  const validateText = (text: unknown, path: string) => {
    if (typeof text !== "string" || text.length === 0) return;
    try {
      parseFrontmatter(text);
    } catch (e: any) {
      errors.push({
        location: path,
        error: `Frontmatter validation failed: ${e.message}`,
      });
    }
  };

  const type = payload?.["@type"];

  if (type === "Article") {
    validateText(payload.text, "/text");
  } else if (type === "CreativeWork" && payload.isBasedOn) {
    // BroAbstract — text는 순수 텍스트이므로 frontmatter 2차 검증 스킵 가능
    // 단, text에 frontmatter가 있다면 검증 수행
    if (typeof payload.text === "string" && payload.text.startsWith("---\n")) {
      validateText(payload.text, "/text");
    }
  }
  // [SCHEMA v1 개정] ItemList의 itemListElement는 @id 참조만 허용.
  // text 필드가 존재하지 않으므로 Frontmatter 2차 검증 불필요.

  return errors;
}

// 엔드포인트 B: 2-Pass Validation 파이프라인
app.post("/api/v1/validate", async (c) => {
  const requestStartTime = Date.now();
  try {
    const payload = await c.req.json();

    // ── 전처리: URN Scheme 소문자 정규화 ──
    normalizePayload(payload);

    // ── 1차 검증: JSON Schema (구조 검증) ──
    const result = validator.validate(payload);

    if (!result.valid) {
      return c.json(
        {
          status: "REJECTED",
          message: "The provided payload does not meet the BRO v1 schema requirements.",
          timestamp: new Date().toISOString(),
          latencyMs: Date.now() - requestStartTime,
          errors: result.errors.map((err) => ({
            location: err.instanceLocation,
            keyword: err.keyword,
            message: err.error,
          })),
        },
        400,
      );
    }

    // ── 2차 검증: Frontmatter 추출 & Valibot 검증 ──
    const frontmatterErrors = performFrontmatterValidation(payload);

    if (frontmatterErrors.length > 0) {
      return c.json(
        {
          status: "FRONTMATTER_VALIDATION_ERROR",
          message: "Payload structure is valid, but embedded Frontmatter failed validation.",
          timestamp: new Date().toISOString(),
          latencyMs: Date.now() - requestStartTime,
          errors: frontmatterErrors,
        },
        400,
      );
    }

    return c.json(
      {
        status: "VERIFIED",
        message: "Payload successfully validated against BRO v1 specifications (2-Pass).",
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - requestStartTime,
      },
      200,
    );
  } catch (e) {
    if (e instanceof SyntaxError) {
      return c.json(
        { 
          status: "FATAL_PARSE_ERROR", 
          message: "Malformed JSON: Failed to parse request body.",
          timestamp: new Date().toISOString()
        },
        400,
      );
    } else {
      console.error("Critical worker error:", e);
      return c.json(
        {
          status: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred during processing.",
          timestamp: new Date().toISOString()
        },
        500,
      );
    }
  }
});

export default app;
