# Bibliographic Reaction Object (BRO) v1.0

BRO는 도서, 논문, 기사, 웹문서, 데이터셋 등 서지적으로 다룰 수 있는 자료에 대한 **추천 목록, 서평 목록, 독서 목록, 큐레이션 목록, 감상문, 추천 사유, 요약**을 교환하기 위한 JSON/JSON-LD 메타데이터 스키마다.

이 문서는 `bro.schema.json`과 `bro.context.jsonld`의 기준 명세서다. JSON Schema는 구조 검증을 담당하고, JSON-LD context는 Schema.org, Dublin Core, BIBO, PROV, BIBFRAME, 국립중앙도서관 LOD 같은 외부 메타데이터 체계와의 연결을 담당한다.

검토 기준일: **2026-05-09**

---

## 1. 표준 식별자

| 항목 | 값 |
|---|---|
| 표준명 | Bibliographic Reaction Object |
| 약칭 | BRO |
| 버전 | v1.0 |
| JSON Schema | `https://schema.slat.or.kr/bro/v1.0/schema.json` |
| JSON-LD Context | `https://schema.slat.or.kr/bro/v1.0/context.jsonld` |
| Vocabulary IRI | `https://schema.slat.or.kr/bro/v1.0/vocab#` |
| 로컬 파일 | `bro.schema.json`, `bro.context.jsonld`, `examples.json` |
| 기반 사양 | JSON Schema Draft 2020-12, JSON-LD 1.1 |

---

## 2. 한 문장 규칙

> **목록에는 자료를 바로 넣고, 항목별 글이 있으면 `Reaction` 또는 `ReactionAbstract`를 만들어 목록에서 참조한다.**

여기서 “자료”는 책만이 아니다. `Book`은 가장 흔한 예시일 뿐이며, BRO는 `CreativeWork` 계열 자료 전체로 확장된다.

---

## 3. 작성 이유와 철학

현실의 추천·서평 데이터는 매우 파편화되어 있다. 공공도서관은 사서 추천 목록을 만들고, 학교는 학년별 권장 목록을 만들고, 신문과 블로그는 서평 목록을 만들고, 상업 플랫폼은 테마 큐레이션을 만들고, AI 시스템은 요약과 추천 사유를 만든다. 이 데이터들은 MARC, MODS, 웹페이지, 엑셀, RDF, 내부 DB, 카드뉴스, PDF 등 서로 다른 형식으로 존재한다.

BRO가 보존하려는 핵심 정보는 단지 “책 정보”가 아니다. **어떤 자료가 어떤 목록에 등재되었는지** 자체가 중요한 정보다. “사서 추천 목록”, “청소년 권장 목록”, “비평가 선정 목록”, “입문 논문 목록”에 포함되었다는 사실은 자료의 의미, 신뢰도, 활용 맥락을 설명한다.

BRO의 설계 철학은 다음과 같다.

1. **목록 우선**: 목록은 단순 컨테이너가 아니라 1급 메타데이터다.
2. **쉬운 입력**: 일반 입력자가 RDF, MARC, BIBFRAME을 몰라도 작성할 수 있어야 한다.
3. **점진적 정규화**: ISBN, DOI, LOD URI를 모르면 제목과 저자 문자열만으로도 남긴다.
4. **고아 정보 방지**: 업로드자의 작은 실수 때문에 행이 버려지지 않도록 약한 단서도 보존한다.
5. **식별자 통합**: 외부 연결 단서는 `identifier`로 통일해 파편화를 줄인다.
6. **표준 호환**: JSON-LD와 Schema.org를 중심으로 기존 서지 표준과 연결 가능해야 한다.
7. **복잡성 비강제**: 전문 변환기는 정교하게 쓸 수 있지만, 일반 입력자에게 복잡한 구조를 강제하지 않는다.

---

## 4. 데이터 모델

BRO payload는 최상위에서 정확히 하나의 엔티티여야 한다.

| 엔티티 | `@type` | 역할 |
|---|---|---|
| `ReactionList` | `"ReactionList"` | 추천 목록, 서평 목록, 독서 목록, 큐레이션 목록 |
| `Reaction` | `"Reaction"` | 서평, 감상, 코멘트, 추천 사유, 등재 신호 |
| `ReactionAbstract` | `"ReactionAbstract"` | Reaction, ReactionList, CreativeWork의 요약 |

관계 구조:

```text
ReactionList
  └─ itemListElement[]
       ├─ CreativeWork reference
       └─ Reaction / ReactionAbstract reference

Reaction
  └─ about[]
       └─ CreativeWork reference

ReactionAbstract
  └─ isBasedOn[]
       ├─ CreativeWork reference
       └─ Reaction / ReactionAbstract / ReactionList reference
```

---

## 5. 빠른 시작

### 5.1 가장 단순한 추천 목록

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "ReactionList",
  "@id": "https://library.example.kr/lists/2026-05-recommended",
  "name": "2026년 5월 사서 추천 자료",
  "creator": [
    { "@type": "Organization", "name": "예시도서관" }
  ],
  "itemListElement": [
    {
      "@type": "Book",
      "identifier": "urn:isbn:9788937462788",
      "name": "1984",
      "creatorName": "George Orwell",
      "bibliographicLevel": "Edition"
    },
    {
      "@type": "CreativeWork",
      "name": "식별자를 아직 모르는 추천 자료",
      "creatorName": "원문 저자 문자열",
      "bibliographicLevel": "Unspecified"
    }
  ],
  "dateCreated": "2026-05-09T00:00:00+09:00"
}
```

### 5.2 도서가 아닌 자료

```json
{
  "@type": "ScholarlyArticle",
  "identifier": "https://doi.org/10.1038/s41586-021-03819-2",
  "name": "예시 학술논문",
  "bibliographicLevel": "Work"
}
```

```json
{
  "@type": "WebPage",
  "identifier": "https://example.org/reading-guide/1984",
  "name": "1984 독서 지도 자료"
}
```

### 5.3 항목별 추천 사유가 있는 경우

추천 사유는 별도 `Reaction`으로 만든다.

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "urn:uuid:7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "reactionType": "Listing",
  "about": [
    {
      "@type": "Book",
      "identifier": "urn:isbn:9788937462788",
      "name": "1984"
    }
  ],
  "text": "권력과 언어를 함께 토론하기 좋은 자료라 목록에 포함함.",
  "creator": [
    { "@type": "Organization", "name": "예시중학교 국어과" }
  ],
  "dateCreated": "2026-05-09T10:00:00+09:00"
}
```

목록에서는 그 `Reaction`을 참조한다.

```json
{
  "@id": "urn:uuid:7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "@type": "Reaction"
}
```

---

## 6. `ReactionList`

`ReactionList`는 BRO의 중심 엔티티다. 추천 목록과 서평 목록을 서로 다른 세계로 분리하지 않고, “목록 자체”를 보존한다.

| 필드 | 필수 | 설명 |
|---|---:|---|
| `@context` | 예 | BRO JSON-LD context |
| `@type` | 예 | 반드시 `ReactionList` |
| `@id` | 예 | 목록 자체의 안정 식별자 |
| `creator` | 예 | 목록을 발행·수집·변환한 책임자 |
| `itemListElement` | 예 | CreativeWork 참조 또는 Reaction/ReactionAbstract 참조 |
| `dateCreated` | 예 | 목록 생성 또는 BRO 변환 시각 |
| `name` | 아니오 | 목록명 |
| `byline` | 아니오 | 원문에 표시된 자유형 출처·작성자 문구 |
| `citation` | 아니오 | 원문 목록 URL, PDF, 공지 페이지 등 |
| `keywords` | 아니오 | 목록 검색·분류 키워드 |
| `additionalProperty` | 아니오 | 프로그램명, 원문 행 번호, 내부 ID 등 |

`itemListElement`는 입력 단계에서 `ListItem`을 강제하지 않는다. 일반 사용자는 자료 객체를 배열에 넣으면 된다. 순서가 중요한 RDF/Schema.org export에서는 변환기가 배열 index로 `ListItem.position`을 만들 수 있다.

---

## 7. 목록 항목: `workReference`

`workReference`는 책·논문·기사·웹문서 등 외부 자료를 가리키는 단순 객체다.

| 필드 | 설명 |
|---|---|
| `@type` | Schema.org CreativeWork 계열 타입. `Book`, `Article`, `ScholarlyArticle`, `WebPage`, `Dataset`, `CreativeWork` 등 |
| `identifier` | 같은 자료를 정확히 식별하는 값. 문자열, `PropertyValue`, 또는 배열 |
| `name` | 자료 제목. identifier가 없으면 반드시 필요 |
| `creatorName` | 저자·창작자 표시 문자열 또는 문자열 배열 |
| `publisherName` | 출판사·발행기관 표시 문자열 |
| `datePublished` | 발행일. `YYYY`, `YYYY-MM`, `YYYY-MM-DD`, RFC3339 date-time 허용 |
| `bibliographicLevel` | `Work`, `Edition`, `Item`, `Unspecified` |
| `bookEdition` | 책 판본명. 예: `청소년판`, `특별판`, `개정판` |
| `url` | 상세 페이지, 접근 URL, 랜딩 페이지 |
| `exampleOfWork` | 판본이 속한 추상 저작을 가리키는 고급 필드 |
| `additionalProperty` | KDC, 제어번호, 상업 API ID 등 |

`identifier` 또는 `name` 중 하나는 있어야 한다. 식별자를 모르면 제목만이라도 남긴다.

```json
{
  "@type": "CreativeWork",
  "name": "원문에 적힌 자료명",
  "creatorName": "원문 저자 문자열"
}
```

---

## 8. `Book`에 고정하지 않는 이유

사용자의 목적은 “추천 도서 목록”에서 출발하지만, 실제 데이터는 도서에 한정되지 않는다. 독서 지도 웹페이지, 논문 목록, 기사 목록, 영상 강의, 데이터셋, 장(chapter), 연속간행물도 추천·서평·큐레이션의 대상이 될 수 있다.

따라서 BRO는 목록 항목을 `Book`으로 고정하지 않고 `CreativeWork` 계열로 연다.

권장 타입:

```json
{ "@type": "Book", "name": "책" }
{ "@type": "Article", "name": "기사" }
{ "@type": "ScholarlyArticle", "name": "논문" }
{ "@type": "WebPage", "name": "웹문서" }
{ "@type": "Dataset", "name": "데이터셋" }
{ "@type": "Chapter", "name": "책의 장" }
{ "@type": "CreativeWork", "name": "정확한 유형을 모르는 자료" }
```

정확한 타입을 모르면 `CreativeWork`를 쓰는 것이 맞다. 나중에 보강기가 `Book`, `Article`, `Dataset` 등으로 좁힐 수 있다.

---

## 9. `identifier`로 통일

BRO core는 `sameAs`를 사용하지 않는다. 외부 연결 단서는 `identifier`로 통일한다.

```json
{
  "@type": "Book",
  "identifier": [
    "urn:isbn:9788937462788",
    "http://lod.nl.go.kr/resource/KMO199000001"
  ],
  "name": "1984"
}
```

### 9.1 왜 `sameAs`를 제거했는가

`sameAs`는 강한 동일성 신호다. 잘못 사용하면 판본, 번역본, 청소년판, 특별판, 관련 웹페이지가 “같은 것”으로 병합될 수 있다. 일반 입력자에게 `identifier`와 `sameAs`의 의미론적 차이를 판단하라고 요구하면 오류가 많아진다.

BRO는 입력 스키마에서 다음 원칙을 채택한다.

> 같은 자료를 정확히 식별하는 값은 모두 `identifier`에 넣는다.

RDF exporter는 필요할 때 `identifier` 중 일부를 `schema:sameAs` 또는 `owl:sameAs`로 파생할 수 있다. 단, 그것은 응용 계층의 판단이며 BRO canonical JSON 필드는 아니다.

### 9.2 `identifier`에 넣는 값

좋은 예:

```json
"identifier": "urn:isbn:9788937462788"
"identifier": "https://doi.org/10.1038/s41586-021-03819-2"
"identifier": "http://lod.nl.go.kr/resource/KMO199000001"
"identifier": "urn:nlk:KMO199000001"
"identifier": "urn:oclc:889647468"
```

식별자 권위와 값을 구조화해야 할 때는 `PropertyValue`를 쓴다.

```json
{
  "@type": "PropertyValue",
  "propertyID": "aladin:itemId",
  "value": 123456789
}
```

### 9.3 `identifier`에 넣지 않는 값

다음은 식별자가 아니라 원문·접근·참고 URL일 수 있다.

- 검색 결과 URL
- 블로그 서평 URL
- 목록을 발견한 원문 페이지
- 관련 기사 URL
- 다른 판본 URL

이런 값은 상황에 따라 `url`, `citation`, 또는 `additionalProperty`에 둔다.

---

## 10. 아몬드 청소년판과 특별판 처리

“아몬드(청소년판)”과 “아몬드(특별판)”은 `sameAs`로 묶는 문제가 아니다. 이는 **서지 수준과 판본 구분**의 문제다.

BRO는 `bibliographicLevel`을 둔다.

| 값 | 의미 | 예 |
|---|---|---|
| `Work` | 추상 저작 수준 | “아몬드”라는 작품 자체 |
| `Edition` | 특정 판본·발행 형태 | 청소년판, 특별판, 특정 ISBN 판본 |
| `Item` | 특정 소장본·개별 사본 | 어느 도서관의 특정 등록번호 사본 |
| `Unspecified` | 판단 불가 | 원문 데이터만으로 수준 불명 |

판본이 다르면 항목을 분리한다.

```json
{
  "@type": "Book",
  "identifier": "urn:isbn:9791160000001",
  "name": "아몬드",
  "creatorName": "손원평",
  "bookEdition": "청소년판",
  "bibliographicLevel": "Edition",
  "exampleOfWork": {
    "@type": "CreativeWork",
    "name": "아몬드",
    "creatorName": "손원평"
  }
}
```

```json
{
  "@type": "Book",
  "identifier": "urn:isbn:9791160000002",
  "name": "아몬드",
  "creatorName": "손원평",
  "bookEdition": "특별판",
  "bibliographicLevel": "Edition",
  "exampleOfWork": {
    "@type": "CreativeWork",
    "name": "아몬드",
    "creatorName": "손원평"
  }
}
```

두 ISBN을 하나의 `identifier` 배열에 섞지 않는다. 하나의 `identifier` 배열은 같은 자료에 대한 여러 식별자만 담는다.

일반 입력자는 `exampleOfWork`를 생략해도 된다. 제목, 저자, 판본명, ISBN만 보존해도 나중에 충분히 연결할 수 있다.

---

## 11. `Reaction`

`Reaction`은 특정 자료에 대한 반응이다.

| `reactionType` | 의미 | `text` 정책 |
|---|---|---|
| `Response` | 서평, 감상, 비평, 코멘트 | 빈 문자열 불가 |
| `Listing` | 추천·등재·선정 사실 또는 추천 사유 | 빈 문자열 허용 |
| `Unspecified` | 발행자가 분류하지 않음 | 빈 문자열 허용 |

단순히 “이 자료가 목록에 들어갔다”는 사실도 `Listing`으로 표현할 수 있다. 추천 사유가 없으면 `text`는 빈 문자열이어도 된다.

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "urn:uuid:018f2e8b-5b5d-7cc2-a4d8-4e4b1a0e4f06",
  "reactionType": "Response",
  "name": "전체주의의 언어",
  "about": [
    {
      "@type": "Book",
      "identifier": "urn:isbn:9788937462788",
      "name": "1984"
    }
  ],
  "text": "신어는 단순한 단어 체계가 아니라 사고의 경계를 설계하는 통치 기술이다.",
  "creator": [
    { "@type": "Person", "name": "김독자" }
  ],
  "dateCreated": "2026-05-09T21:30:00+09:00",
  "inLanguage": ["ko"]
}
```

---

## 12. `ReactionAbstract`

`ReactionAbstract`는 Reaction, ReactionList, 또는 CreativeWork를 기반으로 한 요약이다.

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "ReactionAbstract",
  "@id": "urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "1984 서평 요약",
  "text": "서평은 신어를 사고 통제 장치로 해석한다.",
  "creator": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://schema.slat.or.kr/agents/bro-summarizer",
      "name": "BRO Summarizer",
      "softwareVersion": "1.0.0"
    }
  ],
  "dateCreated": "2026-05-09T22:00:00+09:00",
  "isBasedOn": [
    {
      "@id": "urn:uuid:018f2e8b-5b5d-7cc2-a4d8-4e4b1a0e4f06",
      "@type": "Reaction"
    }
  ],
  "inLanguage": ["ko"]
}
```

---

## 13. `creator`와 `byline`

`creator`는 BRO 객체를 발행·수집·변환·큐레이션한 책임 주체다. 원문에 표시된 필자명, 직책, 출처 문구는 `byline`이다.

```json
{
  "creator": [
    { "@type": "Organization", "name": "예시도서관 디지털아카이브" }
  ],
  "byline": "김독자(1995년 당시 문화부 기자)"
}
```

이 구분은 중요하다. 원문 byline을 `creator`로 옮기면 데이터 책임자와 원문 표시가 섞인다.

`creator`에는 다음 타입을 사용할 수 있다.

| 타입 | 의미 |
|---|---|
| `Person` | 개인 |
| `Organization` | 도서관, 학교, 기업, 정부기관, 단체 |
| `SoftwareApplication` | AI, 크롤러, 변환기, 요약기 |
| `UnknownAgent` | 책임 주체 미상 |
| `Role` | 당시 직책이나 역할 보존 |

---

## 14. `additionalProperty`

정식 필드로 둘 만큼 보편적이지 않지만 보존해야 하는 값은 `additionalProperty`에 둔다.

```json
{
  "@type": "PropertyValue",
  "name": "nlon:kdc",
  "propertyID": "http://lod.nl.go.kr/ontology/kdc",
  "value": "843"
}
```

사용 예:

```text
source:rawTitle
source:rawIsbn
source:rowNumber
nlk:controlNo
nlon:kdc
komarc:520:ind1
aladin:itemId
school:grade
```

---

## 15. JSON-LD/RDF 호환

BRO는 일반 JSON으로 바로 사용할 수 있고, JSON-LD context를 통해 RDF로 확장할 수 있다.

주요 매핑:

| BRO | JSON-LD/RDF |
|---|---|
| `ReactionList` | `bro:ReactionList` |
| `Reaction` | `bro:Reaction` |
| `ReactionAbstract` | `bro:ReactionAbstract` |
| `Book` | `schema:Book` |
| `CreativeWork` | `schema:CreativeWork` |
| `itemListElement` | `schema:itemListElement` |
| `identifier` | `schema:identifier` |
| `url` | `schema:url` |
| `exampleOfWork` | `schema:exampleOfWork` |
| `creator` | `schema:creator` |
| `about` | `schema:about` |
| `isBasedOn` | `schema:isBasedOn` |
| `additionalProperty` | `schema:additionalProperty` |

BRO context는 `sameAs`를 핵심 필드로 두지 않는다. Schema.org export가 필요하면 응용 계층에서 근거 있는 `identifier` 값을 `schema:sameAs`로 파생할 수 있다.

---

## 16. Schema.org ItemList와의 관계

Schema.org는 `itemListElement`에 단순 엔티티나 `ListItem`을 사용할 수 있다. 순서가 중요하면 `ListItem.position`을 사용하는 것이 더 명시적이다.

BRO 입력 단계에서는 일반 사용성을 위해 `ListItem`을 강제하지 않는다. 배열 순서를 목록 순서로 사용하고, exporter가 필요할 때 다음 형태로 변환한다.

```json
{
  "@type": "ListItem",
  "position": 1,
  "item": {
    "@type": "Book",
    "identifier": "urn:isbn:9788937462788",
    "name": "1984"
  }
}
```

---

## 17. 국립중앙도서관 LOD와 결합

국립중앙도서관 LOD URI는 `identifier`에 직접 넣을 수 있다.

```json
{
  "@type": "Book",
  "identifier": [
    "urn:isbn:9788937462788",
    "http://lod.nl.go.kr/resource/KMO199000001"
  ],
  "name": "1984"
}
```

KDC, 제어번호, CIP, 주제어 등은 `additionalProperty`로 보존한다.

```json
{
  "@type": "PropertyValue",
  "name": "nlk:controlNo",
  "value": "KMO199000001"
}
```

```json
{
  "@type": "PropertyValue",
  "name": "nlon:kdc",
  "propertyID": "http://lod.nl.go.kr/ontology/kdc",
  "value": "843"
}
```

---

## 18. KORMARC 호환

KORMARC 520은 요약, 초록, 주석, 평론, 자료 설명 구절을 담는다. BRO 변환 시 다음 원칙을 쓴다.

| KORMARC | BRO |
|---|---|
| 020 `▾a` ISBN | `identifier: "urn:isbn:..."` |
| 245 표제 | `name` |
| 100/700 저자 | `creatorName` 또는 `additionalProperty` |
| 260/264 발행자 | `publisherName` |
| 260/264 발행년 | `datePublished` |
| 520 요약·초록·해제 | `ReactionAbstract.text` |
| 520 평론·비평·서평 | `Reaction(reactionType="Response").text` |
| 520 `▾c` 정보 출처 | `byline` 또는 `additionalProperty` |
| 520 `▾u` URI | `citation` 또는 `url` |
| 040 입력기관 | `creator: Organization` |

520만 보고 추천 목록 등재 사실을 `Listing`으로 만들면 안 된다. `Listing`은 실제 목록·선정·추천 맥락이 있을 때 사용한다.

---

## 19. MODS 호환

| MODS | BRO |
|---|---|
| `<mods:abstract>` | `ReactionAbstract.text` |
| `<mods:note type="review">` | `Reaction(reactionType="Response").text` |
| `<mods:note type="recommendation">` | `Reaction(reactionType="Listing").text` |
| `<mods:identifier type="isbn">` | `identifier: "urn:isbn:..."` |
| `<mods:titleInfo><mods:title>` | `name` |
| `<mods:namePart>` | `creatorName` 또는 `creator[].name` |
| `<mods:publisher>` | `publisherName` |
| `<mods:dateIssued>` | `datePublished` |
| `<mods:languageTerm>` | `inLanguage` |

MODS는 서지 레코드 중심이고 BRO는 목록·반응 중심이다. 따라서 `ReactionList`의 목록 맥락은 MODS 표준 필드만으로 완전히 보존하기 어렵고 local extension이 필요할 수 있다.

---

## 20. BIBFRAME 호환

BIBFRAME 2.0은 `Work`, `Instance`, `Item` 중심의 서지 본체 모델이다. BRO는 BIBFRAME을 대체하지 않는다. BRO는 서지 본체 위에 얹히는 추천·서평·목록·요약 교환 모델이다.

근사 매핑:

| BRO | BIBFRAME 근사 대응 |
|---|---|
| `bibliographicLevel="Work"` | `bf:Work` |
| `bibliographicLevel="Edition"` | 대체로 `bf:Instance`에 가까움 |
| `bibliographicLevel="Item"` | `bf:Item` |
| `identifier` | `bf:identifiedBy` 또는 외부 URI |
| `ReactionAbstract` | `bf:summary` 또는 note 계열 |
| `Reaction` | BIBFRAME core 직접 대응 없음. 외부 review/annotation resource 또는 local extension 권장 |
| `ReactionList` | BIBFRAME 외부의 컬렉션/큐레이션 리소스로 유지 |

BIBFRAME core에 `Reaction`을 억지로 끼워 넣지 않는다. 변환 시 BRO vocabulary 또는 별도 review/annotation 리소스로 보존하는 편이 안전하다.

---

## 21. 상업 서지 데이터 결합

상업 API의 상품 ID, 상세 URL, 리뷰 점수, 카테고리는 다음 원칙으로 다룬다.

1. ISBN 또는 DOI가 있으면 `identifier`의 대표값으로 사용한다.
2. 상업 플랫폼의 안정 레코드 URL이 같은 자료를 정확히 식별하면 `identifier`에 넣을 수 있다.
3. 단순 접근·상품 페이지 성격이면 `url`에 둔다.
4. 플랫폼 고유 ID, 카테고리, 평점 등은 `additionalProperty`에 둔다.

```json
{
  "@type": "Book",
  "identifier": "urn:isbn:9788937462788",
  "name": "1984",
  "url": "https://example-bookstore.test/items/12345",
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "vendor:itemId",
      "value": 12345
    }
  ]
}
```

---

## 22. 검증

Python 예:

```python
import json
from jsonschema import Draft202012Validator

with open("bro.schema.json", "r", encoding="utf-8") as f:
    schema = json.load(f)

with open("payload.json", "r", encoding="utf-8") as f:
    payload = json.load(f)

validator = Draft202012Validator(schema)
errors = sorted(validator.iter_errors(payload), key=lambda e: tuple(e.path))

for error in errors:
    path = "/".join(map(str, error.path)) or "<root>"
    print(f"[INVALID] {path}: {error.message}")
```

응용 계층 추가 검증:

- ISBN checksum
- ISSN checksum
- ORCID checksum. ORCID는 agent 식별자에만 사용한다.
- DOI resolve 가능성
- LOD URI dereference 가능성
- HTML sanitize
- payload 크기와 중첩 깊이 제한
- 같은 목록 안의 중복 자료 탐지
- 제목·저자·발행연도 기반 fuzzy matching

---

## 23. 고아 정보 방지 원칙

1. ISBN이 없어도 제목을 버리지 않는다.
2. 저자 문자열이 정확하지 않아도 `creatorName`에 남긴다.
3. 원문 URL은 `citation` 또는 `url`에 남긴다.
4. 정규화 실패값은 `additionalProperty`에 남긴다.
5. 잘못된 식별자를 조용히 고치지 않는다. raw value를 보존하고 확정값만 `identifier`에 넣는다.
6. 내부 book table과 연결되지 않아도 `workReference`로 유지한다.

---

## 24. 안티패턴

### 24.1 모든 항목을 Reaction으로 만들기

항목별 글이 없으면 직접 자료를 넣는다.

```json
{ "@type": "Book", "identifier": "urn:isbn:9788937462788", "name": "1984" }
```

### 24.2 식별자가 없으면 삭제하기

```json
{ "@type": "CreativeWork", "name": "원문 제목", "creatorName": "원문 저자" }
```

### 24.3 다른 판본의 identifier를 한 배열에 넣기

나쁨:

```json
"identifier": ["청소년판 ISBN", "특별판 ISBN"]
```

좋음: 두 항목을 분리한다.

### 24.4 ORCID를 자료 identifier에 넣기

ORCID는 사람 식별자다. 자료의 `identifier`가 아니라 `Person.@id`에 사용한다.

---

## 25. 구현 플레이북

### 수집기

1. 원문 목록명을 `ReactionList.name`에 넣는다.
2. 원문 출처 URL을 `ReactionList.citation`에 넣는다.
3. 발행 기관 또는 업로드 주체를 `creator`에 넣는다.
4. 각 행에 ISBN/DOI/LOD URI가 있으면 `identifier`에 넣는다.
5. 식별자가 없으면 `name`, `creatorName`만이라도 보존한다.
6. 항목별 추천 사유가 있으면 `Reaction(Listing)`을 만든다.
7. 긴 서평이면 `Reaction(Response)`를 만든다.
8. 목록에서는 직접 자료 또는 생성한 Reaction을 참조한다.
9. 해석하지 못한 원문 값은 `additionalProperty`에 보존한다.
10. 저장 전 JSON Schema 검증을 수행한다.

### 서지 보강기

1. `identifier`에서 ISBN/DOI/LOD URI를 추출한다.
2. 국립중앙도서관 LOD, 내부 book table, 상업 API를 순차 조회한다.
3. 확정된 추가 식별자는 같은 자료일 때만 `identifier`에 추가한다.
4. 불확실한 관련 URL은 `url` 또는 `additionalProperty`에 둔다.
5. 판본이 다른 후보는 병합하지 않는다.
6. 원문 제목·저자·raw value는 삭제하지 않는다.

### RDF exporter

1. JSON-LD context로 기본 확장을 수행한다.
2. `itemListElement` 배열 순서를 `ListItem.position`으로 변환할지 결정한다.
3. `identifier` 중 근거 있는 외부 URI만 `schema:sameAs`로 파생한다.
4. `PropertyValue.propertyID`가 있으면 RDF property 승격을 검토한다.
5. `bibliographicLevel`을 BIBFRAME Work/Instance/Item 근사 매핑에 활용한다.

---

## 26. 참고 표준 및 공식 문서

- JSON Schema Draft 2020-12: https://json-schema.org/draft/2020-12
- JSON Schema Specification: https://json-schema.org/specification
- JSON-LD 1.1: https://www.w3.org/TR/json-ld11/
- Schema.org: https://schema.org/
- Schema.org ItemList: https://schema.org/ItemList
- Schema.org identifier: https://schema.org/identifier
- Schema.org sameAs: https://schema.org/sameAs
- Schema.org exampleOfWork: https://schema.org/exampleOfWork
- Dublin Core Metadata Terms: https://www.dublincore.org/specifications/dublin-core/dcmi-terms/
- DOI Handbook: https://www.doi.org/the-identifier/resources/handbook
- International ISBN Agency Users' Manual: https://www.isbn-international.org/content/isbn-users-manual
- 국립중앙도서관 국가서지 LOD: https://www.nl.go.kr/NL/contents/N11000000000.do
- KORMARC 520: https://librarian.nl.go.kr/kormarc/KSX6006-0/sub/5XX_520.html
- BIBFRAME: https://www.loc.gov/bibframe/
- BIBFRAME 2.0 changes: https://www.loc.gov/bibframe/docs/bibframe2-whatsnew.html
- MODS User Guidelines: https://www.loc.gov/standards/mods/userguide/

---

## 27. 변경 요약

이번 리팩터링의 핵심은 다음이다.

1. 별도 설계 별칭을 제거하고 이름을 **BRO v1.0**으로 정리했다.
2. 목록 항목을 `Book`에 가두지 않고 `CreativeWork` 계열로 일반화했다.
3. `sameAs`를 core 필드에서 제거하고 `identifier` 하나로 통합했다.
4. 판본·저작 수준 문제는 `bibliographicLevel`, `bookEdition`, 선택적 `exampleOfWork`로 처리한다.
5. JSON-LD와 Schema.org 호환은 유지하되 일반 입력자에게 RDF 복잡성을 강제하지 않는다.
