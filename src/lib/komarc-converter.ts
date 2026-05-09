import type {
  BasedOnReference,
  BibliographicReactionObjectBROV10,
  EntityIri,
  IdentifierValue,
  ListElement,
  Reaction,
  ReactionAbstract,
  ReactionList,
  TargetReference,
  WorkReference,
} from "../validator/schema-types";

export interface KomarcSubfield {
  code: string;
  value: string;
}

export interface KomarcDataField {
  tag: string;
  indicator1: string;
  indicator2: string;
  subfields: KomarcSubfield[];
}

export interface KomarcControlField {
  tag: string;
  value: string;
}

export interface KomarcRecord {
  controlFields: KomarcControlField[];
  dataFields: KomarcDataField[];
}

const BRO_SCHEMA_URI = "https://schema.slat.or.kr/bro/v1.0/schema.json";

function yyyymmdd(dateTime: string): string {
  return dateTime.slice(0, 10).replace(/-/g, "");
}

function isEntityReference(
  reference: TargetReference | BasedOnReference | ListElement,
): reference is { readonly "@id": EntityIri; readonly "@type"?: string } {
  return "@id" in reference;
}

function identifierLabel(identifier: IdentifierValue): string {
  if (typeof identifier === "string") return identifier;
  const authority = identifier.propertyID ?? identifier.name ?? "PropertyValue";
  return `${authority}:${String(identifier.value)}`;
}

function identifierValues(reference: WorkReference): string[] {
  const identifier = reference.identifier;
  if (!identifier) return [];
  if (Array.isArray(identifier)) return (identifier as readonly IdentifierValue[]).map(identifierLabel);
  return [identifierLabel(identifier as IdentifierValue)];
}

function identifierField(identifier: string): KomarcDataField {
  if (identifier.startsWith("urn:isbn:")) {
    return {
      tag: "020",
      indicator1: " ",
      indicator2: " ",
      subfields: [{ code: "a", value: identifier.replace(/^urn:isbn:/, "") }],
    };
  }

  return {
    tag: "024",
    indicator1: "8",
    indicator2: " ",
    subfields: [{ code: "a", value: identifier }],
  };
}

function titleField(reference: WorkReference): KomarcDataField | null {
  if (!reference.name) return null;
  const subfields: KomarcSubfield[] = [{ code: "a", value: reference.name }];
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
    subfields,
  };
}

function referenceFields(reference: TargetReference | BasedOnReference | ListElement): KomarcDataField[] {
  if (isEntityReference(reference)) return [identifierField(reference["@id"])];

  const fields = identifierValues(reference).map(identifierField);
  const title = titleField(reference);
  if (title) fields.push(title);
  return fields;
}

function base552(payload: BibliographicReactionObjectBROV10): KomarcSubfield[] {
  const subfields: KomarcSubfield[] = [
    { code: "h", value: BRO_SCHEMA_URI },
    { code: "u", value: payload["@id"] },
    { code: "k", value: yyyymmdd(payload.dateCreated) },
  ];

  if (payload.name) subfields.push({ code: "b", value: payload.name });
  if (payload.byline) subfields.push({ code: "c", value: payload.byline });
  if (payload.dateModified) subfields.push({ code: "m", value: yyyymmdd(payload.dateModified) });

  return subfields;
}

function text520ForReaction(reaction: Reaction): KomarcDataField {
  const indicator1 = reaction.reactionType === "Listing" ? "4" : "1";
  const subfields: KomarcSubfield[] = [{ code: "a", value: reaction.text }];
  if (reaction.byline) subfields.push({ code: "c", value: reaction.byline });
  for (const uri of reaction.citation ?? []) subfields.push({ code: "u", value: uri });

  return {
    tag: "520",
    indicator1,
    indicator2: " ",
    subfields,
  };
}

function text520ForAbstract(abstractPayload: ReactionAbstract): KomarcDataField {
  const subfields: KomarcSubfield[] = [{ code: "a", value: abstractPayload.text }];
  if (abstractPayload.byline) subfields.push({ code: "c", value: abstractPayload.byline });
  for (const uri of abstractPayload.citation ?? []) subfields.push({ code: "u", value: uri });

  return {
    tag: "520",
    indicator1: " ",
    indicator2: " ",
    subfields,
  };
}

function convertReactionToKomarc(reaction: Reaction): KomarcRecord {
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
          { code: "t", value: reaction.reactionType },
        ],
      },
    ],
  };
}

function convertAbstractToKomarc(abstractPayload: ReactionAbstract): KomarcRecord {
  return {
    controlFields: [],
    dataFields: [
      ...abstractPayload.isBasedOn.flatMap(referenceFields),
      text520ForAbstract(abstractPayload),
      {
        tag: "552",
        indicator1: " ",
        indicator2: " ",
        subfields: base552(abstractPayload),
      },
    ],
  };
}

function convertListToKomarc(list: ReactionList): KomarcRecord[] {
  if (list.itemListElement.length === 0) {
    return [
      {
        controlFields: [],
        dataFields: [
          {
            tag: "552",
            indicator1: " ",
            indicator2: " ",
            subfields: base552(list),
          },
        ],
      },
    ];
  }

  return list.itemListElement.map((element) => {
    const referenceSubfields: KomarcSubfield[] = isEntityReference(element)
      ? [
          { code: "u", value: element["@id"] },
          ...(element["@type"] ? [{ code: "t", value: element["@type"] }] : []),
        ]
      : [
          ...(element.name ? [{ code: "b", value: element.name }] : []),
          { code: "t", value: element["@type"] },
          ...identifierValues(element).map((identifier) => ({ code: "u", value: identifier })),
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
            ...referenceSubfields,
          ],
        },
      ],
    };
  });
}

export function convertBroToKomarc(payload: BibliographicReactionObjectBROV10): KomarcRecord | KomarcRecord[] {
  switch (payload["@type"]) {
    case "Reaction":
      return convertReactionToKomarc(payload);
    case "ReactionAbstract":
      return convertAbstractToKomarc(payload);
    case "ReactionList":
      return convertListToKomarc(payload);
  }
}
