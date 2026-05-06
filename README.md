# Bibliographic Reaction Object (BRO) v1.0 명세서


```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schema.slat.or.kr/bro/v1.0/schema.json",
  "title": "Bibliographic Reaction Object (BRO) v1.0",
  "description": "JSON Schema for BRO v1.0. Paired with the JSON-LD context at https://schema.slat.or.kr/bro/v1.0/context.jsonld and the vocabulary IRI https://schema.slat.or.kr/bro/v1.0/vocab#. RFC 2119/8174 keywords apply. This is an exchange-only schema; runtime concerns such as optimistic locking, ETag issuance, ingestion timestamps, and cache invalidation are explicitly out of scope.",
  "type": "object",
  "oneOf": [
    { "$ref": "#/$defs/Reaction" },
    { "$ref": "#/$defs/ReactionAbstract" },
    { "$ref": "#/$defs/ReactionList" }
  ],

  "$defs": {

    "Reaction": {
      "type": "object",
      "title": "Reaction",
      "description": "A unit of response (textual review, short comment, listing entry, or unspecified) targeting one or more external core works. Subclass of schema:CreativeWork.",
      "required": ["@context", "@type", "@id", "reactionType", "about", "text", "creator", "dateCreated"],
      "properties": {
        "@context":      { "$ref": "#/$defs/contextRef" },
        "@type":         { "const": "Reaction" },
        "@id":           { "$ref": "#/$defs/entityIri" },
        "reactionType":  { "$ref": "#/$defs/reactionType" },
        "name":          { "$ref": "#/$defs/plainText" },
        "byline":        { "$ref": "#/$defs/bylineString" },
        "about": {
          "type": "array",
          "minItems": 1,
          "maxItems": 5,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/externalReference" }
        },
        "text":          { "$ref": "#/$defs/bodyText" },
        "textFormat":    { "$ref": "#/$defs/textFormat" },
        "creator": {
          "type": "array",
          "minItems": 1,
          "maxItems": 100,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/agent" }
        },
        "dateCreated":   { "$ref": "#/$defs/rfc3339DateTime" },
        "dateModified":  { "$ref": "#/$defs/rfc3339DateTime" },
        "datePublished": { "$ref": "#/$defs/rfc3339DateTime" },
        "license":       { "$ref": "#/$defs/httpsIri" },
        "inLanguage":    { "$ref": "#/$defs/languageTagArray" },
        "keywords":      { "$ref": "#/$defs/keywordsArray" },
        "image": {
          "type": "array",
          "maxItems": 50,
          "uniqueItems": true,
          "items": { "type": "string", "format": "uri" }
        },
        "citation": {
          "type": "array",
          "maxItems": 200,
          "uniqueItems": true,
          "items": { "type": "string", "format": "uri" }
        },
        "additionalProperty": { "$ref": "#/$defs/additionalPropertyArray" }
      },
      "patternProperties": {
        "^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$": { "$ref": "#/$defs/extensionValue" }
      },
      "additionalProperties": false,
      "allOf": [
        {
          "if":   { "properties": { "reactionType": { "const": "Response" } }, "required": ["reactionType"] },
          "then": { "properties": { "text": { "minLength": 1 } } }
        }
      ]
    },

    "ReactionAbstract": {
      "type": "object",
      "title": "ReactionAbstract",
      "description": "A structured summary derived from a Reaction or directly from an external core work. Subclass of schema:CreativeWork.",
      "required": ["@context", "@type", "@id", "text", "creator", "dateCreated", "isBasedOn"],
      "properties": {
        "@context":      { "$ref": "#/$defs/contextRef" },
        "@type":         { "const": "ReactionAbstract" },
        "@id":           { "$ref": "#/$defs/entityIri" },
        "name":          { "$ref": "#/$defs/plainText" },
        "byline":        { "$ref": "#/$defs/bylineString" },
        "text": {
          "$ref": "#/$defs/bodyText",
          "minLength": 1
        },
        "textFormat":    { "$ref": "#/$defs/textFormat" },
        "creator": {
          "type": "array",
          "minItems": 1,
          "maxItems": 100,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/agent" }
        },
        "dateCreated":   { "$ref": "#/$defs/rfc3339DateTime" },
        "dateModified":  { "$ref": "#/$defs/rfc3339DateTime" },
        "datePublished": { "$ref": "#/$defs/rfc3339DateTime" },
        "license":       { "$ref": "#/$defs/httpsIri" },
        "isBasedOn": {
          "type": "array",
          "minItems": 1,
          "maxItems": 5,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/externalReference" }
        },
        "inLanguage":    { "$ref": "#/$defs/languageTagArray" },
        "keywords":      { "$ref": "#/$defs/keywordsArray" },
        "image": {
          "type": "array",
          "maxItems": 50,
          "uniqueItems": true,
          "items": { "type": "string", "format": "uri" }
        },
        "citation": {
          "type": "array",
          "maxItems": 200,
          "uniqueItems": true,
          "items": { "type": "string", "format": "uri" }
        },
        "additionalProperty": { "$ref": "#/$defs/additionalPropertyArray" }
      },
      "patternProperties": {
        "^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$": { "$ref": "#/$defs/extensionValue" }
      },
      "additionalProperties": false
    },

    "ReactionList": {
      "type": "object",
      "title": "ReactionList",
      "description": "A persistent curation container that aggregates Reaction and/or ReactionAbstract instances by reference. Subclass of schema:ItemList.",
      "required": ["@context", "@type", "@id", "creator", "itemListElement", "dateCreated"],
      "properties": {
        "@context":      { "$ref": "#/$defs/contextRef" },
        "@type":         { "const": "ReactionList" },
        "@id":           { "$ref": "#/$defs/entityIri" },
        "name":          { "$ref": "#/$defs/plainText" },
        "byline":        { "$ref": "#/$defs/bylineString" },
        "creator": {
          "type": "array",
          "minItems": 1,
          "maxItems": 100,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/agent" }
        },
        "itemListElement": {
          "type": "array",
          "minItems": 0,
          "maxItems": 10000,
          "uniqueItems": true,
          "items": { "$ref": "#/$defs/elementReference" }
        },
        "dateCreated":   { "$ref": "#/$defs/rfc3339DateTime" },
        "dateModified":  { "$ref": "#/$defs/rfc3339DateTime" },
        "license":       { "$ref": "#/$defs/httpsIri" },
        "inLanguage":    { "$ref": "#/$defs/languageTagArray" },
        "keywords":      { "$ref": "#/$defs/keywordsArray" },
        "additionalProperty": { "$ref": "#/$defs/additionalPropertyArray" }
      },
      "patternProperties": {
        "^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$": { "$ref": "#/$defs/extensionValue" }
      },
      "additionalProperties": false
    },

    "reactionType": {
      "type": "string",
      "enum": ["Response", "Listing", "Unspecified"],
      "default": "Unspecified",
      "description": "Discriminator for the reaction's ontological intent. Response: the reaction is a textual response (review/comment/critique); a body is required. Listing: the reaction is a curation entry (recommended-list inclusion, endorsement) regardless of body presence. Unspecified: the publisher explicitly declines to classify."
    },

    "contextRef": {
      "description": "MUST resolve to the BRO v1.0 context. Either the bare context IRI or an array containing it.",
      "oneOf": [
        { "const": "https://schema.slat.or.kr/bro/v1.0/context.jsonld" },
        {
          "type": "array",
          "minItems": 1,
          "contains": { "const": "https://schema.slat.or.kr/bro/v1.0/context.jsonld" },
          "items": {
            "oneOf": [
              { "type": "string", "format": "uri" },
              { "type": "object" }
            ]
          }
        }
      ]
    },

    "entityIri": {
      "description": "Identifier for a BRO entity instance. UUID URN or HTTPS IRI.",
      "anyOf": [
        { "$ref": "#/$defs/uuidUrn" },
        { "$ref": "#/$defs/httpsIri" }
      ]
    },

    "agentIri": {
      "description": "Identifier for an agent. UUID URN, HTTPS IRI, or mailto: URI.",
      "anyOf": [
        { "$ref": "#/$defs/uuidUrn" },
        { "$ref": "#/$defs/httpsIri" },
        { "$ref": "#/$defs/mailtoUri" }
      ]
    },

    "anyIri": {
      "anyOf": [
        { "$ref": "#/$defs/uuidUrn" },
        { "$ref": "#/$defs/httpsIri" },
        { "$ref": "#/$defs/mailtoUri" },
        { "$ref": "#/$defs/isbnUrn" },
        { "$ref": "#/$defs/doiHttpsIri" },
        { "$ref": "#/$defs/orcidHttpsIri" }
      ]
    },

    "uuidUrn": {
      "type": "string",
      "description": "RFC 9562 UUID URN, canonical lowercase. Versions 1, 4, 5, 6, 7, 8.",
      "pattern": "^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
    },

    "httpsIri": {
      "type": "string",
      "description": "HTTPS IRI. Domain MUST contain at least one dot and end in a 2+ character TLD label. Syntactic only — TLD validity, IDN normalization, and dereferenceability remain the application layer's responsibility. IDN MUST be punycode-encoded.",
      "pattern": "^https://(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}(?::[0-9]{1,5})?(?:/[^\\s<>\"\\\\^`{|}]*)?$",
      "maxLength": 2048
    },

    "mailtoUri": {
      "type": "string",
      "description": "RFC 6068 mailto URI. Permitted only as an agent identifier. Publishers SHOULD apply hashing or consent-based handling for PII.",
      "pattern": "^mailto:[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      "maxLength": 320
    },

    "externalReference": {
      "type": "object",
      "description": "Terminal pointer to an external core work or another BRO entity.",
      "required": ["@type", "identifier"],
      "properties": {
        "@type": {
          "type": "string",
          "enum": ["Article", "CreativeWork", "Book", "ScholarlyArticle", "Reaction", "ReactionAbstract"]
        },
        "identifier": { "$ref": "#/$defs/externalIdentifier" }
      },
      "additionalProperties": false
    },

    "elementReference": {
      "type": "object",
      "description": "Pointer to another BRO entity within the same exchange.",
      "required": ["@id"],
      "properties": {
        "@id":   { "$ref": "#/$defs/entityIri" },
        "@type": { "type": "string", "enum": ["Reaction", "ReactionAbstract", "ReactionList"] }
      },
      "additionalProperties": false
    },

    "externalIdentifier": {
      "description": "Identifier for external core works.",
      "anyOf": [
        { "$ref": "#/$defs/isbnUrn" },
        { "$ref": "#/$defs/doiHttpsIri" },
        { "$ref": "#/$defs/orcidHttpsIri" },
        { "$ref": "#/$defs/uuidUrn" },
        { "$ref": "#/$defs/httpsIri" }
      ]
    },

    "isbnUrn": {
      "type": "string",
      "description": "ISBN-10 or ISBN-13 in URN form. Hyphens limited to 4 occurrences. Whitespace forbidden. Strict checksum and group-code validation are the application layer's responsibility.",
      "pattern": "^urn:isbn:(?:97[89][0-9]{10}|97[89](?:-[0-9]+){1,4}|[0-9]{9}[0-9Xx]|[0-9]+(?:-[0-9]+){1,4}-?[0-9Xx])$"
    },

    "doiHttpsIri": {
      "type": "string",
      "description": "DOI in canonical HTTPS form. Standard DOI (10.NNNN/...) and ShortDOI (10/...) are both accepted.",
      "pattern": "^https://doi\\.org/10(?:\\.[0-9]{4,9})?/[\\x21-\\x7e]+$"
    },

    "orcidHttpsIri": {
      "type": "string",
      "description": "ORCID iD in canonical HTTPS form.",
      "pattern": "^https://orcid\\.org/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$"
    },

    "rfc3339DateTime": {
      "type": "string",
      "format": "date-time",
      "description": "RFC 3339 date-time. Time-zone designation Z or numeric offset is required; naive datetimes are rejected. Leap seconds permitted.",
      "pattern": "^[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])T(?:[01][0-9]|2[0-3]):[0-5][0-9]:(?:[0-5][0-9]|60)(?:\\.[0-9]+)?(?:Z|[+-](?:[01][0-9]|2[0-3]):[0-5][0-9])$"
    },

    "rfc3339Date": {
      "type": "string",
      "description": "RFC 3339 full-date (YYYY-MM-DD) with no time component. Used for role start/end dates where time precision is irrelevant.",
      "pattern": "^[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$"
    },

    "languageTag": {
      "type": "string",
      "description": "BCP 47 language tag, syntactic validation only.",
      "pattern": "^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{1,8})*$",
      "maxLength": 35
    },

    "languageTagArray": {
      "type": "array",
      "minItems": 1,
      "maxItems": 20,
      "uniqueItems": true,
      "items": { "$ref": "#/$defs/languageTag" }
    },

    "plainText": {
      "type": "string",
      "minLength": 1,
      "maxLength": 2000,
      "description": "A short human-readable string in the document's primary language declared by inLanguage."
    },

    "bylineString": {
      "type": "string",
      "minLength": 1,
      "maxLength": 2000,
      "description": "A free-form display string preserving the original attribution as it appears in the source. MUST be a string only; structured Role objects belong inside `creator`."
    },

    "keywordsArray": {
      "type": "array",
      "minItems": 0,
      "maxItems": 100,
      "items": {
        "type": "string",
        "minLength": 1,
        "maxLength": 200
      }
    },

    "bodyText": {
      "type": "string",
      "description": "The body text. UTF-8. The string MUST NOT begin with a YAML/TOML front-matter block.",
      "minLength": 0,
      "maxLength": 300000
    },

    "textFormat": {
      "type": "string",
      "description": "MIME type hint per RFC 6838. Free-form to accommodate evolving formats. Absent means text/plain. Consumers MAY apply their own rendering heuristics regardless of this hint.",
      "pattern": "^[a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]{0,126}/[a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]{0,126}(?:\\s*;\\s*[a-zA-Z0-9!#$&^_.+-]+=(?:[a-zA-Z0-9!#$&^_.+-]+|\"[^\"]*\"))*$",
      "maxLength": 255
    },

    "agent": {
      "description": "Polymorphic creator entity, distinguished by @type.",
      "oneOf": [
        { "$ref": "#/$defs/agentPerson" },
        { "$ref": "#/$defs/agentUnknown" },
        { "$ref": "#/$defs/agentGovernment" },
        { "$ref": "#/$defs/agentCorporation" },
        { "$ref": "#/$defs/agentOrganization" },
        { "$ref": "#/$defs/agentSoftware" },
        { "$ref": "#/$defs/agentRole" }
      ]
    },

    "agentPerson": {
      "type": "object",
      "required": ["@type", "name"],
      "properties": {
        "@type": { "const": "Person" },
        "@id":   { "$ref": "#/$defs/agentIri" },
        "name":  { "type": "string", "minLength": 1, "maxLength": 1000 }
      },
      "additionalProperties": false
    },

    "agentUnknown": {
      "type": "object",
      "description": "Explicit declaration that the publisher cannot identify the agent. Each instance is a fresh blank node by design (no global singleton).",
      "required": ["@type"],
      "properties": {
        "@type": { "const": "UnknownAgent" },
        "name":  { "type": "string", "maxLength": 1000 }
      },
      "additionalProperties": false
    },

    "agentGovernment": {
      "type": "object",
      "required": ["@type", "name"],
      "properties": {
        "@type": { "const": "GovernmentOrganization" },
        "@id":   { "anyOf": [{ "$ref": "#/$defs/uuidUrn" }, { "$ref": "#/$defs/httpsIri" }] },
        "name":  { "type": "string", "minLength": 1, "maxLength": 1000 }
      },
      "additionalProperties": false
    },

    "agentCorporation": {
      "type": "object",
      "required": ["@type", "name"],
      "properties": {
        "@type": { "const": "Corporation" },
        "@id":   { "anyOf": [{ "$ref": "#/$defs/uuidUrn" }, { "$ref": "#/$defs/httpsIri" }] },
        "name":  { "type": "string", "minLength": 1, "maxLength": 1000 }
      },
      "additionalProperties": false
    },

    "agentOrganization": {
      "type": "object",
      "required": ["@type", "name"],
      "properties": {
        "@type": { "const": "Organization" },
        "@id":   { "anyOf": [{ "$ref": "#/$defs/uuidUrn" }, { "$ref": "#/$defs/httpsIri" }] },
        "name":  { "type": "string", "minLength": 1, "maxLength": 1000 }
      },
      "additionalProperties": false
    },

    "agentSoftware": {
      "type": "object",
      "required": ["@type", "@id", "name"],
      "properties": {
        "@type":           { "const": "SoftwareApplication" },
        "@id":             { "$ref": "#/$defs/httpsIri" },
        "name":            { "type": "string", "minLength": 1, "maxLength": 1000 },
        "softwareVersion": { "type": "string", "minLength": 1, "maxLength": 50 }
      },
      "additionalProperties": false
    },

    "agentRole": {
      "type": "object",
      "description": "Reified role at the time of authorship. Used inside `creator` to preserve time-bounded affiliations without conflating them with the agent's enduring identity.",
      "required": ["@type", "agent"],
      "properties": {
        "@type":     { "const": "Role" },
        "roleName":  { "type": "string", "minLength": 1, "maxLength": 1000 },
        "startDate": { "$ref": "#/$defs/rfc3339Date" },
        "endDate":   { "$ref": "#/$defs/rfc3339Date" },
        "agent":     { "$ref": "#/$defs/agentInRole" }
      },
      "additionalProperties": false
    },

    "agentInRole": {
      "description": "Inner agent inside a Role. Role itself is excluded to prevent recursive nesting.",
      "oneOf": [
        { "$ref": "#/$defs/agentPerson" },
        { "$ref": "#/$defs/agentUnknown" },
        { "$ref": "#/$defs/agentGovernment" },
        { "$ref": "#/$defs/agentCorporation" },
        { "$ref": "#/$defs/agentOrganization" },
        { "$ref": "#/$defs/agentSoftware" }
      ]
    },

    "additionalPropertyArray": {
      "type": "array",
      "maxItems": 200,
      "items": { "$ref": "#/$defs/additionalPropertyValue" }
    },

    "additionalPropertyValue": {
      "type": "object",
      "required": ["@type", "name", "value"],
      "properties": {
        "@type":          { "const": "PropertyValue" },
        "name":           { "type": "string", "minLength": 1, "maxLength": 200 },
        "propertyID":     { "type": "string", "format": "uri" },
        "value":          {},
        "valueReference": { "type": "string", "format": "uri" },
        "unitCode":       { "type": "string", "maxLength": 50 },
        "unitText":       { "type": "string", "maxLength": 50 }
      },
      "additionalProperties": false
    },

    "extensionValue": {
      "description": "Value of an extension property under a colon-prefixed namespace. Limited in depth and size to prevent payload bombs.",
      "oneOf": [
        { "type": "string",  "maxLength": 10000 },
        { "type": "number" },
        { "type": "boolean" },
        { "type": "null" },
        {
          "type": "object",
          "maxProperties": 20,
          "properties": {
            "@id":       { "$ref": "#/$defs/anyIri" },
            "@type":     { "type": "string", "maxLength": 200 },
            "@value":    { "type": ["string", "number", "boolean"] },
            "@language": { "$ref": "#/$defs/languageTag" }
          },
          "patternProperties": {
            "^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$": {
              "oneOf": [
                { "type": "string",  "maxLength": 10000 },
                { "type": "number" },
                { "type": "boolean" },
                { "type": "null" },
                { "type": "object", "maxProperties": 20 },
                { "type": "array",  "maxItems": 100 }
              ]
            }
          },
          "additionalProperties": false
        },
        {
          "type": "array",
          "maxItems": 100,
          "items": {
            "oneOf": [
              { "type": "string",  "maxLength": 10000 },
              { "type": "number" },
              { "type": "boolean" },
              { "type": "object", "maxProperties": 20 }
            ]
          }
        }
      ]
    }
  }
}
```

```jsonld
{
  "@context": {
    "@version": 1.1,
    "@protected": true,
    "@base": "https://schema.slat.or.kr/bro/v1.0/instances/",

    "schema": "https://schema.org/",
    "bro":    "https://schema.slat.or.kr/bro/v1.0/vocab#",
    "xsd":    "http://www.w3.org/2001/XMLSchema#",
    "rdfs":   "http://www.w3.org/2000/01/rdf-schema#",
    "prov":   "http://www.w3.org/ns/prov#",

    "Reaction": {
      "@id": "bro:Reaction",
      "@context": {
        "creator": { "@id": "schema:author", "@container": "@set" }
      }
    },
    "ReactionAbstract": {
      "@id": "bro:ReactionAbstract",
      "@context": {
        "creator": { "@id": "schema:author", "@container": "@set" }
      }
    },
    "ReactionList": {
      "@id": "bro:ReactionList",
      "@context": {
        "creator": { "@id": "schema:creator", "@container": "@set" }
      }
    },

    "Person":                 "schema:Person",
    "UnknownAgent":           "bro:UnknownAgent",
    "GovernmentOrganization": "schema:GovernmentOrganization",
    "Corporation":            "schema:Corporation",
    "Organization":           "schema:Organization",
    "SoftwareApplication":    "schema:SoftwareApplication",
    "Role":                   "schema:Role",
    "PropertyValue":          "schema:PropertyValue",
    "Article":                "schema:Article",
    "CreativeWork":           "schema:CreativeWork",
    "Book":                   "schema:Book",
    "ScholarlyArticle":       "schema:ScholarlyArticle",

    "reactionType": { "@id": "bro:reactionType", "@type": "@vocab" },
    "Response":     "bro:Response",
    "Listing":      "bro:Listing",
    "Unspecified":  "bro:Unspecified",

    "name":       "schema:name",
    "byline":     "bro:byline",
    "text":       "schema:text",
    "textFormat": "schema:encodingFormat",
    "roleName":   "schema:roleName",
    "agent":      "schema:agent",

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

    "license":       { "@id": "schema:license",       "@type": "@id" },
    "dateCreated":   { "@id": "schema:dateCreated",   "@type": "xsd:dateTime" },
    "dateModified":  { "@id": "schema:dateModified",  "@type": "xsd:dateTime" },
    "datePublished": { "@id": "schema:datePublished", "@type": "xsd:dateTime" },
    "startDate":     { "@id": "schema:startDate",     "@type": "xsd:date" },
    "endDate":       { "@id": "schema:endDate",       "@type": "xsd:date" },

    "softwareVersion": "schema:softwareVersion",

    "about":           { "@id": "schema:about",           "@container": "@set" },
    "isBasedOn":       { "@id": "schema:isBasedOn",       "@container": "@set" },
    "itemListElement": { "@id": "schema:itemListElement", "@container": "@list" },

    "identifier": {
      "@id": "schema:identifier",
      "@type": "@id"
    },

    "additionalProperty": {
      "@id": "schema:additionalProperty",
      "@container": "@set"
    },
    "value":          "schema:value",
    "valueReference": "schema:valueReference",
    "propertyID":     "schema:propertyID",
    "unitCode":       "schema:unitCode",
    "unitText":       "schema:unitText"
  }
}
```

# Bibliographic Reaction Object (BRO) v1.0

| 항목 | 값 |
|---|---|
| 표준 식별자 | `https://schema.slat.or.kr/bro/v1.0/schema.json` |
| JSON-LD 컨텍스트 | `https://schema.slat.or.kr/bro/v1.0/context.jsonld` |
| 어휘 IRI | `https://schema.slat.or.kr/bro/v1.0/vocab#` |
| 사양 | JSON Schema Draft 2020-12 + JSON-LD 1.1 |
| 발행 주체 | SLAT |
| 라이선스 | CC BY 4.0 |

---

## 0. 개요

### 0.1 본 사양이 다루는 것

도서·논문 등 서지 자원에 대한 인간 또는 기계의 2차 저작 활동(서평, 독후감, 감상문, 추천 리스트, 요약)을 **시스템 간에 손실 없이 교환**하기 위한 페이로드 표준이다.

### 0.2 본 사양이 다루지 않는 것

- 저장소의 내부 데이터 모델
- 낙관적 락, ETag 발행, 버전 관리, 감사 로그
- 인입 시각, 캐시 적재 시각, 신선도 정책
- 본문 렌더링 방식 및 보안 정제
- 검색 인덱싱 전략, 권한 모델

### 0.3 설계 철학

본 사양은 두 축의 균형을 명시적으로 추구한다.

1. **명시적 선언 강제** — 침묵(필드 누락, null)을 정보로 취급하지 않는다. 작성자가 모르는 정보는 자유 텍스트(`byline`)나 명시적 미상 어휘(`UnknownAgent`)로 선언해야 한다.
2. **레거시 수용** — 작성 당시의 직책, 부분 정밀도 시각, 정규화 불가능한 출처 표기를 변환자가 자의적으로 해석하지 않고 보존한다.

두 축이 충돌할 때 본 사양은 일관되게 **레거시 수용**을 우선한다. 시맨틱 웹 정통 모델보다 작성자 친화성이 우선한다.

### 0.4 표기 규약

본 명세서의 키워드 **MUST**, **MUST NOT**, **SHALL**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, **OPTIONAL** 은 RFC 2119/8174의 정의를 따른다.

---

## 1. 데이터 모델 개요

본 사양은 세 가지 엔티티를 정의한다. 페이로드는 정확히 하나의 엔티티에 매칭되어야 한다.

| 엔티티 | `@type` | 상위 어휘 | 역할 |
|---|---|---|---|
| `Reaction` | `"Reaction"` | `schema:CreativeWork` | 코어 저작물에 대한 단일 응답 단위 |
| `ReactionAbstract` | `"ReactionAbstract"` | `schema:CreativeWork` | 반응 또는 코어 저작물에 기반한 요약 |
| `ReactionList` | `"ReactionList"` | `schema:ItemList` | 복수의 반응을 묶은 큐레이션 목록 |

### 엔티티 관계도

```
            ReactionList
                 │ itemListElement[*]
                 ▼
            Reaction ──about[1..5]──▶ External Core Work
                 ▲                    (urn:isbn / doi.org / …)
                 │ isBasedOn[1..5]
                 │
            ReactionAbstract
```

요약(ReactionAbstract)은 Reaction을 단방향으로 가리킨다. Reaction은 자신의 요약 목록을 들고 다니지 않는다.

---

## 2. 공통 데이터 타입

### 2.1 식별자

#### entityIri (BRO 인스턴스 자체의 식별자)

| 형식 | 예시 |
|---|---|
| UUID URN (RFC 9562) | `urn:uuid:7c9e6679-7425-40de-944b-e07fc1f90ae7` |
| HTTPS IRI | `https://library.example.kr/reactions/2026/r-9182` |

UUID URN은 **소문자 정규형**이어야 한다. 대문자는 거부된다. UUID 버전 1, 4, 5, 6, 7, 8을 허용한다.

#### agentIri

위에 더해 다음을 추가로 허용한다.

| 형식 | 예시 |
|---|---|
| `mailto:` URI | `mailto:dokja@example.org` |
| HTTPS 핸들 | `https://blog.example.com/@dokja` |
| ORCID HTTPS | `https://orcid.org/0000-0002-1825-0097` |

`mailto:`는 PII이므로 발행 시스템은 해싱 또는 동의 기반 처리를 적용하는 것을 **RECOMMENDED**.

#### 좋은 식별자 예시

```json
"@id": "urn:uuid:7c9e6679-7425-40de-944b-e07fc1f90ae7"
"@id": "https://library.example.kr/reactions/2026/r-9182"
"@id": "https://blog.example.com/posts/1984-review"
```

#### 잘못된 식별자 예시

```json
"@id": "urn:uuid:7C9E6679-7425-40DE-944B-E07FC1F90AE7"  // 대문자 거부
"@id": "review-1984-by-dokja"                            // IRI 아님
"@id": "http://library.example.kr/reactions/r-9182"      // HTTP 거부
"@id": "https://localhost/r-9182"                        // TLD 없음
"@id": "https://192.168.1.1/r-9182"                      // IP 직접 거부
```

---

### 2.2 외부 식별자

코어 저작물(반응의 대상)을 가리키는 식별자.

| 형식 | 예시 |
|---|---|
| ISBN URN | `urn:isbn:9788937462788` |
| DOI HTTPS | `https://doi.org/10.1038/s41586-021-03819-2` |
| ShortDOI HTTPS | `https://doi.org/10/abcde` |
| ORCID HTTPS | `https://orcid.org/0000-0002-1825-0097` |
| HTTPS IRI | `https://www.nl.go.kr/NL/contents/...` |
| UUID URN | `urn:uuid:...` (다른 BRO 인스턴스) |

#### 좋은 사용 예시

```json
{ "@type": "Book", "identifier": "urn:isbn:9788937462788" }
{ "@type": "Book", "identifier": "urn:isbn:978-89-374-6278-8" }
{ "@type": "ScholarlyArticle", "identifier": "https://doi.org/10.1038/s41586-021-03819-2" }
{ "@type": "CreativeWork", "identifier": "https://news.example.com/2025/01/article" }
{ "@type": "Reaction", "identifier": "urn:uuid:7c9e6679-7425-40de-944b-e07fc1f90ae7" }
```

#### 잘못된 사용 예시

```json
{ "@type": "Book", "identifier": "urn:isbn:978-8-9-3-7-4-6-2-7-8-8" }   // 하이픈 5개 초과
{ "@type": "Book", "identifier": "9788937462788" }                       // urn:isbn: 접두사 없음
{ "@type": "Book", "identifier": "urn:isbn:978 89 374 6278 8" }          // 공백 거부
{ "@type": "Book", "identifier": "doi:10.1038/s41586-021-03819-2" }      // urn:doi: 거부, HTTPS 형태 사용
```

#### 국가별 식별자

KOLIS 일련번호, NLK 제어번호, KCI 논문 ID 등은 본 사양의 핵심 식별자에 포함되지 않는다. `additionalProperty`로 표현한다.

```json
"about": [{ "@type": "Book", "identifier": "urn:isbn:9788937462788" }],
"additionalProperty": [
  {
    "@type": "PropertyValue",
    "name": "kr-nlk:cnumber",
    "propertyID": "https://schema.slat.or.kr/national/kr-nlk#cnumber",
    "value": "CIP2018024829"
  }
]
```

---

### 2.3 시각

RFC 3339 형식. 시간대 지정자 필수.

| 유효 | 무효 |
|---|---|
| `2026-04-15T18:22:00+09:00` | `2026-04-15 18:22:00` |
| `2026-04-15T09:22:00Z` | `2026-04-15T18:22:00` |
| `1995-04-01T00:00:00+09:00` | `2026/04/15` |

#### `dateCreated`의 의미

콘텐츠가 만들어진 시각. **콘텐츠 시간 영역**이다 (인입·저장 시각이 아님). 작성자가 자유롭게 지정 가능하며, 시스템은 비어있을 때만 인입 시각으로 자동 보완한다.

#### 레거시 부분 정밀도

```json
"dateCreated": "1995-04-01T00:00:00+09:00",
"additionalProperty": [
  { "@type": "PropertyValue", "name": "ops:dateCreatedPrecision", "value": "month" }
]
```

`ops:dateCreatedPrecision` 값: `year` / `month` / `day` / `second`.

---

### 2.4 reactionType (Reaction 한정)

`Reaction`의 **필수 필드**. 발신자가 명시적으로 분류 책임을 진다.

| 값 | 의미 | text 정책 |
|---|---|---|
| `Response` | 텍스트 응답 (후기·코멘트·비평) | `minLength: 1` 강제 |
| `Listing` | 단순 등재 (추천 리스트, 권장 도서) | 본문 자유 (있으면 등재 사유 메모) |
| `Unspecified` | 발신자가 분류를 명시적으로 포기 | 본문 자유 |

#### 분류 결정 가이드

- 작성자가 책에 대해 의견을 표현하고 본문이 있는가? → `Response`
- 작성자가 책을 목록에 포함시키는 행위인가? 본문 유무 무관 → `Listing`
- 발신자가 둘 중 어느 쪽인지 결정할 수 없는가? → `Unspecified`

#### 좋은 예시

```json
{ "reactionType": "Response", "text": "오웰의 신어는 ..." }
{ "reactionType": "Listing", "text": "" }
{ "reactionType": "Listing", "text": "권장 도서로 선정. 학생들이 읽기 쉬움." }
{ "reactionType": "Unspecified", "text": "원본에 분류 정보가 없었음" }
```

#### 잘못된 예시

```json
{ "reactionType": "Response", "text": "" }                  // Response는 본문 필수
{ "reactionType": null }                                    // null 거부
{ /* reactionType 키 자체가 없음 */ }                       // 필드 누락은 비준수
{ "reactionType": "Review" }                                // enum에 없음
```

---

### 2.5 인간 가독 텍스트

`name`, `byline`, `keywords` 항목은 단순 문자열이다. 길이는 1–2,000자 (키워드는 1–200자). 다국어 객체는 받지 않는다.

다국어가 필요한 발행자는 (1) 언어별 별도 인스턴스 발행, 또는 (2) `additionalProperty`로 자체 어휘 부착으로 자율 처리한다.

```json
"name": "전체주의의 언어"
"byline": "탐진치 (작성 당시 국어국문학과 교수)"
"keywords": ["디스토피아", "전체주의"]
"inLanguage": ["ko"]
```

---

### 2.6 본문 (`text`, `textFormat`)

#### `text`

UTF-8 문자열, 0–300,000자. `reactionType=Response`일 때 `minLength: 1` 강제.

#### `textFormat` (선택)

본문의 MIME 타입 힌트. RFC 6838 구문 자유 형식. 생략 시 `text/plain`으로 간주.

| 흔한 값 |
|---|
| `text/plain` |
| `text/markdown` |
| `text/markdown; variant=CommonMark` |
| `text/markdown; variant=GFM` |
| `text/markdown; variant=MDX` |
| `text/html` |
| `text/x-asciidoc` |

`textFormat`은 **힌트**다. 받는 시스템은 자체 휴리스틱으로 처리할 수 있다.

#### 주의 사항

메타데이터는 1급 필드 또는 `additionalProperty`로 분리되어야 한다.

#### 좋은 예시

```json
{ "text": "오늘 1984를 다 읽었다. 마지막 장면이 인상적이었다." }
{ "text": "재미있었다.", "textFormat": "text/plain" }
{ "text": "# 전체주의의 언어\n\n오웰이 그린 ...", "textFormat": "text/markdown; variant=CommonMark" }
{ "text": "<p>오웰이 그린 <em>전체주의 사회</em>...</p>", "textFormat": "text/html" }
```

#### 잘못된 예시

```json
"text": "---\nrating: 5\n---\n\n오늘 ..."  // 프론트매터 거부
```

---

### 2.7 작성자 (`creator`)

작성자는 **이 BRO 데이터를 발행한 책임자**다. 본문 저자가 아닐 수 있다 (§2.8 byline 참조).

#### 7가지 타입

| `@type` | 사용 사례 | `@id` 정책 |
|---|---|---|
| `Person` | 자연인 | 선택 (UUID/HTTPS/mailto/ORCID) |
| `UnknownAgent` | 작성자가 알려지지 않음을 명시적 선언 | 금지 (매 인스턴스 blank node) |
| `GovernmentOrganization` | 정부기관 | 선택 |
| `Corporation` | 영리 법인 | 선택 |
| `Organization` | 비영리·일반 조직 | 선택 |
| `SoftwareApplication` | AI·봇·자동 변환 도구 | 필수 (HTTPS IRI) |
| `Role` | 시간 한정적 직책 (Reified Role) | (내부 agent에 위 6종) |

#### 좋은 사용 예시

```json
"creator": [{ "@type": "Person", "name": "김독자" }]

"creator": [{ "@type": "Person", "name": "김독자", "@id": "https://library.example.kr/users/dokja-9182" }]

"creator": [{ "@type": "Person", "name": "이연구", "@id": "https://orcid.org/0000-0002-1825-0097" }]

"creator": [{ "@type": "Person", "name": "Dokja", "@id": "mailto:dokja@example.org" }]

"creator": [{ "@type": "Organization", "name": "국립중앙도서관", "@id": "https://www.nl.go.kr/" }]

"creator": [{
  "@type": "SoftwareApplication",
  "name": "BRO Summarizer",
  "softwareVersion": "1.2.0",
  "@id": "https://schema.slat.or.kr/agents/bro-summarizer"
}]

"creator": [{ "@type": "UnknownAgent" }]

"creator": [{ "@type": "UnknownAgent", "name": "○○일보 기자 미상" }]

"creator": [{
  "@type": "Role",
  "roleName": "1학년 국어과 교사",
  "startDate": "1995-03-01",
  "endDate": "1996-02-28",
  "agent": { "@type": "Person", "name": "탐진치" }
}]
```

#### 잘못된 예시

```json
"creator": []                                  // 빈 배열 거부
"creator": [{ "@type": "UnknownAgent", "@id": "..." }]  // UnknownAgent에 @id 금지
"creator": [{ "@type": "Anonymous" }]          // 본 사양에서 사용하지 않는
"creator": [{ "@type": "Person" }]             // name 필수
"creator": null                                // 필드 자체 누락 또는 null 모두 비준수
```

#### `UnknownAgent`의 의미

 `@type === "UnknownAgent"` 단일 비교로 "발신자가 미상을 명시적으로 선언했음"을 판정한다. 필드가 누락되었거나 `creator: []`인 경우와 정확히 구분된다.

---

### 2.8 byline

본문 저자에 대한 **자유 문자열**. 시스템 식별자로 관리되지 않거나 관리할 필요가 없는 작성자 정보를 원본 그대로 보존한다.

#### 도입 배경

1. 레거시 데이터의 작성자가 IRI로 관리되지 않음 (1990년대 신문 서평 등)
2. 작성 당시의 직책·소속이 시간이 지나면 변함 (전거 비용을 본 사양이 강제하지 않음)
3. 출처에 작성자 정보가 부분적으로만 명시됨 ("사서 서사 추천", "A시 B구 거주 어린이 강아지풀 씀")
4. 출처에 작성자가 자신을 가명으로 표시하는 경우

#### 좋은 사용 예시

```json
"byline": "탐진우치 (작성 당시 국어국문학과 교수)"
"byline": "어린이 강아지 씀"
"byline": "사서 서사"
"byline": "○○신문 기자 김기자"
"byline": "나무를 사랑하는 어린이 강아지 씀"
```

#### 잘못된 사용 예시

```json
"byline": { "@type": "Role", "roleName": "...", "agent": {...} }  // 객체 거부 (v1.0)
"byline": ""                                                       // 빈 문자열 거부
```

`byline`은 **순수 문자열만** 받는다. 구조화된 직책 정보가 필요한 경우 `creator` 내부에서 `Role`을 사용한다(§2.7).

---

### 2.9 license (선택)

본 BRO 인스턴스의 라이선스 IRI. SPDX 라이선스 IRI 또는 Creative Commons IRI 사용을 **RECOMMENDED**.

```json
"license": "https://creativecommons.org/licenses/by/4.0/"
"license": "https://creativecommons.org/licenses/by-sa/4.0/"
"license": "https://creativecommons.org/publicdomain/zero/1.0/"
"license": "https://spdx.org/licenses/MIT.html"
```

---

### 2.10 동적 메타데이터 (`additionalProperty`)

스키마를 변경하지 않고 도메인별 메타데이터를 부착하는 확장점.

| 필드 | 필수 | 설명 |
|---|---|---|
| `@type` | ✓ | `"PropertyValue"` 고정 |
| `name` | ✓ | 키. 콜론 접두사 권장 |
| `value` | ✓ | 임의 JSON 값 |
| `propertyID` | — | 디리퍼런스 IRI |
| `valueReference` | — | 값 출처 IRI |
| `unitCode` / `unitText` | — | 단위 |

#### 사용 예시

```json
{ "@type": "PropertyValue", "name": "lib:rating", "value": 4.5 }
{ "@type": "PropertyValue", "name": "lib:readingStatus", "value": "completed" }
{ "@type": "PropertyValue", "name": "lib:targetAge", "value": { "min": 9, "max": 12 } }
{
  "@type": "PropertyValue",
  "name": "kpa:designation",
  "propertyID": "https://schema.kpa21.or.kr/designations#sejong",
  "value": "세종도서 학술부문 선정"
}
```

---

### 2.11 외부 RDF 어휘 확장 (patternProperties)

본 사양은 모든 엔티티 객체에 콜론 접두사 키를 통한 외부 RDF 어휘 직접 주입을 허용한다. 패턴은 `^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$`이며, 값은 깊이 2단계로 제한된다.

#### 허용되는 키 예시

```json
{
  "@type": "Reaction",
  ...,
  "foaf:depiction": "https://example.org/avatar.png",
  "dcterms:rightsHolder": "○○대학교",
  "prov:wasGeneratedBy": { "@id": "https://example.org/curation-event-001" }
}
```

이는 `foaf`, `dcterms`, `prov` 등 외부 어휘를 본 사양의 추가 정의 없이 자유롭게 합성하기 위한 확장점이다. JSON-LD 처리기는 사용된 접두사를 본 사양 컨텍스트의 추가 정의 또는 인스턴스 자체의 `@context` 확장에서 해석한다.

#### 거부되는 패턴

```json
"myCustomField": "..."        // 콜론 접두사 없음 → 거부
"@customType": "..."          // @ 접두사는 JSON-LD 예약어
```

---

## 3. 엔티티별 상세 명세

### 3.1 Reaction

코어 저작물에 대한 단일 응답 단위. 응답의 형태는 자유다 — 긴 후기, 짧은 코멘트, 별점만 부착한 등재, 본문 없는 단순 등재까지 모두 같은 단위에 속한다.

본 사양의 이 결정은 시맨틱 웹의 어휘 세분화 원칙(`schema:Review` vs `schema:EndorseAction` 분리)과 의도적으로 다르다. 본 사양은 작성자 시점의 **발행 단위 일관성**과 **진화 수용성**을 우선한다. 발행 후 응답의 형태가 변하더라도 발행 단위(`@id`)는 보존된다. 받는 시스템이 정통 어휘로 매핑하고자 한다면 `reactionType`과 본문 길이로 분기하는 변환 함수를 응용 계층에 두면 된다.

#### 필수 필드

| 필드 | 타입 | 의미 |
|---|---|---|
| `@context` | 컨텍스트 IRI | BRO v1.0 컨텍스트 |
| `@type` | `"Reaction"` | 고정 |
| `@id` | entityIri | 이 반응의 식별자 |
| `reactionType` | enum | `Response`/`Listing`/`Unspecified` |
| `about` | externalReference[] | 코어 저작물 (1–5개) |
| `text` | string | 반응 본문 |
| `creator` | agent[] | 발행 책임자 (1–100개) |
| `dateCreated` | RFC 3339 | 작성 시각 |

#### 선택 필드

`name`, `byline`, `textFormat`, `dateModified`, `datePublished`, `license`, `inLanguage`, `keywords`, `image`, `citation`, `additionalProperty`, 그리고 colon-prefixed 외부 RDF 어휘 키.

#### 다중 about의 의미

`about: [BookA, BookB]`는 본문이 두 책에 **동등한 가중치로 통합 적용됨**을 선언한다. 차등 평가가 의도된 경우 발신자가 별개의 Reaction으로 분리하여 발행해야 한다(MUST). 다중 about에 차등 평가를 욱여넣은 페이로드는 비준수(non-conformant)이며, 수신 시스템이 어떻게 처리하든 사양은 책임지지 않는다.

#### 전체 예시 A — 개인 독자가 모바일 앱에서 작성

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "urn:uuid:7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "reactionType": "Response",
  "name": "오랜만에 다시 읽은 1984",
  "about": [{ "@type": "Book", "identifier": "urn:isbn:9780451524935" }],
  "text": "오늘 1984를 다 읽었다. 마지막 장면이 인상적이었다.",
  "creator": [{ "@type": "Person", "name": "김독자" }],
  "dateCreated": "2026-04-15T22:30:00+09:00",
  "license": "https://creativecommons.org/licenses/by/4.0/",
  "inLanguage": ["ko"],
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "lib:rating", "value": 5 }
  ]
}
```

#### 전체 예시 B — 도서관 단순 등재 (본문 없음)

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "https://library.example.kr/reactions/2026/r-9182",
  "reactionType": "Listing",
  "name": "사서추천도서 2026년 4월",
  "about": [{ "@type": "Book", "identifier": "urn:isbn:9780451524935" }],
  "text": "",
  "creator": [
    {
      "@type": "Organization",
      "name": "국립중앙도서관",
      "@id": "https://www.nl.go.kr/"
    }
  ],
  "byline": "사서 서사",
  "dateCreated": "2026-04-15T10:00:00+09:00",
  "inLanguage": ["ko"],
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "nlk:recommendationProgram",
      "value": "사서추천도서 2026년 4월"
    }
  ]
}
```

#### 전체 예시 C — 학술 논문 리뷰

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "https://reviews.example.org/2026/review-3821",
  "reactionType": "Response",
  "name": "AI 안전성 논문에 대한 비평",
  "about": [
    { "@type": "ScholarlyArticle", "identifier": "https://doi.org/10.1038/s41586-021-03819-2" }
  ],
  "text": "# 서론\n\n본 논문은...",
  "textFormat": "text/markdown; variant=CommonMark",
  "creator": [
    {
      "@type": "Person",
      "name": "이연구",
      "@id": "https://orcid.org/0000-0002-1825-0097"
    }
  ],
  "dateCreated": "2026-03-10T14:00:00+09:00",
  "datePublished": "2026-03-15T09:00:00+09:00",
  "license": "https://creativecommons.org/licenses/by/4.0/",
  "inLanguage": ["ko"],
  "keywords": ["AI 안전성", "정렬"],
  "citation": [
    "https://example.org/related-work-1"
  ]
}
```

#### 전체 예시 D — 레거시 신문 서평 변환 (Role 사용)

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "https://archive.example.kr/legacy/news/1995-04-r-12",
  "reactionType": "Response",
  "name": "박완서의 나목을 읽고",
  "about": [{ "@type": "Book", "identifier": "urn:isbn:9788932910857" }],
  "text": "(원문 보존)",
  "creator": [
    {
      "@type": "Role",
      "roleName": "○○대 국어국문학과 교수",
      "startDate": "1995-03-01",
      "agent": { "@type": "Person", "name": "탐진우치" }
    }
  ],
  "byline": "탐진우치 (당시 ○○대 국어국문학과 교수)",
  "dateCreated": "1995-04-01T00:00:00+09:00",
  "inLanguage": ["ko"],
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "ops:dateCreatedPrecision", "value": "month" },
    { "@type": "PropertyValue", "name": "archive:source", "value": "○○일보 1995년 4월호" }
  ]
}
```

#### 전체 예시 E — 작성자 미상 레거시 데이터

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "https://archive.example.kr/legacy/anon/r-3001",
  "reactionType": "Response",
  "about": [{ "@type": "Book", "identifier": "urn:isbn:9788937462788" }],
  "text": "(원본에서 추출된 짧은 평문)",
  "creator": [{ "@type": "UnknownAgent", "name": "○○신문 익명 기고" }],
  "byline": "익명",
  "dateCreated": "1998-06-01T00:00:00+09:00",
  "inLanguage": ["ko"]
}
```

---

### 3.2 ReactionAbstract

`Reaction` 또는 코어 저작물에 대한 구조화된 요약.

#### 필수 필드

`@context`, `@type`, `@id`, `text` (minLength 1), `creator`, `dateCreated`, `isBasedOn`.

#### 선택 필드

`name`, `byline`, `textFormat`, `dateModified`, `datePublished`, `license`, `inLanguage`, `keywords`, `image`, `citation`, `additionalProperty`, 외부 RDF 어휘 키.

#### 전체 예시 — AI 생성 요약

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "ReactionAbstract",
  "@id": "urn:uuid:f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "name": "1984 서평 핵심 요약",
  "text": "본 서평은 신어(Newspeak)의 정치적 함의를 중심으로...",
  "creator": [
    {
      "@type": "SoftwareApplication",
      "name": "BRO Summarizer",
      "softwareVersion": "1.2.0",
      "@id": "https://schema.slat.or.kr/agents/bro-summarizer"
    }
  ],
  "dateCreated": "2026-04-15T22:35:00+09:00",
  "isBasedOn": [
    { "@type": "Reaction", "identifier": "urn:uuid:7c9e6679-7425-40de-944b-e07fc1f90ae7" }
  ],
  "inLanguage": ["ko"]
}
```

---

### 3.3 ReactionList

복수의 반응을 묶은 큐레이션 컨테이너.

#### 필수 필드

`@context`, `@type`, `@id`, `creator`, `itemListElement` (0–10000), `dateCreated`.

#### 선택 필드

`name`, `byline`, `dateModified`, `license`, `inLanguage`, `keywords`, `additionalProperty`, 외부 RDF 어휘 키.

#### 전체 예시

```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "ReactionList",
  "@id": "https://library.example.kr/lists/2026-q1-dystopia",
  "name": "2026년 1분기 디스토피아 컬렉션",
  "creator": [
    {
      "@type": "Organization",
      "name": "국립중앙도서관 사서추천위원회",
      "@id": "https://www.nl.go.kr/"
    }
  ],
  "itemListElement": [
    { "@id": "urn:uuid:7c9e6679-7425-40de-944b-e07fc1f90ae7", "@type": "Reaction" },
    { "@id": "urn:uuid:9b2c5d4e-8f7a-4b3c-a1d2-3e4f5a6b7c8d", "@type": "Reaction" },
    { "@id": "urn:uuid:1a2b3c4d-5e6f-4789-9abc-def012345678", "@type": "ReactionAbstract" }
  ],
  "dateCreated": "2026-03-31T18:00:00+09:00",
  "inLanguage": ["ko"],
  "keywords": ["디스토피아", "큐레이션"],
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "list:visibility", "value": "public" }
  ]
}
```

---

## 4. 검증

### 4.1 JSON Schema (Python)

```python
import json, urllib.request
from jsonschema import Draft202012Validator

with urllib.request.urlopen("https://schema.slat.or.kr/bro/v1.0/schema.json") as r:
    schema = json.load(r)

validator = Draft202012Validator(schema)
errors = sorted(validator.iter_errors(payload), key=lambda e: tuple(e.path))
for e in errors:
    print(f"[INVALID] {'/'.join(map(str, e.path)) or '<root>'}: {e.message}")
```

### 4.2 JSON-LD 처리

JSON-LD 1.1 처리기는 컨텍스트를 fetch하여 인스턴스를 RDF 트리플로 확장한다. `creator`는 엔티티 타입에 따라 `schema:author` 또는 `schema:creator`로 자동 매핑된다. `reactionType`은 `@vocab` 규칙으로 `bro:Response`/`bro:Listing`/`bro:Unspecified`로 IRI 확장된다.

### 4.3 응용 계층 책임

- ISBN/ORCID 체크섬 검증
- 본문 첫 줄 프론트매터 검출
- IRI 디리퍼런스 가능성 확인
- 식별자 참조 무결성
- 본문 형식 추정 및 보안 정제 (HTML)
- 다중 about의 차등 평가 검출 (텍스트 마이닝 시)

---

## 5. 외부 표준과의 호환성

본 사양은 KOMARC, BIBFRAME, MODS, LOD/RDF 도구체인과 양방향 변환 가능하다. 본 절은 각 표준에 대한 매핑과 변환 절차를 명시한다.

### 5.1 KOMARC 520 필드 호환성

#### 5.1.1 KOMARC 520 필드

KOMARC(한국문헌자동화목록) 520 필드는 **요약, 주석, 또는 비평 정보**를 담는 가변 필드다. 한국 도서관계의 표준 어휘이며 다음 지시기호와 식별기호를 사용한다.

| 위치 | 의미 |
|---|---|
| 제1지시기호 | 표시 형식 (∅: 요약, 1: 비평, 2: 범위/내용, 3: 초록, 4: 내용 안내) |
| 제2지시기호 | 미정의 (블랭크) |
| ▾a | 요약, 주석 등 본문 |
| ▾b | 확장 요약 |
| ▾c | 정보 출처 |
| ▾u | URI |

#### 5.1.2 KOMARC 520 → BRO 변환

| KOMARC 520 제1지시기호 | BRO `reactionType` | BRO 엔티티 |
|---|---|---|
| ∅ (요약) | `Response` | `ReactionAbstract` |
| 1 (비평) | `Response` | `Reaction` |
| 2 (범위/내용) | `Response` | `ReactionAbstract` |
| 3 (초록) | `Response` | `ReactionAbstract` |
| 4 (내용 안내) | `Listing` | `Reaction` |

#### 매핑 규칙

| KOMARC | BRO |
|---|---|
| 본 레코드의 ISBN(020 ▾a) | `about[].identifier` (urn:isbn:형식으로 변환) |
| 520 ▾a 본문 | `text` |
| 520 ▾b 확장 | `text`에 본문 결합 또는 별도 ReactionAbstract 발행 |
| 520 ▾c 정보 출처 | `byline` 또는 `additionalProperty[komarc:source]` |
| 520 ▾u URI | `citation[]` |
| 008/35-37 언어 코드 | `inLanguage[]` |
| 040 ▾a 입력 기관 | `creator[].name` (Organization) |
| 005 최종처리일시 | `dateModified` |

#### 변환 예시

KOMARC 원본 (520 비평):
```
=520  1\$a오웰의 신어(Newspeak)는 단순한 언어가 아니다.$c김독자(국어국문학과 교수)$uhttps://example.org/full-review
=020  \\$a9780451524935
=040  \\$a한국비평학회
=008  ko
```

BRO 변환:
```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "urn:uuid:...",
  "reactionType": "Response",
  "about": [{ "@type": "Book", "identifier": "urn:isbn:9780451524935" }],
  "text": "오웰의 신어(Newspeak)는 단순한 언어가 아니다.",
  "creator": [{ "@type": "Organization", "name": "한국비평학회" }],
  "byline": "김독자(국어국문학과 교수)",
  "citation": ["https://example.org/full-review"],
  "dateCreated": "2026-01-01T00:00:00+09:00",
  "inLanguage": ["ko"],
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "komarc:520:ind1", "value": "1" }
  ]
}
```

#### BRO → KOMARC 520 역변환

| BRO | KOMARC |
|---|---|
| `reactionType` | 520 제1지시기호 (`Response`→1, `Listing`→4, `Unspecified`→∅) |
| `text` | 520 ▾a |
| `byline` | 520 ▾c |
| `citation[]` | 520 ▾u (각 URI당 별도 520 필드) |
| `creator[].name` (Organization) | 040 ▾a |
| `about[].identifier` (urn:isbn:) | 020 ▾a |
| `inLanguage[0]` | 008/35-37 |
| `dateModified` | 005 |

#### 손실 매핑 주의

`Reaction.additionalProperty[]`의 `lib:rating` 등 도메인 메타데이터는 KOMARC 520에 직접 매핑되지 않는다. 보존이 필요한 경우 KOMARC 9XX 지역 필드 사용을 권고한다.

---

### 5.2 BIBFRAME 호환성

#### 5.2.1 BIBFRAME 모델

BIBFRAME 2.0은 미국 의회도서관(LC)이 MARC를 대체하기 위해 발행한 RDF 어휘로, 다음 3계층을 가진다.

- `bf:Work` — 추상적 저작
- `bf:Instance` — 물리적/디지털 구현
- `bf:Item` — 단일 사본

리뷰·요약 정보는 `bf:Annotation` 또는 `bf:Work.summary` 속성으로 표현된다.

#### 5.2.2 BIBFRAME → BRO 변환

| BIBFRAME | BRO |
|---|---|
| `bf:Work` (리뷰 대상) | `about[]` |
| `bf:Annotation` (리뷰 내용) | `Reaction` 또는 `ReactionAbstract` |
| `bf:annotates` (대상 저작) | `about[].identifier` |
| `bf:annotationBody` | `text` |
| `bf:annotator` | `creator[]` |
| `bf:assertionDate` | `dateCreated` |
| `bf:Summary` | `ReactionAbstract` |

#### 변환 예시

BIBFRAME 원본 (Turtle):
```turtle
@prefix bf: <http://id.loc.gov/ontologies/bibframe/> .

<https://example.org/annotation/r-001> a bf:Annotation ;
    bf:annotates <https://example.org/work/1984> ;
    bf:annotationBody "오웰의 신어는 단순한 언어가 아니다." ;
    bf:annotator <https://example.org/person/dokja> ;
    bf:assertionDate "2026-04-15"^^xsd:date .

<https://example.org/work/1984> a bf:Work ;
    bf:identifiedBy [ a bf:Isbn ; rdf:value "9780451524935" ] .
```

BRO 변환:
```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "Reaction",
  "@id": "https://example.org/annotation/r-001",
  "reactionType": "Response",
  "about": [{ "@type": "Book", "identifier": "urn:isbn:9780451524935" }],
  "text": "오웰의 신어는 단순한 언어가 아니다.",
  "creator": [
    {
      "@type": "Person",
      "name": "Dokja",
      "@id": "https://example.org/person/dokja"
    }
  ],
  "dateCreated": "2026-04-15T00:00:00+00:00",
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "bf:annotates",
      "propertyID": "http://id.loc.gov/ontologies/bibframe/annotates",
      "value": "https://example.org/work/1984"
    }
  ]
}
```

#### BRO → BIBFRAME 역변환

각 `Reaction`을 `bf:Annotation`으로, `ReactionAbstract`를 `bf:Summary`로 매핑한다. `about[].identifier`는 `bf:annotates`의 IRI로 변환되며, ISBN URN은 `bf:Work` 노드의 `bf:identifiedBy [ bf:Isbn ]` 구조로 풀어낸다.

#### 보존 손실

BIBFRAME은 `reactionType` 어휘를 갖지 않는다. BRO → BIBFRAME 변환 시 `reactionType`을 BIBFRAME의 추가 어휘(`bf:noteType` 또는 `dcterms:type`)로 매핑할 것을 **RECOMMENDED**.

---

### 5.3 LOD (Linked Open Data) 호환성

#### 5.3.1 일반 RDF/SPARQL 호환성

본 사양 인스턴스는 JSON-LD 1.1 처리기로 RDF 트리플로 직접 확장된다. 주요 트리플:

```turtle
<reactionId> a bro:Reaction ;
    bro:reactionType bro:Response ;
    schema:about <bookId> ;
    schema:text "..." ;
    schema:author <personId> ;
    schema:dateCreated "..."^^xsd:dateTime .

bro:Reaction rdfs:subClassOf schema:CreativeWork .
```

`bro:` 어휘는 `schema:` 어휘로 점진적으로 매핑되어 있어 SPARQL 질의에서 `?x a schema:CreativeWork` 같은 상위 클래스 질의로도 BRO 인스턴스를 회수할 수 있다.

#### 5.3.2 SPARQL 질의 예시

```sparql
PREFIX schema: <https://schema.org/>
PREFIX bro:    <https://schema.slat.or.kr/bro/v1.0/vocab#>

# 특정 ISBN에 대한 모든 응답
SELECT ?reaction ?text ?author WHERE {
  ?reaction a bro:Reaction ;
            bro:reactionType bro:Response ;
            schema:about ?book ;
            schema:text ?text ;
            schema:author ?author .
  ?book schema:identifier <urn:isbn:9780451524935> .
}

# 미상 작성자 응답 집계
SELECT (COUNT(?reaction) AS ?count) WHERE {
  ?reaction a bro:Reaction ;
            schema:author ?agent .
  ?agent a bro:UnknownAgent .
}

# Reaction과 그 요약 조인
SELECT ?reaction ?abstract WHERE {
  ?abstract a bro:ReactionAbstract ;
            schema:isBasedOn ?reaction .
  ?reaction a bro:Reaction .
}
```

#### 5.3.3 어휘 점진 매핑

본 사양의 `bro:` 어휘 문서는 다음 RDF 진술을 발행한다.

```turtle
@prefix bro:    <https://schema.slat.or.kr/bro/v1.0/vocab#> .
@prefix schema: <https://schema.org/> .
@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .

bro:Reaction         rdfs:subClassOf schema:CreativeWork .
bro:ReactionAbstract rdfs:subClassOf schema:CreativeWork .
bro:ReactionList     rdfs:subClassOf schema:ItemList .
bro:UnknownAgent     rdfs:subClassOf schema:Agent .
bro:byline           rdfs:subPropertyOf schema:creditText .
bro:reactionType     rdfs:subPropertyOf schema:additionalType .
```

#### 5.3.4 SHACL/ShEx 검증

LOD 환경에서 BRO 인스턴스를 검증하려면 별도의 SHACL Shapes를 정의해야 한다. 본 사양은 SHACL 정의를 v1.0 시점에서 발행하지 않으나, JSON Schema 정의가 SHACL로 자동 변환 가능한 도구체인이 존재한다(`json-schema-to-shacl` 등).

---

### 5.4 MODS (Metadata Object Description Schema) 호환성

#### 5.4.1 MODS 모델

MODS는 미국 의회도서관이 발행한 XML 기반 서지 메타데이터 표준이다. 리뷰·요약은 `<mods:abstract>`, `<mods:note>`, `<mods:tableOfContents>` 요소로 표현된다.

#### 5.4.2 MODS → BRO 매핑

| MODS 요소 | BRO |
|---|---|
| `<mods:abstract>` | `ReactionAbstract.text` |
| `<mods:note type="content">` | `Reaction(reactionType=Listing).text` |
| `<mods:note type="review">` | `Reaction(reactionType=Response).text` |
| `<mods:identifier type="isbn">` | `about[].identifier` (urn:isbn:로 변환) |
| `<mods:name><mods:displayForm>` | `byline` 또는 `creator[].name` |
| `<mods:language><mods:languageTerm>` | `inLanguage[]` |
| `<mods:dateIssued>` | `datePublished` |
| `<mods:recordChangeDate>` | `dateModified` |

#### 변환 예시

MODS 원본:
```xml
<mods:mods version="3.7">
  <mods:identifier type="isbn">9780451524935</mods:identifier>
  <mods:abstract lang="ko">
    오웰의 신어(Newspeak)는 단순한 언어가 아니다.
  </mods:abstract>
  <mods:name type="personal">
    <mods:namePart>김독자</mods:namePart>
    <mods:role>
      <mods:roleTerm type="text">reviewer</mods:roleTerm>
    </mods:role>
  </mods:name>
  <mods:dateIssued>2026-04-15</mods:dateIssued>
  <mods:language>
    <mods:languageTerm authority="iso639-2b">kor</mods:languageTerm>
  </mods:language>
</mods:mods>
```

BRO 변환:
```json
{
  "@context": "https://schema.slat.or.kr/bro/v1.0/context.jsonld",
  "@type": "ReactionAbstract",
  "@id": "urn:uuid:...",
  "text": "오웰의 신어(Newspeak)는 단순한 언어가 아니다.",
  "creator": [{ "@type": "Person", "name": "김독자" }],
  "dateCreated": "2026-04-15T00:00:00+00:00",
  "datePublished": "2026-04-15T00:00:00+00:00",
  "isBasedOn": [{ "@type": "Book", "identifier": "urn:isbn:9780451524935" }],
  "inLanguage": ["ko"]
}
```

#### BRO → MODS 역변환

각 BRO 엔티티는 단일 MODS 레코드 또는 MODS 노트 요소로 변환된다. `reactionType`에 따라 `<mods:note type="...">` 또는 `<mods:abstract>` 요소가 선택된다. BRO의 `Role`은 MODS `<mods:role>` 어휘로 매핑된다.

#### 언어 코드 변환

MODS는 ISO 639-2/B 3자 코드를 권장하는 반면 BRO는 BCP 47을 사용한다. 변환 시 매핑 테이블이 필요하다 (`kor` ↔ `ko`, `eng` ↔ `en` 등).

---

### 5.5 변환 도구 권고

본 사양은 v1.0 발행 시점에서 변환 도구를 직접 발행하지 않는다. 다음 오픈소스 라이브러리 사용을 **RECOMMENDED**.

| 변환 방향 | 권장 도구 |
|---|---|
| KOMARC ↔ BRO | `pymarc` 라이브러리 + 커스텀 매핑 스크립트 |
| BIBFRAME ↔ BRO | `bibframe2marc` (LC 발행) + JSON-LD 후처리 |
| LOD/RDF ↔ BRO | `pyld`, `rdflib` |
| MODS ↔ BRO | `lxml` + XSLT 변환 시트 |

매핑 가이드라인은 본 사양 §5.1–§5.4를 따른다.

---

## 6. 부록 A — 정규식 요약

```
entity IRI (UUID)  : ^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$
entity IRI (HTTPS) : ^https://(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::[0-9]{1,5})?(?:/[^\s<>"\\^`{|}]*)?$
agent IRI (mailto) : ^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$
ISBN URN           : ^urn:isbn:(?:97[89][0-9]{10}|97[89](?:-[0-9]+){1,4}|[0-9]{9}[0-9Xx]|[0-9]+(?:-[0-9]+){1,4}-?[0-9Xx])$
DOI HTTPS          : ^https://doi\.org/10(?:\.[0-9]{4,9})?/[\x21-\x7e]+$
ORCID HTTPS        : ^https://orcid\.org/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$
RFC 3339 dateTime  : ^[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])T(?:[01][0-9]|2[0-3]):[0-5][0-9]:(?:[0-5][0-9]|60)(?:\.[0-9]+)?(?:Z|[+-](?:[01][0-9]|2[0-3]):[0-5][0-9])$
RFC 3339 fullDate  : ^[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$
BCP 47 tag         : ^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{1,8})*$
extension key      : ^[a-z][a-z0-9-]*:[A-Za-z][A-Za-z0-9_-]*$
MIME type          : ^[a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]{0,126}/[a-zA-Z0-9][a-zA-Z0-9!#$&^_.+-]{0,126}(?:\s*;\s*[a-zA-Z0-9!#$&^_.+-]+=(?:[a-zA-Z0-9!#$&^_.+-]+|"[^"]*"))*$
```

## 7. 부록 B — 컨텍스트 발행 권고

- `Content-Type: application/ld+json; charset=utf-8`
- `Cache-Control: public, max-age=31536000, immutable`
- `Access-Control-Allow-Origin: *`
- gzip/brotli 압축 지원
- HTTPS 강제, HTTP 요청 시 308 리다이렉트

## 8. 부록 C — 어휘 IRI 진술 (bro:vocab#)

```turtle
@prefix bro:    <https://schema.slat.or.kr/bro/v1.0/vocab#> .
@prefix schema: <https://schema.org/> .
@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .

bro:Reaction         a rdfs:Class ; rdfs:subClassOf schema:CreativeWork .
bro:ReactionAbstract a rdfs:Class ; rdfs:subClassOf schema:CreativeWork .
bro:ReactionList     a rdfs:Class ; rdfs:subClassOf schema:ItemList .
bro:UnknownAgent     a rdfs:Class ; rdfs:subClassOf schema:Agent ;
                     rdfs:comment "Explicit declaration that the publisher cannot identify the agent. Each instance is a fresh blank node by design; no global singleton." .

bro:reactionType a rdf:Property ; rdfs:subPropertyOf schema:additionalType .
bro:Response     a bro:ReactionType .
bro:Listing      a bro:ReactionType .
bro:Unspecified  a bro:ReactionType .

bro:byline a rdf:Property ; rdfs:subPropertyOf schema:creditText .
```

## 9. 라이선스 및 거버넌스

- 명세 문서, JSON Schema, JSON-LD 컨텍스트, 어휘 IRI 진술: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- 발행 주체: SLAT
- 변경 제안 및 이슈: 발행 주체의 공식 채널

## 10. 변경 이력

- v1.0 (2026): 초기 발행
