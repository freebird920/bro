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

// src/lib/frontmatter.ts
var frontmatter_exports = {};
__export(frontmatter_exports, {
  parseFrontmatter: () => parseFrontmatter,
  serializeFrontmatter: () => serializeFrontmatter
});
module.exports = __toCommonJS(frontmatter_exports);
var import_yaml = __toESM(require("yaml"), 1);

// src/lib/schema-types.ts
var v = __toESM(require("valibot"), 1);
var StrictFrontmatterSchema = v.strictObject({
  title: v.string("Title must be a strictly defined string."),
  keywords: v.array(v.string("Keywords must be an array of strings.")),
  byline: v.optional(v.array(v.string("Byline must be an array of strings."))),
  image: v.optional(v.array(v.string("Image must be an array of strings."))),
  source_url: v.optional(v.array(v.string("Source URL must be an array of strings.")))
});
var DynamicFieldSchema = v.record(v.string(), v.any());
var OthersBundleSchema = v.array(DynamicFieldSchema);

// src/validator/index.ts
var import_json_schema = require("@cfworker/json-schema");

// worker/assets/bro-v1-schema.json
var bro_v1_schema_default = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://schema.slat.or.kr/bro/v1/schema.json",
  title: "Bibliographic Reaction Object(BRO)",
  description: "Bibliographic Reaction Object",
  type: "object",
  oneOf: [
    {
      description: "\uD074\uB77C\uC774\uC5B8\uD2B8 \uB370\uC774\uD130 \uC778\uC785\uC6A9 \uC4F0\uAE30 \uD398\uC774\uB85C\uB4DC (Ingestion DTO - UUID \uAC80\uC99D \uBA74\uC81C)",
      $ref: "#/$defs/articleIngestionPayload"
    },
    {
      description: "\uC11C\uBC84 \uB0B4\uBD80 \uBC0F \uC870\uD68C\uC6A9 \uC601\uC18D\uC131 \uC5D4\uD2F0\uD2F0 (Persisted Entity - UUID \uD544\uC218 \uAC15\uC81C, \uBC18\uCD9C \uC2DC \uC9ED UUID\uB85C \uCE58\uD658\uD560 \uAC83)",
      $ref: "#/$defs/articlePersistedEntity"
    },
    {
      description: "\uB3C4\uC11C \uAD00\uB828 \uAE00 \uBAA9\uB85D (ItemList - \uB2E4\uC911 \uBC30\uC5F4 \uB9E4\uD2B8\uB9AD\uC2A4)",
      $ref: "#/$defs/itemListDefinition"
    }
  ],
  $defs: {
    itemListDefinition: {
      type: "object",
      required: ["@context", "@type", "author", "itemListElement"],
      properties: {
        "@context": {
          const: "https://schema.org"
        },
        "@type": {
          const: "ItemList"
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
          description: "\uB3C4\uC11C \uBAA9\uB85D \uC791\uC131/\uC0DD\uC131 \uC8FC\uCCB4 \uBC30\uC5F4. \uB2E4\uC218 \uC8FC\uCCB4(\uACF5\uB3D9 \uC800\uC790, \uB2E4\uC911 \uC2DC\uC2A4\uD15C) \uBC14\uC778\uB529 \uC9C0\uC6D0.",
          items: {
            $ref: "#/$defs/authorDefinitions"
          }
        },
        itemListElement: {
          type: "array",
          minItems: 0,
          description: "\uB3C4\uC11C \uBAA9\uB85D\uC758 \uAC01 \uD56D\uBAA9. \uBAA8\uB4E0 \uD56D\uBAA9\uC740 Article\uB85C \uADDC\uACA9\uD654\uB418\uBA70, \uC21C\uC218\uD55C \uB3C4\uC11C \uCD94\uAC00\uC758 \uACBD\uC6B0 text\uAC00 \uBE48 \uBB38\uC790\uC5F4\uC778 Article\uB85C \uCDE8\uAE09\uB429\uB2C8\uB2E4.",
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
      required: ["@type", "@id", "text", "author", "dateCreated"],
      unevaluatedProperties: false,
      properties: {
        "@type": {
          const: "CreativeWork"
        },
        "@id": {
          type: "string",
          pattern: "^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
          description: "\uC6D0\uBCF8 \uB370\uC774\uD130\uC758 UUID\uC640 \uC0DD\uC131 \uC2DC\uAC04\uC744 \uAE30\uBC18\uC73C\uB85C \uD55C \uACB0\uC815\uB860\uC801 UUID. \uBCF8 \uAC1D\uCCB4\uB294 \uBD88\uBCC0(Immutable)\uD558\uBA70 \uAC31\uC2E0 \uC2DC \uC0C8\uB85C\uC6B4 UUID\uAC00 \uBC1C\uAE09\uB418\uC5B4\uC57C \uD568."
        },
        dateCreated: {
          type: "string",
          format: "date-time",
          description: "\uC694\uC57D \uAC1D\uCCB4\uC758 \uCD5C\uCD08 \uC0DD\uC131 \uD0C0\uC784\uC2A4\uD0EC\uD504 (ISO 8601 / RFC 3339 \uC900\uC218). \uBD88\uBCC0\uC131 \uC6D0\uCE59\uC5D0 \uB530\uB77C \uB370\uC774\uD130 \uC218\uC815 \uC2DC updated \uD544\uB4DC\uB97C \uC0AC\uC6A9\uD558\uC9C0 \uC54A\uACE0 \uC2E0\uADDC \uAC1D\uCCB4\uC640 \uC0C8\uB85C\uC6B4 dateCreated\uB97C \uBC1C\uAE09\uD558\uC5EC \uBA71\uB4F1\uC131\uC744 \uBCF4\uC7A5\uD568. (Mapping: KOMARC \uB9E4\uD551\uC2DC YYYYMMDD \uD3EC\uB9F7\uC73C\uB85C \uBB38\uC790\uC5F4 \uC808\uC0AD \uCC98\uB9AC\uB418\uC5B4 KOMARC 552 \u25BEk \uC18D\uC131 \uAC12\uC758 \uAC1C\uC2DC\uC77C\uC790/\uC885\uB8CC\uC77C\uC790\uC5D0 \uBC14\uC778\uB529\uB428)"
        },
        text: {
          type: "string",
          description: "LLM \uB610\uB294 \uC0AC\uB78C\uC774 \uC791\uC131\uD55C \uB9AC\uBDF0, \uBD84\uC11D, \uBE44\uD3C9 \uB4F1 \uD30C\uC0DD \uB370\uC774\uD130\uC5D0 \uB300\uD55C \uC815\uD615\uD654\uB41C \uC0C1\uC138 \uC694\uC57D \uBCF8\uBB38. (Mapping: KOMARC 552 \u25BEo \uAC1C\uCCB4/\uC18D\uC131 \uAC1C\uC694 \uC11C\uBE0C\uD544\uB4DC\uC5D0 \uC9C1\uC811 \uC8FC\uC785\uB428)"
        },
        author: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          description: "\uC694\uC57D \uB370\uC774\uD130 \uC0DD\uC131 \uC8FC\uCCB4 \uBC30\uC5F4. \uAE30\uACC4(LLM)\uC640 \uC778\uAC04 \uC791\uC5C5\uC790\uC758 \uACF5\uB3D9 \uC791\uC5C5 \uB4F1 \uBCF5\uC218 \uC8FC\uCCB4 \uBA85\uC2DC.",
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
          const: "https://schema.org"
        },
        "@type": {
          const: "Article"
        },
        dateCreated: {
          type: "string",
          format: "date-time",
          description: "\uD30C\uC0DD \uBB38\uC11C \uC5D4\uD2F0\uD2F0\uC758 \uCD5C\uCD08 \uC0DD\uC131 \uD0C0\uC784\uC2A4\uD0EC\uD504 (ISO 8601 / RFC 3339 \uC900\uC218). \uB370\uC774\uD130 \uBB34\uACB0\uC131\uC744 \uC704\uD574 \uAC31\uC2E0\uC744 \uD5C8\uC6A9\uD558\uC9C0 \uC54A\uC74C(No Update). \uC218\uC815 \uC694\uAD6C \uBC1C\uC0DD \uC2DC \uAE30\uC874 \uAC1D\uCCB4\uB97C \uB17C\uB9AC\uC801 \uC0AD\uC81C \uB610\uB294 \uC544\uCE74\uC774\uBE59\uD558\uACE0 \uC2E0\uADDC \uD0C0\uC784\uC2A4\uD0EC\uD504\uB97C \uD68D\uB4DD\uD55C \uC0C8 \uAC1D\uCCB4\uB85C \uB300\uCCB4\uD568. (Mapping: KOMARC \uC5F0\uB3D9 \uC2DC YYYYMMDD\uB85C \uB2E4\uC6B4\uCE90\uC2A4\uD305\uB418\uC5B4 552 \u25BEk \uC11C\uBE0C\uD544\uB4DC\uC5D0 \uAC1C\uC2DC\uC77C\uC790\uB85C \uB9F5\uD551\uB428)"
        },
        about: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          description: "\uD30C\uC0DD \uBB38\uC11C\uAC00 \uD0C0\uAC9F\uD305\uD558\uB294 \uCF54\uC5B4 \uC11C\uC9C0 \uC5D4\uD2F0\uD2F0 \uBC30\uC5F4. \uB2E8\uAD8C, \uB2E4\uAD8C\uBCF8 \uC138\uD2B8, \uB3D9\uC77C \uC800\uC791\uBB3C\uC758 \uC774\uAE30\uC885 \uD310\uBCF8(\uAC1C\uC815\uD310, e-book \uB4F1 \uC5EC\uB7EC ISBN)\uC744 \uBB34\uC81C\uD55C\uC73C\uB85C \uBC14\uC778\uB529\uD560 \uC218 \uC788\uC74C. \uB2E8\uC77C \uB3C4\uC11C \uD0C0\uAC9F\uD305 \uC2DC\uC5D0\uB3C4 \uBC18\uB4DC\uC2DC \uC6D0\uC18C 1\uAC1C\uC9DC\uB9AC \uBC30\uC5F4\uB85C \uC778\uC785\uB418\uC5B4\uC57C \uD568.",
          items: {
            type: "object",
            required: ["@type", "isbn"],
            unevaluatedProperties: false,
            properties: {
              "@type": {
                const: "Book"
              },
              isbn: {
                $ref: "#/$defs/isbnDefinition",
                description: "\uAD6D\uC81C\uD45C\uC900\uB3C4\uC11C\uBC88\uD638 \uC2DD\uBCC4\uC790."
              }
            }
          }
        },
        text: {
          type: "string",
          minLength: 0,
          maxLength: 3e5,
          description: "\uBC94\uC6A9 \uBB38\uC11C \uD14D\uC2A4\uD2B8. \uCD5C\uC0C1\uB2E8 YAML Frontmatter \uCEA1\uC290\uD654 \uD544\uC218. \uB370\uC774\uD130 \uC778\uC785 \uC2DC \uD504\uB860\uD2B8\uB9E4\uD130 \uB0B4\uBD80\uC758 \uC784\uC758\uC758 \uD0A4(Arbitrary Keys) \uD655\uC7A5\uC740 \uC804\uBA74 \uD5C8\uC6A9\uB428. \uB2E8, API \uBC18\uD658 \uBC0F \uC601\uC18D\uD654 \uAC1D\uCCB4 \uD45C\uCD9C \uC2DC \uD30C\uC774\uD504\uB77C\uC778\uC740 \uBC18\uB4DC\uC2DC \uB370\uC774\uD130\uB97C \uC815\uADDC\uD654\uD558\uC5EC 1\uAE09 \uD544\uB4DC\uC778 `title`(string), `byline`(string[]), `keywords`(string[]), `image`(string[]), `source_url`(string[])\uB9CC\uC744 \uCD5C\uC0C1\uC704 \uB178\uB4DC\uC5D0 \uC9C1\uB82C\uD654\uD558\uACE0, \uAE30\uD0C0 \uBAA8\uB4E0 \uC794\uC5EC \uB3D9\uC801 \uB370\uC774\uD130\uB294 `others: [{key: value}, ...]` \uD615\uD0DC\uC758 \uBC30\uC5F4 \uAC1D\uCCB4\uB85C \uAC15\uC81C \uBB36\uC74C \uCC98\uB9AC\uD558\uC5EC \uB9C8\uD06C\uB2E4\uC6B4\uC744 \uC7AC\uC870\uB9BD\uD574\uC57C \uD568. (Mapping Protocol: \uBCF8 \uB370\uC774\uD130 \uC138\uD2B8\uC758 \uADDC\uACA9 \uCD9C\uCC98\uB294 KOMARC 552 \u25BEh \uBD80\uD638\uC138\uD2B8 \uC774\uB984/\uCD9C\uCC98\uC5D0 `https://schema.slat.or.kr/bro/v1/schema.json` \uC2DD\uBCC4\uC790\uB85C \uBA85\uC2DC\uB418\uC5B4\uC57C \uD558\uBA70, text \uD398\uC774\uB85C\uB4DC \uC6D0\uBB38\uC740 552 \u25BEu\uC758 URI \uC2DD\uBCC4\uC790\uB97C \uD1B5\uD574 \uC678\uBD80 \uD574\uC18C\uB418\uC5B4\uC57C \uD568) @format markdown @ai-hint Frontmatter \uD30C\uC2F1\uC740 \uC815\uADDC\uC2DD ^---\\n([\\s\\S]*?)\\n--- \uB97C \uC0AC\uC6A9\uD558\uB418, \uC5ED\uC9C1\uB82C\uD654 \uBC18\uD658 \uC2DC `title`, `byline`, `keywords`, `image`, `source_url` \uBC0F \uC794\uC5EC K-V \uD29C\uD50C\uC744 \uD3EC\uD568\uD558\uB294 `others` \uB178\uB4DC\uB9CC\uC744 \uD3EC\uD568\uD558\uB3C4\uB85D \uC7AC\uAD6C\uC131\uD560 \uAC83."
        },
        abstract: {
          $ref: "#/$defs/abstractDefinition",
          description: "\uBB38\uC11C\uC758 \uAD6C\uC870\uD654\uB41C \uC694\uC57D \uB370\uC774\uD130 (\uAE30\uACC4 \uB610\uB294 \uC0AC\uB78C\uC774 \uC791\uC131)"
        },
        author: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          description: "\uBCF8\uBB38 \uB370\uC774\uD130 \uC0DD\uC131 \uC8FC\uCCB4 \uBC30\uC5F4. \uBCF5\uC218 \uC778\uC6D0 \uACF5\uB3D9 \uC9D1\uD544 \uBC0F \uBCF5\uD569 \uBAA8\uB378 \uAD00\uC5EC \uC774\uB825 \uCD94\uC801\uC6A9.",
          items: {
            $ref: "#/$defs/authorDefinitions"
          }
        }
      }
    },
    articleIngestionPayload: {
      description: "\uD074\uB77C\uC774\uC5B8\uD2B8 POST \uD398\uC774\uB85C\uB4DC \uAD6C\uC870 (\uC11C\uBC84 \uC0AC\uC774\uB4DC \uBCC0\uC218 \uD1B5\uC81C)",
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
      description: "\uB370\uC774\uD130\uBCA0\uC774\uC2A4 \uC601\uC18D\uC131 \uBC0F \uB370\uC774\uD130 \uBC18\uCD9C\uC6A9 \uC5C4\uACA9\uD55C \uC2A4\uD0A4\uB9C8 \uAD6C\uC870",
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
              description: "\uC5D4\uD2F0\uD2F0\uC758 \uBC1C\uD589/\uC601\uC18D\uD654 \uC77C\uC790. (Mapping: KOMARC 552 \u25BEk \uC11C\uBE0C\uD544\uB4DC\uC5D0 \uC885\uB8CC\uC77C\uC790 \uB610\uB294 \uC720\uD6A8\uC77C\uC790\uB85C \uB9F5\uD551\uB428)"
            }
          }
        }
      ]
    },
    authorDefinitions: {
      type: "object",
      required: ["@type", "@id", "name"],
      unevaluatedProperties: false,
      properties: {
        "@type": {
          enum: [
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
          description: "\uD30C\uC0DD \uBB38\uC11C(\uC694\uC57D, \uC11C\uD3C9 \uB4F1)\uB97C \uC0DD\uC131\uD55C \uC8FC\uCCB4\uC758 \uC774\uB984 \uB610\uB294 \uAE30\uAD00/\uC2DC\uC2A4\uD15C\uBA85. \uC8FC\uC758: \uC6D0\uBCF8 \uB3C4\uC11C\uC758 \uC800\uC790(\uC11C\uC9C0 \uD45C\uC900\uC758 1XX/7XX \uACC4\uCE35)\uC640 \uC5C4\uACA9\uD788 \uBD84\uB9AC\uB41C \uB3C4\uBA54\uC778\uC784."
        },
        softwareVersion: {
          type: "string",
          description: "LLM \uB4F1 \uBAA8\uB378\uC758 \uC138\uBD80 \uBC84\uC804"
        },
        "@id": {
          type: "string",
          description: "\uC11C\uBC84 \uB0B4\uBD80\uC5D0\uC11C\uB294 \uC6D0\uBCF8 UUID v7\uC744 \uC720\uC9C0\uD558\uB418, \uD074\uB77C\uC774\uC5B8\uD2B8 \uBC18\uCD9C \uC2DC \uBC18\uB4DC\uC2DC \uAC00\uBA85 \uCC98\uB9AC\uB41C \uAC12\uC744 \uBC14\uC778\uB529\uD560 \uAC83."
        }
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
            properties: {
              "@id": {
                pattern: "^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
              }
            }
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
            properties: {
              "@id": {
                pattern: "^urn:kr:govcode:\\d{7}$"
              }
            }
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
            properties: {
              "@id": {
                pattern: "^urn:kr:(crn:\\d{13}|brn:\\d{10})$"
              }
            }
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
            properties: {
              "@id": {
                pattern: "^urn:(kr:npo:\\d{10}|uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$"
              }
            }
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
            properties: {
              "@id": {
                pattern: "^urn:model:[a-zA-Z0-9-]+:[a-zA-Z0-9\\.-]+$",
                description: "\uBAA8\uB378\uC744 \uC2DD\uBCC4\uD558\uB294 \uB2E8\uC77C URN (\uC608: urn:model:openai:gpt-4o, urn:model:google:gemini-1.5-pro)"
              }
            }
          }
        }
      ]
    }
  }
};

// src/validator/index.ts
var v2 = __toESM(require("valibot"), 1);
var validator = new import_json_schema.Validator(bro_v1_schema_default);
function validateStrictFrontmatter(payload) {
  try {
    return v2.parse(StrictFrontmatterSchema, payload);
  } catch (error) {
    throw new Error(`CRITICAL [Valibot Error]: Frontmatter validation failed. Unauthorized structural anomalies detected in the first-class data object.
${error}`);
  }
}

// src/lib/frontmatter.ts
function parseFrontmatter(markdownOrYaml, body) {
  let yamlBlock = "";
  let content = "";
  if (body !== void 0) {
    yamlBlock = markdownOrYaml;
    content = body;
  } else {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = markdownOrYaml.match(frontmatterRegex);
    if (match) {
      yamlBlock = match[1];
      content = markdownOrYaml.replace(frontmatterRegex, "").trimStart();
    } else {
      content = markdownOrYaml;
    }
  }
  const data = { title: "", keywords: [] };
  let others = [];
  if (yamlBlock.trim()) {
    const rawData = import_yaml.default.parse(yamlBlock) || {};
    if (rawData.title !== void 0) data.title = String(rawData.title);
    if (rawData.keywords !== void 0) {
      data.keywords = Array.isArray(rawData.keywords) ? rawData.keywords.map(String) : [String(rawData.keywords)];
    }
    if (rawData.byline !== void 0) {
      data.byline = Array.isArray(rawData.byline) ? rawData.byline.map(String) : [String(rawData.byline)];
    }
    if (rawData.image !== void 0) {
      data.image = Array.isArray(rawData.image) ? rawData.image.map(String) : [String(rawData.image)];
    }
    if (rawData.source_url !== void 0) {
      data.source_url = Array.isArray(rawData.source_url) ? rawData.source_url.map(String) : [String(rawData.source_url)];
    }
    if (Array.isArray(rawData.others)) {
      others = [...rawData.others];
    }
    for (const [key, value] of Object.entries(rawData)) {
      if (key !== "title" && key !== "keywords" && key !== "byline" && key !== "image" && key !== "source_url" && key !== "others") {
        others.push({ [key]: value });
      }
    }
    validateStrictFrontmatter(data);
  }
  return { data, others, content };
}
function serializeFrontmatter(data, others, content) {
  validateStrictFrontmatter(data);
  const yamlData = {
    title: data.title,
    keywords: data.keywords
  };
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  parseFrontmatter,
  serializeFrontmatter
});
