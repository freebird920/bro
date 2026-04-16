/**
 * BRO → BIBFRAME 2.0 변환기
 * 
 * BRO 페이로드(Article/Abstract)를 BIBFRAME 2.0 JSON-LD 구조로 변환합니다.
 * Linked Open Data(LOD) 생태계와의 호환성을 위한 완전한 JSON-LD/BIBFRAME 2.0 변환을 지원합니다.
 * 
 * [매핑 규칙]
 * - Article → bf:Work + bf:Review, 관계: bf:reviewOf
 * - CreativeWork (Abstract) → bf:Work + bf:Summary, 관계: bf:summaryOf
 * - Creator 다형성: Person/Anonymous → bf:Person, Organization 계열 → bf:Organization, Software → bf:Agent
 */

import type { BroArticle, BroAbstract } from '../validator/schema-types';

// ─── BIBFRAME Output Types ───

export interface BibframeContribution {
  "@type": "bf:Contribution";
  "bf:agent": {
    "@type": string;
    "@id"?: string;
    "rdfs:label": string;
  };
}

export interface BibframeIdentifier {
  "@type": "bf:Identifier";
  "rdf:value": string;
}

export interface BibframeInstance {
  "@type": "bf:Instance";
  "bf:identifiedBy": BibframeIdentifier;
}

export interface BibframeNote {
  "@type": "bf:Note";
  "rdfs:label": string;
}

export interface BibframeWork {
  "@context": {
    bf: string;
    rdf: string;
    rdfs: string;
  };
  "@type": string[];
  "@id": string;
  "bf:originDate": string;
  "bf:changeDate"?: string;
  "bf:contribution": BibframeContribution[];
  "bf:note": BibframeNote;
  [key: string]: unknown;
}

// ─── Converter Implementation ───

/**
 * BRO 페이로드에서 BIBFRAME 2.0으로의 변환.
 * 
 * @param payload BroArticle 또는 BroAbstract 페이로드
 * @returns BIBFRAME 2.0 JSON-LD 객체
 * 
 * @example
 * ```typescript
 * import { convertBroToBibframe } from '@slat.or.kr/bro-schema';
 * 
 * const bibframe = convertBroToBibframe(articlePayload);
 * console.log(bibframe["@type"]); // ["bf:Work", "bf:Review"]
 * ```
 */
export function convertBroToBibframe(payload: BroArticle | BroAbstract): BibframeWork {
  const isArticle = payload["@type"] === "Article";
  const bfClass = isArticle ? "bf:Review" : "bf:Summary";
  const relationProp = isArticle ? "bf:reviewOf" : "bf:summaryOf";

  // 작성자(Agent) 처리 로직 (권위 vs 익명 분기)
  const contributions: BibframeContribution[] = payload.creator.map((agent) => {
    let bfAgentType = "bf:Agent";

    if (agent["@type"] === "Person") bfAgentType = "bf:Person";
    if (agent["@type"] === "Anonymous") bfAgentType = "bf:Person"; // 익명도 개념상 Person으로 매핑
    if (
      ["Organization", "GovernmentOrganization", "Corporation"].includes(agent["@type"])
    ) {
      bfAgentType = "bf:Organization";
    }

    const agentEntry: BibframeContribution["bf:agent"] = {
      "@type": bfAgentType,
      "rdfs:label": ("name" in agent && agent.name) ? agent.name : "Anonymous",
    };

    // 식별자가 있는 경우만 매핑
    if ("@id" in agent && agent["@id"]) {
      agentEntry["@id"] = String(agent["@id"]);
    }

    return {
      "@type": "bf:Contribution" as const,
      "bf:agent": agentEntry,
    };
  });

  // 타겟 식별자 매핑 (about 또는 isBasedOn)
  const targets = isArticle
    ? (payload as BroArticle).about
    : (payload as BroAbstract).isBasedOn;

  const targetInstances: BibframeInstance[] = targets.map((t) => ({
    "@type": "bf:Instance" as const,
    "bf:identifiedBy": {
      "@type": "bf:Identifier" as const,
      "rdf:value": String(t.identifier),
    },
  }));

  const result: BibframeWork = {
    "@context": {
      "bf": "http://id.loc.gov/ontologies/bibframe/",
      "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    },
    "@type": ["bf:Work", bfClass],
    "@id": payload["@id"],
    [relationProp]: targetInstances,
    "bf:originDate": payload.dateCreated,
    ...(payload.dateModified && { "bf:changeDate": payload.dateModified }),
    "bf:contribution": contributions,
    // 순수 본문 매핑 (JSON Native)
    "bf:note": {
      "@type": "bf:Note",
      "rdfs:label": payload.text,
    },
  };

  return result;
}
