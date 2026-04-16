import * as v from 'valibot';

// ─── Strict Frontmatter Schema ───
// x-frontmatter-schema 규격과 1:1 동기화.
// JSON 스키마의 "required": [] 에 따라 모든 필드가 optional입니다.
// additionalProperties: false 이므로 strictObject 사용.
export const StrictFrontmatterSchema = v.strictObject({
  about_title: v.optional(v.string('about_title must be a string.')),
  about_creator: v.optional(v.string('about_creator must be a string.')),
  article_title: v.optional(v.string('article_title must be a string.')),
  article_byline: v.optional(v.string('article_byline must be a string.')),
  language: v.optional(
    v.array(
      v.pipe(
        v.string('Language items must be strings.'),
        v.regex(/^[a-zA-Z]{2,3}(-[a-zA-Z0-9]+)?$/, 'Must be a valid BCP 47 / ISO 639 language code.')
      ),
      'Language must be an array of BCP 47 codes.'
    )
  ),
  keywords: v.optional(v.array(v.string('Keywords must be an array of strings.'))),
  image: v.optional(v.array(v.string('Image must be an array of strings.'))),
  source_url: v.optional(v.array(v.string('Source URL must be an array of strings.'))),
  others: v.optional(
    v.array(
      v.record(v.string(), v.any()),
      'Others must be an array of {key: value} objects.'
    )
  ),
});

// Dynamic Field Matrix definition: 개별 others 항목용
export const DynamicFieldSchema = v.record(v.string(), v.any());
export const OthersBundleSchema = v.array(DynamicFieldSchema);

// ─── Type Inference ───
export type StrictFrontmatter = v.InferOutput<typeof StrictFrontmatterSchema>;
export type DynamicField = v.InferOutput<typeof DynamicFieldSchema>;

// Unified interface for the deserialization payload output.
export interface FrontmatterResult {
  data: StrictFrontmatter;
  others: DynamicField[];
  content: string;
}
