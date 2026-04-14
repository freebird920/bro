import * as _cfworker_json_schema from '@cfworker/json-schema';
import * as v from 'valibot';

var $schema = "https://json-schema.org/draft/2020-12/schema";
var $id = "https://schema.slat.or.kr/bro/v1/schema.json";
var title = "Bibliographic Reaction Object(BRO)";
var description = "Bibliographic Reaction Object";
var type = "object";
var oneOf = [
	{
		description: "클라이언트 데이터 인입용 쓰기 페이로드 (Ingestion DTO - UUID 검증 면제)",
		$ref: "#/$defs/articleIngestionPayload"
	},
	{
		description: "서버 내부 및 조회용 영속성 엔티티 (Persisted Entity - UUID 필수 강제, 반출 시 짭 UUID로 치환할 것)",
		$ref: "#/$defs/articlePersistedEntity"
	},
	{
		description: "도서 관련 글 목록 (ItemList - 다중 배열 매트릭스)",
		$ref: "#/$defs/itemListDefinition"
	}
];
var $defs = {
	itemListDefinition: {
		type: "object",
		required: [
			"@context",
			"@type",
			"author",
			"itemListElement"
		],
		properties: {
			"@context": {
				"const": "https://schema.org"
			},
			"@type": {
				"const": "ItemList"
			},
			"@id": {
				type: "string",
				pattern: "^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
			},
			name: {
				type: "string",
				minLength: 2,
				maxLength: 200
			},
			author: {
				type: "array",
				minItems: 1,
				uniqueItems: true,
				description: "도서 목록 작성/생성 주체 배열. 다수 주체(공동 저자, 다중 시스템) 바인딩 지원.",
				items: {
					$ref: "#/$defs/authorDefinitions"
				}
			},
			itemListElement: {
				type: "array",
				minItems: 0,
				description: "도서 목록의 각 항목. 모든 항목은 Article로 규격화되며, 순수한 도서 추가의 경우 text가 빈 문자열인 Article로 취급됩니다.",
				items: {
					$ref: "#/$defs/articleIngestionPayload"
				}
			}
		}
	},
	isbnDefinition: {
		type: "string",
		pattern: "^(?:97[89]-?)?(?:\\d[ -]?){9}[\\dxX]$"
	},
	abstractDefinition: {
		type: "object",
		required: [
			"@type",
			"@id",
			"text",
			"author",
			"dateCreated"
		],
		unevaluatedProperties: false,
		properties: {
			"@type": {
				"const": "CreativeWork"
			},
			"@id": {
				type: "string",
				pattern: "^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
				description: "원본 데이터의 UUID와 생성 시간을 기반으로 한 결정론적 UUID. 본 객체는 불변(Immutable)하며 갱신 시 새로운 UUID가 발급되어야 함."
			},
			dateCreated: {
				type: "string",
				format: "date-time",
				description: "요약 객체의 최초 생성 타임스탬프 (ISO 8601 / RFC 3339 준수). 불변성 원칙에 따라 데이터 수정 시 updated 필드를 사용하지 않고 신규 객체와 새로운 dateCreated를 발급하여 멱등성을 보장함. (Mapping: KOMARC 매핑시 YYYYMMDD 포맷으로 문자열 절삭 처리되어 KOMARC 552 ▾k 속성 값의 개시일자/종료일자에 바인딩됨)"
			},
			text: {
				type: "string",
				description: "LLM 또는 사람이 작성한 리뷰, 분석, 비평 등 파생 데이터에 대한 정형화된 상세 요약 본문. (Mapping: KOMARC 552 ▾o 개체/속성 개요 서브필드에 직접 주입됨)"
			},
			author: {
				type: "array",
				minItems: 1,
				uniqueItems: true,
				description: "요약 데이터 생성 주체 배열. 기계(LLM)와 인간 작업자의 공동 작업 등 복수 주체 명시.",
				items: {
					$ref: "#/$defs/authorDefinitions"
				}
			}
		}
	},
	articleBaseProperties: {
		type: "object",
		properties: {
			"@context": {
				"const": "https://schema.org"
			},
			"@type": {
				"const": "Article"
			},
			dateCreated: {
				type: "string",
				format: "date-time",
				description: "파생 문서 엔티티의 최초 생성 타임스탬프 (ISO 8601 / RFC 3339 준수). 데이터 무결성을 위해 갱신을 허용하지 않음(No Update). 수정 요구 발생 시 기존 객체를 논리적 삭제 또는 아카이빙하고 신규 타임스탬프를 획득한 새 객체로 대체함. (Mapping: KOMARC 연동 시 YYYYMMDD로 다운캐스팅되어 552 ▾k 서브필드에 개시일자로 맵핑됨)"
			},
			about: {
				type: "array",
				minItems: 1,
				uniqueItems: true,
				description: "파생 문서가 타겟팅하는 코어 서지 엔티티 배열. 단권, 다권본 세트, 동일 저작물의 이기종 판본(개정판, e-book 등 여러 ISBN)을 무제한으로 바인딩할 수 있음. 단일 도서 타겟팅 시에도 반드시 원소 1개짜리 배열로 인입되어야 함.",
				items: {
					type: "object",
					required: [
						"@type",
						"isbn"
					],
					unevaluatedProperties: false,
					properties: {
						"@type": {
							"const": "Book"
						},
						isbn: {
							$ref: "#/$defs/isbnDefinition",
							description: "국제표준도서번호 식별자."
						}
					}
				}
			},
			text: {
				type: "string",
				minLength: 0,
				maxLength: 300000,
				description: "범용 문서 텍스트. 최상단 YAML Frontmatter 캡슐화 필수. 데이터 인입 시 프론트매터 내부의 임의의 키(Arbitrary Keys) 확장은 전면 허용됨. 단, API 반환 및 영속화 객체 표출 시 파이프라인은 반드시 데이터를 정규화하여 1급 필드인 `title`(string), `byline`(string[]), `keywords`(string[]), `image`(string[]), `source_url`(string[])만을 최상위 노드에 직렬화하고, 기타 모든 잔여 동적 데이터는 `others: [{key: value}, ...]` 형태의 배열 객체로 강제 묶음 처리하여 마크다운을 재조립해야 함. (Mapping Protocol: 본 데이터 세트의 규격 출처는 KOMARC 552 ▾h 부호세트 이름/출처에 `https://schema.slat.or.kr/bro/v1/schema.json` 식별자로 명시되어야 하며, text 페이로드 원문은 552 ▾u의 URI 식별자를 통해 외부 해소되어야 함) @format markdown @ai-hint Frontmatter 파싱은 정규식 ^---\\n([\\s\\S]*?)\\n--- 를 사용하되, 역직렬화 반환 시 `title`, `byline`, `keywords`, `image`, `source_url` 및 잔여 K-V 튜플을 포함하는 `others` 노드만을 포함하도록 재구성할 것."
			},
			abstract: {
				$ref: "#/$defs/abstractDefinition",
				description: "문서의 구조화된 요약 데이터 (기계 또는 사람이 작성)"
			},
			author: {
				type: "array",
				minItems: 1,
				uniqueItems: true,
				description: "본문 데이터 생성 주체 배열. 복수 인원 공동 집필 및 복합 모델 관여 이력 추적용.",
				items: {
					$ref: "#/$defs/authorDefinitions"
				}
			}
		}
	},
	articleIngestionPayload: {
		description: "클라이언트 POST 페이로드 구조 (서버 사이드 변수 통제)",
		type: "object",
		required: [
			"@context",
			"@type",
			"about",
			"text",
			"author",
			"dateCreated"
		],
		unevaluatedProperties: false,
		allOf: [
			{
				$ref: "#/$defs/articleBaseProperties"
			}
		]
	},
	articlePersistedEntity: {
		description: "데이터베이스 영속성 및 데이터 반출용 엄격한 스키마 구조",
		type: "object",
		unevaluatedProperties: false,
		required: [
			"@context",
			"@type",
			"@id",
			"about",
			"text",
			"author",
			"dateCreated"
		],
		allOf: [
			{
				$ref: "#/$defs/articleBaseProperties"
			},
			{
				properties: {
					"@id": {
						type: "string",
						pattern: "^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
					},
					datePublished: {
						type: "string",
						format: "date",
						description: "엔티티의 발행/영속화 일자. (Mapping: KOMARC 552 ▾k 서브필드에 종료일자 또는 유효일자로 맵핑됨)"
					}
				}
			}
		]
	},
	authorDefinitions: {
		type: "object",
		required: [
			"@type",
			"@id",
			"name"
		],
		unevaluatedProperties: false,
		properties: {
			"@type": {
				"enum": [
					"Person",
					"GovernmentOrganization",
					"Corporation",
					"Organization",
					"SoftwareApplication"
				]
			},
			name: {
				type: "string",
				maxLength: 100,
				description: "파생 문서(요약, 서평 등)를 생성한 주체의 이름 또는 기관/시스템명. 주의: 원본 도서의 저자(서지 표준의 1XX/7XX 계층)와 엄격히 분리된 도메인임."
			},
			softwareVersion: {
				type: "string",
				description: "LLM 등 모델의 세부 버전"
			},
			"@id": {
				type: "string",
				description: "서버 내부에서는 원본 UUID v7을 유지하되, 클라이언트 반출 시 반드시 가명 처리된 값을 바인딩할 것."
			}
		},
		allOf: [
			{
				"if": {
					properties: {
						"@type": {
							"const": "Person"
						}
					}
				},
				then: {
					properties: {
						"@id": {
							pattern: "^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
						}
					}
				}
			},
			{
				"if": {
					properties: {
						"@type": {
							"const": "GovernmentOrganization"
						}
					}
				},
				then: {
					properties: {
						"@id": {
							pattern: "^urn:kr:govcode:\\d{7}$"
						}
					}
				}
			},
			{
				"if": {
					properties: {
						"@type": {
							"const": "Corporation"
						}
					}
				},
				then: {
					properties: {
						"@id": {
							pattern: "^urn:kr:(crn:\\d{13}|brn:\\d{10})$"
						}
					}
				}
			},
			{
				"if": {
					properties: {
						"@type": {
							"const": "Organization"
						}
					}
				},
				then: {
					properties: {
						"@id": {
							pattern: "^urn:(kr:npo:\\d{10}|uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$"
						}
					}
				}
			},
			{
				"if": {
					properties: {
						"@type": {
							"const": "SoftwareApplication"
						}
					}
				},
				then: {
					properties: {
						"@id": {
							pattern: "^urn:model:[a-zA-Z0-9-]+:[a-zA-Z0-9\\.-]+$",
							description: "모델을 식별하는 단일 URN (예: urn:model:openai:gpt-4o, urn:model:google:gemini-1.5-pro)"
						}
					}
				}
			}
		]
	}
};
var broV1Schema = {
	$schema: $schema,
	$id: $id,
	title: title,
	description: description,
	type: type,
	oneOf: oneOf,
	$defs: $defs
};

/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the build script to regenerate this file.
 */
/**
 * Bibliographic Reaction Object
 */
type BibliographicReactionObjectBRO = ArticleIngestionPayload | ArticlePersistedEntity | ItemListDefinition;
/**
 * 클라이언트 데이터 인입용 쓰기 페이로드 (Ingestion DTO - UUID 검증 면제)
 */
type ArticleIngestionPayload = ArticleBaseProperties;
type AuthorDefinitions = {
    [k: string]: unknown;
} & {
    [k: string]: unknown;
} & {
    [k: string]: unknown;
} & {
    [k: string]: unknown;
} & {
    [k: string]: unknown;
} & {
    "@type": "Person" | "GovernmentOrganization" | "Corporation" | "Organization" | "SoftwareApplication";
    /**
     * 파생 문서(요약, 서평 등)를 생성한 주체의 이름 또는 기관/시스템명. 주의: 원본 도서의 저자(서지 표준의 1XX/7XX 계층)와 엄격히 분리된 도메인임.
     */
    name: string;
    /**
     * LLM 등 모델의 세부 버전
     */
    softwareVersion?: string;
    /**
     * 서버 내부에서는 원본 UUID v7을 유지하되, 클라이언트 반출 시 반드시 가명 처리된 값을 바인딩할 것.
     */
    "@id": string;
    [k: string]: unknown;
} & {
    "@type": "Person" | "GovernmentOrganization" | "Corporation" | "Organization" | "SoftwareApplication";
    /**
     * 파생 문서(요약, 서평 등)를 생성한 주체의 이름 또는 기관/시스템명. 주의: 원본 도서의 저자(서지 표준의 1XX/7XX 계층)와 엄격히 분리된 도메인임.
     */
    name: string;
    /**
     * LLM 등 모델의 세부 버전
     */
    softwareVersion?: string;
    /**
     * 서버 내부에서는 원본 UUID v7을 유지하되, 클라이언트 반출 시 반드시 가명 처리된 값을 바인딩할 것.
     */
    "@id": string;
    [k: string]: unknown;
} & {
    "@type": "Person" | "GovernmentOrganization" | "Corporation" | "Organization" | "SoftwareApplication";
    /**
     * 파생 문서(요약, 서평 등)를 생성한 주체의 이름 또는 기관/시스템명. 주의: 원본 도서의 저자(서지 표준의 1XX/7XX 계층)와 엄격히 분리된 도메인임.
     */
    name: string;
    /**
     * LLM 등 모델의 세부 버전
     */
    softwareVersion?: string;
    /**
     * 서버 내부에서는 원본 UUID v7을 유지하되, 클라이언트 반출 시 반드시 가명 처리된 값을 바인딩할 것.
     */
    "@id": string;
    [k: string]: unknown;
} & {
    "@type": "Person" | "GovernmentOrganization" | "Corporation" | "Organization" | "SoftwareApplication";
    /**
     * 파생 문서(요약, 서평 등)를 생성한 주체의 이름 또는 기관/시스템명. 주의: 원본 도서의 저자(서지 표준의 1XX/7XX 계층)와 엄격히 분리된 도메인임.
     */
    name: string;
    /**
     * LLM 등 모델의 세부 버전
     */
    softwareVersion?: string;
    /**
     * 서버 내부에서는 원본 UUID v7을 유지하되, 클라이언트 반출 시 반드시 가명 처리된 값을 바인딩할 것.
     */
    "@id": string;
    [k: string]: unknown;
} & {
    "@type": "Person" | "GovernmentOrganization" | "Corporation" | "Organization" | "SoftwareApplication";
    /**
     * 파생 문서(요약, 서평 등)를 생성한 주체의 이름 또는 기관/시스템명. 주의: 원본 도서의 저자(서지 표준의 1XX/7XX 계층)와 엄격히 분리된 도메인임.
     */
    name: string;
    /**
     * LLM 등 모델의 세부 버전
     */
    softwareVersion?: string;
    /**
     * 서버 내부에서는 원본 UUID v7을 유지하되, 클라이언트 반출 시 반드시 가명 처리된 값을 바인딩할 것.
     */
    "@id": string;
    [k: string]: unknown;
} & {
    "@type": "Person" | "GovernmentOrganization" | "Corporation" | "Organization" | "SoftwareApplication";
    /**
     * 파생 문서(요약, 서평 등)를 생성한 주체의 이름 또는 기관/시스템명. 주의: 원본 도서의 저자(서지 표준의 1XX/7XX 계층)와 엄격히 분리된 도메인임.
     */
    name: string;
    /**
     * LLM 등 모델의 세부 버전
     */
    softwareVersion?: string;
    /**
     * 서버 내부에서는 원본 UUID v7을 유지하되, 클라이언트 반출 시 반드시 가명 처리된 값을 바인딩할 것.
     */
    "@id": string;
    [k: string]: unknown;
};
/**
 * 서버 내부 및 조회용 영속성 엔티티 (Persisted Entity - UUID 필수 강제, 반출 시 짭 UUID로 치환할 것)
 */
type ArticlePersistedEntity = ArticleBaseProperties & {
    "@id"?: string;
    /**
     * 엔티티의 발행/영속화 일자. (Mapping: KOMARC 552 ▾k 서브필드에 종료일자 또는 유효일자로 맵핑됨)
     */
    datePublished?: string;
    [k: string]: unknown;
};
/**
 * 클라이언트 POST 페이로드 구조 (서버 사이드 변수 통제)
 */
type ArticleIngestionPayload1 = ArticleBaseProperties;
interface ArticleBaseProperties {
    "@context"?: "https://schema.org";
    "@type"?: "Article";
    /**
     * 파생 문서 엔티티의 최초 생성 타임스탬프 (ISO 8601 / RFC 3339 준수). 데이터 무결성을 위해 갱신을 허용하지 않음(No Update). 수정 요구 발생 시 기존 객체를 논리적 삭제 또는 아카이빙하고 신규 타임스탬프를 획득한 새 객체로 대체함. (Mapping: KOMARC 연동 시 YYYYMMDD로 다운캐스팅되어 552 ▾k 서브필드에 개시일자로 맵핑됨)
     */
    dateCreated?: string;
    /**
     * 파생 문서가 타겟팅하는 코어 서지 엔티티 배열. 단권, 다권본 세트, 동일 저작물의 이기종 판본(개정판, e-book 등 여러 ISBN)을 무제한으로 바인딩할 수 있음. 단일 도서 타겟팅 시에도 반드시 원소 1개짜리 배열로 인입되어야 함.
     *
     * @minItems 1
     */
    about?: [
        {
            "@type": "Book";
            /**
             * 국제표준도서번호 식별자.
             */
            isbn: string;
            [k: string]: unknown;
        },
        ...{
            "@type": "Book";
            /**
             * 국제표준도서번호 식별자.
             */
            isbn: string;
            [k: string]: unknown;
        }[]
    ];
    /**
     * 범용 문서 텍스트. 최상단 YAML Frontmatter 캡슐화 필수. 데이터 인입 시 프론트매터 내부의 임의의 키(Arbitrary Keys) 확장은 전면 허용됨. 단, API 반환 및 영속화 객체 표출 시 파이프라인은 반드시 데이터를 정규화하여 1급 필드인 `title`(string), `byline`(string[]), `keywords`(string[]), `image`(string[]), `source_url`(string[])만을 최상위 노드에 직렬화하고, 기타 모든 잔여 동적 데이터는 `others: [{key: value}, ...]` 형태의 배열 객체로 강제 묶음 처리하여 마크다운을 재조립해야 함. (Mapping Protocol: 본 데이터 세트의 규격 출처는 KOMARC 552 ▾h 부호세트 이름/출처에 `https://schema.slat.or.kr/bro/v1/schema.json` 식별자로 명시되어야 하며, text 페이로드 원문은 552 ▾u의 URI 식별자를 통해 외부 해소되어야 함) @format markdown @ai-hint Frontmatter 파싱은 정규식 ^---\n([\s\S]*?)\n--- 를 사용하되, 역직렬화 반환 시 `title`, `byline`, `keywords`, `image`, `source_url` 및 잔여 K-V 튜플을 포함하는 `others` 노드만을 포함하도록 재구성할 것.
     */
    text?: string;
    abstract?: AbstractDefinition;
    /**
     * 본문 데이터 생성 주체 배열. 복수 인원 공동 집필 및 복합 모델 관여 이력 추적용.
     *
     * @minItems 1
     */
    author?: [AuthorDefinitions, ...AuthorDefinitions[]];
    [k: string]: unknown;
}
/**
 * 문서의 구조화된 요약 데이터 (기계 또는 사람이 작성)
 */
interface AbstractDefinition {
    "@type": "CreativeWork";
    /**
     * 원본 데이터의 UUID와 생성 시간을 기반으로 한 결정론적 UUID. 본 객체는 불변(Immutable)하며 갱신 시 새로운 UUID가 발급되어야 함.
     */
    "@id": string;
    /**
     * 요약 객체의 최초 생성 타임스탬프 (ISO 8601 / RFC 3339 준수). 불변성 원칙에 따라 데이터 수정 시 updated 필드를 사용하지 않고 신규 객체와 새로운 dateCreated를 발급하여 멱등성을 보장함. (Mapping: KOMARC 매핑시 YYYYMMDD 포맷으로 문자열 절삭 처리되어 KOMARC 552 ▾k 속성 값의 개시일자/종료일자에 바인딩됨)
     */
    dateCreated: string;
    /**
     * LLM 또는 사람이 작성한 리뷰, 분석, 비평 등 파생 데이터에 대한 정형화된 상세 요약 본문. (Mapping: KOMARC 552 ▾o 개체/속성 개요 서브필드에 직접 주입됨)
     */
    text: string;
    /**
     * 요약 데이터 생성 주체 배열. 기계(LLM)와 인간 작업자의 공동 작업 등 복수 주체 명시.
     *
     * @minItems 1
     */
    author: [AuthorDefinitions, ...AuthorDefinitions[]];
    [k: string]: unknown;
}
/**
 * 도서 관련 글 목록 (ItemList - 다중 배열 매트릭스)
 */
interface ItemListDefinition {
    "@context": "https://schema.org";
    "@type": "ItemList";
    "@id"?: string;
    name?: string;
    /**
     * 도서 목록 작성/생성 주체 배열. 다수 주체(공동 저자, 다중 시스템) 바인딩 지원.
     *
     * @minItems 1
     */
    author: [AuthorDefinitions, ...AuthorDefinitions[]];
    /**
     * 도서 목록의 각 항목. 모든 항목은 Article로 규격화되며, 순수한 도서 추가의 경우 text가 빈 문자열인 Article로 취급됩니다.
     *
     * @minItems 0
     */
    itemListElement: ArticleIngestionPayload1[];
    [k: string]: unknown;
}

declare const StrictFrontmatterSchema: v.StrictObjectSchema<{
    readonly title: v.StringSchema<"Title must be a strictly defined string.">;
    readonly keywords: v.ArraySchema<v.StringSchema<"Keywords must be an array of strings.">, undefined>;
    readonly byline: v.OptionalSchema<v.ArraySchema<v.StringSchema<"Byline must be an array of strings.">, undefined>, undefined>;
    readonly image: v.OptionalSchema<v.ArraySchema<v.StringSchema<"Image must be an array of strings.">, undefined>, undefined>;
    readonly source_url: v.OptionalSchema<v.ArraySchema<v.StringSchema<"Source URL must be an array of strings.">, undefined>, undefined>;
}, undefined>;
declare const DynamicFieldSchema: v.RecordSchema<v.StringSchema<undefined>, v.AnySchema, undefined>;
type StrictFrontmatter = v.InferOutput<typeof StrictFrontmatterSchema>;
type DynamicField = v.InferOutput<typeof DynamicFieldSchema>;

/**
 * Validates data against the Book Article List Ontology (BRO) schema.
 */
declare function validateBroSchema(data: unknown): {
    valid: boolean;
    errors: _cfworker_json_schema.OutputUnit[];
};

/**
 * Executes rigorous Valibot pipeline validation to intercept anomalous data injections.
 * Bypasses the overhead of Zod's deep cloning mechanisms, performing direct memory inspection.
 */
declare function validateStrictFrontmatter(payload: unknown): StrictFrontmatter;
/**
 * Validates the topological integrity of the extracted dynamic fields matrix.
 */
declare function validateOthersBundle(payload: unknown): DynamicField[];

export { type AbstractDefinition, type ArticleBaseProperties, type ArticleIngestionPayload, type ArticleIngestionPayload1, type ArticlePersistedEntity, type AuthorDefinitions, type BibliographicReactionObjectBRO, type ItemListDefinition, broV1Schema, validateBroSchema, validateOthersBundle, validateStrictFrontmatter };
