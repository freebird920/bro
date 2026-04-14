# Bibliographic Reaction Object (BRO) Schema v1

본 문서는 `https://schema.slat.or.kr/bro/v1/schema.json`에 정의된 **Bibliographic Reaction Object (BRO, 서지 반응정보 객체)** 의 아키텍처, 제약 조건 및 데이터 처리 파이프라인에 대한 심층 기술 명세입니다. BRO 스키마는 도서 및 비정형 서지 파생 데이터에 대한 메타데이터 규칙입니다.원본 데이터에 대한 리뷰, 분석, 비평, 요약, 감상 등의 파생 데이터를 일관성 있고 독립적인 엔티티로 구조화합니다.

---

## 1. 최상위 라우팅 아키텍처 (Top-Level Routing)

BRO 스키마는 단일 목적의 객체가 아니며, 진입점의 `@type` 필드에 따라 3개의 서로 다른 에그리거트 루트 중 하나(`oneOf`)로 분기 처리됩니다. 본 스키마는 시스템 쓰기(Write/Command) 전용 원시 모델이며, 클라이언트 조회용 내포(Embedding) 트리 변환은 미들웨어 도메인 계층의 책임으로 위임합니다.

1.  **`BroItemList` (`@type: "ItemList"`)**
    - **목적:** 다중 타겟 문서 큐레이션을 위한 영속적 컨테이너 엔티티입니다.
    - **특징:** `itemListElement`는 오직 `@id`(URN UUID) 식별자 참조만 허용하며, 문서 객체 전체의 내포(Embedding)는 스키마 레벨에서 엄격히 금지됩니다.
2.  **`BroArticle` (`@type: "Article"`)**
    - **목적:** 단일 코어 문서(Article) 처리를 위한 쓰기/영속성 스키마입니다.
    - **특징:** 파생 문서(Abstract 등)와의 결합은 외부 참조(`@id`)로만 이뤄지며, `about` 배열을 통해 원본 서지 엔티티를 식별합니다.
3.  **`BroAbstract` (`@type: "CreativeWork"`)**
    - **목적:** 단일 요약본(Abstract) 처리를 위한 원시 스키마입니다.
    - **특징:** `isBasedOn` 배열을 통해 원본 엔티티(Article 또는 CreativeWork)를 역참조합니다.

---

## 2. 핵심 속성 (Core Properties)

모든 Article 기반 객체가 상속받는 핵심 뼈대 데이터 구조(`articleBaseProperties`)입니다. `@context`는 `https://schema.org`, `@type`은 `Article`로 고정됩니다.

### 2.1. `about` (타겟 서지 엔티티 배열)

파생 문서가 대상으로 하는 원본 도서(서지 엔티티) 배열입니다.

- 단권, 다권본 세트, 동일 저작물의 이기종 판본(개정판, e-book 등 여러 ISBN)을 무제한으로 바인딩할 수 있습니다.
- 단일 도서 타겟팅 시에도 **반드시 원소가 최소 1개인 배열(`Array`) 형태**로 인입되어야 합니다.
- 내부 객체 구조: `@type: "CreativeWork"` 지정 및 URN 형태(`urn:isbn:`, `urn:doi:`, `urn:uci:`, `urn:kolis:`, `urn:uuid:` 등)의 `identifier` 속성을 필수로 가져야 합니다.

### 2.2. `creator` (작성 주체 배열)

해당 파생 문서나 요약본을 생성한 주체의 배열입니다. 기계(LLM)와 인간 작업자의 공동 작업 등 복수 주체의 명시 및 이력 추적이 가능합니다.

> ⚠️ **주의:** 원본 도서의 저자(서지 표준의 1XX/7XX 계층)와는 엄격히 분리된 도메인입니다. (자세한 식별자 규격은 [6. 작성자 식별 구조](#6-작성자-식별-구조-creatordefinitions) 참고)

### 2.3. `dateCreated` (최초 생성 타임스탬프)

파생 문서 엔티티의 최초 생성 타임스탬프(ISO 8601 / RFC 3339 준수)입니다.

- **불변성 규칙(Immutability):** 시스템 아키텍처 상 데이터 갱신(Update)은 전면 금지됩니다. 수정 요구 발생 시, 기존 객체를 논리적 삭제(Soft Delete) 또는 아카이빙하고 신규 타임스탬프를 획득한 새 객체로 대체하여 멱등성을 보장해야 합니다.
- _KOMARC 매핑:_ 연동 시 YYYYMMDD로 다운캐스팅되어 `552 ▾k` 서브필드에 개시일자로 매핑됩니다.

---

## 3. ⚠️ YAML Frontmatter 및 마크다운(`text`) 가이드

`text` 필드는 범용 문서 텍스트(Markdown)를 저장하며, 문자열 길이는 0 ~ 300,000자로 제한됩니다. 본문 데이터는 **최상단에 YAML Frontmatter 캡슐화가 필수적으로 요구됩니다.** 이 규칙은 `BroArticle`과 `BroAbstract` 양쪽 모두의 `text` 필드에 **완전히 동일하게** 적용됩니다.

### 3.1. Frontmatter 필드 명세 및 JSON 스키마

프론트매터의 각 필드는 문서의 핵심 메타데이터를 나타냅니다. 반환(Response) 시 기준이 되는 1급 필드와 기타 속성에 대한 상세 명세는 다음과 같습니다.

- **`title` (문자열):** 문서의 제목입니다.
- **`byline` (문자열 배열):** 작성자, 기여자, 또는 원작자의 이름을 명시적으로 표시해야 할 때 사용하는 필드입니다. 시스템은 기본적으로 개인정보 보호를 위해 서버에서 개인의 실명을 자동 출력하지 않습니다. 따라서 **출력 데이터에 명시적인 작성자 표기가 반드시 필요하다고 판단되는 다음과 같은 경우**에 이 필드를 활용합니다:
  - 원작자가 개인이며, 원작자의 라이선스 사용 허락 조건이 '저작자 표시(BY)'를 요구하는 경우
  - 원작자가 자신의 이름 표기를 명시적으로 요구한 경우
  - 공개된 정보 중 원작자의 권위나 신원 등이 정보의 신뢰성에 특별히 중요한 의미를 갖는 경우
  - 작성자의 직위, 소속 등을 함께 포함하여 서술해야 하는 경우 (예: `"김교수 - 안드로메다대학 명예교수"`)
  - 블로그 등에서 원작자가 자신의 가명(닉네임, 별명)등을 사용하는 경우

  특별히 정해진 텍스트 형식 없이 원본의 기술을 따릅니다.
  단, 복수의 작성자나 기여자가 있을 경우 `["홍길동", "AI Assistant"]`와 같이 배열 형태로 나열합니다.

- **`keywords` (문자열 배열):** 문서를 분류하거나 검색에 사용될 핵심어 목록입니다.
- **`image` (문자열 배열):** 문서와 관련된 주요 이미지 URL 목록입니다. 본문 전체가 이미지로 구성된 경우 등에 활용할 수 있습니다.
- **`source_url` (문자열 배열):** 파생 문서가 참고하거나 기반으로 한 원문의 링크가 존재하는 경우 해당 URL을 기재합니다.
- **`others` (객체 배열):** 위 1급 필드에 해당하지 않는 나머지 모든 사용자 정의 메타데이터가 모이는 공간입니다. 클라이언트가 전송할 때는 모든 키를 평탄화(Flat)하여 보내며 서버도 원본 그대로 저장하지만, 서버에서 데이터를 출력(API 반환)할 때는 반드시 이 `others` 배열 내에 `{ "키": "값" }` 형태의 객체로 정규화되어 출력됩니다.

**[참고] Frontmatter 정규화 구조 JSON 스키마 표현**
이러한 YAML 구조를 JSON 스키마 규격으로 표현하면 다음과 같습니다. (API 반환 시 정규화된 형태 기준)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "title": { "type": "string" },
    "byline": {
      "type": "array",
      "items": { "type": "string" }
    },
    "keywords": {
      "type": "array",
      "items": { "type": "string" }
    },
    "image": {
      "type": "array",
      "items": { "type": "string" }
    },
    "source_url": {
      "type": "array",
      "items": { "type": "string" }
    },
    "others": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": true
      }
    }
  },
  "additionalProperties": false
}
```

### 3.2. 데이터 인입 (Ingestion) 시의 유연성

클라이언트가 데이터를 생성하고 서버로 인입(Ingestion)할 때, 프론트매터 내부에 **임의의 키(Arbitrary Keys)를 선언하고 확장하는 것이 전면 허용**됩니다. 이때 데이터는 `others` 노드로 묶지 않고 **평탄화(Flat)된 구조**로 전송합니다.

```yaml
---
title: "헤밍웨이의 바다, 그리고 불굴의 의지"
language: ["ko"]
byline: ["홍길동", "AI Assistant"]
keywords: ["헤밍웨이", "고전", "바다", "노인과바다"]
image: ["https://example.com/cover.jpg"]
source_url: ["https://example.com/reviews/1234"]
custom_rating: 5
read_status: "completed"
recommended_age: "15+"
---
# 리뷰 본문
노인과 바다는 단순한 어부의 이야기가 아니라...
```

### 3.3. 데이터 영속화(Persistence) 및 반환 (API Response)

**1. 데이터 영속화 (Persistence)**
서버에서 데이터를 데이터베이스나 스토리지에 영속화할 때는 인입된 형태를 유지하여, 1급 필드와 잔여 동적 데이터를 **모두 최상위 계층에 평탄화(Flat)된 상태 그대로 저장**합니다.

**2. API 반환 (Response) 및 정규화**
API를 통해 클라이언트로 데이터를 반환할 때, 파이프라인은 데이터를 **정규화(Normalization)** 하여 마크다운 프론트매터를 재조립합니다. (파싱 정규식: `^---\n([\s\S]*?)\n---`)

🌟 **1급 필드 (First-class Fields)**  
앞서 정의한 `title`, `byline`, `keywords`, `image`, `source_url` 5가지 속성은 반환 시에도 최상위 계층(root node)에 유지되어야 합니다.

📦 **잔여 동적 데이터 강제 묶음 처리 (`others` 노드)**  
반면, 1급 필드를 제외한 모든 사용자 정의 임의 키(Arbitrary Keys)들은 서버에서 클라이언트로 나갈 때 반드시 **`others: [{key: value}, ...]` 형태의 배열 객체로 강제 묶음(Grouping) 처리**되어 반환됩니다.

**클라이언트 반환(API Response) 시의 정규화/역직렬화 예시:**

```yaml
---
title: "헤밍웨이의 바다, 그리고 불굴의 의지"
language:
  - "ko"
byline:
  - "홍길동"
  - "AI Assistant"
keywords:
  - "헤밍웨이"
  - "고전"
  - "바다"
  - "노인과바다"
image:
  - "https://example.com/cover.jpg"
source_url:
  - "https://example.com/reviews/1234"
others:
  - custom_rating: 5
  - read_status: "completed"
  - recommended_age: "15+"
---
# 리뷰 본문
노인과 바다는 단순한 어부의 이야기가 아니라...
```

> **매핑 프로토콜:** 생성된 `text` 데이터 세트의 규격 출처 식별자는 KOMARC `552 ▾h`에 `https://schema.slat.or.kr/bro/v1/schema.json`으로 기록되어야 하며, 페이로드 원문은 `552 ▾u` 서브필드의 URI 식별자를 통해 접근 가능해야 합니다.

---

## 4. 서브 컴포넌트: `abstract` (요약 데이터)

문서 또는 도서에 대한 기계(LLM)나 사람에 의해 작성된 고밀도의 정형화된 상세 요약 텍스트(`text`)와 메타데이터 객체입니다. 추가 임의 속성 주입(`unevaluatedProperties`)은 `false`로 엄격히 차단됩니다.
최상위 라우팅 아키텍처에 따라 `abstractIngestionPayload` (인입용)와 `abstractPersistedEntity` (영속성 엔티티)로 구분됩니다.

- **`text` (YAML Frontmatter 동일 적용):** BroAbstract의 `text` 필드는 BroArticle의 `text`와 **완전히 동일한 YAML Frontmatter 캡슐화 규칙 및 2-Pass Validation**이 적용됩니다. (§3 참고)
- **`isBasedOn` (원본 엔티티 식별자):** 요약이 기반하고 있는 원본 엔티티(`Article` 또는 `CreativeWork`)의 식별자 배열을 필수로 가집니다.
- **`@id` 불변성 (Deterministic UUID):** 영속성 엔티티의 경우 원본 데이터의 UUID와 생성 시간을 기반으로 한 결정론적 해시값이 강제됩니다. 갱신 시 `updated` 필드 사용은 스키마 단위에서 금지되어 있으며, 반드시 신규 객체와 새로운 UUID, `dateCreated`를 재발급하여 시스템의 멱등성을 보장해야 합니다.
- **KOMARC 매핑:** 서지 시스템 연동 시 요약 텍스트는 `552 ▾o`의 '개체/속성 개요' 서브필드에 직접 주입됩니다.

---

## 5. 컬렉션 구조: `BroItemList`

단일 도서에 종속되지 않는 큐레이션 데이터나 다중 게시물 반환 시 사용하는 배열 컨테이너입니다.

- **구조:** `@type`은 `ItemList`. `@id`는 URN UUID 규격 적용. `name`은 길이 2~2000자 제약.
- **`creator`:** 도서 목록 작성/생성 주체 배열. 다수 주체 바인딩 지원을 위해 배열로 입력.
- **`itemListElement`:** 내부 아이템의 **`@id` 식별자(URN UUID) 참조 배열**. 객체 내포(Embedding)를 통한 에그리거트 간 데이터 결합은 스키마 레벨에서 금지되며, 검증(Validation) 단계에서 거부(Reject)됩니다. 모든 하위 엔티티 결합은 오직 `@id` 포인터로만 이루어져야 합니다.
  - _특이사항:_ 개별 문서의 상세 데이터가 필요한 경우, 도메인 계층에서 `@id`를 기반으로 In-Memory Join을 수행하여 응답 DTO를 합성합니다.

---

## 6. 작성자 식별 구조: `creatorDefinitions`

이 스키마에서 가장 엄격한 검증 로직이 적용된 블록입니다. 파생 문서(요약, 서평 등)를 생성한 주체의 이름 또는 기관/시스템명을 정의하며, 주체의 성격(`@type`)에 따라 식별자(`@id`)의 검증 정규식이 동적으로 변이(Mutation)하는 `allOf` + `if/then` 논리 게이트가 설계되어 있습니다.
패턴 불일치 시 스키마 유효성 검증은 즉시 하드 폴트(Hard Fault)를 발생시킵니다.

| `@type` (주체 성격)          | `@id` URN 지원 규격                                                          | 설명                         |
| :--------------------------- | :--------------------------------------------------------------------------- | :--------------------------- |
| **`Person`**                 | 범용 `uuid`, `orcid`, `isni`                                                 | 일반 사용자 또는 개인 작성자 |
| **`GovernmentOrganization`** | 범용 `uuid`, 대한민국 `kr:govcode` (7자리), `lei`, `isni`                    | 정부 및 공공기관             |
| **`Corporation`**            | 범용 `uuid`, 법인/사업자 `kr:crn` (13자리), `kr:brn` (10자리), `lei`, `isni` | 영리 법인 및 기업            |
| **`Organization`**           | 범용 `uuid`, 비영리 고유번호 `kr:npo` (10자리), `lei`, `isni`                | 비영리단체 및 기타 조직      |
| **`SoftwareApplication`**    | `model` (예: `urn:model:openai:gpt-4o`)                                      | AI/LLM 모델 식별 단일 URN    |

_참고:_ 생성 주체가 LLM인 경우 모델의 하위 버전을 `softwareVersion` 속성에 추가 표기할 수 있습니다.

---

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schema.slat.or.kr/bro/v1/schema.json",
  "title": "Bibliographic Reaction Object (BRO)",
  "description": "Bibliographic Reaction Object (BRO)의 원시스키마 BroItemList, BroArticle, BroAbstract. 본 스키마는 시스템 쓰기(Write/Command) 전용 모델이며, 클라이언트 조회를 위한 내포(Embedding) 트리 변환은 미들웨어 계층의 책임으로 위임함.",
  "$comment": "[ARCHITECTURE CORE DIRECTIVE] 본 원시 스키마는 애그리거트 루트(Aggregate Root) 간의 객체 내포(Embedding)를 엄격히 금지하고 단방향 URN 식별자(@id) 참조만을 허용한다. 이는 분산 DB 환경에서 트랜잭션 락 경합과 다중 판본 업데이트 이상을 방어하기 위한 CQRS 쓰기 파이프라인의 물리적 제약이다. 프론트엔드 렌더링 최적화를 위한 JSON 내포 구조(View Model)가 필요할 경우, 본 원시 스키마를 수정하지 말고 도메인 계층에서 In-Memory Join을 수행하여 도메인 특화 응답 DTO를 합성할 것.",
  "type": "object",
  "oneOf": [
    {
      "$ref": "#/$defs/BroItemList"
    },
    {
      "$ref": "#/$defs/BroArticle"
    },
    {
      "$ref": "#/$defs/BroAbstract"
    }
  ],
  "$defs": {
    "BroItemList": {
      "type": "object",
      "description": "다중 타겟 문서 큐레이션을 위한 영속적 컨테이너 엔티티 (ItemList).",
      "required": ["@context", "@type", "creator", "itemListElement"],
      "properties": {
        "@context": {
          "const": "https://schema.org"
        },
        "@type": {
          "const": "ItemList"
        },
        "@id": {
          "$ref": "#/$defs/urnUuidOnly"
        },
        "name": {
          "type": "string",
          "minLength": 2,
          "maxLength": 2000
        },
        "creator": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": {
            "$ref": "#/$defs/creatorRoot"
          }
        },
        "itemListElement": {
          "type": "array",
          "minItems": 0,
          "description": "리스트에 포함된 개별 문서(Article 등)의 식별자 목록. 페이로드 생성 시 반드시 @id 객체 배열만을 전송해야 하며, 문서 객체 전체를 배열 내부에 내포(Embed)하는 페이로드는 검증(Validation) 단계에서 거부(Reject)된다.",
          "$comment": "[ANTI-PATTERN PREVENTION] itemListElement 내부의 oneOf를 통한 Article 객체 직접 포함 허용 로직은 데이터 단편화 방지 및 식별자 정규화를 위해 영구 삭제됨. 모든 하위 엔티티 결합은 오직 @id 포인터로만 이루어져야 함.",
          "items": {
            "type": "object",
            "required": ["@id"],
            "properties": {
              "@id": {
                "$ref": "#/$defs/urnUuidOnly"
              }
            }
          }
        }
      }
    },
    "BroArticle": {
      "type": "object",
      "description": "단일 코어 문서(Article) 처리를 위한 쓰기/영속성 스키마. 파생 문서(Abstract 등)와의 결합은 외부 참조(@id)로만 이뤄진다.",
      "required": [
        "@context",
        "@type",
        "about",
        "text",
        "creator",
        "dateCreated"
      ],
      "properties": {
        "@context": {
          "const": "https://schema.org"
        },
        "@type": {
          "const": "Article"
        },
        "@id": {
          "$ref": "#/$defs/urnUuidOnly"
        },
        "dateCreated": {
          "$ref": "#/$defs/strictDateTime"
        },
        "datePublished": {
          "$ref": "#/$defs/strictDateTime"
        },
        "about": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "description": "파생 문서가 타겟팅하는 코어 저작물 엔티티. 다중 판본 바인딩 시 복수의 원소를 허용하나, 각 요소는 단일 URN을 소유함.",
          "items": {
            "$ref": "#/$defs/terminalIdentifier"
          }
        },
        "text": {
          "$ref": "#/$defs/boundedText"
        },
        "abstract": {
          "type": "array",
          "description": "현재 문서(Article)에 종속된 파생 요약본의 식별자(URN) 배열. 요약본의 상세 텍스트(Text)는 포함하지 않는다.",
          "$comment": "[DATA REDUNDANCY LOCK] Article 페이로드 내에 Abstract 본문 내포를 허용할 경우 발생하는 1:N 구조의 디스크 중복 적재(Redundancy) 및 B-Tree 분할을 막기 위해 철저히 식별자 참조 체계로 고립시킴.",
          "items": {
            "type": "object",
            "required": ["@id"],
            "properties": {
              "@id": {
                "$ref": "#/$defs/urnUuidOnly"
              }
            }
          }
        },
        "creator": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": {
            "$ref": "#/$defs/creatorRoot"
          }
        }
      }
    },
    "BroAbstract": {
      "type": "object",
      "description": "단일 요약본(Abstract) 처리를 위한 원시 스키마",
      "required": [
        "@context",
        "@type",
        "text",
        "creator",
        "dateCreated",
        "isBasedOn"
      ],
      "properties": {
        "@context": {
          "const": "https://schema.org"
        },
        "@type": {
          "const": "CreativeWork"
        },
        "@id": {
          "$ref": "#/$defs/urnUuidOnly"
        },
        "dateCreated": {
          "$ref": "#/$defs/strictDateTime"
        },
        "datePublished": {
          "$ref": "#/$defs/strictDateTime"
        },
        "text": {
          "$ref": "#/$defs/boundedText"
        },
        "inLanguage": {
          "type": "string",
          "description": "요약본의 언어 코드 (예: ko, en)"
        },
        "creator": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "items": {
            "$ref": "#/$defs/creatorRoot"
          }
        },
        "isBasedOn": {
          "type": "array",
          "minItems": 1,
          "description": "이 요약이 기반하고 있는 원본 엔티티(Article 또는 도서 등 CreativeWork)의 식별자",
          "items": {
            "$ref": "#/$defs/terminalIdentifier"
          }
        }
      }
    },
    "BASE_PRIMITIVES": {
      "$comment": " 1. 원시 데이터 계층 (Base Primitives): 식별자, 날짜 통제"
    },
    "urnIdentifier": {
      "type": "string",
      "description": "식별자 검증. 시스템 레벨의 소문자 URN Scheme 정규화를 전제로 패턴을 단순화함.",
      "oneOf": [
        {
          "pattern": "^urn:isbn:(?:97[89]-?)?(?:\\d[ -]?){9}[\\dxX]$"
        },
        {
          "pattern": "^urn:doi:10\\.\\d{4,9}\\/[-._;()/:A-Za-z0-9]+$"
        },
        {
          "pattern": "^urn:uci:[a-zA-Z0-9]{3,10}[:\\-+][a-zA-Z0-9\\-+.:]+$"
        },
        {
          "pattern": "^urn:kolis:[a-zA-Z0-9]+$"
        },
        {
          "pattern": "^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[47][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
        },
        {
          "pattern": "^urn:nlk:[a-zA-Z0-9]+$"
        }
      ]
    },
    "urnUuidOnly": {
      "type": "string",
      "pattern": "^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[47][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
      "description": "UUID v4(랜덤) 및 v7(타임스탬프)만 허용 (영속성 엔티티용)"
    },
    "strictDateTime": {
      "type": "string",
      "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\\.[0-9]{1,6})?(?:Z|[+-][0-9]{2}:[0-9]{2})$",
      "description": "RFC 3339 기반 날짜 포맷 검증. Z 또는 오프셋(+09:00)을 강제하여 타임존 누락으로 인한 DB 데이터 오염 방지."
    },
    "boundedText": {
      "type": "string",
      "minLength": 0,
      "maxLength": 300000,
      "description": "범용 문서 텍스트. 최상단 YAML Frontmatter 캡슐화 필수. 데이터 인입 시 프론트매터 내부의 임의의 키(Arbitrary Keys) 확장은 전면 허용됨. 단, API 반환 및 영속화 객체 표출 시 파이프라인은 반드시 데이터를 정규화하여 1급 필드인 `title`(string), `byline`(string[]), `language`(string[]), `keywords`(string[]), `image`(string[]), `source_url`(string[])만을 최상위 노드에 직렬화하고, 기타 모든 잔여 동적 데이터는 `others: [{key: value}, ...]` 형태의 배열 객체로 강제 묶음 처리하여 마크다운을 재조립해야 함. [SYSTEM_CONSTRAINT: 2-Pass Validation Required]",
      "x-frontmatter-schema": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "byline": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "language": {
            "type": "array",
            "items": {
              "type": "string",
              "pattern": "^[a-zA-Z]{2,3}(-[a-zA-Z0-9]+)?$"
            },
            "minItems": 1,
            "uniqueItems": true
          },
          "keywords": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "image": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "source_url": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "others": {
            "type": "array",
            "items": {
              "type": "object",
              "additionalProperties": true
            }
          }
        },
        "additionalProperties": false,
        "required": []
      }
    },
    "terminalIdentifier": {
      "type": "object",
      "description": "순환 참조(Billion Laughs) 공격을 차단하기 위한 터미널 객체.",
      "required": ["@type", "identifier"],
      "properties": {
        "@type": {
          "enum": ["Article", "CreativeWork"]
        },
        "identifier": {
          "$ref": "#/$defs/urnIdentifier"
        }
      },
      "additionalProperties": false
    },
    "CREATOR_ENTITIES": {
      "$comment": " 2. 저자 엔티티 계층: 다형성 속성 출혈(Property Bleeding) 상호 배제."
    },
    "creatorRoot": {
      "type": "object",
      "required": ["@type"],
      "discriminator": {
        "propertyName": "@type"
      },
      "allOf": [
        {
          "if": {
            "properties": {
              "@type": {
                "const": "Person"
              }
            }
          },
          "then": {
            "$ref": "#/$defs/creatorPerson"
          }
        },
        {
          "if": {
            "properties": {
              "@type": {
                "const": "GovernmentOrganization"
              }
            }
          },
          "then": {
            "$ref": "#/$defs/creatorGovernment"
          }
        },
        {
          "if": {
            "properties": {
              "@type": {
                "const": "Corporation"
              }
            }
          },
          "then": {
            "$ref": "#/$defs/creatorCorporation"
          }
        },
        {
          "if": {
            "properties": {
              "@type": {
                "const": "Organization"
              }
            }
          },
          "then": {
            "$ref": "#/$defs/creatorOrganization"
          }
        },
        {
          "if": {
            "properties": {
              "@type": {
                "const": "SoftwareApplication"
              }
            }
          },
          "then": {
            "$ref": "#/$defs/creatorSoftware"
          }
        }
      ]
    },
    "creatorPerson": {
      "type": "object",
      "required": ["@type", "@id", "name"],
      "properties": {
        "@type": {
          "const": "Person"
        },
        "name": {
          "type": "string",
          "maxLength": 1000
        },
        "@id": {
          "pattern": "^urn:(?:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[47][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|orcid:\\d{4}-\\d{4}-\\d{4}-\\d{3}[0-9X]|isni:0000[ \\-]?\\d{4}[ \\-]?\\d{4}[ \\-]?\\d{3}[0-9X])$"
        }
      },
      "additionalProperties": false
    },
    "creatorGovernment": {
      "type": "object",
      "required": ["@type", "@id", "name"],
      "properties": {
        "@type": {
          "const": "GovernmentOrganization"
        },
        "name": {
          "type": "string",
          "maxLength": 1000
        },
        "@id": {
          "pattern": "^urn:(?:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[47][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|kr:govcode:\\d{7}|lei:[0-9A-Z]{20}|isni:0000[ \\-]?\\d{4}[ \\-]?\\d{4}[ \\-]?\\d{3}[0-9X])$"
        }
      },
      "additionalProperties": false
    },
    "creatorCorporation": {
      "type": "object",
      "required": ["@type", "@id", "name"],
      "properties": {
        "@type": {
          "const": "Corporation"
        },
        "name": {
          "type": "string",
          "maxLength": 100
        },
        "@id": {
          "pattern": "^urn:(?:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[47][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|kr:(?:crn:\\d{13}|brn:\\d{10})|lei:[0-9A-Z]{20}|isni:0000[ \\-]?\\d{4}[ \\-]?\\d{4}[ \\-]?\\d{3}[0-9X])$"
        }
      },
      "additionalProperties": false
    },
    "creatorOrganization": {
      "type": "object",
      "required": ["@type", "@id", "name"],
      "properties": {
        "@type": {
          "const": "Organization"
        },
        "name": {
          "type": "string",
          "maxLength": 100
        },
        "@id": {
          "pattern": "^urn:(?:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[47][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|kr:npo:\\d{10}|lei:[0-9A-Z]{20}|isni:0000[ \\-]?\\d{4}[ \\-]?\\d{4}[ \\-]?\\d{3}[0-9X])$"
        }
      },
      "additionalProperties": false
    },
    "creatorSoftware": {
      "type": "object",
      "required": ["@type", "@id", "name"],
      "properties": {
        "@type": {
          "const": "SoftwareApplication"
        },
        "name": {
          "type": "string",
          "maxLength": 100
        },
        "softwareVersion": {
          "type": "string",
          "maxLength": 50
        },
        "@id": {
          "pattern": "^urn:model:[a-zA-Z0-9-]+:[a-zA-Z0-9\\.-]+$"
        }
      },
      "additionalProperties": false
    }
  }
}
```

---

## 7. 서지 표준 매핑 가이드 (Bibliographic Standard Mapping)

BRO는 전통적인 핵심 서지 레코드(MARC, Dublin Core 등)가 아니라, 코어 서지에 부착/연동되는 **부가 파생 정보(Note/Extension)** 속성을 갖습니다.

### 7.1. KOMARC (한국문헌자동화목록형식) 매핑

기본적으로 KORMARC/KOMARC의 **552 필드 (데이터 세트와 관련된 개체/속성 주기)** 에 매핑됩니다.

| BRO 속성 (Property)          | KOMARC 필드         | 매핑 상세 설명                                                                                                    |
| :--------------------------- | :------------------ | :---------------------------------------------------------------------------------------------------------------- |
| `about` 배열 내 `identifier` | `020 ▾a` / `024 ▾a` | URN 식별자 접두어에 따라 분기. (`urn:isbn:`은 `020`, 그 외는 `024` 필드 매핑)                                     |
| `text` (본문)                | `552 ▾h`, `552 ▾u`  | `552 ▾h`에 `https://schema.slat.or.kr/bro/v1/schema.json` 명시. 원문은 `552 ▾u` URI 식별자를 통해 외부 해소 연결. |
| `article.dateCreated`        | `552 ▾k`            | 최초 생성 타임스탬프 (YYYYMMDD 포맷 변환 후 **개시일자** 바인딩).                                                 |
| `article.datePublished`      | `552 ▾k`            | 영속화/발행 일자 (YYYYMMDD 포맷 변환 후 **종료일자/유효일자** 바인딩).                                            |
| `abstract.text`              | `552 ▾o`            | 작성된 구조화 요약 본문은 핵심 개요로서 **개체/속성 개요** 서브필드에 직접 주입.                                  |
| `abstract.dateCreated`       | `552 ▾k`            | 요약 객체 생성일 (YYYYMMDD 매핑).                                                                                 |

### 7.2. Dublin Core 매핑

| BRO 속성 (Property)     | Dublin Core 요소                      | 매핑 상세 설명                                                           |
| :---------------------- | :------------------------------------ | :----------------------------------------------------------------------- |
| `@id` (UUID)            | `dc:identifier`                       | 파생 문서 엔티티 자체의 고유 식별자 (`urn:uuid:...`)                     |
| `about` 내 `identifier` | `dc:relation` / `dc:source`           | 파생 문서가 종속된 원본 저작물을 가리키는 관계 식별자 (URN).             |
| `creator`               | `dc:creator`                          | 파생 데이터를 생성한 주체(사람, 기관, AI)의 배열. 원본 도서 저자와 별개. |
| `dateCreated`           | `dc:date` / `dcterms:created`         | 파생 데이터 최초 생성 일자.                                              |
| `abstract.text`         | `dc:description` / `dcterms:abstract` | 도서에 대한 요약/개요.                                                   |
| `text` (본문)           | `dc:description`                      | 서평, 비평, 파생문서 전체 (또는 원문 URI 링크 제공).                     |

---

## 8. `@slat.or.kr/bro-schema` 라이브러리 사용 가이드

[@slat.or.kr/bro-schema](https://www.npmjs.com/package/@slat.or.kr/bro-schema)는 BRO 스키마 정의, 유효성 검사 유틸리티, TypeScript 타이핑 및 마크다운 정규화 파서를 제공하는 공식 패키지입니다.

### 📦 설치

```bash
# pnpm
pnpm add @slat.or.kr/bro-schema

# npm
npm install @slat.or.kr/bro-schema
```

### 💻 주요 사용법

#### 1. 스키마 유효성 검사

`@cfworker/json-schema` 기반으로 BRO JSON 객체의 유효성을 검사합니다.

```typescript
import { validateBroSchema } from "@slat.or.kr/bro-schema";

const payload = {
  "@context": "https://schema.org",
  "@type": "Article",
  about: [{ "@type": "CreativeWork", identifier: "urn:isbn:9788937460753" }],
  creator: [
    {
      "@type": "Person",
      "@id": "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
      name: "홍길동",
    },
  ],
  text: "---\ntitle: 리뷰\nlanguage:\n  - ko\n---\n매혹적인 책입니다.",
  dateCreated: "2024-04-11T15:00:00Z",
};

const result = validateBroSchema(payload);
if (result.valid) console.log("유효한 BRO 스키마입니다!");
```

#### 2. 프런트매터 정규화 및 역직렬화 (Frontmatter Parsing)

YAML 프런트매터를 파싱하여 1급 필드(`title`, `keywords` 등)와 동적 번들(`others`)로 분리하고 안전하게 직렬화합니다.

```typescript
import { parseFrontmatter, serializeFrontmatter } from "@slat.or.kr/bro-schema";

// API 반환 형태의 마크다운 문자열 예시 (others가 묶여 있는 상태)
const markdownString = `---
title: "도서 리뷰"
language:
  - "ko"
keywords:
  - "소설"
  - "고전"
others:
  - rating: 5
  - readDate: "2024-04-11"
---
# 리뷰 본문
여기 제 리뷰가 있습니다...`;

// 정규화 파싱
const { data, others, content } = parseFrontmatter(markdownString);

console.log(data.title); // "도서 리뷰"
console.log(data.keywords); // ["소설", "고전"]
console.log(others); //[{ rating: 5 }, { readDate: "2024-04-11" }]
console.log(content); // "# 리뷰 본문\n여기 제 리뷰가 있습니다..."

// 마크다운 재조립 직렬화
const reconstructedMarkdown = serializeFrontmatter(data, others, content);
```

#### 3. KOMARC 변환 유틸리티

BRO 페이로드를 표준 KOMARC 필드 규격으로 손쉽게 변환합니다.

```typescript
import { convertBroToKomarc } from "@slat.or.kr/bro-schema";

const komarcRecord = convertBroToKomarc(payload);
console.log(JSON.stringify(komarcRecord, null, 2));
// 020 (ISBN), 100/700 (저자 필드 무시), 552 (로컬 메타데이터 파생) 매핑 출력
```

### 라이선스

[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)
