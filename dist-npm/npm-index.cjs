"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/npm-index.ts
var npm_index_exports = {};
__export(npm_index_exports, {
  AUTHOR_TYPES: () => AUTHOR_TYPES,
  BroV1Schema: () => bro_v1_schema_default,
  broV1Schema: () => bro_v1_schema_default,
  convertBroToKomarc: () => convertBroToKomarc,
  normalizePayload: () => normalizePayload,
  normalizeUrnScheme: () => normalizeUrnScheme,
  parseFrontmatter: () => parseFrontmatter,
  serializeFrontmatter: () => serializeFrontmatter,
  validateBroSchema: () => validateBroSchema
});
module.exports = __toCommonJS(npm_index_exports);

// worker/assets/bro-v1-schema.json
var bro_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schema.slat.or.kr/bro/v1/schema.json",
  title: "Bibliographic Reaction Object (BRO)",
  description: "Bibliographic Reaction Object (BRO)\uC758 \uC6D0\uC2DC\uC2A4\uD0A4\uB9C8 BroItemList, BroArticle, BroAbstract. \uBCF8 \uC2A4\uD0A4\uB9C8\uB294 \uC2DC\uC2A4\uD15C \uC4F0\uAE30(Write/Command) \uC804\uC6A9 \uBAA8\uB378\uC774\uBA70, \uD074\uB77C\uC774\uC5B8\uD2B8 \uC870\uD68C\uB97C \uC704\uD55C \uB0B4\uD3EC(Embedding) \uD2B8\uB9AC \uBCC0\uD658\uC740 \uBBF8\uB4E4\uC6E8\uC5B4 \uACC4\uCE35\uC758 \uCC45\uC784\uC73C\uB85C \uC704\uC784\uD568.",
  $comment: "[ARCHITECTURE CORE DIRECTIVE] \uBCF8 \uC6D0\uC2DC \uC2A4\uD0A4\uB9C8\uB294 \uC560\uADF8\uB9AC\uAC70\uD2B8 \uB8E8\uD2B8(Aggregate Root) \uAC04\uC758 \uAC1D\uCCB4 \uB0B4\uD3EC(Embedding)\uB97C \uC5C4\uACA9\uD788 \uAE08\uC9C0\uD558\uACE0 \uB2E8\uBC29\uD5A5 URN \uC2DD\uBCC4\uC790(@id) \uCC38\uC870\uB9CC\uC744 \uD5C8\uC6A9\uD55C\uB2E4. \uC774\uB294 \uBD84\uC0B0 DB \uD658\uACBD\uC5D0\uC11C \uD2B8\uB79C\uC7AD\uC158 \uB77D \uACBD\uD569\uACFC \uB2E4\uC911 \uD310\uBCF8 \uC5C5\uB370\uC774\uD2B8 \uC774\uC0C1\uC744 \uBC29\uC5B4\uD558\uAE30 \uC704\uD55C CQRS \uC4F0\uAE30 \uD30C\uC774\uD504\uB77C\uC778\uC758 \uBB3C\uB9AC\uC801 \uC81C\uC57D\uC774\uB2E4. \uD504\uB860\uD2B8\uC5D4\uB4DC \uB80C\uB354\uB9C1 \uCD5C\uC801\uD654\uB97C \uC704\uD55C JSON \uB0B4\uD3EC \uAD6C\uC870(View Model)\uAC00 \uD544\uC694\uD560 \uACBD\uC6B0, \uBCF8 \uC6D0\uC2DC \uC2A4\uD0A4\uB9C8\uB97C \uC218\uC815\uD558\uC9C0 \uB9D0\uACE0 \uB3C4\uBA54\uC778 \uACC4\uCE35\uC5D0\uC11C In-Memory Join\uC744 \uC218\uD589\uD558\uC5EC \uB3C4\uBA54\uC778 \uD2B9\uD654 \uC751\uB2F5 DTO\uB97C \uD569\uC131\uD560 \uAC83.",
  type: "object",
  oneOf: [
    {
      $ref: "#/$defs/BroItemList"
    },
    {
      $ref: "#/$defs/BroArticle"
    },
    {
      $ref: "#/$defs/BroAbstract"
    }
  ],
  $defs: {
    BroItemList: {
      type: "object",
      description: "\uB2E4\uC911 \uD0C0\uAC9F \uBB38\uC11C \uD050\uB808\uC774\uC158\uC744 \uC704\uD55C \uC601\uC18D\uC801 \uCEE8\uD14C\uC774\uB108 \uC5D4\uD2F0\uD2F0 (ItemList).",
      required: ["@context", "@type", "author", "itemListElement"],
      properties: {
        "@context": {
          const: "https://schema.org"
        },
        "@type": {
          const: "ItemList"
        },
        "@id": {
          $ref: "#/$defs/urnUuidOnly"
        },
        name: {
          type: "string",
          minLength: 2,
          maxLength: 2e3
        },
        author: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: {
            $ref: "#/$defs/authorRoot"
          }
        },
        itemListElement: {
          type: "array",
          minItems: 0,
          description: "\uB9AC\uC2A4\uD2B8\uC5D0 \uD3EC\uD568\uB41C \uAC1C\uBCC4 \uBB38\uC11C(Article \uB4F1)\uC758 \uC2DD\uBCC4\uC790 \uBAA9\uB85D. \uD398\uC774\uB85C\uB4DC \uC0DD\uC131 \uC2DC \uBC18\uB4DC\uC2DC @id \uAC1D\uCCB4 \uBC30\uC5F4\uB9CC\uC744 \uC804\uC1A1\uD574\uC57C \uD558\uBA70, \uBB38\uC11C \uAC1D\uCCB4 \uC804\uCCB4\uB97C \uBC30\uC5F4 \uB0B4\uBD80\uC5D0 \uB0B4\uD3EC(Embed)\uD558\uB294 \uD398\uC774\uB85C\uB4DC\uB294 \uAC80\uC99D(Validation) \uB2E8\uACC4\uC5D0\uC11C \uAC70\uBD80(Reject)\uB41C\uB2E4.",
          $comment: "[ANTI-PATTERN PREVENTION] itemListElement \uB0B4\uBD80\uC758 oneOf\uB97C \uD1B5\uD55C Article \uAC1D\uCCB4 \uC9C1\uC811 \uD3EC\uD568 \uD5C8\uC6A9 \uB85C\uC9C1\uC740 \uB370\uC774\uD130 \uB2E8\uD3B8\uD654 \uBC29\uC9C0 \uBC0F \uC2DD\uBCC4\uC790 \uC815\uADDC\uD654\uB97C \uC704\uD574 \uC601\uAD6C \uC0AD\uC81C\uB428. \uBAA8\uB4E0 \uD558\uC704 \uC5D4\uD2F0\uD2F0 \uACB0\uD569\uC740 \uC624\uC9C1 @id \uD3EC\uC778\uD130\uB85C\uB9CC \uC774\uB8E8\uC5B4\uC838\uC57C \uD568.",
          items: {
            type: "object",
            required: ["@id"],
            properties: {
              "@id": {
                $ref: "#/$defs/urnUuidOnly"
              }
            }
          }
        }
      }
    },
    BroArticle: {
      type: "object",
      description: "\uB2E8\uC77C \uCF54\uC5B4 \uBB38\uC11C(Article) \uCC98\uB9AC\uB97C \uC704\uD55C \uC4F0\uAE30/\uC601\uC18D\uC131 \uC2A4\uD0A4\uB9C8. \uD30C\uC0DD \uBB38\uC11C(Abstract \uB4F1)\uC640\uC758 \uACB0\uD569\uC740 \uC678\uBD80 \uCC38\uC870(@id)\uB85C\uB9CC \uC774\uB904\uC9C4\uB2E4.",
      required: [
        "@context",
        "@type",
        "about",
        "text",
        "author",
        "dateCreated"
      ],
      properties: {
        "@context": {
          const: "https://schema.org"
        },
        "@type": {
          const: "Article"
        },
        "@id": {
          $ref: "#/$defs/urnUuidOnly"
        },
        dateCreated: {
          $ref: "#/$defs/strictDateTime"
        },
        datePublished: {
          $ref: "#/$defs/strictDateTime"
        },
        about: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          description: "\uD30C\uC0DD \uBB38\uC11C\uAC00 \uD0C0\uAC9F\uD305\uD558\uB294 \uCF54\uC5B4 \uC800\uC791\uBB3C \uC5D4\uD2F0\uD2F0. \uB2E4\uC911 \uD310\uBCF8 \uBC14\uC778\uB529 \uC2DC \uBCF5\uC218\uC758 \uC6D0\uC18C\uB97C \uD5C8\uC6A9\uD558\uB098, \uAC01 \uC694\uC18C\uB294 \uB2E8\uC77C URN\uC744 \uC18C\uC720\uD568.",
          items: {
            $ref: "#/$defs/terminalIdentifier"
          }
        },
        text: {
          $ref: "#/$defs/boundedText"
        },
        abstract: {
          type: "array",
          description: "\uD604\uC7AC \uBB38\uC11C(Article)\uC5D0 \uC885\uC18D\uB41C \uD30C\uC0DD \uC694\uC57D\uBCF8\uC758 \uC2DD\uBCC4\uC790(URN) \uBC30\uC5F4. \uC694\uC57D\uBCF8\uC758 \uC0C1\uC138 \uD14D\uC2A4\uD2B8(Text)\uB294 \uD3EC\uD568\uD558\uC9C0 \uC54A\uB294\uB2E4.",
          $comment: "[DATA REDUNDANCY LOCK] Article \uD398\uC774\uB85C\uB4DC \uB0B4\uC5D0 Abstract \uBCF8\uBB38 \uB0B4\uD3EC\uB97C \uD5C8\uC6A9\uD560 \uACBD\uC6B0 \uBC1C\uC0DD\uD558\uB294 1:N \uAD6C\uC870\uC758 \uB514\uC2A4\uD06C \uC911\uBCF5 \uC801\uC7AC(Redundancy) \uBC0F B-Tree \uBD84\uD560\uC744 \uB9C9\uAE30 \uC704\uD574 \uCCA0\uC800\uD788 \uC2DD\uBCC4\uC790 \uCC38\uC870 \uCCB4\uACC4\uB85C \uACE0\uB9BD\uC2DC\uD0B4.",
          items: {
            type: "object",
            required: ["@id"],
            properties: {
              "@id": {
                $ref: "#/$defs/urnUuidOnly"
              }
            }
          }
        },
        author: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: {
            $ref: "#/$defs/authorRoot"
          }
        }
      }
    },
    BroAbstract: {
      type: "object",
      description: "\uB2E8\uC77C \uC694\uC57D\uBCF8(Abstract) \uCC98\uB9AC\uB97C \uC704\uD55C \uC6D0\uC2DC \uC2A4\uD0A4\uB9C8",
      required: [
        "@context",
        "@type",
        "text",
        "author",
        "dateCreated",
        "isBasedOn"
      ],
      properties: {
        "@context": {
          const: "https://schema.org"
        },
        "@type": {
          const: "CreativeWork"
        },
        "@id": {
          $ref: "#/$defs/urnUuidOnly"
        },
        dateCreated: {
          $ref: "#/$defs/strictDateTime"
        },
        datePublished: {
          $ref: "#/$defs/strictDateTime"
        },
        text: {
          $ref: "#/$defs/boundedText"
        },
        inLanguage: {
          type: "string",
          description: "\uC694\uC57D\uBCF8\uC758 \uC5B8\uC5B4 \uCF54\uB4DC (\uC608: ko, en)"
        },
        author: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: {
            $ref: "#/$defs/authorRoot"
          }
        },
        isBasedOn: {
          type: "array",
          minItems: 1,
          description: "\uC774 \uC694\uC57D\uC774 \uAE30\uBC18\uD558\uACE0 \uC788\uB294 \uC6D0\uBCF8 \uC5D4\uD2F0\uD2F0(Article \uB610\uB294 \uB3C4\uC11C \uB4F1 CreativeWork)\uC758 \uC2DD\uBCC4\uC790",
          items: {
            $ref: "#/$defs/terminalIdentifier"
          }
        }
      }
    },
    BASE_PRIMITIVES: {
      $comment: " 1. \uC6D0\uC2DC \uB370\uC774\uD130 \uACC4\uCE35 (Base Primitives): \uC2DD\uBCC4\uC790, \uB0A0\uC9DC \uD1B5\uC81C"
    },
    urnIdentifier: {
      type: "string",
      description: "\uC2DD\uBCC4\uC790 \uAC80\uC99D. \uC2DC\uC2A4\uD15C \uB808\uBCA8\uC758 \uC18C\uBB38\uC790 URN Scheme \uC815\uADDC\uD654\uB97C \uC804\uC81C\uB85C \uD328\uD134\uC744 \uB2E8\uC21C\uD654\uD568.",
      oneOf: [
        {
          pattern: "^urn:isbn:(?:97[89]-?)?(?:\\d[ -]?){9}[\\dxX]$"
        },
        {
          pattern: "^urn:doi:10\\.\\d{4,9}\\/[-._;()/:A-Za-z0-9]+$"
        },
        {
          pattern: "^urn:uci:[a-zA-Z0-9]{3,10}[:\\-+][a-zA-Z0-9\\-+.:]+$"
        },
        {
          pattern: "^urn:kolis:[a-zA-Z0-9]+$"
        },
        {
          pattern: "^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[47][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
        },
        {
          pattern: "^urn:nlk:[a-zA-Z0-9]+$"
        }
      ]
    },
    urnUuidOnly: {
      type: "string",
      pattern: "^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[47][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
      description: "UUID v4(\uB79C\uB364) \uBC0F v7(\uD0C0\uC784\uC2A4\uD0EC\uD504)\uB9CC \uD5C8\uC6A9 (\uC601\uC18D\uC131 \uC5D4\uD2F0\uD2F0\uC6A9)"
    },
    strictDateTime: {
      type: "string",
      pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\\.[0-9]{1,6})?(?:Z|[+-][0-9]{2}:[0-9]{2})$",
      description: "RFC 3339 \uAE30\uBC18 \uB0A0\uC9DC \uD3EC\uB9F7 \uAC80\uC99D. Z \uB610\uB294 \uC624\uD504\uC14B(+09:00)\uC744 \uAC15\uC81C\uD558\uC5EC \uD0C0\uC784\uC874 \uB204\uB77D\uC73C\uB85C \uC778\uD55C DB \uB370\uC774\uD130 \uC624\uC5FC \uBC29\uC9C0."
    },
    boundedText: {
      type: "string",
      minLength: 0,
      maxLength: 3e5,
      description: "\uBC94\uC6A9 \uBB38\uC11C \uD14D\uC2A4\uD2B8. \uCD5C\uC0C1\uB2E8 YAML Frontmatter \uCEA1\uC290\uD654 \uD544\uC218. \uB370\uC774\uD130 \uC778\uC785 \uC2DC \uD504\uB860\uD2B8\uB9E4\uD130 \uB0B4\uBD80\uC758 \uC784\uC758\uC758 \uD0A4(Arbitrary Keys) \uD655\uC7A5\uC740 \uC804\uBA74 \uD5C8\uC6A9\uB428. \uB2E8, API \uBC18\uD658 \uBC0F \uC601\uC18D\uD654 \uAC1D\uCCB4 \uD45C\uCD9C \uC2DC \uD30C\uC774\uD504\uB77C\uC778\uC740 \uBC18\uB4DC\uC2DC \uB370\uC774\uD130\uB97C \uC815\uADDC\uD654\uD558\uC5EC 1\uAE09 \uD544\uB4DC\uC778 `title`(string), `byline`(string[]), `language`(string[]), `keywords`(string[]), `image`(string[]), `source_url`(string[])\uB9CC\uC744 \uCD5C\uC0C1\uC704 \uB178\uB4DC\uC5D0 \uC9C1\uB82C\uD654\uD558\uACE0, \uAE30\uD0C0 \uBAA8\uB4E0 \uC794\uC5EC \uB3D9\uC801 \uB370\uC774\uD130\uB294 `others: [{key: value}, ...]` \uD615\uD0DC\uC758 \uBC30\uC5F4 \uAC1D\uCCB4\uB85C \uAC15\uC81C \uBB36\uC74C \uCC98\uB9AC\uD558\uC5EC \uB9C8\uD06C\uB2E4\uC6B4\uC744 \uC7AC\uC870\uB9BD\uD574\uC57C \uD568. [SYSTEM_CONSTRAINT: 2-Pass Validation Required]",
      "x-frontmatter-schema": {
        $schema: "https://json-schema.org/draft/2020-12/schema",
        type: "object",
        properties: {
          title: {
            type: "string"
          },
          byline: {
            type: "array",
            items: {
              type: "string"
            }
          },
          language: {
            type: "array",
            items: {
              type: "string",
              pattern: "^[a-zA-Z]{2,3}(-[a-zA-Z0-9]+)?$"
            },
            minItems: 1,
            uniqueItems: true
          },
          keywords: {
            type: "array",
            items: {
              type: "string"
            }
          },
          image: {
            type: "array",
            items: {
              type: "string"
            }
          },
          source_url: {
            type: "array",
            items: {
              type: "string"
            }
          },
          others: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: true
            }
          }
        },
        additionalProperties: false,
        required: []
      }
    },
    terminalIdentifier: {
      type: "object",
      description: "\uC21C\uD658 \uCC38\uC870(Billion Laughs) \uACF5\uACA9\uC744 \uCC28\uB2E8\uD558\uAE30 \uC704\uD55C \uD130\uBBF8\uB110 \uAC1D\uCCB4.",
      required: ["@type", "identifier"],
      properties: {
        "@type": {
          enum: ["Article", "CreativeWork"]
        },
        identifier: {
          $ref: "#/$defs/urnIdentifier"
        }
      },
      additionalProperties: false
    },
    AUTHOR_ENTITIES: {
      $comment: " 2. \uC800\uC790 \uC5D4\uD2F0\uD2F0 \uACC4\uCE35: \uB2E4\uD615\uC131 \uC18D\uC131 \uCD9C\uD608(Property Bleeding) \uC0C1\uD638 \uBC30\uC81C."
    },
    authorRoot: {
      type: "object",
      required: ["@type"],
      discriminator: {
        propertyName: "@type"
      },
      allOf: [
        {
          if: {
            properties: {
              "@type": {
                const: "Person"
              }
            }
          },
          then: {
            $ref: "#/$defs/authorPerson"
          }
        },
        {
          if: {
            properties: {
              "@type": {
                const: "GovernmentOrganization"
              }
            }
          },
          then: {
            $ref: "#/$defs/authorGovernment"
          }
        },
        {
          if: {
            properties: {
              "@type": {
                const: "Corporation"
              }
            }
          },
          then: {
            $ref: "#/$defs/authorCorporation"
          }
        },
        {
          if: {
            properties: {
              "@type": {
                const: "Organization"
              }
            }
          },
          then: {
            $ref: "#/$defs/authorOrganization"
          }
        },
        {
          if: {
            properties: {
              "@type": {
                const: "SoftwareApplication"
              }
            }
          },
          then: {
            $ref: "#/$defs/authorSoftware"
          }
        }
      ]
    },
    authorPerson: {
      type: "object",
      required: ["@type", "@id", "name"],
      properties: {
        "@type": {
          const: "Person"
        },
        name: {
          type: "string",
          maxLength: 1e3
        },
        "@id": {
          pattern: "^urn:(?:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[47][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|orcid:\\d{4}-\\d{4}-\\d{4}-\\d{3}[0-9X]|isni:0000[ \\-]?\\d{4}[ \\-]?\\d{4}[ \\-]?\\d{3}[0-9X])$"
        }
      },
      additionalProperties: false
    },
    authorGovernment: {
      type: "object",
      required: ["@type", "@id", "name"],
      properties: {
        "@type": {
          const: "GovernmentOrganization"
        },
        name: {
          type: "string",
          maxLength: 1e3
        },
        "@id": {
          pattern: "^urn:(?:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[47][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|kr:govcode:\\d{7}|lei:[0-9A-Z]{20}|isni:0000[ \\-]?\\d{4}[ \\-]?\\d{4}[ \\-]?\\d{3}[0-9X])$"
        }
      },
      additionalProperties: false
    },
    authorCorporation: {
      type: "object",
      required: ["@type", "@id", "name"],
      properties: {
        "@type": {
          const: "Corporation"
        },
        name: {
          type: "string",
          maxLength: 100
        },
        "@id": {
          pattern: "^urn:(?:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[47][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|kr:(?:crn:\\d{13}|brn:\\d{10})|lei:[0-9A-Z]{20}|isni:0000[ \\-]?\\d{4}[ \\-]?\\d{4}[ \\-]?\\d{3}[0-9X])$"
        }
      },
      additionalProperties: false
    },
    authorOrganization: {
      type: "object",
      required: ["@type", "@id", "name"],
      properties: {
        "@type": {
          const: "Organization"
        },
        name: {
          type: "string",
          maxLength: 100
        },
        "@id": {
          pattern: "^urn:(?:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[47][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|kr:npo:\\d{10}|lei:[0-9A-Z]{20}|isni:0000[ \\-]?\\d{4}[ \\-]?\\d{4}[ \\-]?\\d{3}[0-9X])$"
        }
      },
      additionalProperties: false
    },
    authorSoftware: {
      type: "object",
      required: ["@type", "@id", "name"],
      properties: {
        "@type": {
          const: "SoftwareApplication"
        },
        name: {
          type: "string",
          maxLength: 100
        },
        softwareVersion: {
          type: "string",
          maxLength: 50
        },
        "@id": {
          pattern: "^urn:model:[a-zA-Z0-9-]+:[a-zA-Z0-9\\.-]+$"
        }
      },
      additionalProperties: false
    }
  }
};

// src/validator/index.ts
var import_json_schema = require("@cfworker/json-schema");
var v2 = __toESM(require("valibot"), 1);

// src/lib/schema-types.ts
var v = __toESM(require("valibot"), 1);
var StrictFrontmatterSchema = v.strictObject({
  title: v.optional(v.string("Title must be a string.")),
  language: v.optional(
    v.array(
      v.pipe(
        v.string("Language items must be strings."),
        v.regex(/^[a-zA-Z]{2,3}(-[a-zA-Z0-9]+)?$/, "Must be a valid BCP 47 / ISO 639 language code.")
      ),
      "Language must be an array of BCP 47 codes."
    )
  ),
  keywords: v.optional(v.array(v.string("Keywords must be an array of strings."))),
  byline: v.optional(v.array(v.string("Byline must be an array of strings."))),
  image: v.optional(v.array(v.string("Image must be an array of strings."))),
  source_url: v.optional(v.array(v.string("Source URL must be an array of strings."))),
  others: v.optional(
    v.array(
      v.record(v.string(), v.any()),
      "Others must be an array of {key: value} objects."
    )
  )
});
var DynamicFieldSchema = v.record(v.string(), v.any());
var OthersBundleSchema = v.array(DynamicFieldSchema);

// src/lib/normalize.ts
var URN_SCHEME_PREFIXES = [
  "urn:isbn:",
  "urn:doi:",
  "urn:uci:",
  "urn:kolis:",
  "urn:uuid:",
  "urn:orcid:",
  "urn:isni:",
  "urn:kr:govcode:",
  "urn:kr:crn:",
  "urn:kr:brn:",
  "urn:kr:npo:",
  "urn:lei:",
  "urn:model:"
];
function normalizeUrnScheme(urn) {
  if (typeof urn !== "string") return urn;
  const lower = urn.toLowerCase();
  for (const prefix of URN_SCHEME_PREFIXES) {
    if (lower.startsWith(prefix)) {
      return prefix + urn.slice(prefix.length);
    }
  }
  return urn;
}
var IDENTIFIER_KEYS = /* @__PURE__ */ new Set(["@id", "identifier"]);
function normalizePayload(payload) {
  if (payload === null || payload === void 0) return payload;
  if (Array.isArray(payload)) {
    for (let i = 0; i < payload.length; i++) {
      payload[i] = normalizePayload(payload[i]);
    }
    return payload;
  }
  if (typeof payload === "object") {
    const obj = payload;
    for (const key of Object.keys(obj)) {
      if (IDENTIFIER_KEYS.has(key) && typeof obj[key] === "string") {
        obj[key] = normalizeUrnScheme(obj[key]);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        normalizePayload(obj[key]);
      }
    }
    return payload;
  }
  return payload;
}

// src/lib/bro-types.ts
var AUTHOR_TYPES = [
  "Person",
  "GovernmentOrganization",
  "Corporation",
  "Organization",
  "SoftwareApplication"
];

// src/validator/index.ts
var validator = new import_json_schema.Validator(bro_v1_schema_default);
function validateBroSchema(data) {
  const result = validator.validate(data);
  return {
    valid: result.valid,
    errors: result.errors
  };
}
function validateStrictFrontmatter(payload) {
  try {
    return v2.parse(StrictFrontmatterSchema, payload);
  } catch (error) {
    throw new Error(`CRITICAL [Valibot Error]: Frontmatter validation failed. Unauthorized structural anomalies detected in the first-class data object.
${error}`);
  }
}

// src/lib/frontmatter.ts
var import_yaml = __toESM(require("yaml"), 1);
var FIRST_CLASS_FIELDS = /* @__PURE__ */ new Set([
  "title",
  "language",
  "keywords",
  "byline",
  "image",
  "source_url",
  "others"
]);
var FRONTMATTER_SEARCH_LIMIT = 5e3;
function toStringArray(value) {
  if (value === void 0 || value === null) return [];
  if (Array.isArray(value)) return value.map(String);
  return [String(value)];
}
function parseFrontmatter(markdownOrYaml, body) {
  let yamlBlock = "";
  let content = "";
  if (body !== void 0) {
    yamlBlock = markdownOrYaml;
    content = body;
  } else {
    const searchArea = markdownOrYaml.slice(0, FRONTMATTER_SEARCH_LIMIT);
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = searchArea.match(frontmatterRegex);
    if (match) {
      yamlBlock = match[1];
      content = markdownOrYaml.slice(match[0].length).trimStart();
    } else {
      content = markdownOrYaml;
    }
  }
  const data = {};
  let others = [];
  if (yamlBlock.trim()) {
    const rawData = import_yaml.default.parse(yamlBlock) || {};
    if (rawData.title !== void 0) data.title = String(rawData.title);
    if (rawData.language !== void 0) {
      data.language = toStringArray(rawData.language);
    }
    if (rawData.keywords !== void 0) {
      data.keywords = toStringArray(rawData.keywords);
    }
    if (rawData.byline !== void 0) {
      data.byline = toStringArray(rawData.byline);
    }
    if (rawData.image !== void 0) {
      data.image = toStringArray(rawData.image);
    }
    if (rawData.source_url !== void 0) {
      data.source_url = toStringArray(rawData.source_url);
    }
    if (Array.isArray(rawData.others)) {
      others = [...rawData.others];
    }
    for (const [key, value] of Object.entries(rawData)) {
      if (!FIRST_CLASS_FIELDS.has(key)) {
        others.push({ [key]: value });
      }
    }
    if (others.length > 0) {
      data.others = others;
    }
    validateStrictFrontmatter(data);
  }
  return { data, others, content };
}
function serializeFrontmatter(data, others, content) {
  validateStrictFrontmatter(data);
  const yamlData = {};
  if (data.title !== void 0) yamlData.title = data.title;
  if (data.language !== void 0) yamlData.language = data.language;
  if (data.keywords !== void 0) yamlData.keywords = data.keywords;
  if (data.byline !== void 0) yamlData.byline = data.byline;
  if (data.image !== void 0) yamlData.image = data.image;
  if (data.source_url !== void 0) yamlData.source_url = data.source_url;
  if (others && others.length > 0) {
    yamlData.others = others;
  }
  const yamlBlock = import_yaml.default.stringify(yamlData);
  return `---
${yamlBlock}---

${content}`;
}

// src/lib/komarc-converter.ts
function convertBroToKomarc(broPayload) {
  if (isItemList(broPayload)) {
    return broPayload.itemListElement.map((element) => {
      const subfields552 = [
        { code: "h", value: "https://schema.slat.or.kr/bro/v1/schema.json" }
      ];
      if (element["@id"]) {
        subfields552.push({ code: "u", value: String(element["@id"]) });
      }
      return {
        controlFields: [],
        dataFields: [{
          tag: "552",
          indicator1: " ",
          indicator2: " ",
          subfields: subfields552
        }]
      };
    });
  }
  if (isAbstract(broPayload)) {
    return convertAbstractToKomarc(broPayload);
  }
  return convertArticleToKomarc(broPayload);
}
function isItemList(payload) {
  return payload && payload["@type"] === "ItemList" && Array.isArray(payload.itemListElement);
}
function isAbstract(payload) {
  return payload && payload["@type"] === "CreativeWork" && "isBasedOn" in payload;
}
function convertArticleToKomarc(article) {
  const dataFields = [];
  if (Array.isArray(article.about)) {
    for (const creativeWork of article.about) {
      if (creativeWork.identifier) {
        const idStr = String(creativeWork.identifier);
        if (idStr.startsWith("urn:isbn:")) {
          dataFields.push({
            tag: "020",
            indicator1: " ",
            indicator2: " ",
            subfields: [{ code: "a", value: idStr.replace("urn:isbn:", "") }]
          });
        } else if (idStr.startsWith("urn:")) {
          const prefixMatch = idStr.match(/^urn:([^:]+):/);
          const value = prefixMatch ? idStr.substring(prefixMatch[0].length) : idStr;
          dataFields.push({
            tag: "024",
            indicator1: "8",
            // Unspecified type of standard number
            indicator2: " ",
            subfields: [{ code: "a", value }]
          });
        }
      }
    }
  }
  const subfields552 = [
    { code: "h", value: "https://schema.slat.or.kr/bro/v1/schema.json" }
  ];
  if (article.dateCreated) {
    const truncatedDate = article.dateCreated.substring(0, 10).replace(/-/g, "");
    subfields552.push({ code: "k", value: truncatedDate });
  }
  if (article["@id"]) {
    subfields552.push({ code: "u", value: String(article["@id"]) });
  }
  dataFields.push({
    tag: "552",
    indicator1: " ",
    indicator2: " ",
    subfields: subfields552
  });
  return {
    controlFields: [],
    dataFields
  };
}
function convertAbstractToKomarc(abstract) {
  const dataFields = [];
  if (Array.isArray(abstract.isBasedOn)) {
    for (const origin of abstract.isBasedOn) {
      if (origin.identifier) {
        const idStr = String(origin.identifier);
        if (idStr.startsWith("urn:isbn:")) {
          dataFields.push({
            tag: "020",
            indicator1: " ",
            indicator2: " ",
            subfields: [{ code: "a", value: idStr.replace("urn:isbn:", "") }]
          });
        } else if (idStr.startsWith("urn:")) {
          const prefixMatch = idStr.match(/^urn:([^:]+):/);
          const value = prefixMatch ? idStr.substring(prefixMatch[0].length) : idStr;
          dataFields.push({
            tag: "024",
            indicator1: "8",
            indicator2: " ",
            subfields: [{ code: "a", value }]
          });
        }
      }
    }
  }
  const subfields552 = [
    { code: "h", value: "https://schema.slat.or.kr/bro/v1/schema.json" }
  ];
  if (abstract.dateCreated) {
    const truncatedDate = abstract.dateCreated.substring(0, 10).replace(/-/g, "");
    subfields552.push({ code: "k", value: truncatedDate });
  }
  if (abstract.text) {
    subfields552.push({ code: "o", value: abstract.text });
  }
  dataFields.push({
    tag: "552",
    indicator1: " ",
    indicator2: " ",
    subfields: subfields552
  });
  return {
    controlFields: [],
    dataFields
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AUTHOR_TYPES,
  BroV1Schema,
  broV1Schema,
  convertBroToKomarc,
  normalizePayload,
  normalizeUrnScheme,
  parseFrontmatter,
  serializeFrontmatter,
  validateBroSchema
});
