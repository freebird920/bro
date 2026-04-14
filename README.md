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

> ⚠️ **주의:** 원본 도서의 저자(서지 표준의 1XX/7XX 계층)와는 엄격히 분리된 도메인입니다. (자세한 식별자 규격은 [6. 작성자 식별 구조](#6-작성자-식별-구조-creatorroot) 참고)

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
  "$schema": "https://json-schema.org/draft/2020-12/schema",
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

## 4. 서브 컴포넌트: `BroAbstract` (요약 데이터)

문서 또는 도서에 대한 기계(LLM)나 사람에 의해 작성된 고밀도의 정형화된 상세 요약 텍스트(`text`)와 메타데이터 객체입니다. `@type`은 `"CreativeWork"`로 고정됩니다.

- **`text` (YAML Frontmatter 동일 적용):** BroAbstract의 `text` 필드는 BroArticle의 `text`와 **완전히 동일한 YAML Frontmatter 캡슐화 규칙 및 2-Pass Validation**이 적용됩니다. (§3 참고)
- **`isBasedOn` (원본 엔티티 식별자):** 요약이 기반하고 있는 원본 엔티티(`Article` 또는 `CreativeWork`)의 식별자 배열을 필수로 가집니다. 각 요소는 `terminalIdentifier` 구조(`@type` + `identifier` URN)를 따릅니다.
- **`@id` 불변성:** 갱신 시 `updated` 필드 사용은 금지되며, 반드시 신규 `@id`와 새로운 `dateCreated`를 재발급하여 시스템의 멱등성을 보장해야 합니다.
- **KOMARC 매핑:** 서지 시스템 연동 시 요약 텍스트는 `552 ▾o`의 '개체/속성 개요' 서브필드에 직접 주입됩니다.

---

## 5. 컬렉션 구조: `BroItemList`

단일 도서에 종속되지 않는 큐레이션 데이터나 다중 게시물 반환 시 사용하는 배열 컨테이너입니다.

- **구조:** `@type`은 `ItemList`. `@id`는 URN UUID 규격 적용. `name`은 길이 2~2000자 제약.
- **`creator`:** 도서 목록 작성/생성 주체 배열. 다수 주체 바인딩 지원을 위해 배열로 입력.
- **`itemListElement`:** 내부 아이템의 **`@id` 식별자(URN UUID) 참조 배열**. 객체 내포(Embedding)를 통한 에그리거트 간 데이터 결합은 스키마 레벨에서 금지되며, 검증(Validation) 단계에서 거부(Reject)됩니다. 모든 하위 엔티티 결합은 오직 `@id` 포인터로만 이루어져야 합니다.
  - _특이사항:_ 개별 문서의 상세 데이터가 필요한 경우, 도메인 계층에서 `@id`를 기반으로 In-Memory Join을 수행하여 응답 DTO를 합성합니다.

---

## 6. 작성자 식별 구조: `creatorRoot`

이 스키마에서 가장 엄격한 검증 로직이 적용된 블록입니다. 파생 문서(요약, 서평 등)를 생성한 주체의 이름 또는 기관/시스템명을 정의하며, JSON Schema Draft 2020-12 표준인 **`oneOf` 기반 태그드 유니온(Tagged Union)** 방식으로 구현됩니다. `@type` 필드가 discriminator 역할을 하며, 타입별로 허용되는 `@id` URN 규격이 완전히 분리되어 속성 출혈(Property Bleeding)을 방지합니다. 패턴 불일치 시 스키마 유효성 검증은 즉시 하드 폴트(Hard Fault)를 발생시킵니다.

| `@type` (주체 성격)          | `@id` URN 지원 규격                                                          | 설명                         |
| :--------------------------- | :--------------------------------------------------------------------------- | :--------------------------- |
| **`Person`**                 | 범용 `uuid`, `orcid`, `isni`                                                 | 일반 사용자 또는 개인 작성자 |
| **`GovernmentOrganization`** | 범용 `uuid`, 대한민국 `kr:govcode` (7자리), `lei`, `isni`                    | 정부 및 공공기관             |
| **`Corporation`**            | 범용 `uuid`, 법인/사업자 `kr:crn` (13자리), `kr:brn` (10자리), `lei`, `isni` | 영리 법인 및 기업            |
| **`Organization`**           | 범용 `uuid`, 비영리 고유번호 `kr:npo` (10자리), `lei`, `isni`                | 비영리단체 및 기타 조직      |
| **`SoftwareApplication`**    | `model` (예: `urn:model:google:gemini-2.0`)                                  | AI/LLM 모델 식별 단일 URN    |

_참고:_ 생성 주체가 LLM인 경우 모델의 하위 버전을 `softwareVersion` 속성에 추가 표기할 수 있습니다. 모든 creator 서브타입의 `name` 필드는 `maxLength: 1000`으로 통일되어 있습니다.

---

> 📄 **전체 JSON Schema 원문:** [`https://schema.slat.or.kr/bro/v1/schema.json`](https://schema.slat.or.kr/bro/v1/schema.json)
>
> 스키마 전문은 위 URL에서 직접 조회하거나, 워커 엔드포인트 `GET /bro/v1/schema.json`을 통해 실시간으로 확인할 수 있습니다.

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
