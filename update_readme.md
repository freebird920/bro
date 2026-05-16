# 도서 추천 정보 객체 v1.0

## Bibliographic Reaction Object (BRO) v1.0

 도서 추천 정보 객체 BRO(**Bibliographic Reaction Object**의 약칭)는 도서, 논문, 기사, 웹문서, 데이터셋, 보고서 등 서지적으로 다룰 수 있는 자료에 대해 다양한 주체가 생산하는 **추천, 등재, 선정, 수상, 서평, 감상, 비평, 코멘트** 정보를 교환하기 위한 JSON/JSON-LD 응용 프로파일이다. 

 BRO의 핵심은 “책 정보”를 새로 정의하는 것이 아니다. 기존 서지표준과 상업 데이터는 이미 책과 자료의 정규 메타데이터를 다룬다. BRO는 그 위에 놓이는 **반응 정보(도서 추천,서평, 권장 도서 목록 등) 계층**이다. 즉, 어떤 자료가 어떤 목록에 등재되었는지, 누가 어떤 맥락에서 추천했는지, 어떤 기관·교사·전문가·개인 등은 어떤 반응 데이터(텍스트)를 남겼는지, 그리고 그 정보가 어떤 출처에서 왔는지를 **손실 없이 교환**하기 위한 형식이다.

---

## 1\. 표준 식별자

| 항목 | 값 |
| :---- | :---- |
| 표준명 | Bibliographic Reaction Object |
| 약칭 | BRO |
| 버전 | v1.0 |
| JSON Schema | `https://schema.slat.or.kr/bro/v1.0/schema.json` |
| JSON-LD Context | `https://schema.slat.or.kr/bro/v1.0/context.jsonld` |
| Vocabulary IRI | `https://schema.slat.or.kr/bro/v1.0/vocab#` |
| 기반 사양 | JSON Schema Draft 2020-12, JSON-LD 1.1 |
| 권장 Content-Type | `application/ld+json; charset=utf-8` 또는 `application/json; charset=utf-8` |

## 2\. BRO의 필요성

현실의 추천·서평 등 서지에 대한 반응정보 데이터는 매우 파편화되어 있다. 공공도서관은 사서 추천 목록을 만든다. 교육청 등 교육기관에서도 교육 관련 양서 목록을 만든다. 학교와 교사는 매년 학년별 권장도서와 수행평가용 목록을 만들고, 문학상·학술상·기관 선정 사업은 수상·선정 목록을 만든다. 언론·비평지·출판사·상업 플랫폼·개인 블로그도 서평과 큐레이션을 만든다. 형식은 웹페이지, 엑셀, PDF, MARC, MODS, RDF, 내부 DB, 카드뉴스, API 응답 등으로 흩어져 있다.

이 정보의 가치는 단순히 본문 텍스트에만 있지 않다. AI가 요약문이나 추천문을 쉽게 생성할 수 있는 환경에서는 오히려 다음 정보가 더 중요해진다.

- **누가** 추천했는가.  
- **어떤 기관 또는 역할**에서 추천했는가.  
- **어떤 목록, 수상, 수업, 평가, 프로그램의 일부**였는가.  
- **어떤 자료**를 지칭했는가.  
- 그 자료 식별자가 명확한가, 아니면 나중에 매칭해야 하는가.  
- 원천 출처가 있는가.  
- **같은 자료가 서로 독립된 출처에서 반복적으로 등재**되었는가.

BRO는 이 신호를 **“검증 가능한 유용한 정보 신호”**로 구조화한다. 단, BRO는 추천의 진실성이나 객관성을 보증는 것이 아닌 판단에 필요한 맥락을 제공한다.

---

## 

## 3\. BRO의 핵심 원칙

### 3.1 등재 자체도 Reaction이다

BRO에서 어떤 자료가 목록에 들어간 사실은 단순한 배열 항목이 아니다. 그것은 다음과 같은 반응정보다.

어떤 주체가, 어떤 맥락에서, 어떤 자료를, 어떤 목록 또는 선정 체계 안에 포함시켰다.

따라서 canonical BRO에서는 단순 목록 등재도 `Reaction`으로 표현한다.

{  
  "@type": "Reaction",  
  "reactionType": "Listing",  
  "about": \[{ "@type": "Book", "name": "아몬드", "creatorName": "손원평" }\],  
  "text": "",  
  "creator": \[{ "@type": "Library", "name": "예시공공도서관" }\],  
  "dateCreated": "2026-05-09T00:00:00+09:00"  
}

이 객체는 “아몬드라는 책이 있다”가 아니라 “예시공공도서관이 아몬드를 등재했다”는 정보를 담는다.

### 3.2 목록은 Reaction을 묶는다

 `ReactionList`는 `Book`을 직접 담는 단순 책 목록이 아니라, `Reaction` 또는 `ReactionAbstract`를 참조하는 컨테이너다.

{  
  "@type": "ReactionList",  
  "itemListElement": \[  
    { "@id": "urn:uuid:...", "@type": "Reaction" }  
  \]  
}

일반 입력 도구는 사용자가 책 제목 목록만 올리게 할 수 있다. 그러나 정규 BRO로 변환할 때는 각 항목을 `Reaction(reactionType="Listing")`으로 정규화하는 것이 권장된다.

### 

### 3.3 `reactionType`은 텍스트 장르가 아니라 정보 기능이다

`reactionType`은 글의 길이, 문체, 감정 표현 여부를 분류하지 않는다. 해당 `Reaction` 객체가 원천 자료에서 수행하는 주된 정보 기능을 나타낸다.

| 값 | 의미 | `text` 정책 |
| :---- | :---- | :---- |
| `Listing` | 등재, 추천, 선정, 수상, 후보화, 큐레이션 포함 사실을 보존하는 Reaction | 빈 문자열 가능. 추천 사유·선정 사유·짧은 주석을 담을 수 있음 |
| `Response` | 독립적인 서평, 감상, 비평, 평가, 코멘트 본문을 보존하는 Reaction | 비공백 본문 필수 |
| `Unspecified` | 원천 자료만으로 주된 정보 기능을 안전하게 판단하기 어려움 | 빈 문자열 가능 |

선정 사유에 평가적 표현이 들어가도 그 객체의 주된 기능이 목록 등재라면 `Listing`이다. 본격적인 서평 본문 자체가 중심이면 `Response`다. 애매하면 `Unspecified`를 사용한다.

### 3.4 `text`는 하나로 유지한다

`Reaction.text`는 해당 Reaction의 주된 본문이다. Response에서는 서평, 감상, 비평, 평가, 코멘트 본문을 담는다. Listing에서는 추천 사유, 선정 사유, 목록 등재 설명을 담을 수 있으며, 단순 등재만 기록할 경우 빈 문자열일 수 있다. Unspecified에서는 원천 자료의 반응 성격을 판단하기 어려운 경우의 본문을 담거나 빈 문자열일 수 있다.

BRO v1.0은 복수 본문, 원문·번역문·정제문을 core 구조로 분리하지 않는다. 그 경우 `additionalProperty`를 사용한다. 원문 Reaction 또는 ReactionList에서 파생된 독립 요약 산출물을 별도로 교환해야 할 때만 `ReactionAbstract`를 사용한다.

### 3.5 `source`는 선택이지만 중요한 신뢰 신호다

 `source`는 BRO 객체가 유래한 출처다. 개인 메모, 익명 반응, 레거시 데이터는 source 없이도 유효할 수 있지만 재수집, 감사, 신뢰도 평가에 source는 매우 중요하다.

### 

### 3.6 BRO는 기존 서지표준을 대체하지 않는다

 BRO는 MARC/KORMARC, MODS, BIBFRAME, ONIX, DataCite, Schema.org, Web Annotation, RLI, 국립중앙도서관 LOD, 상업 서지 데이터셋을 대체하지 않는다. BRO는 그 표준들과 연결될 수 있는 reaction/list evidence layer다.

---

## 4\. 엔티티 모델

 BRO v1.0의 **핵심 엔티티**는 `Reaction`과 `ReactionList`다. `ReactionAbstract`는 핵심 반응정보가 아니라, 원문 Reaction·ReactionList·외부 자료에서 파생된 요약 산출물을 독립 객체로 교환해야 할 때 사용하는 **선택적 파생 엔티티**다.

| 구분 | 엔티티 | `@type` | 역할 |
| :---- | :---- | :---- | :---- |
| Core | Reaction | `Reaction` | 등재, 추천, 선정, 수상, 서평, 감상, 비평, 코멘트 등의 단일 반응 신호 |
| Core | ReactionList | `ReactionList` | Reaction 또는 ReactionAbstract를 참조하는 큐레이션 컨테이너 |
| Optional derived | ReactionAbstract | `ReactionAbstract` | Reaction, ReactionList, 또는 외부 자료에서 파생된 요약 산출물 |
| Document form | BROGraph | 없음. top-level `@graph` | 목록과 그 항목 Reaction들을 한 번에 교환하는 JSON-LD graph 문서 |

---

## 

## 5\. `@graph`란 무엇인가

`@graph`는 JSON-LD에서 여러 개의 연결된 노드를 한 문서 안에 함께 담는 표준 컨테이너다. BRO에서 `ReactionList`와 그 목록 항목인 `Reaction`들을 함께 보내려면 `@graph`를 사용한다.

{  
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",  
  "@graph": \[  
    {  
      "@type": "ReactionList",  
      "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000100",  
      "name": "2026년 5월 사서 추천 자료",  
      "itemListElement": \[  
        { "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000101", "@type": "Reaction" }  
      \],  
      "creator": \[{ "@type": "Library", "name": "예시공공도서관" }\],  
      "dateCreated": "2026-05-09T00:00:00+09:00"  
    },  
    {  
      "@type": "Reaction",  
      "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000101",  
      "reactionType": "Listing",  
      "about": \[  
        { "@type": "Book",  
          "name": "아몬드",   
          "creatorName": "손원평"   
         }  
       \],  
      "text": "",  
      "creator": \[{ "@type": "Library", "name": "예시공공도서관" }\],  
      "dateCreated": "2026-05-09T00:00:00+09:00"  
    }  
  \]

}  
 일반 사용자가 직접 `@graph`를 작성할 필요는 없다. 업로드 도구, 변환기, exporter가 단순 입력을 `@graph` 문서로 정규화할 수 있다.  
---

## 6\. 공통 필드

### `@context`

BRO JSON-LD context다. 단일 객체에서는 필수다.  
"@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld"  
확장 context를 사용하려면 BRO context가 첫 번째여야 한다.

"@context": \[  
  "https://schema.slat.or.kr/bro/v1.0/context.jsonld",  
  { "ex": "https://example.org/vocab\#" }  
\]

### `@type`

BRO 엔티티 타입이다. `Reaction`, `ReactionAbstract`, `ReactionList` 중 하나다. `@graph` 문서의 top-level에는 `@type`이 없다.

### `@id`

BRO 엔티티의 식별자다. UUID URN 또는 HTTPS IRI를 사용한다.

"@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000101"  
"@id": "https://library.example.kr/bro/reaction/2026-05-001"

BRO 자체 `@id`에는 HTTP URL, 임의 문자열, 로컬 숫자 ID를 쓰지 않는다. 외부 자료 식별자는 `about[].identifier`나 `source[].identifier`에 넣는다.

### `name`

사람이 읽을 수 있는 제목이다.  
"name": "2026년 5월 사서 추천 자료 등재: 아몬드"

### `description`

BRO 객체 자체에 대한 설명이다. 반응 본문은 `text`에 넣는다.

"description": "공공도서관 사서가 청소년 독자를 위해 선정한 추천 자료 목록."

### `creator`

 BRO 객체의 책임 주체다. 원문 작성자일 수도 있고, 목록 발행 기관, 수상 기관, 교사, 소프트웨어, 익명 주체일 수도 있다. 원문에 표시된 자유형 표기는 `byline`에 보존한다.

### `source`

BRO 객체의 출처. 선택 필드다.

"source": \[  
  {  
    "@type": "WebPage",  
    "identifier": "https://library.example.kr/recommend/2026-05",  
    "name": "예시공공도서관 2026년 5월 사서 추천 자료"  
  }  
\]

### `sourceKey`

재수집과 중복 방지를 위한 키. 전역 식별자가 아니다.  
"sourceKey": "example-library:recommend:2026-05\#item-002"

### `dateCreated`, `dateModified`, `datePublished`

BRO 객체의 생성, 수정, 발행 시각이다. RFC 3339 date-time을 사용한다. 시간대가 있어야 한다.  
"dateCreated": "2026-05-09T00:00:00+09:00"

외부 자료의 부분 출판일은 `about[].datePublished`에서   
`2003`,  
`2003-04`,  
`2003-04-15`처럼 표현할 수 있다.

### `byline`

**원문에 표시된 작성자·출처 문자열**이다. 구조화된 agent가 아니며 반드시 원문에 표기된 그대로를 옮긴다.  
"byline": "김교사, 예시중학교 국어과"

### `inLanguage`

BCP 47 언어 태그 배열이다.  
"inLanguage": \["ko"\]

### `keywords`, `genre`, `audience`

검색·분류·사용 맥락을 위한 짧은 텍스트다.  
"keywords": \["청소년", "추천도서", "공감"\]  
"audience": \["중학교 2학년", "국어 수행평가"\]  
`additionalProperty`  
도메인별 확장 메타데이터다. 스키마를 복잡하게 만들지 않기 위한 확장점이다.

"additionalProperty": \[  
  {   
"@type": "PropertyValue",   
"name": "award:name",   
"value": "예시문학상"   
},  
  	{  
"@type": "PropertyValue",  
"name": "education:subject",  
"value": "국어"   
}  
\]

---

## 7\. Reaction

`Reaction`은 BRO의 핵심 엔티티다. 추천, 등재, 선정, 수상, 서평, 감상, 비평, 코멘트가 모두 Reaction이다.

### 필수 필드

| 필드 | 의미 |
| :---- | :---- |
| `@context` | BRO context |
| `@type` | `Reaction` |
| `@id` | BRO Reaction 식별자 |
| `reactionType` | `Listing`, `Response`, `Unspecified` |
| `about` | 이 Reaction이 대상으로 삼는 자료 |
| `text` | 주된 본문. Listing/Unspecified에서는 빈 문자열 가능 |
| `creator` | 책임 주체 |
| `dateCreated` | 생성 시각 |

### 

### `reactionType=Listing`

Listing은 대상 자료가 목록, 추천 체계, 수상 목록, 수서 후보군, 교육 자료 목록 등에 등재되었음을 나타낸다. `text`는 비어 있을 수 있고, 값이 있으면 추천 사유, 선정 사유, 등재 설명, 짧은 주석을 담는다.

{  
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",  
  "@type": "Reaction",  
  "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000101",  
  "reactionType": "Listing",  
  "about": \[  
    { "@type": "Book", "name": "아몬드", "creatorName": "손원평" }  
  \],  
  "text": "",  
  "creator": \[  
    { "@type": "Library", "name": "예시공공도서관" }  
  \],  
  "dateCreated": "2026-05-09T00:00:00+09:00"  
}

선정 사유가 있는 Listing도 정상이다.

{  
  "@type": "Reaction",  
  "reactionType": "Listing",  
  "about": \[  
    { "@type": "Book", "name": "아몬드", "creatorName": "손원평" }  
  \],  
  "text": "청소년 독자가 타인의 감정을 이해하고 관계를 성찰하기에 적합한 작품으로 선정함.",  
  "creator": \[  
    { "@type": "Library", "name": "예시공공도서관" }  
  \],  
  "dateCreated": "2026-05-09T00:00:00+09:00"  
}

이 문장이 평가적 표현을 포함하더라도, 객체의 주된 기능이 목록 등재라면 `Listing`이다.

### 

### `reactionType=Response`

Response는 독립적인 서평, 감상, 비평, 평가, 코멘트 본문이다. `text`는 하나 이상의 비공백 문자를 포함해야 한다.

{  
  "@type": "Reaction",  
  "reactionType": "Response",  
  "about": \[  
    { "@type": "Book", "identifier": "urn:isbn:9788937462788", "name": "1984" }  
  \],  
  "text": "언어와 권력의 관계를 토론하기에 적합하다. 단순한 줄거리 이해를 넘어 정보 통제와 시민성의 문제를 연결할 수 있다.",  
  "creator": \[  
    {  
      "@type": "Role",  
      "roleName": "중학교 국어 교사",  
      "agent": { "@type": "Person", "name": "김교사" },  
      "knowsAbout": \["국어교육", "청소년문학"\]  
    }  
  \],  
  "dateCreated": "2026-05-09T09:00:00+09:00"  
}

### `reactionType=Unspecified`

원천 자료만 보고 Listing인지 Response인지 안정적으로 판단하기 어려울 때 사용한다. 실패 상태가 아니라 과잉 해석을 피하는 명시적 선언이다.

{  
  "@type": "Reaction",  
  "reactionType": "Unspecified",  
  "about": \[  
    { "@type": "Book", "name": "데미안", "creatorName": "헤르만 헤세" }  
  \],

  "text": "성장과 자기 발견을 다룬 작품.",  
  "creator": \[{ "@type": "UnknownAgent" }\],  
  "dateCreated": "2026-05-09T00:00:00+09:00"  
}

### `isPartOf`

Reaction이 어떤 ReactionList 안에서 관찰되었는지 표현한다.

"isPartOf": \[  
  {  
   "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000100",  
   "@type": "ReactionList"   
  }  
\]

Listing Reaction에는 특히 유용하다.

---

## 8\. ReactionList

`ReactionList`는 Reaction 또는 ReactionAbstract를 묶는 목록이다. 목록 항목은 자료 자체가 아니라 BRO 엔티티 참조다.

### 필수 필드

| 필드 | 의미 |
| :---- | :---- |
| `@context` | BRO context |
| `@type` | `ReactionList` |
| `@id` | 목록 식별자 |
| `creator` | 목록 책임 주체 |
| `itemListElement` | `Reaction` 또는 `ReactionAbstract` 참조 배열 |
| `dateCreated` | 생성 시각 |

### 

### 단순 추천 목록

단순 추천 목록도 각 항목을 Listing Reaction으로 만든다. 목록은 그 Reaction들을 참조한다.

{  
  "@type": "ReactionList",  
  "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000100",  
  "name": "2026년 5월 사서 추천 자료",  
  "itemListElement": \[  
    { "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000101", "@type": "Reaction" },  
    { "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000102", "@type": "Reaction" }  
  \],  
  "creator": \[{ "@type": "Library", "name": "예시공공도서관" }\],  
  "dateCreated": "2026-05-09T00:00:00+09:00"  
}

### 서평이 있는 항목과 없는 항목이 섞인 목록

모든 항목은 최소 Listing Reaction을 가진다. 본격적인 서평이 있으면 별도 Response Reaction을 추가할 수 있다.

목록 항목 A: Listing Reaction만 있음  
목록 항목 B: Listing Reaction \+ Response Reaction 있음  
목록 항목 C: Listing Reaction만 있음

이렇게 하면 해마다 목록의 형식이 바뀌어도 구조가 흔들리지 않는다.

### `selectionCriteria`

목록의 선정 기준이다. `listType` enum을 만들지 않는 대신, 실제 목록의 복합적이고 변동적인 성격을 자연어 기준으로 보존한다.

"selectionCriteria": \[  
  "청소년 독자의 토론 가능성",  
  "도서관 소장 및 접근 가능성",  
  "교사 또는 사서의 검토 이력이 있는 자료 우선"  
\]

BRO v1.0에는 `listType`을 두지 않는다. 현실 목록은 추천 목록, 수상 목록, 서평 목록, 줄거리 소개, 교육 자료 목록이 혼합되거나 해마다 성격이 바뀌기 때문이다.

---

## 9\. ReactionAbstract — 선택적 파생 요약 산출물

`ReactionAbstract`는 BRO의 기본 반응정보가 아니다. 원천에서 관찰된 등재, 추천, 선정, 수상, 서평, 감상, 비평, 코멘트는 `Reaction`으로 표현한다. `ReactionAbstract`는 그런 Reaction, ReactionList, 또는 외부 자료를 요약한 **별도 산출물**을 교환해야 할 때만 사용한다.

따라서 `ReactionAbstract`는 다음처럼 이해해야 한다.

Reaction \= 원천에서 관찰된 반응 행위

ReactionList \= 반응 행위들을 묶은 목록

ReactionAbstract \= 원천 반응이나 목록에서 파생된 요약 산출물

### 

### 언제 사용하지 않는가

다음은 보통 `ReactionAbstract`가 아니다.

- 원천 목록에 실린 짧은 추천 사유  
- 원천 페이지의 한 줄 책 소개  
- 단순 줄거리 소개  
- 본문이 짧은 서평  
- 목록에 붙은 선정 사유

이런 정보는 보통 `Reaction(reactionType= "Listing")`, `Reaction (reactionType = "Response")`, 또는 `description`으로 보존한다.

### 언제 사용하는가

다음 경우에는 `ReactionAbstract`가 적합하다.

- 긴 교사 서평을 AI 또는 사람이 요약한 별도 산출물  
- 추천 목록 전체를 요약한 별도 문서  
- 검색 인덱싱 또는 RAG 근거 검색을 위해 생성한 요약  
- 원문 Reaction과 작성자·생성일·라이선스가 다른 요약  
- 사람 검수 요약과 기계 요약을 원문과 분리해 관리해야 하는 경우

### 

### 예시 — 교사 서평의 파생 요약

{  
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",  
  "@type": "ReactionAbstract",  
  "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000104",  
  "name": "1984 교사 서평 요약",  
  "text": "이 서평은 『1984』를 언어와 권력의 관계를 토론하기에 적합한 작품으로 평가한다.",  
  "creator": \[  
    {  
      "@type": "SoftwareApplication",  
      "@id": "https://schema.slat.or.kr/agents/bro-summarizer",  
      "name": "BRO Summarizer",  
      "softwareVersion": "1.0.0"  
    }  
  \],

  "isBasedOn": \[  
    { "@id": "urn:uuid:018f1b2c-0000-7000-8000-000000000103", "@type": "Reaction" }  
  \],  
  "dateCreated": "2026-05-09T10:00:00+09:00",  
  "inLanguage": \["ko"\]  
}

요약 생성자가 AI 또는 소프트웨어인 경우 `creator`에 `SoftwareApplication`을 넣는다. 별도 `generator` 필드는 두지 않는다. `ReactionAbstract`는 원문 Reaction을 대체하지 않는다. 가능한 경우 원문 Reaction을 보존하고, 요약은 별도 `ReactionAbstract`로 발행한다.

## 10\. 대상 자료: `about`과 `workReference`

`Reaction.about`은 이 반응이 대상으로 삼는 자료다. 책만이 아니라 `CreativeWork` 계열 전체를 받을 수 있다.

{  
  "@type": "Book",  
  "identifier": "urn:isbn:9788937462788",  
  "name": "1984",  
  "creatorName": "George Orwell"  
}

{  
  "@type": "ScholarlyArticle",  
  "identifier": "https://doi.org/10.1038/s41586-021-03819-2",  
  "name": "예시 논문"  
}

{  
  "@type": "WebPage",  
  "identifier": "https://example.org/reading-guide",  
  "name": "독서교육 자료 페이지"  
}

식별자가 없으면 name과 creatorName만으로도 보존할 수 있다.

{  
  "@type": "Book",  
  "name": "아몬드",  
  "creatorName": "손원평"  
}

이것은 완성된 서지 레코드가 아니다. 나중에 ISBN, 국립중앙도서관 LOD URI, 상업 DB ID, 내부 레코드와 매칭하기 위한 unresolved reference다.

---

## 

## 11\. identifier 정책

BRO는 `sameAs`를 core 필드로 사용하지 않는다. 외부 결합 단서는 `identifier` 하나로 통합한다.

"identifier": \[  
  "urn:isbn:9788937462788",  
  "http://lod.nl.go.kr/resource/KMO199000001",  
  {  
    "@type": "PropertyValue",  
    "name": "aladin:itemId",  
    "propertyID": "aladin:itemId",  
    "value": 123456  
  }  
\]

### 

### 중요한 규칙

같은 `identifier` 배열 안의 값들은 같은 서지 자원 또는 같은 외부 레코드를 가리켜야 한다. 서로 다른 판본이나 표현형의 ISBN을 한 객체 안에 섞으면 안 된다.

잘못된 예:  
{  
  "@type": "Book",  
  "name": "아몬드",  
  "identifier": \[  
    "urn:isbn:청소년판ISBN",  
    "urn:isbn:특별판ISBN"  
  \]  
}

올바른 예:  
"about": \[  
  {  
    "@type": "Book",  
    "identifier": "urn:isbn:청소년판ISBN",  
    "name": "아몬드",  
    "creatorName": "손원평",  
    "bookEdition": "청소년판"  
  },  
  {  
    "@type": "Book",  
    "identifier": "urn:isbn:특별판ISBN",  
    "name": "아몬드",  
    "creatorName": "손원평",  
    "bookEdition": "특별판"  
  }  
\]  
BRO는 BIBFRAME의 Work/Instance/Item 모델을 core에 강제하지 않는다. 판본·저작 수준 정규화는 외부 서지 데이터와 보강 단계의 책임이다. BRO는 원천이 준 식별자, 제목, 저자표기, 출판사, 판차 정보를 보존한다.

---

## 12\. Agent와 권위/신뢰 신호

BRO는 개인, 익명, 공공도서관, 정부기관, 교육기관, 학교, 법인, 소프트웨어, 역할을 모두 agent로 표현한다.

### 개인

{  
  "@type": "Person",  
  "name": "김독자"  
}

ORCID가 있으면 @id에 넣을 수 있다.

{  
  "@type": "Person",  
  "@id": "https://orcid.org/0000-0002-1825-0097",  
  "name": "이연구"  
}

### 익명 또는 미상

{  
  "@type": "UnknownAgent",  
  "name": "원천 작성자 미상"  
}

UnknownAgent에는 @id를 넣지 않는다. 매번 독립적인 blank node로 취급한다.

### 공공도서관

{

  "@type": "Library",  
  "name": "예시공공도서관",  
  "@id": "https://library.example.kr/",  
  "knowsAbout": \["청소년 독서교육", "공공도서관 장서개발"\]  
}

### 

### 교육기관과 교사 역할

{

  "@type": "Role",  
  "roleName": "중학교 국어 교사",  
  "agent": { "@type": "Person", "name": "김교사" },  
  "affiliation": \[  
    { "@type": "School", "name": "예시중학교" }  
  \],  
  "knowsAbout": \["국어교육", "청소년문학", "독서토론"\],  
  "credential": \["중등 국어교사 자격"\]  
}

`credential`은 증거 단서일 뿐 증명서 검증 결과가 아니다. 검증이 필요한 시스템은 별도 검증 절차를 둔다.

### 소프트웨어

{  
  "@type": "SoftwareApplication",  
  "@id": "https://schema.slat.or.kr/agents/bro-summarizer",  
  "name": "BRO Summarizer",  
  "softwareVersion": "1.0.0"  
}

소프트웨어가 BRO 객체의 책임 주체라면 `creator`에 넣는다. 별도 `generator` 필드는 사용하지 않는다.

---

## 

## 13\. 목록·서평 혼재 패턴

BRO는 목록/서평 혼재 패턴을 고정하지 않는다. 대신 다음 규칙을 적용한다.

1. 등재 사실은 `Listing` Reaction으로 표현한다.  
2. 짧은 추천 사유나 선정 사유는 `Listing.text`에 들어갈 수 있다.  
3. 독립적인 서평·비평·감상 본문은 `Response` Reaction으로 표현한다.  
4. 같은 항목에 `Listing`과 `Response`가 모두 있을 수 있다.  
5. 서평 자체를 모은 목록은 `Response` Reaction들을 `ReactionList`가 참조한다.  
6. 판단이 어려운 경우 `Unspecified`를 쓴다.

### 목록만 있는 경우

ReactionList

- Listing Reaction(text="")

### 목록과 짧은 추천 사유가 있는 경우

ReactionList

-  Listing Reaction(text="청소년 독서토론에 적합하여 선정함")

### 목록과 본격 서평이 함께 있는 경우

ReactionList

- Listing Reaction(text="")  
- Response Reaction(text="독립적인 서평 본문")

### 서평 목록인 경우

ReactionList

- Response Reaction

이 모델은 같은 프로그램이 해마다 “목록만 제공 → 일부 추천사 제공 → 모든 항목에 서평 제공 → 다시 목록만 제공”처럼 변해도 안정적으로 작동한다.

---

## 

## 14\. Schema.org export 안내

BRO JSON은 BRO 고유의 단순 구조를 유지한다. 외부 Schema.org 마크업으로 내보낼 때는 다음과 같이 변환할 수 있다.

### ReactionList → Schema.org ItemList

BRO:

{  
  "@type": "ReactionList",  
  "itemListElement": \[  
    { "@id": "urn:uuid:listing-001", "@type": "Reaction" }  
  \]  
}

Schema.org export:

{  
  "@context": "https://schema.org",  
  "@type": "ItemList",  
  "itemListElement": \[  
    {  
      "@type": "ListItem",  
      "position": 1,  
      "item": {  
        "@type": "Book",  
        "name": "아몬드",  
        "author": "손원평"  
      }  
    }  
  \]  
}

BRO에서는 등재 행위를 보존하고, Schema.org 공개 마크업에서는 필요한 경우 책 목록으로 투영할 수 있다.

### Response Reaction → Schema.org Review

{  
  "@context": "https://schema.org",  
  "@type": "Review",  
  "itemReviewed": {  
    "@type": "Book",  
    "name": "1984"  
  },  
  "reviewBody": "언어와 권력의 관계를 토론하기에 적합하다.",  
  "author": {  
    "@type": "Person",  
    "name": "김교사"  
  }  
}

### Listing Reaction → Schema.org Recommendation 또는 ListItem

짧은 추천 사유가 있는 Listing은 `Recommendation`으로 export할 수 있다. 단, 수신 플랫폼이 `Recommendation`을 처리하지 못하면 `ItemList/ListItem`으로 보수적으로 export한다.

---

## 

## 15\. Web Annotation export 안내

BRO `Reaction`은 Web Annotation으로 내보낼 수 있다.

### Response Reaction

{  
  "@context": "http://www.w3.org/ns/anno.jsonld",  
  "type": "Annotation",  
  "motivation": "assessing",  
  "body": {  
    "type": "TextualBody",  
    "value": "언어와 권력의 관계를 토론하기에 적합하다.",  
    "format": "text/plain",  
    "language": "ko"  
  },

  "target": {  
    "id": "urn:isbn:9788937462788",  
    "type": "Book"  
  }  
}

### Listing Reaction

본문이 없는 등재는 `motivation=bookmarking` 또는 BRO 고유 motivation으로 내보낼 수 있다. 본문이 있으면 body를 둔다.

{  
  "@context": "http://www.w3.org/ns/anno.jsonld",  
  "type": "Annotation",  
  "motivation": "bookmarking",  
  "target": {  
    "id": "urn:isbn:9788937462788",  
    "type": "Book"  
  }  
}

BRO는 Web Annotation을 대체하지 않는다. 구절 단위 주석, selector, fragment, exact quote annotation이 필요하면 Web Annotation을 직접 사용하거나 BRO `additionalProperty`에 locator를 보존한다.

---

## 16\. RLI와 BRO

1EdTech RLI(Resource List Interoperability)는 BRO와 가장 가까운 선행 표준이다. RLI는 resource list를 만들기 위해 자원을 저장·노출하는 시스템과 그 목록을 수집·조직하는 시스템 사이에서 structured metadata를 교환하기 위한 표준이며, reading list를 대표 예로 든다.

BRO와 RLI의 공통점은 목록 자체를 교환 대상으로 본다는 점이다. 차이는 다음과 같다.

| 항목 | RLI | BRO |
| :---- | :---- | :---- |
| 시대/기술 | 2004년 XML Schema/WSDL/Content Packaging 중심 | JSON Schema/JSON-LD 중심 |
| 주된 맥락 | 교육·훈련용 resource list | 추천, 등재, 수상, 서평, 요약, 교사/전문가 반응정보 |
| 목록 항목 | resource | Reaction, 특히 Listing Reaction |
| annotation | 부가 annotation | Reaction이 1급 엔티티 |
| 기존 서지 데이터 결합 | LOM, ISO 690-2, OpenURL 등 | Schema.org, Web Annotation, MARC/KORMARC, MODS, BIBFRAME, ONIX, DataCite, LOD, 상업 데이터셋 |
| AI/RAG 활용 | 고려하지 않음 | 비규범 활용 사례로 고려 |

BRO는 RLI가 다룬 문제를 현대 JSON-LD와 도서 추천 정보 맥락에서 다시 단순화한 응용 프로파일이다.

---

## 

## 17\. 다른 표준과의 관계

### Schema.org

BRO `ReactionList`는 `schema:ItemList`, `Reaction`은 `schema:CreativeWork` 또는 export 시 `schema:Review`/`schema:Recommendation`, 대상 자료는 `schema:Book`, `schema:Article`, `schema:ScholarlyArticle`, `schema:CreativeWork` 등으로 연결된다.

### Web Annotation

BRO `Reaction`은 Web Annotation `Annotation`으로 export 가능하다. `Reaction.text`는 `TextualBody.value`, `about`은 `target`, `reactionType`은 `motivation`에 대응한다.

### MARC/KORMARC

MARC/KORMARC 520은 요약, 초록, 주석, 평론, 자료 설명 구절을 기술한다. BRO `ReactionAbstract` 또는 `Reaction(Response)`와 연결할 수 있다. 단, 520 필드만으로 목록 등재를 단정하지 않는다.

### MODS

MODS `<abstract>`는 자원의 내용 요약을 기록하는 요소이며, type에 review 같은 값을 둘 수 있다. BRO `ReactionAbstract` 또는 `Reaction(Response)`와 연결 가능하다.

### BIBFRAME

BIBFRAME은 Work, Instance, Item 수준의 정규 서지 기술에 강하다. BRO는 BIBFRAME을 대체하지 않고, `about.identifier`와 보강 단계에서 BIBFRAME Work/Instance/Item과 연결될 수 있도록 한다.

### ONIX

ONIX는 출판 공급망의 상품 메타데이터에 강하다. BRO는 ONIX product identifier, publisher, publication date, category 등을 `identifier`와 `additionalProperty`로 연결할 수 있다.

### DataCite/Crossref

논문, 데이터셋, 연구 산출물은 DOI와 DataCite/Crossref 메타데이터와 연결된다. BRO는 `identifier`에 DOI를 보존하고, `about.@type`을 `ScholarlyArticle`, `Dataset`, `CreativeWork` 등으로 둔다.

### 국립중앙도서관 LOD 및 기타 서지 데이터셋

LOD URI, 제어번호, ISBN, KDC, 저자명, 주제어, 수상 주기 등은 `identifier` 또는 `additionalProperty`에 보존한다. BRO는 특정 LOD에만 종속되지 않는다. 다른 공공·민간·상업 서지 데이터셋도 같은 방식으로 연결할 수 있다.  
---

## 18\. 활용 예시

이 절은 가능한 활용 예시다.

### 학교도서관 수서 후보 목록

여러 공공도서관 추천, 교사 서평, 수상 목록, 학교 보유 현황을 결합해 수서 후보를 만들 수 있다. BRO는 수서 판단을 하지 않는다. BRO는 판단에 필요한 출처 있는 신호를 제공한다.

### 수행평가용 도서 목록

교사 서평, 교육과정 주제, 학년, 독서토론 적합성, 수행평가 활동 유형을 `Reaction`, `audience`, `keywords`, `additionalProperty`로 보존할 수 있다.

### 학생 자기주도 탐색

학생 질문과 BRO 반응정보를 결합하면 단순 유사도 검색보다 설명 가능한 탐색을 만들 수 있다. 예: “기후 위기와 도시 문제를 발표할 때 읽을 만한 책”에 대해 출처 있는 추천 목록과 교사 서평을 함께 제시한다.

### 출처 기반 RAG

BRO는 RAG 답변의 객관성을 보증하지 않는다. 다만 어떤 추천 신호가 어떤 출처에서 나왔는지, 어떤 책임 주체가 있었는지, 어떤 항목이 어떤 목록에 등재되었는지 감사 가능하게 만든다.

---

## 

## 19\. 검증 규칙 요약

- `Response.text`는  
  - **하나 이상의 비공백 문자**를 포함해야 한다.  
- `Listing.text`는  
  - 빈 문자열일 수 있다.  
- `Unspecified.text`는  
  - 빈 문자열일 수 있다.  
- `text`는  
  - YAML/TOML front matter로 시작하면 안 된다.  
- `ReactionList.itemListElement`는   
  - `Reaction` 또는 `ReactionAbstract` 참조다.  
- 서로 다른 판본이나 표현형의 ISBN을 같은 `identifier` 배열에 섞지 않는다.  
- `source`는 선택이지만 **신뢰도의 중요한 신호**다.  
- `creator`는 빈 배열이면 안 된다. 모르면 `UnknownAgent`를 쓴다.  
- `UnknownAgent`에는 `@id`를 두지 않는다.  
- `@context` 배열을 사용할 경우 BRO context가 첫 번째여야 한다.

---

## 20\. 잘못된 용례

### 20.1 목록에 책을 직접 넣는 canonical BRO

{  
  "@type": "ReactionList",  
  "itemListElement": \[  
    { "@type": "Book", "name": "아몬드" }  
  \]  
}

이 형태는 authoring shortcut으로는 가능하지만 canonical BRO가 아니다. canonical BRO에서는 각 항목을 `Reaction(reactionType="Listing")`으로 정규화한다.

### 20.2 Response인데 빈 본문

{  
  "reactionType": "Response",  
  "text": ""  
}

비준수다.

### 20.3 같은 객체에 다른 판본 identifier 섞기

{  
  "@type": "Book",  
  "identifier": \["urn:isbn:청소년판", "urn:isbn:특별판"\]  
}

비준수에 가까운 의미 오류다. 별도 `workReference`로 분리한다.

---

## 21\. 구현 메모

- 업로드 도구는 사용자의 단순 목록 입력을 받아 `ReactionList + Listing Reaction[]` 형태의 `@graph`로 정규화할 수 있다.  
- 내부 DB는 position column을 둘 수 있다. BRO exchange에서는 배열 순서가 목록 순서를 나타내며, Schema.org export 시 필요한 경우 `ListItem.position`을 생성한다.  
- 수신 시스템은 `sourceKey`와 `@id`를 이용해 재수집 시 멱등성을 확보한다.  
- 식별자 정규화, ISBN 체크섬, DOI 정규화, LOD dereference, 상업 DB 매칭은 응용 계층 책임이다.

---

## 22\. 참고 표준

- JSON-LD 1.1: [https://www.w3.org/TR/json-ld11/](https://www.w3.org/TR/json-ld11/)  
- Web Annotation Data Model: [https://www.w3.org/TR/annotation-model/](https://www.w3.org/TR/annotation-model/)  
- Schema.org ItemList: [https://schema.org/ItemList](https://schema.org/ItemList)  
- Schema.org Review: [https://schema.org/Review](https://schema.org/Review)  
- Schema.org Recommendation: [https://schema.org/Recommendation](https://schema.org/Recommendation)  
- 1EdTech RLI Information Model:   
  - [https://www.imsglobal.org/rli/rliv1p0/imsrli\_infov1p0.html](https://www.imsglobal.org/rli/rliv1p0/imsrli_infov1p0.html)  
- 1EdTech RLI Best Practice Guide:   
  - [https://www.imsglobal.org/rli/rliv1p0/imsrli\_bestv1p0.html](https://www.imsglobal.org/rli/rliv1p0/imsrli_bestv1p0.html)  
- KORMARC 소개: [https://librarian.nl.go.kr/LI/contents/L10101000000.do](https://librarian.nl.go.kr/LI/contents/L10101000000.do)  
- KORMARC 520: [https://librarian.nl.go.kr/kormarc/KSX6006-0/sub/5XX\_520.html](https://librarian.nl.go.kr/kormarc/KSX6006-0/sub/5XX_520.html)  
- BIBFRAME 2.0 Model: [https://www.loc.gov/bibframe/docs/bibframe2-model.html](https://www.loc.gov/bibframe/docs/bibframe2-model.html)  
- MODS Abstract: [https://www.loc.gov/standards/mods/userguide/abstract.html](https://www.loc.gov/standards/mods/userguide/abstract.html)  
- International ISBN Agency: [https://www.isbn-international.org/content/what-isbn/10](https://www.isbn-international.org/content/what-isbn/10)

