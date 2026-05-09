export const broV1Context = {
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
} as const;

export default broV1Context;
