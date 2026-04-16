import { useState, useMemo, useEffect, type ChangeEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

import { Validator, type Schema } from "@cfworker/json-schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2,
  AlertCircle,
  FileJson,
  BookOpen,
  ExternalLink,
  Sparkles,
  User,
  Type,
  Layout,
  Tag,
  Cpu,
  Library,
  Zap,
  Link,
  Image as ImageIcon,
  List,
} from "lucide-react";

import schema from "../worker/assets/bro-v1-schema.json";
import readmeMarkdown from "../README.md?raw";
import { normalizePayload, normalizeUrnScheme } from "./lib/normalize";
import { CREATOR_TYPES, type CreatorType } from "./lib/bro-types";
import type { AdditionalPropertyArray } from "./validator/schema-types";
import "./lib/githubmarkdown.css";

const EXAMPLES = {
  AI_ARTICLE: {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440010",
    name: "AI가 본 현대 사회",
    aboutTitle: "현대 사회 (원서)",
    aboutCreator: "김사회",
    articleByline: "AI Assistant",
    dateCreated: "2026-04-12T12:00:00Z",
    about: [
      {
        "@type": "CreativeWork" as const,
        identifier: "urn:isbn:978-89-01-23456-7",
      },
    ],
    text: "AI 모델을 통한 현대 사회의 심층 분석 보고서입니다.",
    inLanguage: ["ko"],
    keywords: ["사회학", "미래"],
    creator: [
      {
        "@type": "SoftwareApplication" as const,
        name: "gemini-1.5-pro",
        "@id": "urn:model:google:gemini-1.5-pro",
        softwareVersion: "1.5-pro",
      },
    ],
    additionalProperty: [
      { "@type": "PropertyValue" as const, name: "custom_rating", value: 5 },
    ],
    abstract: [{ "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440001" }],
  },
  ABSTRACT: {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440001",
    dateCreated: "2026-04-12T12:05:00Z",
    isBasedOn: [
      {
        "@type": "Article" as const,
        identifier: "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
      },
    ],
    text: "현대 사회의 복잡성을 AI의 시각에서 간결하게 요약한 발췌본입니다.",
    inLanguage: ["ko"],
    creator: [
      {
        "@type": "SoftwareApplication" as const,
        name: "gemini-1.5-flash",
        "@id": "urn:model:google:gemini-1.5-flash",
      },
    ],
  },
  ANONYMOUS_ARTICLE: {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440077",
    name: "익명 사용자의 리뷰",
    aboutTitle: "노인과 바다",
    aboutCreator: "어니스트 헤밍웨이",
    dateCreated: "2026-04-15T09:00:00Z",
    about: [
      {
        "@type": "CreativeWork" as const,
        identifier: "urn:isbn:9788937460753",
      },
    ],
    text: "추적 불가능한 익명 사용자의 감상문입니다.",
    creator: [
      {
        "@type": "Anonymous" as const,
      },
    ],
  },
  ITEM_LIST: {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440022",
    name: "2026학년도 분야별 추천사 목록",
    dateCreated: "2026-04-12T12:00:00Z",
    creator: [
      {
        "@type": "Organization" as const,
        name: "슬랫 도서 검토위원회",
        "@id": "urn:uuid:550e8400-e29b-41d4-a716-446655440000",
      },
    ],
    itemListElement: [
      { "@id": "urn:uuid:123e4567-e89b-12d3-a456-426614174000" },
      { "@id": "urn:uuid:123e4567-e89b-12d3-a456-426614174001" },
    ],
  },
  PERSISTED_ARTICLE: {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
    name: "영속성 엔티티 예시",
    aboutTitle: "영속성 설계 교본",
    aboutCreator: "박영속",
    articleByline: "슬랫 출판사 검토팀",
    dateCreated: "2026-04-12T12:00:00Z",
    datePublished: "2026-04-13T00:00:00Z",
    dateModified: "2026-04-14T10:00:00Z",
    version: 2,
    about: [
      {
        "@type": "CreativeWork" as const,
        identifier: "urn:isbn:978-89-01-23456-7",
      },
    ],
    text: "데이터베이스에 영구적으로 저장된 객체입니다. dateModified와 version으로 이력을 추적합니다.",
    inLanguage: ["ko"],
    keywords: ["DB", "영속성"],
    citation: ["https://example.com/persistence-guide"],
    creator: [
      {
        "@type": "Corporation" as const,
        name: "슬랫 출판사",
        "@id": "urn:kr:crn:1234567890123",
      },
    ],
  },
};

export default function App() {
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(EXAMPLES.AI_ARTICLE, null, 2),
  );
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors?: any[];
    syntaxError?: string;
  } | null>(null);

  const validator = useMemo(() => {
    try {
      return new Validator(schema as Schema, "2020-12", false);
    } catch (error) {
      console.error("Critical: Schema compilation failed", error);
      return null;
    }
  }, []);

  const handleValidate = () => {
    if (!validator) {
      setValidationResult({
        valid: false,
        syntaxError: "System Error: The BRO schema failed to compile.",
      });
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);

      // 전처리: URN Scheme 소문자 정규화
      normalizePayload(parsed);
      // 정규화된 결과를 JSON 에디터에도 반영
      setJsonInput(JSON.stringify(parsed, null, 2));

      // JSON Schema 단일 패스 검증 (YAML Frontmatter 2차 검증 폐기)
      const result = validator.validate(parsed);
      if (!result.valid) {
        setValidationResult({
          valid: false,
          errors: result.errors,
        });
        return;
      }

      setValidationResult({ valid: true });
    } catch (e: any) {
      setValidationResult({
        valid: false,
        syntaxError: e.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans antialiased text-foreground">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl text-foreground">
              BRO: Bibliographic Reaction Object
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              서지 반응정보 객채(BRO: Bibliographic Reaction Object)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 px-6"
              onClick={() =>
                window.open("https://github.com/freebird920/bro", "_blank")
              }
            >
              <ExternalLink className="h-4 w-4" />
              Source
            </Button>
          </div>
        </header>

        <div className="space-y-12">
          {/* Documentation Card (Parsed dynamically from README.md) */}
          <Card className="border shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="pb-4 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    Specification Documents
                  </CardTitle>
                  <CardDescription>
                    Schema architecture and mapping guidelines
                  </CardDescription>
                </div>
                <div className="text-muted-foreground">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="max-w-none markdown-body max-h-[600px] overflow-y-auto pr-4">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                  {readmeMarkdown}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Validator Area */}
          <ValidatorSection
            jsonInput={jsonInput}
            setJsonInput={setJsonInput}
            handleValidate={handleValidate}
            validationResult={validationResult}
          />
        </div>

        <footer className="mt-20 py-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>schema.slat.or.kr</p>
        </footer>
      </div>
    </div>
  );
}

function ValidatorSection({
  jsonInput,
  setJsonInput,
  handleValidate,
  validationResult,
}: {
  jsonInput: string;
  setJsonInput: (val: string) => void;
  handleValidate: () => void;
  validationResult: any;
}) {
  const [metaData, setMetaData] = useState({
    name: "",
    aboutTitle: "",
    aboutCreator: "",
    articleByline: "",
    inLanguage: "",
    keywords: "",
    image: "",
    citation: "",
  });
  const [creatorData, setCreatorData] = useState<{
    type: CreatorType;
    name: string;
    id: string;
    version: string;
  }>({ type: "Person", name: "", id: "", version: "" });
  const [additionalProps, setAdditionalProps] = useState<AdditionalPropertyArray>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (isSyncing) return;
    try {
      const parsed = JSON.parse(jsonInput);
      // JSON-LD 네이티브 1급 필드 동기화
      if (parsed["@type"] === "Article") {
        setMetaData({
          name: parsed.name || "",
          aboutTitle: parsed.aboutTitle || "",
          aboutCreator: parsed.aboutCreator || "",
          articleByline: parsed.articleByline || "",
          inLanguage: Array.isArray(parsed.inLanguage)
            ? parsed.inLanguage.join(", ")
            : "",
          keywords: Array.isArray(parsed.keywords)
            ? parsed.keywords.join(", ")
            : "",
          image: Array.isArray(parsed.image) ? parsed.image.join(", ") : "",
          citation: Array.isArray(parsed.citation)
            ? parsed.citation.join(", ")
            : "",
        });
        setAdditionalProps(parsed.additionalProperty || []);
      }

      const isArticleOrAbstract =
        parsed["@type"] === "Article" ||
        (parsed["@type"] === "CreativeWork" && "isBasedOn" in parsed);
      if (isArticleOrAbstract && parsed.creator && parsed.creator.length > 0) {
        const mainCreator = parsed.creator[0];
        setCreatorData({
          type: mainCreator["@type"] || "Person",
          name: mainCreator.name || "",
          id: mainCreator["@id"] || "",
          version: mainCreator.softwareVersion || "",
        });
      }
    } catch (e) {}
  }, [jsonInput]);

  const handleFormChange = (updates: {
    meta?: Partial<typeof metaData>;
    creator?: Partial<typeof creatorData>;
  }) => {
    setIsSyncing(true);
    try {
      const parsed = JSON.parse(jsonInput);
      const isArticleOrig = parsed["@type"] === "Article";
      const isAbstractOrig =
        parsed["@type"] === "CreativeWork" && "isBasedOn" in parsed;

      if (isArticleOrig || isAbstractOrig) {
        // JSON-LD 네이티브 1급 속성을 직접 편집
        if (isArticleOrig && updates.meta) {
          const newMeta = { ...metaData, ...updates.meta };

          if (newMeta.name) parsed.name = newMeta.name;
          else delete parsed.name;
          if (newMeta.aboutTitle) parsed.aboutTitle = newMeta.aboutTitle;
          else delete parsed.aboutTitle;
          if (newMeta.aboutCreator) parsed.aboutCreator = newMeta.aboutCreator;
          else delete parsed.aboutCreator;
          if (newMeta.articleByline) parsed.articleByline = newMeta.articleByline;
          else delete parsed.articleByline;

          const toArr = (s: string) => s.split(",").map((v) => v.trim()).filter(Boolean);
          const lang = toArr(newMeta.inLanguage);
          if (lang.length > 0) parsed.inLanguage = lang;
          else delete parsed.inLanguage;
          const kw = toArr(newMeta.keywords);
          if (kw.length > 0) parsed.keywords = kw;
          else delete parsed.keywords;
          const img = toArr(newMeta.image);
          if (img.length > 0) parsed.image = img;
          else delete parsed.image;
          const cit = toArr(newMeta.citation);
          if (cit.length > 0) parsed.citation = cit;
          else delete parsed.citation;

          setMetaData(newMeta);
        }

        if (updates.creator) {
          const newCreator = { ...creatorData, ...updates.creator };
          const updatedCreator: Record<string, unknown> = {
            "@type": newCreator.type,
          };
          if (newCreator.name) updatedCreator.name = newCreator.name;
          if (newCreator.id) updatedCreator["@id"] = normalizeUrnScheme(newCreator.id);
          if (newCreator.type === "SoftwareApplication" && newCreator.version) {
            updatedCreator.softwareVersion = newCreator.version;
          }
          parsed.creator = [updatedCreator];
          setCreatorData(newCreator);
        }

        setJsonInput(JSON.stringify(parsed, null, 2));
      }
    } catch (e) {}
    setTimeout(() => setIsSyncing(false), 50);
  };

  const isArticle = useMemo(() => {
    try {
      return JSON.parse(jsonInput)["@type"] === "Article";
    } catch {
      return false;
    }
  }, [jsonInput]);

  const isAbstract = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      return parsed["@type"] === "CreativeWork" && "isBasedOn" in parsed;
    } catch {
      return false;
    }
  }, [jsonInput]);

  return (
    <Card className="border shadow-lg rounded-xl overflow-hidden mt-6">
      <CardHeader className="pb-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">
              Interactive Validator
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Test your JSON payload against BRO v1 Specification (2-Pass)
            </CardDescription>
          </div>
          <div className="text-muted-foreground">
            <FileJson className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="flex flex-wrap gap-2">
          {Object.keys(EXAMPLES).map((key) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              className="text-xs h-9 gap-2"
              onClick={() =>
                setJsonInput(JSON.stringify((EXAMPLES as any)[key], null, 2))
              }
            >
              <Sparkles className="h-3 w-3" />
              {key}
            </Button>
          ))}
        </div>

        {(isArticle || isAbstract) && (
          <>
            <div
              className={`grid grid-cols-1 ${isArticle ? "md:grid-cols-2" : "md:grid-cols-1 max-w-2xl"} gap-8 bg-muted/10 p-6 rounded-xl border`}
            >
              {isArticle && (
                <div className="space-y-5">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-foreground uppercase tracking-wider">
                    <Layout className="h-4 w-4" /> JSON-LD Metadata
                  </h3>
                  <div className="space-y-3">
                    <Field
                      label="Name (파생 문서 제목)"
                      icon={<Type className="h-3 w-3" />}
                      value={metaData.name}
                      onChange={(v) => handleFormChange({ meta: { name: v } })}
                    />
                    <Field
                      label="About Title (대상 저작물 제목)"
                      icon={<Type className="h-3 w-3" />}
                      value={metaData.aboutTitle}
                      onChange={(v) => handleFormChange({ meta: { aboutTitle: v } })}
                    />
                    <Field
                      label="About Creator (대상 저작물 저자)"
                      icon={<User className="h-3 w-3" />}
                      value={metaData.aboutCreator}
                      onChange={(v) => handleFormChange({ meta: { aboutCreator: v } })}
                    />
                    <Field
                      label="Article Byline (작성자 표기)"
                      icon={<User className="h-3 w-3" />}
                      value={metaData.articleByline}
                      onChange={(v) => handleFormChange({ meta: { articleByline: v } })}
                    />
                    <Field
                      label="inLanguage (BCP 47)"
                      icon={<Type className="h-3 w-3" />}
                      value={metaData.inLanguage}
                      onChange={(v) =>
                        handleFormChange({ meta: { inLanguage: v } })
                      }
                      placeholder="ko, en"
                    />
                    <Field
                      label="Keywords"
                      icon={<Tag className="h-3 w-3" />}
                      value={metaData.keywords}
                      onChange={(v) =>
                        handleFormChange({ meta: { keywords: v } })
                      }
                    />
                    <Field
                      label="Image URLs"
                      icon={<ImageIcon className="h-3 w-3" />}
                      value={metaData.image}
                      onChange={(v) => handleFormChange({ meta: { image: v } })}
                    />
                    <Field
                      label="Citation URLs"
                      icon={<Link className="h-3 w-3" />}
                      value={metaData.citation}
                      onChange={(v) =>
                        handleFormChange({ meta: { citation: v } })
                      }
                    />
                  </div>

                  {/* additionalProperty 뷰어 */}
                  {additionalProps.length > 0 && (
                    <div className="mt-4 p-4 bg-muted/30 rounded-lg border space-y-2">
                      <h4 className="text-[11px] font-bold uppercase flex items-center gap-1.5 text-muted-foreground tracking-wider">
                        <List className="h-3 w-3" /> additionalProperty (PropertyValue)
                      </h4>
                      <div className="space-y-1">
                        {additionalProps.map((prop, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-xs py-1 border-b border-border/20 last:border-0"
                          >
                            <div className="flex items-center gap-2 w-full">
                              <span className="font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded text-[10px]">
                                {prop.name}
                              </span>
                              <span className="text-foreground text-[11px] truncate">
                                {JSON.stringify(prop.value)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-5">
                <h3 className="text-sm font-bold flex items-center gap-2 text-foreground uppercase tracking-wider">
                  <User className="h-4 w-4" /> Primary Creator Definition
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
                      Type
                    </label>
                    <select
                      value={creatorData.type}
                      onChange={(e) =>
                        handleFormChange({
                          creator: { type: e.target.value as CreatorType },
                        })
                      }
                      className="w-full h-10 rounded-lg border bg-background px-3 py-1 text-sm transition-colors focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                      {CREATOR_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Field
                    label="Name"
                    value={creatorData.name}
                    onChange={(v) => handleFormChange({ creator: { name: v } })}
                  />
                  <Field
                    label="Identifier (@id)"
                    value={creatorData.id}
                    onChange={(v) => handleFormChange({ creator: { id: v } })}
                    placeholder="urn:uuid:..."
                    transformOnBlur={normalizeUrnScheme}
                  />
                  {creatorData.type === "SoftwareApplication" && (
                    <Field
                      label="Software Version"
                      icon={<Cpu className="h-3 w-3" />}
                      value={creatorData.version}
                      onChange={(v) =>
                        handleFormChange({ creator: { version: v } })
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bibliographic Mapping Registry Preview */}
            <div className="bg-muted/20 p-6 md:p-8 rounded-xl border space-y-6">
              <h3 className="text-sm font-bold flex items-center gap-2 text-foreground uppercase tracking-wider">
                <Library className="h-4 w-4" /> Bibliographic Mapping Registry
                Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MappingCard
                  title="KORMARC"
                  icon={<Zap className="h-3 w-3" />}
                  items={[
                    {
                      label: "대상 도서 식별자 (URN)",
                      field: "020 ▾a / 024 ▾a",
                      value: isAbstract
                        ? "Mapped from isBasedOn[0].identifier"
                        : "Mapped from about[0].identifier",
                    },
                    {
                      label: "데이터세트 출처",
                      field: "552 ▾h",
                      value: "https://schema.slat.or.kr/...",
                    },
                    {
                      label: "원문 접근 주소",
                      field: "552 ▾u",
                      value: isAbstract
                        ? "None (Abstract embeds text)"
                        : "Mapped externally from @id",
                    },
                    {
                      label: "개시/종료 일자",
                      field: "552 ▾k",
                      value: "Mapped from dateCreated / datePublished",
                    },
                    {
                      label: "요약 (Abstract)",
                      field: "552 ▾o",
                      value: isAbstract
                        ? "Directly mapped from abstract text"
                        : "None (Isolated entity)",
                    },
                  ]}
                />
                <MappingCard
                  title="Dublin Core"
                  icon={<Zap className="h-3 w-3" />}
                  items={[
                    {
                      label: "Identifier",
                      field: "dc:identifier",
                      value: "Mapped from @id",
                    },
                    {
                      label: "Relation / Source",
                      field: "dc:relation",
                      value: isAbstract
                        ? "Mapped from isBasedOn.identifier"
                        : "Mapped from about.identifier",
                    },
                    {
                      label: "Creator",
                      field: "dc:creator",
                      value: creatorData.name || "Pending",
                    },
                    {
                      label: "Date Created",
                      field: "dc:date",
                      value: "Mapped from dateCreated",
                    },
                    {
                      label: "Description",
                      field: "dc:description",
                      value: isAbstract
                        ? "Mapped from text"
                        : "Mapped from text elements",
                    },
                  ]}
                />
              </div>
            </div>
          </>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <FileJson className="h-4 w-4" /> Raw Payload JSON
            </label>
          </div>
          <Textarea
            className="min-h-[400px] font-mono text-[13px] leading-relaxed bg-background border shadow-sm resize-none p-5 rounded-xl"
            value={jsonInput}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setJsonInput(e.target.value)
            }
          />
        </div>

        <Button
          onClick={handleValidate}
          className="w-full h-14 text-lg font-bold shadow-sm rounded-xl"
        >
          Validate Payload
        </Button>

        {validationResult && (
          <div className="mt-8">
            {validationResult.valid ? (
              <Alert className="border-emerald-500/30 bg-emerald-50/50 text-emerald-600 py-6 rounded-xl flex gap-4 items-center pl-6">
                <CheckCircle2 className="h-7 w-7 shrink-0" />
                <div>
                  <AlertTitle className="text-xl font-bold m-0">
                    Target Schema Validated
                  </AlertTitle>
                  <AlertDescription className="text-base mt-1">
                    Successfully validated against BRO v1.0 JSON-LD native
                    specification.
                  </AlertDescription>
                </div>
              </Alert>
            ) : (
              <Alert variant="destructive" className="py-6 rounded-xl pl-6">
                <div className="flex gap-4 mb-4 items-center">
                  <AlertCircle className="h-7 w-7 shrink-0" />
                  <AlertTitle className="text-xl font-bold m-0">
                    Validation Fault Detected
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-4 break-all">
                  {validationResult.syntaxError && (
                    <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-destructive/20 px-2 py-1 rounded block w-fit mb-2">
                        Syntax Error
                      </span>
                      <p className="font-mono text-xs">
                        {validationResult.syntaxError}
                      </p>
                    </div>
                  )}
                  <ul className="space-y-3">
                    {validationResult.errors?.map((err: any, i: number) => (
                      <li
                        key={i}
                        className="bg-destructive/10 p-4 rounded-lg border border-destructive/20"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-destructive/20 px-2 py-1 rounded block w-fit mb-2">
                          Path: {err.instanceLocation || "/"}
                        </span>
                        <p className="font-mono text-xs">{err.error}</p>
                      </li>
                    ))}

                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MappingCard({
  title,
  icon,
  items,
}: {
  title: string;
  icon: any;
  items: any[];
}) {
  return (
    <div className="bg-muted/30 border rounded-lg p-4 space-y-3 shadow-inner">
      <h4 className="text-[11px] font-bold uppercase flex items-center gap-1.5 mb-3 text-muted-foreground tracking-wider">
        {icon} {title}
      </h4>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-xs py-1"
          >
            <span className="text-muted-foreground font-medium">
              {item.label}
            </span>
            <div className="flex items-center gap-2.5">
              <span className="font-mono bg-muted/50 border px-1.5 py-0.5 rounded text-[10px] text-muted-foreground">
                {item.field}
              </span>
              <span
                className={
                  item.value === "Empty" || item.value === "Pending"
                    ? "text-destructive/80 italic text-[11px]"
                    : "text-foreground text-[11px]"
                }
              >
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  icon,
  placeholder,
  transformOnBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: any;
  placeholder?: string;
  transformOnBlur?: (v: string) => string;
}) {
  return (
    <div className="space-y-2 group">
      <label className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5 group-focus-within:text-primary transition-colors">
        {icon} {label}
      </label>
      <input
        className="flex h-10 w-full rounded-lg border bg-background px-3 py-1.5 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary"
        value={value}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        onBlur={
          transformOnBlur
            ? (e) => {
                const transformed = transformOnBlur(e.target.value);
                if (transformed !== e.target.value) {
                  onChange(transformed);
                }
              }
            : undefined
        }
      />
    </div>
  );
}
