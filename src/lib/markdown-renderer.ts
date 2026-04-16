/**
 * BRO → 마크다운+프론트매터 렌더러 (AI RAG 파이프라인용)
 * 
 * BRO JSON 트리와 본문(text)을 합성하여 '마크다운+YAML 프론트매터' 형식의
 * 평문 텍스트를 On-the-fly로 렌더링합니다.
 * 
 * LLM 컨텍스트 주입 시 JSON 구조보다 마크다운+프론트매터가
 * 토큰 효율 및 의미 파싱 정확도에서 유리하므로, 이 렌더러를 통해
 * RAG 검색 결과를 최적화된 형태로 변환합니다.
 * 
 * [주의] 이 모듈은 YAML 의존성 없이 수동 직렬화를 수행합니다.
 */

import type { 
  BroArticle, 
  BroAbstract, 
  BroItemList,
  AdditionalPropertyArray 
} from '../validator/schema-types';

type BroPayload = BroArticle | BroAbstract | BroItemList;

// ─── Internal YAML Serialization Helpers ───

/**
 * 값을 YAML 호환 문자열로 변환합니다.
 * 특수문자가 포함된 문자열은 쌍따옴표로 감싸고, 나머지는 그대로 반환합니다.
 */
function yamlValue(value: unknown): string {
  if (value === null || value === undefined) return '""';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  const str = String(value);
  // 특수문자가 포함되면 따옴표로 감쌈
  if (/[:#\[\]{}&*!|>'"%@`,\n]/.test(str) || str.trim() !== str || str === '') {
    return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return str;
}

/**
 * 문자열 배열을 YAML 리스트로 직렬화합니다.
 */
function yamlStringArray(arr: string[], indent: string = ''): string {
  return arr.map(item => `${indent}  - ${yamlValue(item)}`).join('\n');
}

/**
 * Creator 배열을 YAML로 직렬화합니다.
 */
function yamlCreators(creators: BroArticle['creator'], indent: string = ''): string {
  return creators.map(c => {
    const lines: string[] = [];
    lines.push(`${indent}  - type: ${yamlValue(c['@type'])}`);
    if ('name' in c && c.name) {
      lines.push(`${indent}    name: ${yamlValue(c.name)}`);
    }
    if ('@id' in c && c['@id']) {
      lines.push(`${indent}    id: ${yamlValue(String(c['@id']))}`);
    }
    if (c['@type'] === 'SoftwareApplication' && 'softwareVersion' in c && c.softwareVersion) {
      lines.push(`${indent}    softwareVersion: ${yamlValue(c.softwareVersion)}`);
    }
    return lines.join('\n');
  }).join('\n');
}

/**
 * additionalProperty 배열을 YAML로 직렬화합니다.
 */
function yamlAdditionalProperty(props: AdditionalPropertyArray): string {
  return props.map(p => {
    return `  - name: ${yamlValue(p.name)}\n    value: ${yamlValue(p.value)}`;
  }).join('\n');
}

// ─── Main Renderer ───

/**
 * BRO 페이로드를 마크다운+프론트매터 형식의 평문 텍스트로 렌더링합니다.
 * AI RAG 파이프라인에서 LLM 컨텍스트 주입용으로 사용합니다.
 * 
 * @param payload BroArticle, BroAbstract, 또는 BroItemList 페이로드
 * @returns 마크다운+YAML 프론트매터 형식의 문자열
 * 
 * @example
 * ```typescript
 * import { renderBroToMarkdown } from '@slat.or.kr/bro-schema';
 * 
 * const markdown = renderBroToMarkdown(articlePayload);
 * // ---
 * // id: "urn:uuid:..."
 * // type: Article
 * // ...
 * // ---
 * // # 본문 내용
 * ```
 */
export function renderBroToMarkdown(payload: BroPayload): string {
  const frontmatterLines: string[] = [];

  // Common metadata
  frontmatterLines.push(`id: ${yamlValue(payload['@id'])}`);
  frontmatterLines.push(`type: ${yamlValue(payload['@type'])}`);
  frontmatterLines.push(`dateCreated: ${yamlValue(payload.dateCreated)}`);

  if ('dateModified' in payload && payload.dateModified) {
    frontmatterLines.push(`dateModified: ${yamlValue(payload.dateModified)}`);
  }

  if ('datePublished' in payload && payload.datePublished) {
    frontmatterLines.push(`datePublished: ${yamlValue(payload.datePublished)}`);
  }

  if ('version' in payload && payload.version !== undefined) {
    frontmatterLines.push(`version: ${yamlValue(payload.version)}`);
  }

  if ('name' in payload && payload.name) {
    frontmatterLines.push(`name: ${yamlValue(payload.name)}`);
  }

  // Article-specific fields
  if (payload['@type'] === 'Article') {
    const article = payload as BroArticle;
    
    if (article.aboutTitle) {
      frontmatterLines.push(`aboutTitle: ${yamlValue(article.aboutTitle)}`);
    }
    if (article.aboutCreator) {
      frontmatterLines.push(`aboutCreator: ${yamlValue(article.aboutCreator)}`);
    }
    if (article.articleByline) {
      frontmatterLines.push(`articleByline: ${yamlValue(article.articleByline)}`);
    }

    // about targets
    frontmatterLines.push(`about:`);
    for (const target of article.about) {
      frontmatterLines.push(`  - type: ${yamlValue(target['@type'])}`);
      frontmatterLines.push(`    identifier: ${yamlValue(target.identifier)}`);
    }
  }

  // Abstract-specific: isBasedOn
  if (payload['@type'] === 'CreativeWork') {
    const abstract = payload as BroAbstract;
    frontmatterLines.push(`isBasedOn:`);
    for (const origin of abstract.isBasedOn) {
      frontmatterLines.push(`  - type: ${yamlValue(origin['@type'])}`);
      frontmatterLines.push(`    identifier: ${yamlValue(origin.identifier)}`);
    }
  }

  // ItemList-specific: itemListElement
  if (payload['@type'] === 'ItemList') {
    const list = payload as BroItemList;
    frontmatterLines.push(`itemListElement:`);
    for (const element of list.itemListElement) {
      frontmatterLines.push(`  - id: ${yamlValue(element['@id'])}`);
    }
  }

  // Creator
  frontmatterLines.push(`creator:`);
  frontmatterLines.push(yamlCreators(payload.creator));

  // Schema.org 1급 표준 속성
  if ('inLanguage' in payload && payload.inLanguage && payload.inLanguage.length > 0) {
    frontmatterLines.push(`inLanguage:`);
    frontmatterLines.push(yamlStringArray(payload.inLanguage));
  }

  if ('keywords' in payload && payload.keywords && payload.keywords.length > 0) {
    frontmatterLines.push(`keywords:`);
    frontmatterLines.push(yamlStringArray(payload.keywords));
  }

  if ('image' in payload && payload.image && (payload.image as string[]).length > 0) {
    frontmatterLines.push(`image:`);
    frontmatterLines.push(yamlStringArray(payload.image as string[]));
  }

  if ('citation' in payload && payload.citation && (payload.citation as string[]).length > 0) {
    frontmatterLines.push(`citation:`);
    frontmatterLines.push(yamlStringArray(payload.citation as string[]));
  }

  // additionalProperty
  if ('additionalProperty' in payload && payload.additionalProperty && payload.additionalProperty.length > 0) {
    frontmatterLines.push(`additionalProperty:`);
    frontmatterLines.push(yamlAdditionalProperty(payload.additionalProperty));
  }

  // Assemble frontmatter
  const frontmatter = `---\n${frontmatterLines.join('\n')}\n---`;

  // Body text
  const bodyText = ('text' in payload && payload.text) ? payload.text : '';

  if (bodyText) {
    return `${frontmatter}\n\n${bodyText}`;
  }

  return frontmatter;
}
