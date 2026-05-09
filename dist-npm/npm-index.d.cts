var $schema = "https://json-schema.org/draft/2020-12/schema";
var $id = "https://schema.slat.or.kr/bro/v1.0/schema.json";
var title = "Bibliographic Reaction Object (BRO) v1.0";
var description = "JSON Schema for exchanging bibliographic reaction data: recommendation lists, review lists, reading lists, curation notes, reviews, comments, and summaries. The schema keeps the ordinary input model simple while remaining compatible with JSON-LD and bibliographic metadata ecosystems.";
var type = "object";
var oneOf = [
	{
		$ref: "#/$defs/Reaction"
	},
	{
		$ref: "#/$defs/ReactionAbstract"
	},
	{
		$ref: "#/$defs/ReactionList"
	}
];
var $defs = {
	contextRef: {
		description: "MUST be the BRO v1.0 context IRI. Extension contexts MAY be appended after the BRO context.",
		oneOf: [
			{
				"const": "https://schema.slat.or.kr/bro/v1.0/context.jsonld"
			},
			{
				type: "array",
				minItems: 1,
				prefixItems: [
					{
						"const": "https://schema.slat.or.kr/bro/v1.0/context.jsonld"
					}
				],
				items: {
					oneOf: [
						{
							type: "string",
							format: "uri"
						},
						{
							type: "object"
						}
					]
				}
			}
		]
	},
	uuidUrn: {
		type: "string",
		description: "Lowercase RFC 9562 UUID URN. Versions 1, 4, 5, 6, 7, and 8 are accepted syntactically.",
		pattern: "^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
	},
	httpsIri: {
		type: "string",
		description: "HTTPS IRI. Used for BRO entity identifiers and web identifiers where secure canonical IDs are available.",
		pattern: "^https://(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}(?::[0-9]{1,5})?(?:/[^\\s<>\"\\\\^`{|}]*)?$",
		maxLength: 2048
	},
	httpIri: {
		type: "string",
		description: "HTTP IRI. Allowed for external bibliographic/LOD identifiers such as legacy linked-data resource URIs, but not for BRO entity @id.",
		pattern: "^http://(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}(?::[0-9]{1,5})?(?:/[^\\s<>\"\\\\^`{|}]*)?$",
		maxLength: 2048
	},
	webIri: {
		anyOf: [
			{
				$ref: "#/$defs/httpsIri"
			},
			{
				$ref: "#/$defs/httpIri"
			}
		]
	},
	mailtoUri: {
		type: "string",
		pattern: "^mailto:[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
		maxLength: 320
	},
	entityIri: {
		description: "Identifier for a BRO entity instance. Use a UUID URN or an HTTPS IRI; do not use HTTP for BRO entity @id.",
		anyOf: [
			{
				$ref: "#/$defs/uuidUrn"
			},
			{
				$ref: "#/$defs/httpsIri"
			}
		]
	},
	agentIri: {
		description: "Identifier for an agent. UUID URN, HTTPS IRI, or mailto URI.",
		anyOf: [
			{
				$ref: "#/$defs/uuidUrn"
			},
			{
				$ref: "#/$defs/httpsIri"
			},
			{
				$ref: "#/$defs/mailtoUri"
			}
		]
	},
	rfc3339DateTime: {
		type: "string",
		format: "date-time",
		description: "RFC 3339 date-time with Z or numeric offset. Naive datetimes are rejected.",
		pattern: "^[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])T(?:[01][0-9]|2[0-3]):[0-5][0-9]:(?:[0-5][0-9]|60)(?:\\.[0-9]+)?(?:Z|[+-](?:[01][0-9]|2[0-3]):[0-5][0-9])$"
	},
	rfc3339Date: {
		type: "string",
		pattern: "^[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$"
	},
	bibliographicDate: {
		description: "Bibliographic publication date. External works often have year-only or month-only precision.",
		oneOf: [
			{
				$ref: "#/$defs/rfc3339DateTime"
			},
			{
				$ref: "#/$defs/rfc3339Date"
			},
			{
				type: "string",
				pattern: "^[0-9]{4}-(?:0[1-9]|1[0-2])$"
			},
			{
				type: "string",
				pattern: "^[0-9]{4}$"
			}
		]
	},
	languageTag: {
		type: "string",
		description: "BCP 47 language tag, syntactic validation only.",
		pattern: "^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{1,8})*$",
		maxLength: 35
	},
	languageTagArray: {
		type: "array",
		minItems: 1,
		maxItems: 20,
		uniqueItems: true,
		items: {
			$ref: "#/$defs/languageTag"
		}
	},
	plainText: {
		type: "string",
		minLength: 1,
		maxLength: 2000
	},
	longText: {
		type: "string",
		minLength: 1,
		maxLength: 10000
	},
	bylineString: {
		type: "string",
		description: "Original attribution display string as it appeared in the source.",
		minLength: 1,
		maxLength: 2000
	},
	bodyText: {
		type: "string",
		description: "Body text. It MUST NOT begin with a YAML/TOML front-matter block.",
		minLength: 0,
		maxLength: 300000,
		not: {
			pattern: "^(?:---|\\+\\+\\+)\\s*(?:\\r?\\n|$)"
		}
	},
	textFormat: {
		type: "string",
		description: "MIME type hint. Absent means text/plain.",
		pattern: "^[a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]{0,126}/[a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]{0,126}(?:\\s*;\\s*[a-zA-Z0-9!#$&^_.+-]+=(?:[a-zA-Z0-9!#$&^_.+-]+|\"[^\"]*\"))*$",
		maxLength: 255
	},
	keywordsArray: {
		type: "array",
		minItems: 0,
		maxItems: 100,
		uniqueItems: true,
		items: {
			type: "string",
			minLength: 1,
			maxLength: 200
		}
	},
	uriArray: {
		type: "array",
		maxItems: 200,
		uniqueItems: true,
		items: {
			type: "string",
			format: "uri"
		}
	},
	identifierString: {
		type: "string",
		description: "Any identifier or identity link for the referenced resource: ISBN URN, DOI URL, NLK/LOD URI, vendor record ID, UUID URN, HTTPS/HTTP URI, or institutional control number. Use name for titles, not identifier.",
		minLength: 1,
		maxLength: 2048,
		not: {
			pattern: "^\\s*$"
		}
	},
	identifierPropertyValue: {
		type: "object",
		description: "Structured identifier using schema:PropertyValue. Recommended when the identifier type or authority must be preserved.",
		required: [
			"@type",
			"value"
		],
		properties: {
			"@type": {
				"const": "PropertyValue"
			},
			name: {
				type: "string",
				minLength: 1,
				maxLength: 200
			},
			propertyID: {
				type: "string",
				minLength: 1,
				maxLength: 500
			},
			value: {
				oneOf: [
					{
						type: "string",
						minLength: 1,
						maxLength: 2048
					},
					{
						type: "number"
					}
				]
			},
			valueReference: {
				type: "string",
				format: "uri"
			}
		},
		anyOf: [
			{
				required: [
					"name"
				]
			},
			{
				required: [
					"propertyID"
				]
			}
		],
		additionalProperties: false
	},
	identifierValue: {
		oneOf: [
			{
				$ref: "#/$defs/identifierString"
			},
			{
				$ref: "#/$defs/identifierPropertyValue"
			}
		]
	},
	identifierSet: {
		description: "A single identifier or a set of identifiers for the same referenced entity. BRO does not use a separate sameAs field.",
		oneOf: [
			{
				$ref: "#/$defs/identifierValue"
			},
			{
				type: "array",
				minItems: 1,
				maxItems: 50,
				uniqueItems: true,
				items: {
					$ref: "#/$defs/identifierValue"
				}
			}
		]
	},
	agent: {
		description: "Creator, curator, issuer, or responsible producer of a BRO object.",
		oneOf: [
			{
				$ref: "#/$defs/agentPerson"
			},
			{
				$ref: "#/$defs/agentOrganization"
			},
			{
				$ref: "#/$defs/agentSoftware"
			},
			{
				$ref: "#/$defs/agentUnknown"
			},
			{
				$ref: "#/$defs/agentRole"
			}
		]
	},
	agentPerson: {
		type: "object",
		required: [
			"@type",
			"name"
		],
		properties: {
			"@type": {
				"const": "Person"
			},
			"@id": {
				$ref: "#/$defs/agentIri"
			},
			name: {
				type: "string",
				minLength: 1,
				maxLength: 1000
			}
		},
		additionalProperties: false
	},
	agentOrganization: {
		type: "object",
		required: [
			"@type",
			"name"
		],
		properties: {
			"@type": {
				"const": "Organization"
			},
			"@id": {
				anyOf: [
					{
						$ref: "#/$defs/uuidUrn"
					},
					{
						$ref: "#/$defs/webIri"
					}
				]
			},
			name: {
				type: "string",
				minLength: 1,
				maxLength: 1000
			}
		},
		additionalProperties: false
	},
	agentSoftware: {
		type: "object",
		required: [
			"@type",
			"@id",
			"name"
		],
		properties: {
			"@type": {
				"const": "SoftwareApplication"
			},
			"@id": {
				$ref: "#/$defs/httpsIri"
			},
			name: {
				type: "string",
				minLength: 1,
				maxLength: 1000
			},
			softwareVersion: {
				type: "string",
				minLength: 1,
				maxLength: 50
			}
		},
		additionalProperties: false
	},
	agentUnknown: {
		type: "object",
		required: [
			"@type"
		],
		properties: {
			"@type": {
				"const": "UnknownAgent"
			},
			name: {
				type: "string",
				minLength: 1,
				maxLength: 1000
			}
		},
		additionalProperties: false
	},
	agentRole: {
		type: "object",
		required: [
			"@type",
			"agent"
		],
		properties: {
			"@type": {
				"const": "Role"
			},
			roleName: {
				type: "string",
				minLength: 1,
				maxLength: 1000
			},
			startDate: {
				$ref: "#/$defs/rfc3339Date"
			},
			endDate: {
				$ref: "#/$defs/rfc3339Date"
			},
			agent: {
				oneOf: [
					{
						$ref: "#/$defs/agentPerson"
					},
					{
						$ref: "#/$defs/agentOrganization"
					},
					{
						$ref: "#/$defs/agentSoftware"
					},
					{
						$ref: "#/$defs/agentUnknown"
					}
				]
			}
		},
		additionalProperties: false
	},
	agentArray: {
		type: "array",
		minItems: 1,
		maxItems: 100,
		uniqueItems: true,
		items: {
			$ref: "#/$defs/agent"
		}
	},
	boundedJsonValue: {
		oneOf: [
			{
				type: "string",
				maxLength: 10000
			},
			{
				type: "number"
			},
			{
				type: "boolean"
			},
			{
				type: "null"
			},
			{
				type: "array",
				maxItems: 100
			},
			{
				type: "object",
				maxProperties: 50
			}
		]
	},
	additionalPropertyValue: {
		type: "object",
		required: [
			"@type",
			"name",
			"value"
		],
		properties: {
			"@type": {
				"const": "PropertyValue"
			},
			name: {
				type: "string",
				minLength: 1,
				maxLength: 200
			},
			value: {
				$ref: "#/$defs/boundedJsonValue"
			},
			propertyID: {
				type: "string",
				minLength: 1,
				maxLength: 500
			},
			valueReference: {
				type: "string",
				format: "uri"
			},
			unitCode: {
				type: "string",
				maxLength: 50
			},
			unitText: {
				type: "string",
				maxLength: 50
			}
		},
		additionalProperties: false
	},
	additionalPropertyArray: {
		type: "array",
		maxItems: 200,
		items: {
			$ref: "#/$defs/additionalPropertyValue"
		}
	},
	extensionValue: {
		description: "Value for a colon-prefixed extension property. Kept shallow to prevent payload bombs.",
		oneOf: [
			{
				type: "string",
				maxLength: 10000
			},
			{
				type: "number"
			},
			{
				type: "boolean"
			},
			{
				type: "null"
			},
			{
				type: "object",
				maxProperties: 20
			},
			{
				type: "array",
				maxItems: 100
			}
		]
	},
	workType: {
		type: "string",
		pattern: "^[A-Z][A-Za-z0-9]{1,79}$",
		description: "Schema.org CreativeWork type token. Recommended values: CreativeWork, Book, Article, ScholarlyArticle, WebPage, Chapter, Periodical, Collection, Dataset, Report. Use CreativeWork when unsure."
	},
	workReference: {
		type: "object",
		description: "A direct reference to an external bibliographic or cultural work. It is intentionally not limited to books.",
		required: [
			"@type"
		],
		properties: {
			"@type": {
				$ref: "#/$defs/workType"
			},
			identifier: {
				$ref: "#/$defs/identifierSet"
			},
			name: {
				$ref: "#/$defs/plainText"
			},
			creatorName: {
				oneOf: [
					{
						type: "string",
						minLength: 1,
						maxLength: 2000
					},
					{
						type: "array",
						minItems: 1,
						maxItems: 50,
						uniqueItems: true,
						items: {
							type: "string",
							minLength: 1,
							maxLength: 1000
						}
					}
				]
			},
			publisherName: {
				type: "string",
				minLength: 1,
				maxLength: 1000
			},
			datePublished: {
				$ref: "#/$defs/bibliographicDate"
			},
			bookEdition: {
				type: "string",
				minLength: 1,
				maxLength: 500
			},
			inLanguage: {
				$ref: "#/$defs/languageTagArray"
			},
			keywords: {
				$ref: "#/$defs/keywordsArray"
			},
			image: {
				$ref: "#/$defs/uriArray"
			},
			additionalProperty: {
				$ref: "#/$defs/additionalPropertyArray"
			},
			bibliographicLevel: {
				$ref: "#/$defs/bibliographicLevel"
			},
			url: {
				$ref: "#/$defs/webIriSet"
			},
			exampleOfWork: {
				$ref: "#/$defs/workIdentityReference"
			}
		},
		anyOf: [
			{
				required: [
					"identifier"
				]
			},
			{
				required: [
					"name"
				]
			}
		],
		additionalProperties: false
	},
	broReference: {
		type: "object",
		description: "Reference to another BRO entity. Use this when list items have their own Reaction or ReactionAbstract object.",
		required: [
			"@id"
		],
		properties: {
			"@id": {
				$ref: "#/$defs/entityIri"
			},
			"@type": {
				type: "string",
				"enum": [
					"Reaction",
					"ReactionAbstract"
				]
			}
		},
		additionalProperties: false
	},
	targetReference: {
		oneOf: [
			{
				$ref: "#/$defs/workReference"
			},
			{
				$ref: "#/$defs/broReference"
			}
		]
	},
	listElement: {
		oneOf: [
			{
				$ref: "#/$defs/workReference"
			},
			{
				$ref: "#/$defs/listEntityReference"
			}
		]
	},
	reactionType: {
		type: "string",
		"enum": [
			"Response",
			"Listing",
			"Unspecified"
		],
		"default": "Unspecified",
		description: "Response = review/comment/critique with non-empty text. Listing = inclusion/recommendation/list-entry action. Unspecified = publisher intentionally declines classification."
	},
	Reaction: {
		type: "object",
		title: "Reaction",
		description: "A review, comment, critique, recommendation reason, or list-inclusion reaction about one or more works.",
		required: [
			"@context",
			"@type",
			"@id",
			"reactionType",
			"about",
			"text",
			"creator",
			"dateCreated"
		],
		properties: {
			"@context": {
				$ref: "#/$defs/contextRef"
			},
			"@id": {
				$ref: "#/$defs/entityIri"
			},
			name: {
				$ref: "#/$defs/plainText"
			},
			byline: {
				$ref: "#/$defs/bylineString"
			},
			creator: {
				$ref: "#/$defs/agentArray"
			},
			dateCreated: {
				$ref: "#/$defs/rfc3339DateTime"
			},
			dateModified: {
				$ref: "#/$defs/rfc3339DateTime"
			},
			datePublished: {
				$ref: "#/$defs/rfc3339DateTime"
			},
			license: {
				$ref: "#/$defs/httpsIri"
			},
			inLanguage: {
				$ref: "#/$defs/languageTagArray"
			},
			keywords: {
				$ref: "#/$defs/keywordsArray"
			},
			image: {
				$ref: "#/$defs/uriArray"
			},
			citation: {
				$ref: "#/$defs/uriArray"
			},
			additionalProperty: {
				$ref: "#/$defs/additionalPropertyArray"
			},
			"@type": {
				"const": "Reaction"
			},
			reactionType: {
				$ref: "#/$defs/reactionType"
			},
			about: {
				type: "array",
				minItems: 1,
				maxItems: 5,
				uniqueItems: true,
				items: {
					$ref: "#/$defs/targetReference"
				}
			},
			text: {
				$ref: "#/$defs/bodyText"
			},
			textFormat: {
				$ref: "#/$defs/textFormat"
			}
		},
		patternProperties: {
			"^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$": {
				$ref: "#/$defs/extensionValue"
			}
		},
		additionalProperties: false,
		allOf: [
			{
				"if": {
					properties: {
						reactionType: {
							"const": "Response"
						}
					},
					required: [
						"reactionType"
					]
				},
				then: {
					properties: {
						text: {
							minLength: 1
						}
					}
				}
			}
		]
	},
	ReactionAbstract: {
		type: "object",
		title: "ReactionAbstract",
		description: "A structured summary derived from a Reaction, ReactionList, or external work.",
		required: [
			"@context",
			"@type",
			"@id",
			"text",
			"creator",
			"dateCreated",
			"isBasedOn"
		],
		properties: {
			"@context": {
				$ref: "#/$defs/contextRef"
			},
			"@id": {
				$ref: "#/$defs/entityIri"
			},
			name: {
				$ref: "#/$defs/plainText"
			},
			byline: {
				$ref: "#/$defs/bylineString"
			},
			creator: {
				$ref: "#/$defs/agentArray"
			},
			dateCreated: {
				$ref: "#/$defs/rfc3339DateTime"
			},
			dateModified: {
				$ref: "#/$defs/rfc3339DateTime"
			},
			datePublished: {
				$ref: "#/$defs/rfc3339DateTime"
			},
			license: {
				$ref: "#/$defs/httpsIri"
			},
			inLanguage: {
				$ref: "#/$defs/languageTagArray"
			},
			keywords: {
				$ref: "#/$defs/keywordsArray"
			},
			image: {
				$ref: "#/$defs/uriArray"
			},
			citation: {
				$ref: "#/$defs/uriArray"
			},
			additionalProperty: {
				$ref: "#/$defs/additionalPropertyArray"
			},
			"@type": {
				"const": "ReactionAbstract"
			},
			text: {
				allOf: [
					{
						$ref: "#/$defs/bodyText"
					},
					{
						minLength: 1
					}
				]
			},
			textFormat: {
				$ref: "#/$defs/textFormat"
			},
			isBasedOn: {
				type: "array",
				minItems: 1,
				maxItems: 10,
				uniqueItems: true,
				items: {
					$ref: "#/$defs/basedOnReference"
				}
			}
		},
		patternProperties: {
			"^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$": {
				$ref: "#/$defs/extensionValue"
			}
		},
		additionalProperties: false
	},
	ReactionList: {
		type: "object",
		title: "ReactionList",
		description: "A persistent recommendation, review, reading, or curation list. The list itself is meaningful metadata.",
		required: [
			"@context",
			"@type",
			"@id",
			"creator",
			"itemListElement",
			"dateCreated"
		],
		properties: {
			"@context": {
				$ref: "#/$defs/contextRef"
			},
			"@id": {
				$ref: "#/$defs/entityIri"
			},
			name: {
				$ref: "#/$defs/plainText"
			},
			byline: {
				$ref: "#/$defs/bylineString"
			},
			creator: {
				$ref: "#/$defs/agentArray"
			},
			dateCreated: {
				$ref: "#/$defs/rfc3339DateTime"
			},
			dateModified: {
				$ref: "#/$defs/rfc3339DateTime"
			},
			datePublished: {
				$ref: "#/$defs/rfc3339DateTime"
			},
			license: {
				$ref: "#/$defs/httpsIri"
			},
			inLanguage: {
				$ref: "#/$defs/languageTagArray"
			},
			keywords: {
				$ref: "#/$defs/keywordsArray"
			},
			image: {
				$ref: "#/$defs/uriArray"
			},
			citation: {
				$ref: "#/$defs/uriArray"
			},
			additionalProperty: {
				$ref: "#/$defs/additionalPropertyArray"
			},
			"@type": {
				"const": "ReactionList"
			},
			itemListElement: {
				type: "array",
				minItems: 0,
				maxItems: 10000,
				items: {
					$ref: "#/$defs/listElement"
				}
			}
		},
		patternProperties: {
			"^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$": {
				$ref: "#/$defs/extensionValue"
			}
		},
		additionalProperties: false
	},
	bibliographicLevel: {
		type: "string",
		"enum": [
			"Work",
			"Edition",
			"Item",
			"Unspecified"
		],
		description: "Approximate bibliographic level of this reference. Work: abstract work level; Edition: manifestation/edition/publication level; Item: holding/copy/item level; Unspecified: source does not allow a decision."
	},
	listEntityReference: {
		type: "object",
		description: "Reference to a BRO Reaction or ReactionAbstract used as a list element. ReactionList nesting is intentionally not used for list elements in v1.0.",
		required: [
			"@id"
		],
		properties: {
			"@id": {
				$ref: "#/$defs/entityIri"
			},
			"@type": {
				type: "string",
				"enum": [
					"Reaction",
					"ReactionAbstract"
				]
			}
		},
		additionalProperties: false
	},
	basedOnEntityReference: {
		type: "object",
		description: "Reference to another BRO entity used as a source for a ReactionAbstract.",
		required: [
			"@id"
		],
		properties: {
			"@id": {
				$ref: "#/$defs/entityIri"
			},
			"@type": {
				type: "string",
				"enum": [
					"Reaction",
					"ReactionAbstract",
					"ReactionList"
				]
			}
		},
		additionalProperties: false
	},
	basedOnReference: {
		oneOf: [
			{
				$ref: "#/$defs/workReference"
			},
			{
				$ref: "#/$defs/basedOnEntityReference"
			}
		]
	},
	workIdentityReference: {
		type: "object",
		description: "Optional abstract-work-level reference for an edition, translation, manifestation, or item. Advanced use; general users may omit it.",
		required: [
			"@type"
		],
		properties: {
			"@type": {
				"const": "CreativeWork"
			},
			identifier: {
				$ref: "#/$defs/identifierSet"
			},
			name: {
				$ref: "#/$defs/plainText"
			},
			creatorName: {
				oneOf: [
					{
						type: "string",
						minLength: 1,
						maxLength: 2000
					},
					{
						type: "array",
						minItems: 1,
						maxItems: 50,
						uniqueItems: true,
						items: {
							type: "string",
							minLength: 1,
							maxLength: 1000
						}
					}
				]
			}
		},
		anyOf: [
			{
				required: [
					"identifier"
				]
			},
			{
				required: [
					"name"
				]
			}
		],
		additionalProperties: false
	},
	webIriArray: {
		type: "array",
		minItems: 1,
		maxItems: 200,
		uniqueItems: true,
		items: {
			$ref: "#/$defs/webIri"
		}
	},
	webIriSet: {
		description: "One or more HTTP/HTTPS URLs.",
		oneOf: [
			{
				$ref: "#/$defs/webIri"
			},
			{
				type: "array",
				minItems: 1,
				maxItems: 200,
				uniqueItems: true,
				items: {
					$ref: "#/$defs/webIri"
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

declare const broV1Context: {
    readonly "@context": {
        readonly "@version": 1.1;
        readonly "@protected": true;
        readonly "@base": "https://schema.slat.or.kr/bro/v1.0/instances/";
        readonly schema: "https://schema.org/";
        readonly bro: "https://schema.slat.or.kr/bro/v1.0/vocab#";
        readonly xsd: "http://www.w3.org/2001/XMLSchema#";
        readonly rdfs: "http://www.w3.org/2000/01/rdf-schema#";
        readonly prov: "http://www.w3.org/ns/prov#";
        readonly dc: "http://purl.org/dc/elements/1.1/";
        readonly dcterms: "http://purl.org/dc/terms/";
        readonly bibo: "http://purl.org/ontology/bibo/";
        readonly nlon: "http://lod.nl.go.kr/ontology/";
        readonly Reaction: "bro:Reaction";
        readonly ReactionAbstract: "bro:ReactionAbstract";
        readonly ReactionList: "bro:ReactionList";
        readonly Person: "schema:Person";
        readonly Organization: "schema:Organization";
        readonly SoftwareApplication: "schema:SoftwareApplication";
        readonly UnknownAgent: "bro:UnknownAgent";
        readonly Role: "schema:Role";
        readonly PropertyValue: "schema:PropertyValue";
        readonly Book: "schema:Book";
        readonly Article: "schema:Article";
        readonly ScholarlyArticle: "schema:ScholarlyArticle";
        readonly WebPage: "schema:WebPage";
        readonly Dataset: "schema:Dataset";
        readonly CreativeWork: "schema:CreativeWork";
        readonly reactionType: {
            readonly "@id": "bro:reactionType";
            readonly "@type": "@vocab";
        };
        readonly Response: "bro:Response";
        readonly Listing: "bro:Listing";
        readonly Unspecified: "bro:Unspecified";
        readonly name: "schema:name";
        readonly byline: "bro:byline";
        readonly text: "schema:text";
        readonly textFormat: "schema:encodingFormat";
        readonly creator: {
            readonly "@id": "schema:creator";
            readonly "@container": "@set";
        };
        readonly creatorName: "schema:creator";
        readonly publisherName: "schema:publisher";
        readonly bookEdition: "schema:bookEdition";
        readonly roleName: "schema:roleName";
        readonly agent: "schema:agent";
        readonly identifier: {
            readonly "@id": "schema:identifier";
            readonly "@container": "@set";
        };
        readonly about: {
            readonly "@id": "schema:about";
            readonly "@container": "@set";
        };
        readonly isBasedOn: {
            readonly "@id": "schema:isBasedOn";
            readonly "@container": "@set";
        };
        readonly itemListElement: {
            readonly "@id": "schema:itemListElement";
            readonly "@container": "@list";
        };
        readonly keywords: {
            readonly "@id": "schema:keywords";
            readonly "@container": "@set";
        };
        readonly image: {
            readonly "@id": "schema:image";
            readonly "@type": "@id";
            readonly "@container": "@set";
        };
        readonly citation: {
            readonly "@id": "schema:citation";
            readonly "@type": "@id";
            readonly "@container": "@set";
        };
        readonly inLanguage: {
            readonly "@id": "schema:inLanguage";
            readonly "@container": "@set";
        };
        readonly license: {
            readonly "@id": "schema:license";
            readonly "@type": "@id";
        };
        readonly dateCreated: {
            readonly "@id": "schema:dateCreated";
            readonly "@type": "xsd:dateTime";
        };
        readonly dateModified: {
            readonly "@id": "schema:dateModified";
            readonly "@type": "xsd:dateTime";
        };
        readonly datePublished: "schema:datePublished";
        readonly startDate: {
            readonly "@id": "schema:startDate";
            readonly "@type": "xsd:date";
        };
        readonly endDate: {
            readonly "@id": "schema:endDate";
            readonly "@type": "xsd:date";
        };
        readonly softwareVersion: "schema:softwareVersion";
        readonly additionalProperty: {
            readonly "@id": "schema:additionalProperty";
            readonly "@container": "@set";
        };
        readonly value: "schema:value";
        readonly valueReference: {
            readonly "@id": "schema:valueReference";
            readonly "@type": "@id";
        };
        readonly propertyID: "schema:propertyID";
        readonly unitCode: "schema:unitCode";
        readonly unitText: "schema:unitText";
        readonly bibliographicLevel: {
            readonly "@id": "bro:bibliographicLevel";
            readonly "@type": "@vocab";
        };
        readonly Work: "bro:WorkLevel";
        readonly Edition: "bro:EditionLevel";
        readonly Item: "bro:ItemLevel";
        readonly "@vocab": "https://schema.org/";
        readonly Chapter: "schema:Chapter";
        readonly Periodical: "schema:Periodical";
        readonly Collection: "schema:Collection";
        readonly Report: "schema:Report";
        readonly url: {
            readonly "@id": "schema:url";
            readonly "@type": "@id";
            readonly "@container": "@set";
        };
        readonly exampleOfWork: {
            readonly "@id": "schema:exampleOfWork";
        };
    };
};

declare const broV1VocabTurtle = "@prefix bro:    <https://schema.slat.or.kr/bro/v1.0/vocab#> .\n@prefix schema: <https://schema.org/> .\n@prefix rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .\n\nbro:Reaction         a rdfs:Class ; rdfs:subClassOf schema:CreativeWork .\nbro:ReactionAbstract a rdfs:Class ; rdfs:subClassOf schema:CreativeWork .\nbro:ReactionList     a rdfs:Class ; rdfs:subClassOf schema:ItemList .\nbro:UnknownAgent     a rdfs:Class ; rdfs:subClassOf schema:Agent ;\n                     rdfs:comment \"Explicit declaration that the publisher cannot identify the agent. Each instance is a fresh blank node by design; no global singleton.\" .\n\nbro:reactionType a rdf:Property ; rdfs:subPropertyOf schema:additionalType .\nbro:Response     a bro:ReactionType .\nbro:Listing      a bro:ReactionType .\nbro:Unspecified  a bro:ReactionType .\n\nbro:byline a rdf:Property ; rdfs:subPropertyOf schema:creditText .\nbro:bibliographicLevel a rdf:Property ; rdfs:subPropertyOf schema:additionalType .\nbro:WorkLevel          a bro:BibliographicLevel .\nbro:EditionLevel       a bro:BibliographicLevel .\nbro:ItemLevel          a bro:BibliographicLevel .\n";

declare function normalizeUrnScheme(value: string): string;
declare function normalizePayload<T>(payload: T): T;
declare function cloneAndNormalizePayload<T>(payload: T): T;

declare const BRO_CONTEXT_IRI$1: "https://schema.slat.or.kr/bro/v1.0/context.jsonld";
type BroContext = typeof BRO_CONTEXT_IRI$1 | readonly [typeof BRO_CONTEXT_IRI$1, ...Array<string | Record<string, unknown>>];
type EntityIri = `urn:uuid:${string}` | `https://${string}`;
type WebIri = `http://${string}` | `https://${string}`;
type AgentIri = EntityIri | `mailto:${string}`;
type Rfc3339DateTime = string;
type Rfc3339Date = string;
type BibliographicDate = Rfc3339DateTime | Rfc3339Date | string;
type LanguageTag = string;
type TextFormat = string;
type BoundedJsonValue = string | number | boolean | null | readonly unknown[] | Record<string, unknown>;
type ReactionType = "Response" | "Listing" | "Unspecified";
type BroEntityType = "Reaction" | "ReactionAbstract" | "ReactionList";
type BibliographicLevel = "Work" | "Edition" | "Item" | "Unspecified";
type WorkType = "CreativeWork" | "Book" | "Article" | "ScholarlyArticle" | "WebPage" | "Chapter" | "Periodical" | "Collection" | "Dataset" | "Report" | (string & {});
interface IdentifierPropertyValue {
    readonly "@type": "PropertyValue";
    name?: string;
    propertyID?: string;
    value: string | number;
    valueReference?: string;
}
type IdentifierValue = string | IdentifierPropertyValue;
type IdentifierSet = IdentifierValue | readonly [IdentifierValue, ...IdentifierValue[]];
interface PropertyValue {
    readonly "@type": "PropertyValue";
    name: string;
    propertyID?: string;
    value: BoundedJsonValue;
    valueReference?: string;
    unitCode?: string;
    unitText?: string;
}
type AdditionalPropertyArray = PropertyValue[];
interface WorkIdentityReference {
    readonly "@type": "CreativeWork";
    identifier?: IdentifierSet;
    name?: string;
    creatorName?: string | readonly [string, ...string[]];
}
interface WorkReference {
    readonly "@type": WorkType;
    identifier?: IdentifierSet;
    name?: string;
    creatorName?: string | readonly [string, ...string[]];
    publisherName?: string;
    datePublished?: BibliographicDate;
    bookEdition?: string;
    inLanguage?: readonly [LanguageTag, ...LanguageTag[]];
    keywords?: string[];
    image?: string[];
    additionalProperty?: AdditionalPropertyArray;
    bibliographicLevel?: BibliographicLevel;
    url?: WebIri | readonly [WebIri, ...WebIri[]];
    exampleOfWork?: WorkIdentityReference;
}
interface BroReference {
    readonly "@id": EntityIri;
    readonly "@type"?: "Reaction" | "ReactionAbstract";
}
interface ListEntityReference {
    readonly "@id": EntityIri;
    readonly "@type"?: "Reaction" | "ReactionAbstract";
}
interface BasedOnEntityReference {
    readonly "@id": EntityIri;
    readonly "@type"?: BroEntityType;
}
type TargetReference = WorkReference | BroReference;
type ListElement = WorkReference | ListEntityReference;
type BasedOnReference = WorkReference | BasedOnEntityReference;
interface AgentPerson {
    readonly "@type": "Person";
    readonly "@id"?: AgentIri;
    name: string;
}
interface AgentUnknown {
    readonly "@type": "UnknownAgent";
    name?: string;
}
interface AgentOrganization {
    readonly "@type": "Organization";
    readonly "@id"?: `urn:uuid:${string}` | WebIri;
    name: string;
}
interface AgentSoftware {
    readonly "@type": "SoftwareApplication";
    readonly "@id": `https://${string}`;
    name: string;
    softwareVersion?: string;
}
type AgentInRole = AgentPerson | AgentUnknown | AgentOrganization | AgentSoftware;
interface AgentRole {
    readonly "@type": "Role";
    roleName?: string;
    startDate?: Rfc3339Date;
    endDate?: Rfc3339Date;
    agent: AgentInRole;
}
type Agent = AgentInRole | AgentRole;
type CreatorRoot = Agent;
interface BroBase {
    readonly "@context": BroContext;
    readonly "@id": EntityIri;
    name?: string;
    byline?: string;
    creator: [Agent, ...Agent[]];
    dateCreated: Rfc3339DateTime;
    dateModified?: Rfc3339DateTime;
    datePublished?: Rfc3339DateTime;
    license?: `https://${string}`;
    inLanguage?: [LanguageTag, ...LanguageTag[]];
    keywords?: string[];
    image?: string[];
    citation?: string[];
    additionalProperty?: AdditionalPropertyArray;
    [extensionKey: `${Lowercase<string>}:${string}`]: unknown;
}
interface Reaction extends BroBase {
    readonly "@type": "Reaction";
    reactionType: ReactionType;
    about: [TargetReference, ...TargetReference[]];
    text: string;
    textFormat?: TextFormat;
}
interface ReactionAbstract extends BroBase {
    readonly "@type": "ReactionAbstract";
    text: string;
    textFormat?: TextFormat;
    isBasedOn: [BasedOnReference, ...BasedOnReference[]];
}
interface ReactionList extends BroBase {
    readonly "@type": "ReactionList";
    itemListElement: ListElement[];
}
type BibliographicReactionObjectBROV10 = Reaction | ReactionAbstract | ReactionList;
type BroPayload = BibliographicReactionObjectBROV10;
type BroReaction = Reaction;
type BroReactionAbstract = ReactionAbstract;
type BroReactionList = ReactionList;
/**
 * Compatibility aliases for earlier public API names.
 * New code should use Reaction, ReactionAbstract, ReactionList, and WorkReference.
 */
type ExternalReference = WorkReference;
type ElementReference = ListEntityReference;
type AgentGovernment = AgentOrganization;
type AgentCorporation = AgentOrganization;
type BroArticle = Reaction;
type BroAbstract = ReactionAbstract;
type BroItemList = ReactionList;
interface BroValidationError {
    location: string;
    keyword?: string;
    message: string;
    error?: string;
    instanceLocation?: string;
}
interface BroValidationResult<T = unknown> {
    valid: boolean;
    errors: BroValidationError[];
    normalizedPayload?: T;
}

declare const BRO_CONTEXT_IRI: "https://schema.slat.or.kr/bro/v1.0/context.jsonld";
declare const BRO_SCHEMA_IRI: "https://schema.slat.or.kr/bro/v1.0/schema.json";
declare const BRO_VOCAB_IRI: "https://schema.slat.or.kr/bro/v1.0/vocab#";
declare const BRO_ENTITY_TYPES: readonly ["Reaction", "ReactionAbstract", "ReactionList"];
declare const REACTION_TYPES: readonly ["Response", "Listing", "Unspecified"];
declare const AGENT_TYPES: readonly ["Person", "UnknownAgent", "Organization", "SoftwareApplication", "Role"];
type AgentType = (typeof AGENT_TYPES)[number];
type CreatorType = AgentType;
type Creator = Agent;
type CreatorPerson = AgentPerson;
type CreatorUnknown = AgentUnknown;
type CreatorAnonymous = AgentUnknown;
type CreatorGovernment = AgentGovernment;
type CreatorCorporation = AgentCorporation;
type CreatorOrganization = AgentOrganization;
type CreatorSoftware = AgentSoftware;
type CreatorRole = AgentRole;
declare function isBroPayload(value: unknown): value is BroPayload;
declare function isReaction(value: unknown): value is BroReaction;
declare function isReactionAbstract(value: unknown): value is BroReactionAbstract;
declare function isReactionList(value: unknown): value is BroReactionList;

interface ValidateBroOptions {
    normalize?: boolean;
    mutate?: boolean;
    includeNormalizedPayload?: boolean;
}
declare function validateBroSchema<T = BibliographicReactionObjectBROV10>(data: unknown, options?: ValidateBroOptions): BroValidationResult<T>;
declare function assertBroSchema(data: unknown, options?: ValidateBroOptions): asserts data is BibliographicReactionObjectBROV10;

interface BibframeContribution {
    "@type": "bf:Contribution";
    "bf:agent": {
        "@type": string;
        "@id"?: string;
        "rdfs:label": string;
    };
    "bf:role"?: {
        "@type": "bf:Role";
        "rdfs:label": string;
    };
}
interface BibframeIdentifier {
    "@type": "bf:Identifier";
    "rdf:value": string;
}
interface BibframeInstance {
    "@type": "bf:Instance";
    "bf:identifiedBy"?: BibframeIdentifier | BibframeIdentifier[];
    "bf:instanceOf"?: {
        "@id": string;
        "@type": string;
    };
    "rdfs:label"?: string;
}
interface BibframeNote {
    "@type": "bf:Note";
    "rdfs:label": string;
}
interface BibframeWork {
    "@context": {
        bf: string;
        rdf: string;
        rdfs: string;
        schema: string;
        bro: string;
    };
    "@type": string[];
    "@id": string;
    "bf:originDate": string;
    "bf:changeDate"?: string;
    "bf:contribution": BibframeContribution[];
    "bf:title"?: {
        "@type": "bf:Title";
        "bf:mainTitle": string;
    };
    "bf:note"?: BibframeNote;
    [key: string]: unknown;
}
declare function convertBroToBibframe(payload: BibliographicReactionObjectBROV10): BibframeWork;

declare function renderBroToMarkdown(payload: BibliographicReactionObjectBROV10): string;

interface KomarcSubfield {
    code: string;
    value: string;
}
interface KomarcDataField {
    tag: string;
    indicator1: string;
    indicator2: string;
    subfields: KomarcSubfield[];
}
interface KomarcControlField {
    tag: string;
    value: string;
}
interface KomarcRecord {
    controlFields: KomarcControlField[];
    dataFields: KomarcDataField[];
}
declare function convertBroToKomarc(payload: BibliographicReactionObjectBROV10): KomarcRecord | KomarcRecord[];

export { AGENT_TYPES, type AdditionalPropertyArray, type Agent, type AgentCorporation, type AgentGovernment, type AgentInRole, type AgentIri, type AgentOrganization, type AgentPerson, type AgentRole, type AgentSoftware, type AgentType, type AgentUnknown, BRO_CONTEXT_IRI, BRO_ENTITY_TYPES, BRO_SCHEMA_IRI, BRO_VOCAB_IRI, type BasedOnEntityReference, type BasedOnReference, type BibframeContribution, type BibframeIdentifier, type BibframeInstance, type BibframeNote, type BibframeWork, type BibliographicDate, type BibliographicLevel, type BibliographicReactionObjectBROV10, type BoundedJsonValue, type BroAbstract, type BroArticle, type BroBase, type BroContext, type BroEntityType, type BroItemList, type BroPayload, type BroReaction, type BroReactionAbstract, type BroReactionList, type BroReference, broV1Context as BroV1Context, broV1Schema as BroV1Schema, broV1VocabTurtle as BroV1VocabTurtle, type BroValidationError, type BroValidationResult, AGENT_TYPES as CREATOR_TYPES, type Creator, type CreatorAnonymous, type CreatorCorporation, type CreatorGovernment, type CreatorOrganization, type CreatorPerson, type CreatorRole, type CreatorRoot, type CreatorSoftware, type CreatorType, type CreatorUnknown, type ElementReference, type EntityIri, type ExternalReference, type IdentifierPropertyValue, type IdentifierSet, type IdentifierValue, type KomarcControlField, type KomarcDataField, type KomarcRecord, type KomarcSubfield, type LanguageTag, type ListElement, type ListEntityReference, type PropertyValue, REACTION_TYPES, type Reaction, type ReactionAbstract, type ReactionList, type ReactionType, type Rfc3339Date, type Rfc3339DateTime, type TargetReference, type TextFormat, type WebIri, type WorkIdentityReference, type WorkReference, type WorkType, assertBroSchema, broV1Schema, cloneAndNormalizePayload, convertBroToBibframe, convertBroToKomarc, isBroPayload, isReaction, isReactionAbstract, isReactionList, normalizePayload, normalizeUrnScheme, renderBroToMarkdown, validateBroSchema };
