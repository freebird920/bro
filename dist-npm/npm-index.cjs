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

// src/npm-index.ts
var npm_index_exports = {};
__export(npm_index_exports, {
  AGENT_TYPES: () => AGENT_TYPES,
  BRO_CONTEXT_IRI: () => BRO_CONTEXT_IRI,
  BRO_ENTITY_TYPES: () => BRO_ENTITY_TYPES,
  BRO_SCHEMA_IRI: () => BRO_SCHEMA_IRI,
  BRO_VOCAB_IRI: () => BRO_VOCAB_IRI,
  BroV1Context: () => broV1Context,
  BroV1Schema: () => bro_v1_schema_default,
  BroV1VocabTurtle: () => broV1VocabTurtle,
  CREATOR_TYPES: () => AGENT_TYPES,
  REACTION_TYPES: () => REACTION_TYPES,
  assertBroSchema: () => assertBroSchema,
  broV1Schema: () => bro_v1_schema_default,
  cloneAndNormalizePayload: () => cloneAndNormalizePayload,
  convertBroToBibframe: () => convertBroToBibframe,
  convertBroToKomarc: () => convertBroToKomarc,
  isBroPayload: () => isBroPayload,
  isReaction: () => isReaction,
  isReactionAbstract: () => isReactionAbstract,
  isReactionList: () => isReactionList,
  normalizePayload: () => normalizePayload,
  normalizeUrnScheme: () => normalizeUrnScheme,
  renderBroToMarkdown: () => renderBroToMarkdown,
  validateBroSchema: () => validateBroSchema
});
module.exports = __toCommonJS(npm_index_exports);

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

// src/lib/bro-context.ts
var broV1Context = {
  "@context": {
    "@version": 1.1,
    "@protected": true,
    "@base": "https://schema.slat.or.kr/bro/v1.0/instances/",
    "schema": "https://schema.org/",
    "bro": "https://schema.slat.or.kr/bro/v1.0/vocab#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "prov": "http://www.w3.org/ns/prov#",
    "dc": "http://purl.org/dc/elements/1.1/",
    "dcterms": "http://purl.org/dc/terms/",
    "bibo": "http://purl.org/ontology/bibo/",
    "nlon": "http://lod.nl.go.kr/ontology/",
    "Reaction": "bro:Reaction",
    "ReactionAbstract": "bro:ReactionAbstract",
    "ReactionList": "bro:ReactionList",
    "Person": "schema:Person",
    "Organization": "schema:Organization",
    "SoftwareApplication": "schema:SoftwareApplication",
    "UnknownAgent": "bro:UnknownAgent",
    "Role": "schema:Role",
    "PropertyValue": "schema:PropertyValue",
    "Book": "schema:Book",
    "Article": "schema:Article",
    "ScholarlyArticle": "schema:ScholarlyArticle",
    "WebPage": "schema:WebPage",
    "Dataset": "schema:Dataset",
    "CreativeWork": "schema:CreativeWork",
    "reactionType": {
      "@id": "bro:reactionType",
      "@type": "@vocab"
    },
    "Response": "bro:Response",
    "Listing": "bro:Listing",
    "Unspecified": "bro:Unspecified",
    "name": "schema:name",
    "byline": "bro:byline",
    "text": "schema:text",
    "textFormat": "schema:encodingFormat",
    "creator": {
      "@id": "schema:creator",
      "@container": "@set"
    },
    "creatorName": "schema:creator",
    "publisherName": "schema:publisher",
    "bookEdition": "schema:bookEdition",
    "roleName": "schema:roleName",
    "agent": "schema:agent",
    "identifier": {
      "@id": "schema:identifier",
      "@container": "@set"
    },
    "about": {
      "@id": "schema:about",
      "@container": "@set"
    },
    "isBasedOn": {
      "@id": "schema:isBasedOn",
      "@container": "@set"
    },
    "itemListElement": {
      "@id": "schema:itemListElement",
      "@container": "@list"
    },
    "keywords": {
      "@id": "schema:keywords",
      "@container": "@set"
    },
    "image": {
      "@id": "schema:image",
      "@type": "@id",
      "@container": "@set"
    },
    "citation": {
      "@id": "schema:citation",
      "@type": "@id",
      "@container": "@set"
    },
    "inLanguage": {
      "@id": "schema:inLanguage",
      "@container": "@set"
    },
    "license": {
      "@id": "schema:license",
      "@type": "@id"
    },
    "dateCreated": {
      "@id": "schema:dateCreated",
      "@type": "xsd:dateTime"
    },
    "dateModified": {
      "@id": "schema:dateModified",
      "@type": "xsd:dateTime"
    },
    "datePublished": "schema:datePublished",
    "startDate": {
      "@id": "schema:startDate",
      "@type": "xsd:date"
    },
    "endDate": {
      "@id": "schema:endDate",
      "@type": "xsd:date"
    },
    "softwareVersion": "schema:softwareVersion",
    "additionalProperty": {
      "@id": "schema:additionalProperty",
      "@container": "@set"
    },
    "value": "schema:value",
    "valueReference": {
      "@id": "schema:valueReference",
      "@type": "@id"
    },
    "propertyID": "schema:propertyID",
    "unitCode": "schema:unitCode",
    "unitText": "schema:unitText",
    "bibliographicLevel": {
      "@id": "bro:bibliographicLevel",
      "@type": "@vocab"
    },
    "Work": "bro:WorkLevel",
    "Edition": "bro:EditionLevel",
    "Item": "bro:ItemLevel",
    "@vocab": "https://schema.org/",
    "Chapter": "schema:Chapter",
    "Periodical": "schema:Periodical",
    "Collection": "schema:Collection",
    "Report": "schema:Report",
    "url": {
      "@id": "schema:url",
      "@type": "@id",
      "@container": "@set"
    },
    "exampleOfWork": {
      "@id": "schema:exampleOfWork"
    }
  }
};

// src/lib/bro-vocab.ts
var broV1VocabTurtle = '@prefix bro:    <https://schema.slat.or.kr/bro/v1.0/vocab#> .\n@prefix schema: <https://schema.org/> .\n@prefix rdf:    <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .\n\nbro:Reaction         a rdfs:Class ; rdfs:subClassOf schema:CreativeWork .\nbro:ReactionAbstract a rdfs:Class ; rdfs:subClassOf schema:CreativeWork .\nbro:ReactionList     a rdfs:Class ; rdfs:subClassOf schema:ItemList .\nbro:UnknownAgent     a rdfs:Class ; rdfs:subClassOf schema:Agent ;\n                     rdfs:comment "Explicit declaration that the publisher cannot identify the agent. Each instance is a fresh blank node by design; no global singleton." .\n\nbro:reactionType a rdf:Property ; rdfs:subPropertyOf schema:additionalType .\nbro:Response     a bro:ReactionType .\nbro:Listing      a bro:ReactionType .\nbro:Unspecified  a bro:ReactionType .\n\nbro:byline a rdf:Property ; rdfs:subPropertyOf schema:creditText .\nbro:bibliographicLevel a rdf:Property ; rdfs:subPropertyOf schema:additionalType .\nbro:WorkLevel          a bro:BibliographicLevel .\nbro:EditionLevel       a bro:BibliographicLevel .\nbro:ItemLevel          a bro:BibliographicLevel .\n';

// src/validator/index.ts
var import_json_schema = require("@cfworker/json-schema");

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
var BRO_ENTITY_TYPES = [
  "Reaction",
  "ReactionAbstract",
  "ReactionList"
];
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
function isBroPayload(value) {
  if (!value || typeof value !== "object") return false;
  const type = value["@type"];
  return type === "Reaction" || type === "ReactionAbstract" || type === "ReactionList";
}
function isReaction(value) {
  return isBroPayload(value) && value["@type"] === "Reaction";
}
function isReactionAbstract(value) {
  return isBroPayload(value) && value["@type"] === "ReactionAbstract";
}
function isReactionList(value) {
  return isBroPayload(value) && value["@type"] === "ReactionList";
}

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

// src/lib/bibframe-converter.ts
function agentLabel(agent) {
  if (agent["@type"] === "Role") return agent.roleName || agentLabel(agent.agent);
  if ("name" in agent && agent.name) return agent.name;
  return "Unknown agent";
}
function agentType(agent) {
  const concreteAgent = agent["@type"] === "Role" ? agent.agent : agent;
  switch (concreteAgent["@type"]) {
    case "Person":
    case "UnknownAgent":
      return "bf:Person";
    case "Organization":
      return "bf:Organization";
    case "SoftwareApplication":
      return "bf:Agent";
    default:
      return "bf:Agent";
  }
}
function agentId(agent) {
  const concreteAgent = agent["@type"] === "Role" ? agent.agent : agent;
  return "@id" in concreteAgent ? concreteAgent["@id"] : void 0;
}
function contributionFromAgent(agent) {
  const contribution = {
    "@type": "bf:Contribution",
    "bf:agent": {
      "@type": agentType(agent),
      "rdfs:label": agentLabel(agent)
    }
  };
  const id = agentId(agent);
  if (id) contribution["bf:agent"]["@id"] = id;
  if (agent["@type"] === "Role" && agent.roleName) {
    contribution["bf:role"] = {
      "@type": "bf:Role",
      "rdfs:label": agent.roleName
    };
  }
  return contribution;
}
function isEntityReference(reference) {
  return "@id" in reference;
}
function identifierLabel(identifier) {
  if (typeof identifier === "string") return identifier;
  const authority = identifier.propertyID ?? identifier.name ?? "PropertyValue";
  return `${authority}:${String(identifier.value)}`;
}
function identifierValues(reference) {
  const identifier = reference.identifier;
  if (!identifier) return [];
  if (Array.isArray(identifier)) return identifier.map(identifierLabel);
  return [identifierLabel(identifier)];
}
function instanceFromWorkReference(reference) {
  const identifiers = identifierValues(reference);
  const instance = {
    "@type": "bf:Instance",
    ...reference.name ? { "rdfs:label": reference.name } : {},
    ...identifiers.length > 0 ? {
      "bf:identifiedBy": identifiers.map((identifier) => ({
        "@type": "bf:Identifier",
        "rdf:value": identifier
      }))
    } : {}
  };
  if (identifiers[0]) {
    instance["bf:instanceOf"] = {
      "@id": identifiers[0],
      "@type": `schema:${reference["@type"]}`
    };
  }
  return instance;
}
function instanceFromReference(reference) {
  if (isEntityReference(reference)) {
    return {
      "@type": "bf:Instance",
      "bf:instanceOf": {
        "@id": reference["@id"],
        "@type": reference["@type"] ? `bro:${reference["@type"]}` : "bf:Work"
      }
    };
  }
  return instanceFromWorkReference(reference);
}
function itemNodeFromReference(reference) {
  if (isEntityReference(reference)) {
    return {
      "@id": reference["@id"],
      "@type": reference["@type"] ? `bro:${reference["@type"]}` : "bf:Work"
    };
  }
  return {
    ...instanceFromWorkReference(reference),
    "@type": "bf:Instance"
  };
}
function convertBroToBibframe(payload) {
  const base = {
    "@context": {
      bf: "http://id.loc.gov/ontologies/bibframe/",
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      schema: "https://schema.org/",
      bro: "https://schema.slat.or.kr/bro/v1.0/vocab#"
    },
    "@type": ["bf:Work"],
    "@id": payload["@id"],
    "bf:originDate": payload.dateCreated,
    ...payload.dateModified ? { "bf:changeDate": payload.dateModified } : {},
    "bf:contribution": payload.creator.map(contributionFromAgent),
    ...payload.name ? {
      "bf:title": {
        "@type": "bf:Title",
        "bf:mainTitle": payload.name
      }
    } : {}
  };
  if (payload["@type"] === "Reaction") {
    return {
      ...base,
      "@type": ["bf:Work", "bf:Review", "bro:Reaction"],
      "bf:reviewOf": payload.about.map(instanceFromReference),
      "bro:reactionType": `bro:${payload.reactionType}`,
      "bf:note": {
        "@type": "bf:Note",
        "rdfs:label": payload.text
      }
    };
  }
  if (payload["@type"] === "ReactionAbstract") {
    return {
      ...base,
      "@type": ["bf:Work", "bf:Summary", "bro:ReactionAbstract"],
      "bf:summaryOf": payload.isBasedOn.map(instanceFromReference),
      "bf:note": {
        "@type": "bf:Note",
        "rdfs:label": payload.text
      }
    };
  }
  return {
    ...base,
    "@type": ["bf:Work", "bf:Collection", "bro:ReactionList"],
    "bf:hasItem": payload.itemListElement.map(itemNodeFromReference)
  };
}

// src/lib/markdown-renderer.ts
function yamlScalar(value) {
  if (value === null || value === void 0) return '""';
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  const text = String(value);
  if (text === "" || text.trim() !== text || /[:#[\]{}&*!|>'"%@`,\n]/.test(text)) {
    return JSON.stringify(text);
  }
  return text;
}
function yamlStringArray(key, values) {
  if (!values || values.length === 0) return [];
  return [key, ...values.map((value) => `  - ${yamlScalar(value)}`)];
}
function yamlValueArray(key, value) {
  if (!value) return [];
  if (!Array.isArray(value)) return [`${key} ${yamlScalar(value)}`];
  const indent = key.match(/^\s*/)?.[0] ?? "";
  return [key, ...value.map((item) => `${indent}  - ${yamlScalar(item)}`)];
}
function renderIdentifierValue(identifier, indent) {
  if (typeof identifier === "string") return [`${indent}- ${yamlScalar(identifier)}`];
  const lines = [`${indent}- type: ${yamlScalar(identifier["@type"])}`];
  if (identifier.name) lines.push(`${indent}  name: ${yamlScalar(identifier.name)}`);
  if (identifier.propertyID) lines.push(`${indent}  propertyID: ${yamlScalar(identifier.propertyID)}`);
  lines.push(`${indent}  value: ${yamlScalar(identifier.value)}`);
  if (identifier.valueReference) lines.push(`${indent}  valueReference: ${yamlScalar(identifier.valueReference)}`);
  return lines;
}
function renderIdentifierSet(reference, indent) {
  if (!reference.identifier) return [];
  const identifiers = Array.isArray(reference.identifier) ? reference.identifier : [reference.identifier];
  return [`${indent}identifier:`, ...identifiers.flatMap((identifier) => renderIdentifierValue(identifier, `${indent}  `))];
}
function renderWorkReference(reference, indent) {
  const lines = [`${indent}- type: ${yamlScalar(reference["@type"])}`];
  lines.push(...renderIdentifierSet(reference, `${indent}  `));
  if (reference.name) lines.push(`${indent}  name: ${yamlScalar(reference.name)}`);
  if (reference.creatorName) {
    lines.push(...yamlValueArray(`${indent}  creatorName:`, reference.creatorName));
  }
  if (reference.publisherName) lines.push(`${indent}  publisherName: ${yamlScalar(reference.publisherName)}`);
  if (reference.datePublished) lines.push(`${indent}  datePublished: ${yamlScalar(reference.datePublished)}`);
  if (reference.bookEdition) lines.push(`${indent}  bookEdition: ${yamlScalar(reference.bookEdition)}`);
  if (reference.bibliographicLevel) lines.push(`${indent}  bibliographicLevel: ${yamlScalar(reference.bibliographicLevel)}`);
  if (reference.url) lines.push(...yamlValueArray(`${indent}  url:`, reference.url));
  return lines;
}
function renderReferences(key, references) {
  if (!references || references.length === 0) return [];
  const lines = [`${key}:`];
  for (const reference of references) {
    if ("@id" in reference) {
      lines.push(`  - id: ${yamlScalar(reference["@id"])}`);
      if (reference["@type"]) lines.push(`    type: ${yamlScalar(reference["@type"])}`);
    } else {
      lines.push(...renderWorkReference(reference, "  "));
    }
  }
  return lines;
}
function renderAgent(agent, indent = "  ") {
  const lines = [`${indent}- type: ${yamlScalar(agent["@type"])}`];
  if ("name" in agent && agent.name) lines.push(`${indent}  name: ${yamlScalar(agent.name)}`);
  if ("@id" in agent && agent["@id"]) lines.push(`${indent}  id: ${yamlScalar(agent["@id"])}`);
  if (agent["@type"] === "SoftwareApplication" && agent.softwareVersion) {
    lines.push(`${indent}  softwareVersion: ${yamlScalar(agent.softwareVersion)}`);
  }
  if (agent["@type"] === "Role") {
    if (agent.roleName) lines.push(`${indent}  roleName: ${yamlScalar(agent.roleName)}`);
    if (agent.startDate) lines.push(`${indent}  startDate: ${yamlScalar(agent.startDate)}`);
    if (agent.endDate) lines.push(`${indent}  endDate: ${yamlScalar(agent.endDate)}`);
    lines.push(`${indent}  agent:`);
    const nested = renderAgent(agent.agent, `${indent}    `);
    lines.push(...nested.map((line) => line.replace(`${indent}    - `, `${indent}    `)));
  }
  return lines;
}
function renderCreators(creators) {
  return ["creator:", ...creators.flatMap((creator) => renderAgent(creator))];
}
function renderAdditionalProperty(properties) {
  if (!properties || properties.length === 0) return [];
  const lines = ["additionalProperty:"];
  for (const property of properties) {
    lines.push(`  - name: ${yamlScalar(property.name)}`);
    lines.push(`    value: ${yamlScalar(JSON.stringify(property.value))}`);
    if (property.propertyID) lines.push(`    propertyID: ${yamlScalar(property.propertyID)}`);
    if (property.valueReference) lines.push(`    valueReference: ${yamlScalar(property.valueReference)}`);
    if (property.unitCode) lines.push(`    unitCode: ${yamlScalar(property.unitCode)}`);
    if (property.unitText) lines.push(`    unitText: ${yamlScalar(property.unitText)}`);
  }
  return lines;
}
function renderBroToMarkdown(payload) {
  const frontmatter = [
    `id: ${yamlScalar(payload["@id"])}`,
    `type: ${yamlScalar(payload["@type"])}`,
    `dateCreated: ${yamlScalar(payload.dateCreated)}`
  ];
  if (payload.name) frontmatter.push(`name: ${yamlScalar(payload.name)}`);
  if (payload.byline) frontmatter.push(`byline: ${yamlScalar(payload.byline)}`);
  if (payload.dateModified) frontmatter.push(`dateModified: ${yamlScalar(payload.dateModified)}`);
  if (payload.license) frontmatter.push(`license: ${yamlScalar(payload.license)}`);
  if (payload["@type"] === "Reaction") {
    frontmatter.push(`reactionType: ${yamlScalar(payload.reactionType)}`);
    if (payload.datePublished) frontmatter.push(`datePublished: ${yamlScalar(payload.datePublished)}`);
    frontmatter.push(...renderReferences("about", payload.about));
  }
  if (payload["@type"] === "ReactionAbstract") {
    if (payload.datePublished) frontmatter.push(`datePublished: ${yamlScalar(payload.datePublished)}`);
    frontmatter.push(...renderReferences("isBasedOn", payload.isBasedOn));
  }
  if (payload["@type"] === "ReactionList") {
    frontmatter.push("itemListElement:");
    for (const element of payload.itemListElement) {
      if ("@id" in element) {
        frontmatter.push(`  - id: ${yamlScalar(element["@id"])}`);
        if (element["@type"]) frontmatter.push(`    type: ${yamlScalar(element["@type"])}`);
      } else {
        frontmatter.push(...renderWorkReference(element, "  "));
      }
    }
  }
  frontmatter.push(...renderCreators(payload.creator));
  frontmatter.push(...yamlStringArray("inLanguage:", payload.inLanguage));
  frontmatter.push(...yamlStringArray("keywords:", payload.keywords));
  if ("image" in payload) frontmatter.push(...yamlStringArray("image:", payload.image));
  if ("citation" in payload) frontmatter.push(...yamlStringArray("citation:", payload.citation));
  frontmatter.push(...renderAdditionalProperty(payload.additionalProperty));
  const metadata = `---
${frontmatter.join("\n")}
---`;
  const body = "text" in payload ? payload.text : "";
  return body ? `${metadata}

${body}` : metadata;
}

// src/lib/komarc-converter.ts
var BRO_SCHEMA_URI = "https://schema.slat.or.kr/bro/v1.0/schema.json";
function yyyymmdd(dateTime) {
  return dateTime.slice(0, 10).replace(/-/g, "");
}
function isEntityReference2(reference) {
  return "@id" in reference;
}
function identifierLabel2(identifier) {
  if (typeof identifier === "string") return identifier;
  const authority = identifier.propertyID ?? identifier.name ?? "PropertyValue";
  return `${authority}:${String(identifier.value)}`;
}
function identifierValues2(reference) {
  const identifier = reference.identifier;
  if (!identifier) return [];
  if (Array.isArray(identifier)) return identifier.map(identifierLabel2);
  return [identifierLabel2(identifier)];
}
function identifierField(identifier) {
  if (identifier.startsWith("urn:isbn:")) {
    return {
      tag: "020",
      indicator1: " ",
      indicator2: " ",
      subfields: [{ code: "a", value: identifier.replace(/^urn:isbn:/, "") }]
    };
  }
  return {
    tag: "024",
    indicator1: "8",
    indicator2: " ",
    subfields: [{ code: "a", value: identifier }]
  };
}
function titleField(reference) {
  if (!reference.name) return null;
  const subfields = [{ code: "a", value: reference.name }];
  if (reference.creatorName) {
    const creators = Array.isArray(reference.creatorName) ? reference.creatorName : [reference.creatorName];
    for (const creator of creators) subfields.push({ code: "c", value: creator });
  }
  if (reference.publisherName) subfields.push({ code: "b", value: reference.publisherName });
  if (reference.datePublished) subfields.push({ code: "d", value: reference.datePublished });
  return {
    tag: "245",
    indicator1: "0",
    indicator2: "0",
    subfields
  };
}
function referenceFields(reference) {
  if (isEntityReference2(reference)) return [identifierField(reference["@id"])];
  const fields = identifierValues2(reference).map(identifierField);
  const title = titleField(reference);
  if (title) fields.push(title);
  return fields;
}
function base552(payload) {
  const subfields = [
    { code: "h", value: BRO_SCHEMA_URI },
    { code: "u", value: payload["@id"] },
    { code: "k", value: yyyymmdd(payload.dateCreated) }
  ];
  if (payload.name) subfields.push({ code: "b", value: payload.name });
  if (payload.byline) subfields.push({ code: "c", value: payload.byline });
  if (payload.dateModified) subfields.push({ code: "m", value: yyyymmdd(payload.dateModified) });
  return subfields;
}
function text520ForReaction(reaction) {
  const indicator1 = reaction.reactionType === "Listing" ? "4" : "1";
  const subfields = [{ code: "a", value: reaction.text }];
  if (reaction.byline) subfields.push({ code: "c", value: reaction.byline });
  for (const uri of reaction.citation ?? []) subfields.push({ code: "u", value: uri });
  return {
    tag: "520",
    indicator1,
    indicator2: " ",
    subfields
  };
}
function text520ForAbstract(abstractPayload) {
  const subfields = [{ code: "a", value: abstractPayload.text }];
  if (abstractPayload.byline) subfields.push({ code: "c", value: abstractPayload.byline });
  for (const uri of abstractPayload.citation ?? []) subfields.push({ code: "u", value: uri });
  return {
    tag: "520",
    indicator1: " ",
    indicator2: " ",
    subfields
  };
}
function convertReactionToKomarc(reaction) {
  return {
    controlFields: [],
    dataFields: [
      ...reaction.about.flatMap(referenceFields),
      text520ForReaction(reaction),
      {
        tag: "552",
        indicator1: " ",
        indicator2: " ",
        subfields: [
          ...base552(reaction),
          { code: "t", value: reaction.reactionType }
        ]
      }
    ]
  };
}
function convertAbstractToKomarc(abstractPayload) {
  return {
    controlFields: [],
    dataFields: [
      ...abstractPayload.isBasedOn.flatMap(referenceFields),
      text520ForAbstract(abstractPayload),
      {
        tag: "552",
        indicator1: " ",
        indicator2: " ",
        subfields: base552(abstractPayload)
      }
    ]
  };
}
function convertListToKomarc(list) {
  if (list.itemListElement.length === 0) {
    return [
      {
        controlFields: [],
        dataFields: [
          {
            tag: "552",
            indicator1: " ",
            indicator2: " ",
            subfields: base552(list)
          }
        ]
      }
    ];
  }
  return list.itemListElement.map((element) => {
    const referenceSubfields = isEntityReference2(element) ? [
      { code: "u", value: element["@id"] },
      ...element["@type"] ? [{ code: "t", value: element["@type"] }] : []
    ] : [
      ...element.name ? [{ code: "b", value: element.name }] : [],
      { code: "t", value: element["@type"] },
      ...identifierValues2(element).map((identifier) => ({ code: "u", value: identifier }))
    ];
    return {
      controlFields: [],
      dataFields: [
        ...referenceFields(element),
        {
          tag: "552",
          indicator1: " ",
          indicator2: " ",
          subfields: [
            ...base552(list),
            ...referenceSubfields
          ]
        }
      ]
    };
  });
}
function convertBroToKomarc(payload) {
  switch (payload["@type"]) {
    case "Reaction":
      return convertReactionToKomarc(payload);
    case "ReactionAbstract":
      return convertAbstractToKomarc(payload);
    case "ReactionList":
      return convertListToKomarc(payload);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AGENT_TYPES,
  BRO_CONTEXT_IRI,
  BRO_ENTITY_TYPES,
  BRO_SCHEMA_IRI,
  BRO_VOCAB_IRI,
  BroV1Context,
  BroV1Schema,
  BroV1VocabTurtle,
  CREATOR_TYPES,
  REACTION_TYPES,
  assertBroSchema,
  broV1Schema,
  cloneAndNormalizePayload,
  convertBroToBibframe,
  convertBroToKomarc,
  isBroPayload,
  isReaction,
  isReactionAbstract,
  isReactionList,
  normalizePayload,
  normalizeUrnScheme,
  renderBroToMarkdown,
  validateBroSchema
});
