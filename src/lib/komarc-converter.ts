import type { 
  BibliographicReactionObjectBROV10 as BibliographicReactionObjectBRO, 
  BroArticle, 
  BroAbstract,
  BroItemList 
} from '../validator/schema-types';

/**
 * KOMARC Subfield interface
 */
export interface KomarcSubfield {
  code: string;
  value: string;
}

/**
 * KOMARC Data Field interface
 */
export interface KomarcDataField {
  tag: string;
  indicator1: string;
  indicator2: string;
  subfields: KomarcSubfield[];
}

/**
 * KOMARC Control Field interface
 */
export interface KomarcControlField {
  tag: string;
  value: string;
}

/**
 * Root KOMARC Record structure
 */
export interface KomarcRecord {
  controlFields: KomarcControlField[];
  dataFields: KomarcDataField[];
}

/**
 * Converts a Bibliographic Reaction Object (BRO) to KOMARC format.
 * Supports Article, Abstract, and ItemList definition types.
 * 
 * @param broPayload The BRO payload to convert
 * @returns A single KomarcRecord or an array of records
 */
export function convertBroToKomarc(broPayload: BibliographicReactionObjectBRO): KomarcRecord | KomarcRecord[] {
  if (isItemList(broPayload)) {
    // [SCHEMA v1 개정] itemListElement는 @id 참조만 허용.
    // 각 참조에 대해 552 ▾u에 식별자를 매핑한 stub 레코드를 생성한다.
    return broPayload.itemListElement.map(element => {
      const subfields552: KomarcSubfield[] = [
        { code: 'h', value: 'https://schema.slat.or.kr/bro/v1/schema.json' }
      ];
      if (element['@id']) {
        subfields552.push({ code: 'u', value: String(element['@id']) });
      }
      return {
        controlFields: [],
        dataFields: [{
          tag: '552',
          indicator1: ' ',
          indicator2: ' ',
          subfields: subfields552
        }]
      };
    });
  }

  if (isAbstract(broPayload)) {
    return convertAbstractToKomarc(broPayload);
  }

  return convertArticleToKomarc(broPayload as BroArticle);
}

/**
 * Internal type guard for ItemList
 */
function isItemList(payload: any): payload is BroItemList {
  return payload && payload['@type'] === 'ItemList' && Array.isArray(payload.itemListElement);
}

/**
 * Internal type guard for Abstract (CreativeWork)
 */
function isAbstract(payload: any): payload is BroAbstract {
  return payload && payload['@type'] === 'CreativeWork' && 'isBasedOn' in payload;
}

/**
 * Core mapping logic for Article to KOMARC
 */
function convertArticleToKomarc(article: BroArticle): KomarcRecord {
  const dataFields: KomarcDataField[] = [];

  // 1. Identifier Mapping: about.identifier -> 020 ▾a or 024 ▾a
  if (Array.isArray(article.about)) {
    for (const creativeWork of article.about) {
      if (creativeWork.identifier) {
        const idStr = String(creativeWork.identifier);
        if (idStr.startsWith('urn:isbn:')) {
          dataFields.push({
            tag: '020',
            indicator1: ' ',
            indicator2: ' ',
            subfields: [{ code: 'a', value: idStr.replace('urn:isbn:', '') }]
          });
        } else if (idStr.startsWith('urn:')) {
          const prefixMatch = idStr.match(/^urn:([^:]+):/);
          const value = prefixMatch ? idStr.substring(prefixMatch[0].length) : idStr;
          dataFields.push({
            tag: '024',
            indicator1: '8', // Unspecified type of standard number
            indicator2: ' ',
            subfields: [{ code: 'a', value }]
          });
        }
      }
    }
  }

  // Authorship for the reaction object should deliberately NOT be
  // mapped to 100/700 to avoid conflicts with original structural authors.

  // 3. 552 Field (Bibliographic Reaction / Local Metadata)
  // 552 ▾k: dateCreated (YYYYMMDD)
  // 552 ▾u: URI (article id, if available)
  // 552 ▾h: schema URI
  const subfields552: KomarcSubfield[] = [
    { code: 'h', value: 'https://schema.slat.or.kr/bro/v1/schema.json' }
  ];

  if (article.dateCreated) {
    // Truncate ISO 8601 string to YYYYMMDD
    const truncatedDate = article.dateCreated.substring(0, 10).replace(/-/g, '');
    subfields552.push({ code: 'k', value: truncatedDate });
  }

  if (article['@id']) {
    subfields552.push({ code: 'u', value: String(article['@id']) });
  }

  dataFields.push({
    tag: '552',
    indicator1: ' ',
    indicator2: ' ',
    subfields: subfields552
  });

  return {
    controlFields: [],
    dataFields
  };
}

/**
 * Core mapping logic for Abstract to KOMARC
 */
function convertAbstractToKomarc(abstract: BroAbstract): KomarcRecord {
  const dataFields: KomarcDataField[] = [];

  // 1. Identifier Mapping: isBasedOn.identifier -> 020 ▾a or 024 ▾a
  if (Array.isArray(abstract.isBasedOn)) {
    for (const origin of abstract.isBasedOn) {
      if (origin.identifier) {
        const idStr = String(origin.identifier);
        if (idStr.startsWith('urn:isbn:')) {
          dataFields.push({
            tag: '020',
            indicator1: ' ',
            indicator2: ' ',
            subfields: [{ code: 'a', value: idStr.replace('urn:isbn:', '') }]
          });
        } else if (idStr.startsWith('urn:')) {
          const prefixMatch = idStr.match(/^urn:([^:]+):/);
          const value = prefixMatch ? idStr.substring(prefixMatch[0].length) : idStr;
          dataFields.push({
            tag: '024',
            indicator1: '8', 
            indicator2: ' ',
            subfields: [{ code: 'a', value }]
          });
        }
      }
    }
  }

  // 3. 552 Field (Bibliographic Reaction / Local Metadata)
  // 552 ▾k: dateCreated (YYYYMMDD)
  // 552 ▾o: abstract.text
  // 552 ▾h: schema URI
  const subfields552: KomarcSubfield[] = [
    { code: 'h', value: 'https://schema.slat.or.kr/bro/v1/schema.json' }
  ];

  if (abstract.dateCreated) {
    const truncatedDate = abstract.dateCreated.substring(0, 10).replace(/-/g, '');
    subfields552.push({ code: 'k', value: truncatedDate });
  }

  if (abstract.text) {
    subfields552.push({ code: 'o', value: abstract.text });
  }

  dataFields.push({
    tag: '552',
    indicator1: ' ',
    indicator2: ' ',
    subfields: subfields552
  });

  return {
    controlFields: [],
    dataFields
  };
}
