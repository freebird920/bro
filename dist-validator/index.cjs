"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/validator/index.ts
var index_exports = {};
__export(index_exports, {
  AGENT_TYPES: () => AGENT_TYPES,
  BRO_CONTEXT_IRI: () => BRO_CONTEXT_IRI,
  BRO_SCHEMA_IRI: () => BRO_SCHEMA_IRI,
  BRO_VOCAB_IRI: () => BRO_VOCAB_IRI,
  CREATOR_TYPES: () => AGENT_TYPES,
  REACTION_TYPES: () => REACTION_TYPES,
  assertBroSchema: () => assertBroSchema,
  broV1Schema: () => bro_v1_schema_default,
  cloneAndNormalizePayload: () => cloneAndNormalizePayload,
  normalizePayload: () => normalizePayload,
  normalizeUrnScheme: () => normalizeUrnScheme,
  validateBroSchema: () => validateBroSchema
});
module.exports = __toCommonJS(index_exports);
var import_json_schema = require("@cfworker/json-schema");

// worker/assets/bro-v1-schema.json
var bro_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schema.slat.or.kr/bro/v1.0/schema.json",
  title: "Bibliographic Reaction Object (BRO) v1.0",
  description: "JSON Schema for exchanging bibliographic reaction data: recommendation lists, review lists, reading lists, curation notes, reviews, comments, and summaries. The schema keeps the ordinary input model simple while remaining compatible with JSON-LD and bibliographic metadata ecosystems.",
  type: "object",
  oneOf: [
    {
      $ref: "#/$defs/Reaction"
    },
    {
      $ref: "#/$defs/ReactionAbstract"
    },
    {
      $ref: "#/$defs/ReactionList"
    }
  ],
  $defs: {
    contextRef: {
      description: "MUST be the BRO v1.0 context IRI. Extension contexts MAY be appended after the BRO context.",
      oneOf: [
        {
          const: "https://schema.slat.or.kr/bro/v1.0/context.jsonld"
        },
        {
          type: "array",
          minItems: 1,
          prefixItems: [
            {
              const: "https://schema.slat.or.kr/bro/v1.0/context.jsonld"
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
      pattern: '^https://(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}(?::[0-9]{1,5})?(?:/[^\\s<>"\\\\^`{|}]*)?$',
      maxLength: 2048
    },
    httpIri: {
      type: "string",
      description: "HTTP IRI. Allowed for external bibliographic/LOD identifiers such as legacy linked-data resource URIs, but not for BRO entity @id.",
      pattern: '^http://(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}(?::[0-9]{1,5})?(?:/[^\\s<>"\\\\^`{|}]*)?$',
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
      maxLength: 2e3
    },
    longText: {
      type: "string",
      minLength: 1,
      maxLength: 1e4
    },
    bylineString: {
      type: "string",
      description: "Original attribution display string as it appeared in the source.",
      minLength: 1,
      maxLength: 2e3
    },
    bodyText: {
      type: "string",
      description: "Body text. It MUST NOT begin with a YAML/TOML front-matter block.",
      minLength: 0,
      maxLength: 3e5,
      not: {
        pattern: "^(?:---|\\+\\+\\+)\\s*(?:\\r?\\n|$)"
      }
    },
    textFormat: {
      type: "string",
      description: "MIME type hint. Absent means text/plain.",
      pattern: '^[a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]{0,126}/[a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]{0,126}(?:\\s*;\\s*[a-zA-Z0-9!#$&^_.+-]+=(?:[a-zA-Z0-9!#$&^_.+-]+|"[^"]*"))*$',
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
          const: "PropertyValue"
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
          const: "Person"
        },
        "@id": {
          $ref: "#/$defs/agentIri"
        },
        name: {
          type: "string",
          minLength: 1,
          maxLength: 1e3
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
          const: "Organization"
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
          maxLength: 1e3
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
          const: "SoftwareApplication"
        },
        "@id": {
          $ref: "#/$defs/httpsIri"
        },
        name: {
          type: "string",
          minLength: 1,
          maxLength: 1e3
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
          const: "UnknownAgent"
        },
        name: {
          type: "string",
          minLength: 1,
          maxLength: 1e3
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
          const: "Role"
        },
        roleName: {
          type: "string",
          minLength: 1,
          maxLength: 1e3
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
          maxLength: 1e4
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
          const: "PropertyValue"
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
          maxLength: 1e4
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
              maxLength: 2e3
            },
            {
              type: "array",
              minItems: 1,
              maxItems: 50,
              uniqueItems: true,
              items: {
                type: "string",
                minLength: 1,
                maxLength: 1e3
              }
            }
          ]
        },
        publisherName: {
          type: "string",
          minLength: 1,
          maxLength: 1e3
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
          enum: [
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
      enum: [
        "Response",
        "Listing",
        "Unspecified"
      ],
      default: "Unspecified",
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
          const: "Reaction"
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
          if: {
            properties: {
              reactionType: {
                const: "Response"
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
          const: "ReactionAbstract"
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
          const: "ReactionList"
        },
        itemListElement: {
          type: "array",
          minItems: 0,
          maxItems: 1e4,
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
      enum: [
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
          enum: [
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
          enum: [
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
          const: "CreativeWork"
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
              maxLength: 2e3
            },
            {
              type: "array",
              minItems: 1,
              maxItems: 50,
              uniqueItems: true,
              items: {
                type: "string",
                minLength: 1,
                maxLength: 1e3
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
  }
};

// src/lib/normalize.ts
var IDENTIFIER_KEYS = /* @__PURE__ */ new Set(["@id", "identifier", "license", "propertyID", "valueReference"]);
var URI_SCHEME_NORMALIZERS = [
  [/^urn:uuid:/i, "urn:uuid:"],
  [/^urn:isbn:/i, "urn:isbn:"],
  [/^mailto:/i, "mailto:"],
  [/^https:\/\/doi\.org\//i, "https://doi.org/"],
  [/^https:\/\/orcid\.org\//i, "https://orcid.org/"]
];
function normalizeIdentifier(value) {
  for (const [pattern, canonicalPrefix] of URI_SCHEME_NORMALIZERS) {
    const match = value.match(pattern);
    if (match) {
      return canonicalPrefix + value.slice(match[0].length);
    }
  }
  return value;
}
function normalizeUrnScheme(value) {
  return normalizeIdentifier(value);
}
function normalizePayload(payload) {
  if (payload === null || payload === void 0) return payload;
  if (Array.isArray(payload)) {
    for (let index = 0; index < payload.length; index += 1) {
      payload[index] = normalizePayload(payload[index]);
    }
    return payload;
  }
  if (typeof payload === "object") {
    const objectPayload = payload;
    for (const key of Object.keys(objectPayload)) {
      const value = objectPayload[key];
      if (IDENTIFIER_KEYS.has(key) && typeof value === "string") {
        objectPayload[key] = normalizeIdentifier(value);
      } else if (value && typeof value === "object") {
        normalizePayload(value);
      }
    }
  }
  return payload;
}
function cloneAndNormalizePayload(payload) {
  const cloned = typeof structuredClone === "function" ? structuredClone(payload) : JSON.parse(JSON.stringify(payload));
  return normalizePayload(cloned);
}

// src/lib/bro-types.ts
var BRO_CONTEXT_IRI = "https://schema.slat.or.kr/bro/v1.0/context.jsonld";
var BRO_SCHEMA_IRI = "https://schema.slat.or.kr/bro/v1.0/schema.json";
var BRO_VOCAB_IRI = "https://schema.slat.or.kr/bro/v1.0/vocab#";
var REACTION_TYPES = [
  "Response",
  "Listing",
  "Unspecified"
];
var AGENT_TYPES = [
  "Person",
  "UnknownAgent",
  "Organization",
  "SoftwareApplication",
  "Role"
];

// src/validator/index.ts
var validator = new import_json_schema.Validator(bro_v1_schema_default, "2020-12", false);
function getTextPayload(value) {
  if (!value || typeof value !== "object") return null;
  const record = value;
  return typeof record.text === "string" ? record.text : null;
}
function hasForbiddenFrontMatter(text) {
  const withoutBom = text.replace(/^\uFEFF/, "");
  return /^(---|\+\+\+)\s*(?:\r?\n|$)/.test(withoutBom);
}
function collectApplicationErrors(payload) {
  const errors = [];
  const text = getTextPayload(payload);
  if (text !== null && hasForbiddenFrontMatter(text)) {
    errors.push({
      location: "/text",
      instanceLocation: "/text",
      keyword: "bro-no-frontmatter",
      message: "BRO text MUST NOT begin with a YAML/TOML front-matter block.",
      error: "BRO text MUST NOT begin with a YAML/TOML front-matter block."
    });
  }
  return errors;
}
function normalizeSchemaError(error) {
  const record = error;
  const location = typeof record.instanceLocation === "string" ? record.instanceLocation : typeof record.location === "string" ? record.location : "/";
  const message = typeof record.error === "string" ? record.error : typeof record.message === "string" ? record.message : "Schema validation failed.";
  return {
    location,
    instanceLocation: location,
    keyword: typeof record.keyword === "string" ? record.keyword : void 0,
    message,
    error: message
  };
}
function validateBroSchema(data, options = {}) {
  const shouldNormalize = options.normalize !== false;
  const payload = shouldNormalize ? options.mutate ? normalizePayload(data) : cloneAndNormalizePayload(data) : data;
  const result = validator.validate(payload);
  const schemaErrors = result.valid ? [] : result.errors.map(normalizeSchemaError);
  const applicationErrors = result.valid ? collectApplicationErrors(payload) : [];
  const errors = [...schemaErrors, ...applicationErrors];
  return {
    valid: errors.length === 0,
    errors,
    ...options.includeNormalizedPayload ? { normalizedPayload: payload } : {}
  };
}
function assertBroSchema(data, options = {}) {
  const result = validateBroSchema(data, options);
  if (!result.valid) {
    const first = result.errors[0];
    throw new Error(first ? `${first.location}: ${first.message}` : "Invalid BRO payload.");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AGENT_TYPES,
  BRO_CONTEXT_IRI,
  BRO_SCHEMA_IRI,
  BRO_VOCAB_IRI,
  CREATOR_TYPES,
  REACTION_TYPES,
  assertBroSchema,
  broV1Schema,
  cloneAndNormalizePayload,
  normalizePayload,
  normalizeUrnScheme,
  validateBroSchema
});
