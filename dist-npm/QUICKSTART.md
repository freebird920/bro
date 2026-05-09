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

