import yaml from 'yaml';
import { 
  type StrictFrontmatter, 
  type DynamicField, 
  type FrontmatterResult 
} from './schema-types';
import { validateStrictFrontmatter } from '../validator/index';

/**
 * 1급 필드 목록 (현재 파서 버전 기준).
 * 이 목록 외의 키는 모두 others로 강제 묶입니다.
 * 
 * [파서 버전 승격 모델]
 * 사용자는 인입(Ingestion) 시 임의의 키를 자유롭게 확장할 수 있으며,
 * 서버는 이를 평탄화(Flat)된 상태 그대로 저장합니다.
 * 반환(Response) 시, 현재 파서 버전이 인식하는 1급 필드만 최상위에 유지되고
 * 나머지는 others 배열로 묶여 반환됩니다.
 * 추후 특정 동적 키가 1급 객체로 승격되면 이 Set에 추가하고 파서 버전을 올립니다.
 */
const FIRST_CLASS_FIELDS = new Set([
  'about_title', 'about_creator', 'article_title', 'article_byline',
  'language', 'keywords', 'image', 'source_url', 'others'
]);

/**
 * ReDoS 방지를 위한 Frontmatter 탐색 범위 제한 (바이트 수)
 */
const FRONTMATTER_SEARCH_LIMIT = 5000;

/**
 * 값을 string 배열로 안전하게 변환합니다.
 * 스칼라 값이면 단일 요소 배열로 래핑합니다.
 */
function toStringArray(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
}

/**
 * Parses frontmatter and body content.
 * Supports both full markdown strings and separated sections (yaml + body).
 * 
 * [보안] Single arg 모드에서는 최상단 5,000자 이내에서만 Frontmatter를 탐색합니다.
 */
export function parseFrontmatter(markdownOrYaml: string, body?: string): FrontmatterResult {
  let yamlBlock = "";
  let content = "";

  if (body !== undefined) {
    // Dual arg mode: yaml block (without delimiters) + body
    yamlBlock = markdownOrYaml;
    content = body;
  } else {
    // Single arg mode: full markdown
    // [ReDoS 방지] 탐색 범위를 최상단 5,000자로 제한
    const searchArea = markdownOrYaml.slice(0, FRONTMATTER_SEARCH_LIMIT);
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = searchArea.match(frontmatterRegex);
    if (match) {
      yamlBlock = match[1];
      // 전체 문자열에서 매칭된 부분 이후를 content로 추출
      content = markdownOrYaml.slice(match[0].length).trimStart();
    } else {
      content = markdownOrYaml;
    }
  }

  const data: StrictFrontmatter = {};
  let others: DynamicField[] = [];

  if (yamlBlock.trim()) {
    const rawData = yaml.parse(yamlBlock) || {};
    
    // Extract strict fields (모두 optional)
    // — 문자열 1급 필드
    if (rawData.about_title !== undefined) data.about_title = String(rawData.about_title);
    if (rawData.about_creator !== undefined) data.about_creator = String(rawData.about_creator);
    if (rawData.article_title !== undefined) data.article_title = String(rawData.article_title);
    if (rawData.article_byline !== undefined) data.article_byline = String(rawData.article_byline);

    // — 배열 1급 필드
    if (rawData.language !== undefined) {
      data.language = toStringArray(rawData.language);
    }
    if (rawData.keywords !== undefined) {
      data.keywords = toStringArray(rawData.keywords);
    }
    if (rawData.image !== undefined) {
      data.image = toStringArray(rawData.image);
    }
    if (rawData.source_url !== undefined) {
      data.source_url = toStringArray(rawData.source_url);
    }

    // Extract dynamic fields into others array
    // 1. 명시적으로 YAML에 'others' 키가 있으면 먼저 수집
    if (Array.isArray(rawData.others)) {
      others = [...rawData.others];
    }
    
    // 2. 1급 필드가 아닌 모든 키를 others로 강제 묶음
    for (const [key, value] of Object.entries(rawData)) {
      if (!FIRST_CLASS_FIELDS.has(key)) {
        others.push({ [key]: value });
      }
    }

    // others가 있으면 data에도 통합 (StrictFrontmatter.others)
    if (others.length > 0) {
      data.others = others;
    }

    // Validate using Valibot (strictObject이므로 미정의 키 자동 거부)
    validateStrictFrontmatter(data);
  }

  return { data, others, content };
}

/**
 * Serializes the strictly separated data back into a Markdown document.
 */
export function serializeFrontmatter(data: StrictFrontmatter, others: DynamicField[], content: string): string {
  // Enforce zero-tolerance validation before serialization
  validateStrictFrontmatter(data);

  // 1. Parent Object Construction
  const yamlData: Record<string, unknown> = {};
  
  if (data.about_title !== undefined) yamlData.about_title = data.about_title;
  if (data.about_creator !== undefined) yamlData.about_creator = data.about_creator;
  if (data.article_title !== undefined) yamlData.article_title = data.article_title;
  if (data.article_byline !== undefined) yamlData.article_byline = data.article_byline;
  if (data.language !== undefined) yamlData.language = data.language;
  if (data.keywords !== undefined) yamlData.keywords = data.keywords;
  if (data.image !== undefined) yamlData.image = data.image;
  if (data.source_url !== undefined) yamlData.source_url = data.source_url;

  if (others && others.length > 0) {
    yamlData.others = others;
  }

  const yamlBlock = yaml.stringify(yamlData);

  // 2. Final Reconstruction
  // Rule: YAML -> Blank Newline -> Content
  return `---\n${yamlBlock}---\n\n${content}`;
}
