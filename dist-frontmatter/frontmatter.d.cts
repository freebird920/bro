import * as v from 'valibot';

declare const StrictFrontmatterSchema: v.StrictObjectSchema<{
    readonly title: v.StringSchema<"Title must be a strictly defined string.">;
    readonly keywords: v.ArraySchema<v.StringSchema<"Keywords must be an array of strings.">, undefined>;
    readonly byline: v.OptionalSchema<v.ArraySchema<v.StringSchema<"Byline must be an array of strings.">, undefined>, undefined>;
    readonly image: v.OptionalSchema<v.ArraySchema<v.StringSchema<"Image must be an array of strings.">, undefined>, undefined>;
    readonly source_url: v.OptionalSchema<v.ArraySchema<v.StringSchema<"Source URL must be an array of strings.">, undefined>, undefined>;
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
 */
declare function parseFrontmatter(markdownOrYaml: string, body?: string): FrontmatterResult;
/**
 * Serializes the strictly separated data back into a Markdown document.
 */
declare function serializeFrontmatter(data: StrictFrontmatter, others: DynamicField[], content: string): string;

export { parseFrontmatter, serializeFrontmatter };
