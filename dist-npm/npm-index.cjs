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
  BroV1Schema: () => bro_v1_schema_default,
  CREATOR_TYPES: () => CREATOR_TYPES,
  broV1Schema: () => bro_v1_schema_default,
  convertBroToBibframe: () => convertBroToBibframe,
  convertBroToKomarc: () => convertBroToKomarc,
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
  description: "Bibliographic Reaction Object (BRO)\uC758 JSON-LD \uB124\uC774\uD2F0\uBE0C \uC6D0\uC2DC \uC2A4\uD0A4\uB9C8. [ARCHITECTURE DIRECTIVE] 1. \uBCF8 \uC2A4\uD0A4\uB9C8\uB294 \uAC1D\uCCB4 \uB0B4\uD3EC\uB97C \uAE08\uC9C0\uD558\uACE0 @id \uCC38\uC870 \uBB34\uACB0\uC131\uC744 \uBCF4\uC7A5\uD558\uB294 CQRS \uC4F0\uAE30 \uC804\uC6A9 \uBAA8\uB378\uC784. 2. \uAE30\uC874 v1.0\uC758 \uC548\uD2F0\uD328\uD134\uC774\uC5C8\uB358 '\uD14D\uC2A4\uD2B8 \uB0B4 YAML \uC740\uB2C9 \uAD6C\uC870'\uB97C \uC804\uBA74 \uD3D0\uAE30\uD558\uACE0 JSON-LD \uB124\uC774\uD2F0\uBE0C \uAD6C\uC870\uB85C \uB370\uC774\uD130 \uC778\uB371\uC2F1 \uC131\uB2A5\uC744 \uBCF5\uAD6C\uD568. 3. @id\uB294 \uC601\uAD6C \uBD88\uBCC0(Immutable)\uC774\uBA70 \uB370\uC774\uD130 \uAC31\uC2E0 \uC2DC dateModified \uD0C0\uC784\uC2A4\uD0EC\uD504 \uAC31\uC2E0 \uBC0F version \uC18D\uC131 \uC99D\uAC00\uB85C \uBC84\uC804 \uAD00\uB9AC\uD568. 4. Schema.org \uD45C\uC900 \uC5B4\uD718\uB97C \uCD5C\uC0C1\uC704 \uB178\uB4DC\uC5D0\uC11C \uC9C0\uC6D0\uD558\uACE0 \uCEE4\uC2A4\uD140 \uBA54\uD0C0\uB370\uC774\uD130\uB294 additionalProperty(PropertyValue) \uBC30\uC5F4\uB85C \uC218\uC6A9\uD568.",
  type: "object",
  oneOf: [
    { $ref: "#/$defs/BroItemList" },
    { $ref: "#/$defs/BroArticle" },
    { $ref: "#/$defs/BroAbstract" }
  ],
  $defs: {
    BroItemList: {
      type: "object",
      description: "\uB2E4\uC911 \uD0C0\uAC9F \uBB38\uC11C \uD050\uB808\uC774\uC158\uC744 \uC704\uD55C \uC601\uC18D\uC801 \uCEE8\uD14C\uC774\uB108 \uC5D4\uD2F0\uD2F0 (ItemList).",
      required: [
        "@context",
        "@type",
        "@id",
        "creator",
        "itemListElement",
        "dateCreated"
      ],
      properties: {
        "@context": { const: "https://schema.org" },
        "@type": { const: "ItemList" },
        "@id": { $ref: "#/$defs/urnUuidOnly" },
        name: {
          type: "string",
          minLength: 2,
          maxLength: 2e3,
          description: "\uB9AC\uC2A4\uD2B8 \uCEE8\uD14C\uC774\uB108\uC758 \uACE0\uC720 \uBA85\uCE6D."
        },
        dateCreated: { $ref: "#/$defs/strictDateTime" },
        dateModified: {
          $ref: "#/$defs/strictDateTime",
          description: "\uBC84\uC804 \uC81C\uC5B4 \uBC0F \uB3D9\uC2DC\uC131 \uAD00\uB9AC\uB97C \uC704\uD55C \uCD5C\uC885 \uC218\uC815 \uC77C\uC2DC."
        },
        version: {
          type: ["string", "number"],
          description: "\uC5D0\uADF8\uB9AC\uAC70\uD2B8 \uB8E8\uD2B8\uC758 \uBCC0\uACBD \uC774\uB825 \uCD94\uC801 \uBC0F \uB099\uAD00\uC801 \uB77D(Optimistic Locking) \uAC80\uC99D\uC744 \uC704\uD55C \uBC84\uC804 \uD574\uC2DC \uB610\uB294 \uC2DC\uD000\uC2A4 \uB118\uBC84."
        },
        creator: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: { $ref: "#/$defs/creatorRoot" }
        },
        itemListElement: {
          type: "array",
          description: "\uB9AC\uC2A4\uD2B8\uC5D0 \uD3EC\uD568\uB41C \uAC1C\uBCC4 \uBB38\uC11C(Article \uB4F1)\uC758 \uC2DD\uBCC4\uC790 \uBAA9\uB85D. \uC9C1\uC811 \uB0B4\uD3EC(Embedding) \uAE08\uC9C0. \uB370\uC774\uD130 \uB2E8\uD3B8\uD654 \uBC29\uC9C0 \uBC0F URN \uC2DD\uBCC4\uC790 \uC815\uADDC\uD654\uB97C \uC704\uD574 \uCCA0\uC800\uD788 \uD3EC\uC778\uD130 \uAE30\uBC18 \uCC38\uC870\uB85C \uACA9\uB9AC\uD568.",
          items: {
            type: "object",
            required: ["@id"],
            properties: { "@id": { $ref: "#/$defs/urnUuidOnly" } }
          }
        },
        inLanguage: { $ref: "#/$defs/languageArray" },
        keywords: { $ref: "#/$defs/keywordsArray" },
        additionalProperty: { $ref: "#/$defs/additionalPropertyArray" }
      }
    },
    BroArticle: {
      type: "object",
      description: "\uB2E8\uC77C \uD30C\uC0DD \uBB38\uC11C(Article) \uCC98\uB9AC\uB97C \uC704\uD55C \uC601\uC18D\uC131 \uC2A4\uD0A4\uB9C8. \uAE30\uC874 YAML \uD504\uB860\uD2B8\uB9E4\uD130 \uC18D\uC131\uC744 \uC2A4\uD0A4\uB9C8 \uCD5C\uC0C1\uC704 \uD504\uB85C\uD37C\uD2F0\uB85C \uCD94\uCD9C\uD558\uC5EC \uAC80\uC0C9 \uC5D4\uC9C4 \uBC0F DB \uC778\uB371\uC11C\uC758 \uC9C1\uC811 \uC811\uADFC\uC744 \uD5C8\uC6A9\uD568.",
      required: [
        "@context",
        "@type",
        "@id",
        "about",
        "text",
        "creator",
        "dateCreated"
      ],
      properties: {
        "@context": { const: "https://schema.org" },
        "@type": { const: "Article" },
        "@id": { $ref: "#/$defs/urnUuidOnly" },
        name: {
          type: "string",
          description: "\uD30C\uC0DD \uBB38\uC11C \uC790\uCCB4\uC758 \uC81C\uBAA9. \uC2DC\uC2A4\uD15C \uBC18\uD658 \uC2DC Article \uC5D4\uD2F0\uD2F0\uC758 \uCD5C\uC0C1\uC704 \uBA85\uCE6D\uC73C\uB85C \uC0AC\uC6A9\uB428."
        },
        aboutTitle: {
          type: "string",
          description: "\uD604\uC7AC \uBB38\uC11C\uAC00 \uD0C0\uAC9F\uD305(about)\uD558\uACE0 \uC788\uB294 \uC6D0\uBCF8 \uCF54\uC5B4 \uC800\uC791\uBB3C\uC758 \uD14D\uC2A4\uD2B8 \uC81C\uBAA9. \uC6D0\uBB38 URN \uCC38\uC870\uAC00 \uC2E4\uD328\uD558\uAC70\uB098 \uC9C0\uC5F0 \uB85C\uB529\uB420 \uACBD\uC6B0\uC758 \uB514\uADF8\uB808\uC774\uB4DC(Degrade) \uCC98\uB9AC\uB97C \uC704\uD55C \uC5ED\uC815\uADDC\uD654 \uB370\uC774\uD130."
        },
        aboutCreator: {
          type: "string",
          description: "\uD604\uC7AC \uBB38\uC11C\uAC00 \uD0C0\uAC9F\uD305\uD558\uB294 \uC6D0\uBCF8 \uCF54\uC5B4 \uC800\uC791\uBB3C\uC758 \uC6D0\uC791\uC790 \uD14D\uC2A4\uD2B8 \uD45C\uAE30."
        },
        articleByline: {
          type: "string",
          description: "\uD604\uC7AC \uD30C\uC0DD \uBB38\uC11C \uC791\uC131\uC790\uC758 \uD06C\uB808\uB527 \uB77C\uC778 \uD45C\uAE30."
        },
        dateCreated: { $ref: "#/$defs/strictDateTime" },
        dateModified: { $ref: "#/$defs/strictDateTime" },
        datePublished: { $ref: "#/$defs/strictDateTime" },
        version: { type: ["string", "number"] },
        about: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          description: "\uD30C\uC0DD \uBB38\uC11C\uAC00 \uD0C0\uAC9F\uD305\uD558\uB294 \uCF54\uC5B4 \uC800\uC791\uBB3C \uC5D4\uD2F0\uD2F0\uC758 \uC2DD\uBCC4\uC790 \uBB36\uC74C. \uB2E4\uC911 \uD310\uBCF8 \uBC14\uC778\uB529 \uC2DC \uBCF5\uC218 \uC6D0\uC18C\uB97C \uD5C8\uC6A9\uD568.",
          items: { $ref: "#/$defs/terminalIdentifier" }
        },
        text: { $ref: "#/$defs/pureText" },
        inLanguage: { $ref: "#/$defs/languageArray" },
        keywords: { $ref: "#/$defs/keywordsArray" },
        image: {
          type: "array",
          items: { type: "string", format: "uri" },
          description: "\uAD00\uB828 \uC774\uBBF8\uC9C0 URL \uBC30\uC5F4."
        },
        citation: {
          type: "array",
          items: { type: "string", format: "uri" },
          description: "\uCC38\uACE0 \uBB38\uD5CC \uB610\uB294 \uC6D0\uBB38 URL \uBAA9\uB85D."
        },
        abstract: {
          type: "array",
          description: "\uD604\uC7AC \uBB38\uC11C(Article)\uC5D0 \uC885\uC18D\uB41C \uD30C\uC0DD \uC694\uC57D\uBCF8\uC758 \uC2DD\uBCC4\uC790(URN) \uBC30\uC5F4. 1:N \uAD6C\uC870\uC758 \uB514\uC2A4\uD06C \uC911\uBCF5 \uC801\uC7AC\uB97C \uB9C9\uAE30 \uC704\uD55C \uC2DD\uBCC4\uC790 \uCC38\uC870. \uBCF8\uBB38 \uB0B4\uD3EC \uC808\uB300 \uAE08\uC9C0.",
          items: {
            type: "object",
            required: ["@id"],
            properties: { "@id": { $ref: "#/$defs/urnUuidOnly" } }
          }
        },
        creator: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: { $ref: "#/$defs/creatorRoot" }
        },
        additionalProperty: { $ref: "#/$defs/additionalPropertyArray" }
      }
    },
    BroAbstract: {
      type: "object",
      description: "\uAD6C\uC870\uD654\uB41C \uC694\uC57D \uB370\uC774\uD130. isBasedOn \uC18D\uC131\uC744 \uD1B5\uD574 \uC6D0\uBCF8 \uC5ED\uCC38\uC870.",
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
        "@context": { const: "https://schema.org" },
        "@type": { const: "CreativeWork" },
        "@id": { $ref: "#/$defs/urnUuidOnly" },
        dateCreated: { $ref: "#/$defs/strictDateTime" },
        dateModified: { $ref: "#/$defs/strictDateTime" },
        version: { type: ["string", "number"] },
        text: { $ref: "#/$defs/pureText" },
        inLanguage: { $ref: "#/$defs/languageArray" },
        keywords: { $ref: "#/$defs/keywordsArray" },
        image: {
          type: "array",
          items: { type: "string", format: "uri" },
          description: "\uAD00\uB828 \uC774\uBBF8\uC9C0 URL \uBC30\uC5F4."
        },
        citation: {
          type: "array",
          items: { type: "string", format: "uri" },
          description: "\uCC38\uACE0 \uBB38\uD5CC \uB610\uB294 \uC6D0\uBB38 URL \uBAA9\uB85D."
        },
        creator: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: { $ref: "#/$defs/creatorRoot" }
        },
        isBasedOn: {
          type: "array",
          minItems: 1,
          description: "\uC774 \uC694\uC57D\uC774 \uAE30\uBC18\uD558\uACE0 \uC788\uB294 \uC6D0\uBCF8 \uC5D4\uD2F0\uD2F0(Article \uB610\uB294 \uB3C4\uC11C \uB4F1 CreativeWork)\uC758 \uB2E8\uBC29\uD5A5 \uC678\uBD80 \uC2DD\uBCC4\uC790 \uD3EC\uC778\uD130.",
          items: { $ref: "#/$defs/terminalIdentifier" }
        },
        additionalProperty: { $ref: "#/$defs/additionalPropertyArray" }
      }
    },
    pureText: {
      type: "string",
      minLength: 0,
      maxLength: 3e5,
      description: "\uC21C\uC218 \uBCF8\uBB38 \uBB38\uC790\uC5F4 (\uC8FC\uB85C Markdown \uAD6C\uC870). YAML Frontmatter \uCEA1\uC290\uD654\uB97C \uC804\uBA74 \uD3D0\uAE30\uD568. \uC778\uC785 \uD30C\uC774\uD504\uB77C\uC778\uC5D0\uC11C \uBCF8 \uD544\uB4DC \uB0B4\uC758 \uBA54\uD0C0\uB370\uC774\uD130 \uC740\uB2C9\uC744 \uAC10\uC9C0\uD560 \uACBD\uC6B0 \uD398\uC774\uB85C\uB4DC \uC218\uC6A9\uC744 \uAC70\uBD80(Reject)\uD558\uBA70, \uBAA8\uB4E0 \uBA54\uD0C0 \uC18D\uC131\uC740 JSON\uC758 1\uAE09 \uAC1D\uCCB4 \uB610\uB294 additionalProperty\uB85C \uBD84\uB9AC \uCD94\uCD9C\uB418\uC5B4\uC57C \uD568."
    },
    languageArray: {
      type: "array",
      items: {
        type: "string",
        pattern: "^[a-zA-Z]{2,3}(-[a-zA-Z0-9]+)?$"
      },
      description: "BCP 47 / ISO 639 \uC5B8\uC5B4 \uCF54\uB4DC \uBAA9\uB85D."
    },
    keywordsArray: {
      type: "array",
      items: { type: "string" },
      description: "\uBD84\uB958\uC6A9 \uD575\uC2EC\uC5B4 \uBAA9\uB85D."
    },
    additionalPropertyArray: {
      type: "array",
      description: "Schema.org \uD45C\uC900 PropertyValue \uAE30\uBC18 \uB3D9\uC801 \uBA54\uD0C0\uB370\uC774\uD130 \uD655\uC7A5 \uCEE8\uD14C\uC774\uB108. \uB3C4\uC11C\uAD00\uC774\uB098 \uC11C\uBE44\uC2A4\uBCC4\uB85C \uD30C\uD3B8\uD654\uB41C \uCEE4\uC2A4\uD140 \uBA54\uD0C0\uB370\uC774\uD130(\uC608: \uD3C9\uC810, \uC644\uB3C5 \uC5EC\uBD80, \uCD94\uCC9C \uC5F0\uB839 \uB4F1)\uB97C \uC2A4\uD0A4\uB9C8\uB97C \uC624\uC5FC\uC2DC\uD0A4\uC9C0 \uC54A\uACE0 \uC218\uC6A9\uD568. NoSQL\uC774\uB098 RDBMS\uC758 JSON \uCEEC\uB7FC\uC5D0\uC11C \uC644\uBCBD\uD55C \uAE30\uACC4\uC801 \uC778\uB371\uC2F1\uC774 \uAC00\uB2A5\uD568.",
      items: {
        type: "object",
        required: ["@type", "name", "value"],
        properties: {
          "@type": { const: "PropertyValue" },
          name: {
            type: "string",
            description: "\uB3D9\uC801 \uC18D\uC131\uC758 \uC2DD\uBCC4 \uD0A4(Key)"
          },
          value: {
            description: "\uB3D9\uC801 \uC18D\uC131\uC758 \uAC12(Value). \uC6D0\uC2DC \uD0C0\uC785 \uBC0F \uAC1D\uCCB4 \uD5C8\uC6A9."
          }
        }
      }
    },
    urnIdentifier: {
      type: "string",
      description: "[BASE_PRIMITIVES: \uC6D0\uC2DC \uB370\uC774\uD130 \uACC4\uCE35 \uC2DD\uBCC4\uC790] \uC2DC\uC2A4\uD15C \uB808\uBCA8\uC758 \uC18C\uBB38\uC790 URN Scheme \uC815\uADDC\uD654\uB97C \uC804\uC81C\uB85C \uD55C \uC815\uADDC\uC2DD \uC9D1\uD569.",
      oneOf: [
        { pattern: "^urn:isbn:(?:97[89]-?)?(?:\\d[ -]?){9}[\\dxX]$" },
        { pattern: "^urn:doi:10\\.\\d{4,9}\\/[-._;()/:A-Za-z0-9]+$" },
        { pattern: "^urn:uci:[a-zA-Z0-9]{3,10}[:\\-+][a-zA-Z0-9\\-+.:]+$" },
        { pattern: "^urn:kolis:[a-zA-Z0-9]+$" },
        {
          pattern: "^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[457][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"
        },
        { pattern: "^urn:nlk:[a-zA-Z0-9]+$" }
      ]
    },
    urnUuidOnly: {
      type: "string",
      pattern: "^urn:uuid:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[457][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
      description: "UUID v4, v5, v7\uC744 \uC218\uC6A9\uD558\uB294 \uC815\uADDC\uD654\uB41C \uBC94\uC6A9 \uACE0\uC720 \uC2DD\uBCC4\uC790 URN \uD3EC\uB9F7."
    },
    strictDateTime: {
      type: "string",
      format: "date-time",
      pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(?:\\.[0-9]{1,6})?(?:Z|[+-][0-9]{2}:[0-9]{2})$",
      description: "RFC 3339 \uAE30\uBC18 \uD0C0\uC784\uC2A4\uD0EC\uD504 \uAC15\uC81C \uADDC\uACA9. Z \uB610\uB294 \uC624\uD504\uC14B \uBA85\uC2DC\uB97C \uB204\uB77D\uD55C \uACBD\uC6B0 DB \uB370\uC774\uD130 \uC624\uC5FC\uC73C\uB85C \uAC04\uC8FC\uD558\uC5EC \uC778\uC785\uC744 \uCC28\uB2E8\uD568."
    },
    terminalIdentifier: {
      type: "object",
      description: "\uC21C\uD658 \uCC38\uC870(Billion Laughs \uB4F1) \uBB34\uD55C \uB8E8\uD504 \uB80C\uB354\uB9C1 \uACF5\uACA9\uC744 \uC6D0\uCC9C \uCC28\uB2E8\uD558\uAE30 \uC704\uD574 \uACC4\uCE35 \uAE4A\uC774\uB97C \uC81C\uD55C\uD55C \uD130\uBBF8\uB110 \uC2DD\uBCC4 \uAC1D\uCCB4.",
      required: ["@type", "identifier"],
      properties: {
        "@type": { enum: ["Article", "CreativeWork"] },
        identifier: { $ref: "#/$defs/urnIdentifier" }
      },
      additionalProperties: false
    },
    creatorRoot: {
      type: "object",
      description: "[CREATOR_ENTITIES] \uC791\uC131\uC790 \uC5D4\uD2F0\uD2F0 \uB2E4\uD615\uC131 \uACC4\uCE35. \uACF5\uACF5 \uBC0F \uBC95\uC778\uC740 @id \uAC15\uC81C \uAC80\uC99D, \uAC1C\uC778\uC740 \uC218\uC9D1 \uD30C\uD3B8\uD654 \uB300\uC751\uC744 \uC704\uD55C \uC120\uD0DD\uC801 @id \uD5C8\uC6A9, \uC775\uBA85\uC740 \uCD94\uC801 \uBD88\uAC00\uB2A5\uD55C \uC791\uC131\uC790 \uB370\uC774\uD130\uC758 \uC720\uC2E4 \uBC29\uC9C0 Fallback.",
      required: ["@type"],
      oneOf: [
        { $ref: "#/$defs/creatorPerson" },
        { $ref: "#/$defs/creatorAnonymous" },
        { $ref: "#/$defs/creatorGovernment" },
        { $ref: "#/$defs/creatorCorporation" },
        { $ref: "#/$defs/creatorOrganization" },
        { $ref: "#/$defs/creatorSoftware" }
      ]
    },
    creatorPerson: {
      type: "object",
      required: ["@type", "name"],
      properties: {
        "@type": { const: "Person" },
        name: { type: "string", maxLength: 1e3 },
        "@id": {
          description: "\uC778\uC99D\uB41C \uC0AC\uC6A9\uC790\uC5D0 \uD55C\uD574 \uBD80\uC5EC\uB418\uB294 URN/ORCID \uC2DD\uBCC4\uC790. \uD30C\uD3B8\uD654\uB41C \uC678\uBD80 \uB370\uC774\uD130 \uC2A4\uD06C\uB798\uD551 \uC778\uC785 \uC2DC \uC0DD\uB7B5\uC744 \uD5C8\uC6A9\uD568.",
          oneOf: [
            { $ref: "#/$defs/urnUuidOnly" },
            { pattern: "^urn:orcid:\\d{4}-\\d{4}-\\d{4}-\\d{3}[0-9X]$" }
          ]
        }
      },
      additionalProperties: false
    },
    creatorAnonymous: {
      type: "object",
      description: "\uB124\uD2B8\uC6CC\uD06C \uC778\uC785 \uB2E8\uB9D0 \uD639\uC740 \uC218\uC9D1 \uD30C\uC774\uD504\uB77C\uC778\uC5D0\uC11C \uC791\uC131\uC790 \uC5D4\uD2F0\uD2F0 \uCD94\uC801\uC5D0 \uC2E4\uD328\uD560 \uACBD\uC6B0, null/undefined\uB85C \uC778\uD55C \uC2A4\uD0A4\uB9C8 \uD06C\uB798\uC2DC\uB97C \uBC29\uC9C0\uD558\uB294 Fallback \uD0C0\uC785.",
      required: ["@type"],
      properties: {
        "@type": { const: "Anonymous" },
        name: { type: "string", default: "Anonymous", maxLength: 1e3 }
      },
      additionalProperties: false
    },
    creatorGovernment: {
      type: "object",
      required: ["@type", "@id", "name"],
      properties: {
        "@type": { const: "GovernmentOrganization" },
        name: { type: "string", maxLength: 1e3 },
        "@id": {
          oneOf: [
            { $ref: "#/$defs/urnUuidOnly" },
            { pattern: "^urn:kr:govcode:\\d{7}$" }
          ]
        }
      },
      additionalProperties: false
    },
    creatorCorporation: {
      type: "object",
      required: ["@type", "@id", "name"],
      properties: {
        "@type": { const: "Corporation" },
        name: { type: "string", maxLength: 1e3 },
        "@id": {
          oneOf: [
            { $ref: "#/$defs/urnUuidOnly" },
            { pattern: "^urn:kr:crn:\\d{13}$" }
          ]
        }
      },
      additionalProperties: false
    },
    creatorOrganization: {
      type: "object",
      required: ["@type", "@id", "name"],
      properties: {
        "@type": { const: "Organization" },
        name: { type: "string", maxLength: 1e3 },
        "@id": {
          oneOf: [
            { $ref: "#/$defs/urnUuidOnly" },
            { pattern: "^urn:kr:npo:\\d{10}$" }
          ]
        }
      },
      additionalProperties: false
    },
    creatorSoftware: {
      type: "object",
      required: ["@type", "@id", "name"],
      properties: {
        "@type": { const: "SoftwareApplication" },
        name: { type: "string", maxLength: 1e3 },
        softwareVersion: { type: "string", maxLength: 50 },
        "@id": { pattern: "^urn:model:[a-zA-Z0-9-]+:[a-zA-Z0-9\\.-]+$" }
      },
      additionalProperties: false
    }
  }
};

// src/validator/index.ts
var import_json_schema = require("@cfworker/json-schema");

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
var CREATOR_TYPES = [
  "Person",
  "Anonymous",
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

// src/lib/bibframe-converter.ts
function convertBroToBibframe(payload) {
  const isArticle = payload["@type"] === "Article";
  const bfClass = isArticle ? "bf:Review" : "bf:Summary";
  const relationProp = isArticle ? "bf:reviewOf" : "bf:summaryOf";
  const contributions = payload.creator.map((agent) => {
    let bfAgentType = "bf:Agent";
    if (agent["@type"] === "Person") bfAgentType = "bf:Person";
    if (agent["@type"] === "Anonymous") bfAgentType = "bf:Person";
    if (["Organization", "GovernmentOrganization", "Corporation"].includes(agent["@type"])) {
      bfAgentType = "bf:Organization";
    }
    const agentEntry = {
      "@type": bfAgentType,
      "rdfs:label": "name" in agent && agent.name ? agent.name : "Anonymous"
    };
    if ("@id" in agent && agent["@id"]) {
      agentEntry["@id"] = String(agent["@id"]);
    }
    return {
      "@type": "bf:Contribution",
      "bf:agent": agentEntry
    };
  });
  const targets = isArticle ? payload.about : payload.isBasedOn;
  const targetInstances = targets.map((t) => ({
    "@type": "bf:Instance",
    "bf:identifiedBy": {
      "@type": "bf:Identifier",
      "rdf:value": String(t.identifier)
    }
  }));
  const result = {
    "@context": {
      "bf": "http://id.loc.gov/ontologies/bibframe/",
      "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      "rdfs": "http://www.w3.org/2000/01/rdf-schema#"
    },
    "@type": ["bf:Work", bfClass],
    "@id": payload["@id"],
    [relationProp]: targetInstances,
    "bf:originDate": payload.dateCreated,
    ...payload.dateModified && { "bf:changeDate": payload.dateModified },
    "bf:contribution": contributions,
    // 순수 본문 매핑 (JSON Native)
    "bf:note": {
      "@type": "bf:Note",
      "rdfs:label": payload.text
    }
  };
  return result;
}

// src/lib/markdown-renderer.ts
function yamlValue(value) {
  if (value === null || value === void 0) return '""';
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  const str = String(value);
  if (/[:#\[\]{}&*!|>'"%@`,\n]/.test(str) || str.trim() !== str || str === "") {
    return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return str;
}
function yamlStringArray(arr, indent = "") {
  return arr.map((item) => `${indent}  - ${yamlValue(item)}`).join("\n");
}
function yamlCreators(creators, indent = "") {
  return creators.map((c) => {
    const lines = [];
    lines.push(`${indent}  - type: ${yamlValue(c["@type"])}`);
    if ("name" in c && c.name) {
      lines.push(`${indent}    name: ${yamlValue(c.name)}`);
    }
    if ("@id" in c && c["@id"]) {
      lines.push(`${indent}    id: ${yamlValue(String(c["@id"]))}`);
    }
    if (c["@type"] === "SoftwareApplication" && "softwareVersion" in c && c.softwareVersion) {
      lines.push(`${indent}    softwareVersion: ${yamlValue(c.softwareVersion)}`);
    }
    return lines.join("\n");
  }).join("\n");
}
function yamlAdditionalProperty(props) {
  return props.map((p) => {
    return `  - name: ${yamlValue(p.name)}
    value: ${yamlValue(p.value)}`;
  }).join("\n");
}
function renderBroToMarkdown(payload) {
  const frontmatterLines = [];
  frontmatterLines.push(`id: ${yamlValue(payload["@id"])}`);
  frontmatterLines.push(`type: ${yamlValue(payload["@type"])}`);
  frontmatterLines.push(`dateCreated: ${yamlValue(payload.dateCreated)}`);
  if ("dateModified" in payload && payload.dateModified) {
    frontmatterLines.push(`dateModified: ${yamlValue(payload.dateModified)}`);
  }
  if ("datePublished" in payload && payload.datePublished) {
    frontmatterLines.push(`datePublished: ${yamlValue(payload.datePublished)}`);
  }
  if ("version" in payload && payload.version !== void 0) {
    frontmatterLines.push(`version: ${yamlValue(payload.version)}`);
  }
  if ("name" in payload && payload.name) {
    frontmatterLines.push(`name: ${yamlValue(payload.name)}`);
  }
  if (payload["@type"] === "Article") {
    const article = payload;
    if (article.aboutTitle) {
      frontmatterLines.push(`aboutTitle: ${yamlValue(article.aboutTitle)}`);
    }
    if (article.aboutCreator) {
      frontmatterLines.push(`aboutCreator: ${yamlValue(article.aboutCreator)}`);
    }
    if (article.articleByline) {
      frontmatterLines.push(`articleByline: ${yamlValue(article.articleByline)}`);
    }
    frontmatterLines.push(`about:`);
    for (const target of article.about) {
      frontmatterLines.push(`  - type: ${yamlValue(target["@type"])}`);
      frontmatterLines.push(`    identifier: ${yamlValue(target.identifier)}`);
    }
  }
  if (payload["@type"] === "CreativeWork") {
    const abstract = payload;
    frontmatterLines.push(`isBasedOn:`);
    for (const origin of abstract.isBasedOn) {
      frontmatterLines.push(`  - type: ${yamlValue(origin["@type"])}`);
      frontmatterLines.push(`    identifier: ${yamlValue(origin.identifier)}`);
    }
  }
  if (payload["@type"] === "ItemList") {
    const list = payload;
    frontmatterLines.push(`itemListElement:`);
    for (const element of list.itemListElement) {
      frontmatterLines.push(`  - id: ${yamlValue(element["@id"])}`);
    }
  }
  frontmatterLines.push(`creator:`);
  frontmatterLines.push(yamlCreators(payload.creator));
  if ("inLanguage" in payload && payload.inLanguage && payload.inLanguage.length > 0) {
    frontmatterLines.push(`inLanguage:`);
    frontmatterLines.push(yamlStringArray(payload.inLanguage));
  }
  if ("keywords" in payload && payload.keywords && payload.keywords.length > 0) {
    frontmatterLines.push(`keywords:`);
    frontmatterLines.push(yamlStringArray(payload.keywords));
  }
  if ("image" in payload && payload.image && payload.image.length > 0) {
    frontmatterLines.push(`image:`);
    frontmatterLines.push(yamlStringArray(payload.image));
  }
  if ("citation" in payload && payload.citation && payload.citation.length > 0) {
    frontmatterLines.push(`citation:`);
    frontmatterLines.push(yamlStringArray(payload.citation));
  }
  if ("additionalProperty" in payload && payload.additionalProperty && payload.additionalProperty.length > 0) {
    frontmatterLines.push(`additionalProperty:`);
    frontmatterLines.push(yamlAdditionalProperty(payload.additionalProperty));
  }
  const frontmatter = `---
${frontmatterLines.join("\n")}
---`;
  const bodyText = "text" in payload && payload.text ? payload.text : "";
  if (bodyText) {
    return `${frontmatter}

${bodyText}`;
  }
  return frontmatter;
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
  BroV1Schema,
  CREATOR_TYPES,
  broV1Schema,
  convertBroToBibframe,
  convertBroToKomarc,
  normalizePayload,
  normalizeUrnScheme,
  renderBroToMarkdown,
  validateBroSchema
});
