import { useMemo, useState, type ChangeEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileJson,
  Library,
  Sparkles,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import broExamples from "../worker/assets/bro-v1-examples.json";
import readmeMarkdown from "../README.md?raw";
import { validateBroSchema } from "./validator";
import type { BibliographicReactionObjectBROV10, BroValidationError } from "./validator/schema-types";
import "./lib/githubmarkdown.css";

const EXAMPLES = Object.fromEntries(
  (broExamples as BibliographicReactionObjectBROV10[]).map((example, index) => [
    `${String(index + 1).padStart(2, "0")}_${example["@type"]}`,
    example,
  ]),
) as Record<string, BibliographicReactionObjectBROV10>;

const DEFAULT_EXAMPLE_KEY = Object.keys(EXAMPLES)[0];

export default function App() {
  const [jsonInput, setJsonInput] = useState(() => JSON.stringify(EXAMPLES[DEFAULT_EXAMPLE_KEY], null, 2));
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    errors: BroValidationError[];
    syntaxError?: string;
  } | null>(null);

  const currentType = useMemo(() => {
    try {
      const parsed = JSON.parse(jsonInput) as { "@type"?: string };
      return parsed["@type"] ?? "Unknown";
    } catch {
      return "Invalid JSON";
    }
  }, [jsonInput]);

  function handleValidate() {
    try {
      const parsed = JSON.parse(jsonInput);
      const result = validateBroSchema(parsed, { includeNormalizedPayload: true });
      if (result.normalizedPayload) {
        setJsonInput(JSON.stringify(result.normalizedPayload, null, 2));
      }
      setValidationResult({ valid: result.valid, errors: result.errors });
    } catch (error) {
      setValidationResult({
        valid: false,
        errors: [],
        syntaxError: error instanceof Error ? error.message : "Failed to parse JSON.",
      });
    }
  }

  async function copyJson() {
    await navigator.clipboard.writeText(jsonInput);
  }

  return (
    <div className="min-h-screen bg-background p-4 text-foreground antialiased md:p-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="flex flex-col gap-5 border-b pb-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Library className="h-3.5 w-3.5" /> BRO v1.0
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                Bibliographic Reaction Object
              </h1>
              <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
                Validate and inspect BRO Reaction, ReactionAbstract, and ReactionList payloads against the README specification.
              </p>
            </div>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => window.open("https://github.com/freebird920/bro", "_blank")}>
            <ExternalLink className="h-4 w-4" /> Source
          </Button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <SpecCard title="Entity model" value="Reaction · ReactionAbstract · ReactionList" />
          <SpecCard title="Current payload" value={currentType} />
          <SpecCard title="Canonical context" value="/bro/v1.0/context.jsonld" />
        </section>

        <Card className="overflow-hidden rounded-xl border shadow-sm">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Specification Documents</CardTitle>
                <CardDescription>README.md is rendered as source-of-truth documentation without modifying its contents.</CardDescription>
              </div>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="markdown-body max-h-[520px] max-w-none overflow-y-auto pr-4">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{readmeMarkdown}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-xl border shadow-lg">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Interactive Validator</CardTitle>
                <CardDescription>Paste a BRO v1.0 JSON-LD payload, normalize URI schemes, and validate it locally.</CardDescription>
              </div>
              <FileJson className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-wrap gap-2">
              {Object.keys(EXAMPLES).map((key) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-xs"
                  onClick={() => {
                    setJsonInput(JSON.stringify(EXAMPLES[key], null, 2));
                    setValidationResult(null);
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" /> {key}
                </Button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Raw Payload JSON</label>
                <Button variant="ghost" size="sm" className="gap-2" onClick={copyJson}>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
              </div>
              <Textarea
                className="min-h-[440px] resize-y rounded-xl bg-background p-5 font-mono text-[13px] leading-relaxed shadow-sm"
                value={jsonInput}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setJsonInput(event.target.value)}
                spellCheck={false}
              />
            </div>

            <Button onClick={handleValidate} className="h-12 w-full rounded-xl text-base font-bold">
              Validate BRO Payload
            </Button>

            {validationResult && <ValidationResultPanel result={validationResult} />}
          </CardContent>
        </Card>

        <footer className="border-t py-8 text-center text-sm text-muted-foreground">
          schema.slat.or.kr · BRO v1.0
        </footer>
      </div>
    </div>
  );
}

function SpecCard({ title, value }: { title: string; value: string }) {
  return (
    <Card className="rounded-xl border bg-card/60 shadow-sm">
      <CardHeader className="space-y-1 p-5">
        <CardDescription className="text-xs font-bold uppercase tracking-wider">{title}</CardDescription>
        <CardTitle className="text-base leading-snug">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function ValidationResultPanel({
  result,
}: {
  result: { valid: boolean; errors: BroValidationError[]; syntaxError?: string };
}) {
  if (result.valid) {
    return (
      <Alert className="rounded-xl border-emerald-500/30 bg-emerald-50/50 py-5 text-emerald-700">
        <CheckCircle2 className="h-5 w-5" />
        <AlertTitle className="font-bold">Target Schema Validated</AlertTitle>
        <AlertDescription>BRO v1.0 JSON Schema validation and application-layer checks passed.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className="rounded-xl py-5">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="font-bold">Validation Fault Detected</AlertTitle>
      <AlertDescription className="space-y-3 pt-2">
        {result.syntaxError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 font-mono text-xs">
            {result.syntaxError}
          </div>
        )}
        {result.errors.map((error, index) => (
          <div key={`${error.location}-${index}`} className="rounded-lg border border-destructive/20 bg-destructive/10 p-3">
            <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-wider">
              {error.location || error.instanceLocation || "/"}{error.keyword ? ` · ${error.keyword}` : ""}
            </div>
            <p className="font-mono text-xs">{error.message || error.error}</p>
          </div>
        ))}
      </AlertDescription>
    </Alert>
  );
}
