# Bibliographic Reaction Object (BRO) Schema v1.0

본 문서는 `https://schema.slat.or.kr/bro/v1.0/schema.json`에 정의된 **Bibliographic Reaction Object (BRO, 서지 반응정보 객체)** 의 아키텍처, 제약 조건 및 데이터 처리 파이프라인에 대한 심층 기술 명세입니다. BRO 스키마는 도서 및 비정형 서지 파생 데이터에 대한 메타데이터 규칙으로, 원본 데이터에 대한 리뷰, 분석, 비평, 요약, 감상 등의 파생 데이터를 일관성 있고 독립적인 JSON-LD 네이티브 엔티티로 구조화합니다.

---

## 1. 아키텍처 원칙 (Architecture Principles)

- **JSON-LD 네이티브 설계:**
- **참조 무결성과 객체 내포 금지:** 하위/연관 객체를 내부에 직접 내포(Embedding)하는 것을 금지하며, 오직 타겟 자원의 `@id` 포인터만 저장하여 데이터 정규화를 강제합니다(CQRS 쓰기 전용 모델).
- **불변성 (Immutability) 및 버전 관리:** 최초 생성 후 객체의 `@id`는 영구 불변(Immutable)입니다. 객체가 수정되는 경우, 반드시 `dateModified` 타임스탬프를 갱신하고 선택적으로 낙관적 락(Optimistic Locking)을 위한 `version` 식별자를 증가시킵니다.

## 2. 최상위 라우팅 엔티티 (Top-Level Routing)

BRO 스키마는 단일 목적의 객체가 아니며, 진입점의 `@type` 필드에 따라 3개의 서로 다른 에그리거트 루트 중 하나(`oneOf`)로 분기 처리됩니다.

1.  **`BroItemList` (`@type: "ItemList"`)**
    - **목적:** 다중 타겟 문서 큐레이션을 위한 영속적 컨테이너 엔티티입니다.
    - **특징:** `itemListElement`는 오직 `@id`(URN UUID) 식별자 참조만 허용하며, 문서 객체 전체의 내포(Embedding)는 스키마 레벨에서 엄격히 금지됩니다.
2.  **`BroArticle` (`@type: "Article"`)**
    - **목적:** 단일 코어 문서(서평, 비평, 반응문서 등) 처리를 위한 쓰기/영속성 스키마입니다.
    - **특징:** 파생 요약본(Abstract)과의 결합은 외부 참조(`@id`)로만 이뤄지며, `about` 배열을 통해 원본 서지 엔티티를 식별합니다. 기존 프론트매터 데이터(`aboutTitle`, `articleByline`, `inLanguage`, `keywords` 등)를 순수 JSON의 1급 속성으로 보유합니다.
3.  **`BroAbstract` (`@type: "CreativeWork"`)**
    - **목적:** 기계(LLM)나 인간 작업자에 의해 작성된 고밀도 요약본(Abstract) 처리를 위한 원시 스키마입니다.
    - **특징:** `isBasedOn` 배열을 통해 요약의 기반이 되는 원본 엔티티(Article 또는 도서)를 역참조합니다.

---

## 3. 핵심 속성 (Core Properties)

모든 데이터 엔티티가 상호 운용성을 위해 공유하는 핵심 필드 구조입니다. `@context`는 `https://schema.org` 규격을 준수합니다.

### 3.1. 식별 및 생명주기 제어 속성

- **`@id` (URN Identifier):** 객체의 식별자. 파생문서와 작성자는 `urn:uuid:` 형식 등을 갖추어야 합니다.
- **`dateCreated` (시간):** 엔티티 최초 생성 타임스탬프(ISO 8601).
- **`dateModified` (시간):** 객체 내용 변경 시 갱신되는 갱신 타임스탬프.
- **`version` (버전 해시/순서):** 데이터 변경 이력을 트래킹하기 위한 리비전 넘버.

### 3.2. 1급 메타데이터 (1st-class Metadata)

이전 세대의 프론트매터 캡슐화에서 해방되어, 스키마 레벨에서 직접 쿼리 및 인덱싱 가능한 1급 속성입니다.

- **`about` / `isBasedOn`:** 타겟이 되는 원본 객체의 식별자(`identifier`) 배열. (원소가 최소 1개 이상 필수)
- **`text`:** 순수 본문 텍스트 (마크다운 포맷).
- **`inLanguage`:** BCP 47 언어 코드 배열 (`["ko", "en"]` 등).
- **`keywords`:** 분류용 핵심어 목록.
- **`image` / `citation`:** 연관 이미지 링크 및 참고 문헌 URN/URL 배열.

### 3.3. 동적 데이터 확장 (`additionalProperty`)

도서관이나 서비스별로 파편화된 커스텀 메타데이터(예: 평점, 완독 여부, 추천 연령 등)는 스키마를 오염시키지 않고 Schema.org 표준의 `PropertyValue` 배열 형태인 `additionalProperty`로 수용합니다. 이를 통해 NoSQL이나 RDB의 JSON 컬럼에서 정형화된 쿼리가 가능합니다.

```json
"additionalProperty": [
  { "@type": "PropertyValue", "name": "custom_rating", "value": 5 },
  { "@type": "PropertyValue", "name": "read_status", "value": "completed" }
]
```

---

## 4. 작성자 식별 구조 (`creator`)

이 스키마에서 가장 엄격한 검증 로직이 적용된 블록입니다. 문서를 생성한 주체의 이름 또는 기관/시스템명을 정의하며, **`oneOf` 기반 태그드 유니온(Tagged Union)** 방식으로 구현됩니다. `@type` 필드가 discriminator 역할을 하며, 타입별로 허용되는 식별자 규격이 분리되어 있습니다.

| `@type` (주체 성격)          | 상세 허용 구조 및 특징                                                                                          |
| :--------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| **`Person`**                 | 일반 개인 작성자. 파편화된 외부 데이터 스크래핑 인입에 대응하기 위해 `@id` 식별자를 예외적으로 생략 허용합니다. |
| **`Anonymous`**              | 네트워크 인입 단말에서 작성자 추적에 실패할 경우 스키마 크래시를 방지하기 위한 Fallback용 익명 작성자.          |
| **`GovernmentOrganization`** | 정부 및 공공기관 (범용 `uuid`, 대한민국 `kr:govcode` 등 `@id` 강제 요구).                                       |
| **`Corporation`**            | 영리 법인 및 기업 (`kr:crn` 등 `@id` 강제 요구).                                                                |
| **`Organization`**           | 비영리단체 및 기타 조직 (`kr:npo` 등 `@id` 강제 요구).                                                          |
| **`SoftwareApplication`**    | 문서 생성 주체가 AI/LLM 파이프라인인 경우. `softwareVersion` 속성에 추가 표기 가능. (`@id` 강제 요구)           |

---

## 5. Linked Open Data (LOD) 및 서지 시스템 매핑 (Standard Mapping)

BRO 페이로드는 자체 패키지에 동봉된 변환기를 사용하여 전통적인 핵심 서지 레코드 생태계와 매핑될 수 있습니다.

### 5.1. BIBFRAME 2.0 변환

- `Article` → `["bf:Work", "bf:Review"]` (관계 엣지: `bf:reviewOf`)
- `Abstract` → `["bf:Work", "bf:Summary"]` (관계 엣지: `bf:summaryOf`)
- `creator` 객체들은 `bf:Contribution`을 생성하여 `bf:Person`, `bf:Organization`, `bf:Agent` 등으로 각각 다형성 매핑됩니다.

### 5.2. KORMARC 변환

- 기본적으로 KORMARC **552 필드 (데이터 세트와 관련된 개체/속성 주기)** 에 매핑됩니다.
- 타겟 식별자는 `020 ▾a` / `024 ▾a`에 바인딩되며, 데이터셋 출처 표시는 `552 ▾h`에 `https://schema.slat.or.kr/bro/v1.0/schema.json`으로 명시됩니다.

---

## 6. `@slat.or.kr/bro-schema` 로컬 라이브러리 사용 가이드

본 패키지(`@slat.or.kr/bro-schema`)는 BRO 스키마 정의, JSON Schema 단일 패스 유효성 검증 체계, BIBFRAME 2.0 변환기 및 RAG 대응 렌더러를 공식 제공합니다.

### 📦 설치

```bash
# pnpm
pnpm add @slat.or.kr/bro-schema

# npm
npm install @slat.or.kr/bro-schema
```

### 💻 패키지 활용법

#### 1. 스키마 단일 검증 (Validation)

JSON-LD 네이티브 아키텍처로 이전됨에 따라 기존 2-Pass(Valibot Frontmatter) 검증 파이프라인이 폐기되고 단일 패스 Validator로 단순화되었습니다.

```typescript
import { validateBroSchema } from "@slat.or.kr/bro-schema";

const payload = {
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "urn:uuid:123e...",
  dateCreated: "2026-04-16T12:00:00Z",
  about: [{ "@type": "CreativeWork", identifier: "urn:isbn:9788937460753" }],
  creator: [{ "@type": "Person", name: "홍길동" }],
  text: "매혹적인 책입니다.",
  inLanguage: ["ko"],
  additionalProperty: [{ "@type": "PropertyValue", name: "rating", value: 5 }],
};

const result = validateBroSchema(payload);
if (result.valid) console.log("유효한 BRO 스키마입니다!");
```

#### 2. BIBFRAME 2.0 JSON-LD 로의 양방향 연동

LOD 호환 생태계와의 연결을 위해 페이로드를 BIBFRAME 규격으로 On-the-fly 변환합니다.

```typescript
import { convertBroToBibframe } from "@slat.or.kr/bro-schema";

const bfPayload = convertBroToBibframe(payload);
console.log(bfPayload["@type"]); // ["bf:Work", "bf:Review"]
```

#### 3. AI RAG (Retrieval-Augmented Generation) 마크다운 렌더러

LLM 벡터 DB 검색 이후 컨텍스트 주입 시, JSON 트리 모델보다 의미적 압축률이 뛰어난 "마크다운 기반 텍스트 + YAML 프론트매터" 포맷으로 BRO 객체를 합성해 반환합니다. (외부 의존성 없음)

```typescript
import { renderBroToMarkdown } from "@slat.or.kr/bro-schema";

const ragContextStr = renderBroToMarkdown(payload);
console.log(ragContextStr);
// ---
// id: urn:uuid:123e...
// type: Article
// inLanguage:
//   - ko
// ...
// ---
// 매혹적인 책입니다.
```

### 라이선스

[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)
