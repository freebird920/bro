import * as v from 'valibot';

declare const StrictFrontmatterSchema: v.StrictObjectSchema<{
    readonly about_title: v.OptionalSchema<v.StringSchema<"about_title must be a string.">, undefined>;
    readonly about_creator: v.OptionalSchema<v.StringSchema<"about_creator must be a string.">, undefined>;
    readonly article_title: v.OptionalSchema<v.StringSchema<"article_title must be a string.">, undefined>;
    readonly article_byline: v.OptionalSchema<v.StringSchema<"article_byline must be a string.">, undefined>;
    readonly language: v.OptionalSchema<v.ArraySchema<v.SchemaWithPipe<readonly [v.StringSchema<"Language items must be strings.">, v.RegexAction<string, "Must be a valid BCP 47 / ISO 639 language code.">]>, "Language must be an array of BCP 47 codes.">, undefined>;
    readonly keywords: v.OptionalSchema<v.ArraySchema<v.StringSchema<"Keywords must be an array of strings.">, undefined>, undefined>;
    readonly image: v.OptionalSchema<v.ArraySchema<v.StringSchema<"Image must be an array of strings.">, undefined>, undefined>;
    readonly source_url: v.OptionalSchema<v.ArraySchema<v.StringSchema<"Source URL must be an array of strings.">, undefined>, undefined>;
    readonly others: v.OptionalSchema<v.ArraySchema<v.RecordSchema<v.StringSchema<undefined>, v.AnySchema, undefined>, "Others must be an array of {key: value} objects.">, undefined>;
}, undefined>;
declare const DynamicFieldSchema: v.RecordSchema<v.StringSchema<undefined>, v.AnySchema, undefined>;
type StrictFrontmatter = v.InferOutput<typeof StrictFrontmatterSchema>;
type DynamicField = v.InferOutput<typeof DynamicFieldSchema>;
interface FrontmatterResult {
    data: StrictFrontmatter;
    others: DynamicField[];
    content: string;
}

/**
 * Parses frontmatter and body content.
 * Supports both full markdown strings and separated sections (yaml + body).
 *
 * [보안] Single arg 모드에서는 최상단 5,000자 이내에서만 Frontmatter를 탐색합니다.
 */
declare function parseFrontmatter(markdownOrYaml: string, body?: string): FrontmatterResult;
/**
 * Serializes the strictly separated data back into a Markdown document.
 */
declare function serializeFrontmatter(data: StrictFrontmatter, others: DynamicField[], content: string): string;

export { parseFrontmatter, serializeFrontmatter };
