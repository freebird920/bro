"""Shared deterministic text, hash, HyDE, and embedding utilities for Booksle.

This module is intentionally dependency-light. It supports the book abstract/HyDE
pipeline and both Gemini embedding pipelines. All hashes are derived from
canonical source records and contain no timestamps, so unchanged inputs exit
idempotently without API calls or DB writes.
"""

from __future__ import annotations

import hashlib
import json
import math
import re
from typing import Any, Dict, Iterable, List, Mapping, Optional, Sequence

BRO_CONTEXT_IRI = "https://schema.slat.or.kr/bro/v1.0/context.jsonld"
TEXT_BUILDER_VERSION = "booksle-book-semantic-v2.0.0"
HASH_ALGORITHM = "sha256"
HASH_ENCODING = "utf-8"

_CONTROL_RE = re.compile(r"[\x00-\x09\x0b-\x1f\x7f]")
_ZERO_WIDTH_RE = re.compile(r"[\u200b\u200c\u200d\ufeff]")
_HORIZONTAL_SPACE_RE = re.compile(r"[ \t]+")
_WHITESPACE_RE = re.compile(r"\s+")
_SPLIT_RE = re.compile(r"[;,]")


def clean_text(value: Any, *, max_length: Optional[int] = None, preserve_newlines: bool = False) -> str:
    """Convert arbitrary values into normalized plain text."""
    if value is None:
        return ""

    if isinstance(value, str):
        text = value
    elif isinstance(value, Mapping):
        text = json.dumps(canonicalize(value), ensure_ascii=False, sort_keys=True)
    elif isinstance(value, Iterable) and not isinstance(value, (bytes, bytearray)):
        text = " ".join(clean_text(item) for item in value)
    else:
        text = str(value)

    text = _CONTROL_RE.sub("", text)
    text = _ZERO_WIDTH_RE.sub("", text)
    text = text.replace("\u00a0", " ")
    if preserve_newlines:
        text = _HORIZONTAL_SPACE_RE.sub(" ", text).strip()
    else:
        text = _WHITESPACE_RE.sub(" ", text).strip()
    if max_length is not None and max_length > 0 and len(text) > max_length:
        return text[:max_length].rstrip()
    return text


def parse_json_maybe(value: str) -> Any:
    text = value.strip()
    if not text:
        return value
    if (text.startswith("[") and text.endswith("]")) or (text.startswith("{") and text.endswith("}")):
        try:
            return json.loads(text)
        except Exception:
            return value
    return value


def safe_text_array(value: Any, *, max_items: Optional[int] = None, split_commas: bool = False) -> List[str]:
    """Normalize text[]/JSON/list/string values into a stable unique list."""
    if value is None:
        return []

    if isinstance(value, str):
        parsed = parse_json_maybe(value)
        if parsed is not value:
            return safe_text_array(parsed, max_items=max_items, split_commas=split_commas)
        items: Iterable[Any] = _SPLIT_RE.split(value) if split_commas else [value]
    elif isinstance(value, Mapping):
        items = [value]
    elif isinstance(value, Iterable) and not isinstance(value, (bytes, bytearray)):
        items = value
    else:
        items = [value]

    result: List[str] = []
    seen: set[str] = set()
    for item in items:
        if isinstance(item, Mapping):
            name = clean_text(item.get("name"))
            value_text = clean_text(item.get("value"))
            candidate = ": ".join(part for part in (name, value_text) if part)
            if not candidate:
                candidate = clean_text(item)
        else:
            candidate = clean_text(item)

        if not candidate:
            continue
        key = candidate.casefold()
        if key in seen:
            continue
        seen.add(key)
        result.append(candidate)
        if max_items is not None and len(result) >= max_items:
            break
    return result


def normalize_text(value: Any) -> Optional[str]:
    text = clean_text(value)
    if not text or text.lower() == "nan":
        return None
    return text


def normalize_text_array(value: Any) -> List[str]:
    return safe_text_array(value, split_commas=True)


def compact_string_array(value: Any) -> List[str]:
    return safe_text_array(value, split_commas=False)


def canonicalize(value: Any) -> Any:
    """Recursively canonicalize JSON-compatible values for stable hashing."""
    if value is None:
        return None
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        if isinstance(value, float) and not math.isfinite(value):
            return None
        return value
    if isinstance(value, str):
        return clean_text(value)
    if isinstance(value, Mapping):
        canonical: Dict[str, Any] = {}
        for key in sorted(value.keys(), key=lambda item: str(item)):
            normalized_key = clean_text(key)
            if not normalized_key:
                continue
            normalized_value = canonicalize(value[key])
            if normalized_value in (None, "", [], {}):
                continue
            canonical[normalized_key] = normalized_value
        return canonical
    if isinstance(value, Iterable) and not isinstance(value, (bytes, bytearray)):
        canonical_items = []
        for item in value:
            normalized_item = canonicalize(item)
            if normalized_item in (None, "", [], {}):
                continue
            canonical_items.append(normalized_item)
        return canonical_items
    return clean_text(value)


def canonical_json(value: Any) -> str:
    return json.dumps(canonicalize(value), ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def canonical_json_dumps(value: Any) -> str:
    return canonical_json(value)


def sha256_hex(value: Any) -> str:
    if isinstance(value, bytes):
        payload = value
    else:
        payload = str(value).encode(HASH_ENCODING)
    return hashlib.sha256(payload).hexdigest()


def hash_source_record(record: Mapping[str, Any]) -> str:
    return sha256_hex(canonical_json(record))


def seed_from_hash(hash_value: str) -> int:
    cleaned = clean_text(hash_value)
    if len(cleaned) < 8:
        cleaned = sha256_hex(cleaned)
    return int(cleaned[:8], 16) & 0x7FFFFFFF


def normalize_l2(vector: Sequence[float]) -> List[float]:
    norm = math.sqrt(sum(float(value) * float(value) for value in vector))
    if norm == 0.0:
        return [0.0 for _ in vector]
    return [float(value) / norm for value in vector]


def vector_to_pgvector_literal(
    vector: Sequence[float],
    dimension: Optional[int] = None,
    *,
    expected_dim: Optional[int] = None,
) -> str:
    dim = expected_dim if expected_dim is not None else (dimension if dimension is not None else 768)
    if len(vector) != dim:
        raise ValueError(f"expected_dim={dim}, actual_dim={len(vector)}")
    return "[" + ",".join(f"{float(value):.9g}" for value in vector) + "]"


def first_non_empty(*values: Any) -> str:
    for value in values:
        text = clean_text(value)
        if text:
            return text
    return ""


def _safe_join(values: Iterable[Any]) -> str:
    result = [clean_text(item) for item in values if clean_text(item)]
    return ", ".join(result) or "None"


# -----------------------------------------------------------------------------
# HyDE/book abstract source construction
# -----------------------------------------------------------------------------
def normalize_bro_reaction(raw: Mapping[str, Any]) -> Dict[str, Any]:
    return canonicalize(
        {
            "bro_id": raw.get("bro_id"),
            "reaction_type": raw.get("reaction_type") or raw.get("reactionType"),
            "name": raw.get("name"),
            "byline": raw.get("byline"),
            "text": clean_text(raw.get("text"), max_length=3000),
            "creator": raw.get("creator"),
            "keywords": safe_text_array(raw.get("keywords"), max_items=30),
            "audience": safe_text_array(raw.get("audience"), max_items=20),
            "genre": safe_text_array(raw.get("genre"), max_items=20),
            "citation": safe_text_array(raw.get("citation"), max_items=20),
            "source_key": raw.get("source_key") or raw.get("sourceKey"),
            "source": raw.get("source"),
            "additional_property": raw.get("additional_property") or raw.get("additionalProperty"),
            "date_created": raw.get("date_created") or raw.get("dateCreated"),
            "date_published": raw.get("date_published") or raw.get("datePublished"),
        }
    )


def build_book_hyde_prompt(book: Mapping[str, Any]) -> str:
    label = "None" if book.get("label") is None else str(book.get("label"))
    keywords = ",".join(safe_text_array(book.get("keyword") or book.get("book_keyword"), split_commas=True))
    description = str(book.get("description") or book.get("book_description") or "")
    return "\n".join([f"label: {label}", f"keywords: {keywords}", f"description: {description}"])


def build_book_hyde_source_record(
    book_record: Mapping[str, Any],
    *,
    model_id: Optional[str] = None,
    prompt_version: Optional[str] = None,
    system_instruction_hash: Optional[str] = None,
    max_reactions: int = 24,
) -> Dict[str, Any]:
    """Create the canonical source record for book abstract/HyDE generation.

    The optional model/prompt parameters are accepted for backward compatibility,
    but the generation content hash should be built with build_book_hyde_content_hash().
    """
    raw_reactions = book_record.get("bro_reactions") or []
    if isinstance(raw_reactions, str):
        parsed = parse_json_maybe(raw_reactions)
        raw_reactions = parsed if isinstance(parsed, list) else []

    normalized_reactions = []
    for reaction in raw_reactions:
        if isinstance(reaction, Mapping):
            normalized_reactions.append(normalize_bro_reaction(reaction))
    normalized_reactions = sorted(
        normalized_reactions,
        key=lambda reaction: (
            clean_text(reaction.get("bro_id")),
            clean_text(reaction.get("reaction_type")),
            clean_text(reaction.get("name")),
        ),
    )[:max_reactions]

    record = {
        "schema": "booksle.book-hyde-source.v2",
        "book": {
            "book_id": book_record.get("book_id") or book_record.get("_id"),
            "title": first_non_empty(
                book_record.get("title"),
                book_record.get("book_title"),
                book_record.get("title_nl"),
                book_record.get("title_lod"),
                book_record.get("label"),
            ),
            "label": book_record.get("label"),
            "title_nl": book_record.get("title_nl"),
            "title_lod": book_record.get("title_lod"),
            "creator": safe_text_array(book_record.get("creator"), max_items=20),
            "publisher": book_record.get("publisher"),
            "issued": book_record.get("issued"),
            "isbn": book_record.get("isbn"),
            "isbn_array": safe_text_array(book_record.get("isbn_array"), max_items=20),
            "lod_id": book_record.get("lod_id"),
            "kdc": book_record.get("kdc"),
            "keywords": safe_text_array(book_record.get("keyword") or book_record.get("book_keyword"), max_items=60, split_commas=True),
            "description": clean_text(book_record.get("description") or book_record.get("book_description"), max_length=6000),
        },
        "bro_reactions": normalized_reactions,
    }
    if model_id or prompt_version or system_instruction_hash:
        record["generation"] = {
            "model_id": model_id,
            "prompt_version": prompt_version,
            "system_instruction_hash": system_instruction_hash,
        }
    return canonicalize(record)


def build_book_hyde_input_text(source_record: Mapping[str, Any]) -> str:
    book = source_record.get("book", {}) if isinstance(source_record, Mapping) else {}
    reactions = source_record.get("bro_reactions", []) if isinstance(source_record, Mapping) else []

    lines = [
        "# BOOK SOURCE",
        f"title: {clean_text(book.get('title'))}",
        f"label: {clean_text(book.get('label'))}",
        f"creator: {', '.join(safe_text_array(book.get('creator')))}",
        f"publisher: {clean_text(book.get('publisher'))}",
        f"issued: {clean_text(book.get('issued'))}",
        f"isbn: {clean_text(book.get('isbn'))}",
        f"kdc: {clean_text(book.get('kdc'))}",
        f"keywords: {', '.join(safe_text_array(book.get('keywords')))}",
        f"description: {clean_text(book.get('description'))}",
    ]

    if reactions:
        lines.append("# BRO REACTION SIGNALS")
        for index, reaction in enumerate(reactions, start=1):
            if not isinstance(reaction, Mapping):
                continue
            lines.extend(
                [
                    f"reaction_{index}.reaction_type: {clean_text(reaction.get('reaction_type'))}",
                    f"reaction_{index}.name: {clean_text(reaction.get('name'))}",
                    f"reaction_{index}.creator: {clean_text(reaction.get('creator'), max_length=500)}",
                    f"reaction_{index}.keywords: {', '.join(safe_text_array(reaction.get('keywords'), max_items=20))}",
                    f"reaction_{index}.text: {clean_text(reaction.get('text'), max_length=1800)}",
                ]
            )
    else:
        lines.append("# BRO REACTION SIGNALS")
        lines.append("none")

    return "\n".join(line for line in lines if line.strip())


def build_book_hyde_content_hash(
    *,
    source_record: Mapping[str, Any],
    model_id: str,
    prompt_version: str,
    schema_version: str,
    system_instruction_hash: str,
) -> str:
    return hash_source_record(
        {
            "kind": "book-hyde-generation-input",
            "source_record": source_record,
            "provider": "google",
            "model": model_id,
            "prompt_version": prompt_version,
            "schema_version": schema_version,
            "system_instruction_hash": system_instruction_hash,
        }
    )


# -----------------------------------------------------------------------------
# Embedding text construction
# -----------------------------------------------------------------------------
def build_book_embedding_source_record(item: Mapping[str, Any]) -> Dict[str, Any]:
    title = first_non_empty(
        item.get("book_title"),
        item.get("title"),
        item.get("title_nl"),
        item.get("title_lod"),
        item.get("label"),
    )
    return canonicalize(
        {
            "schema": "booksle.book-embedding-source.v2",
            "book": {
                "book_id": item.get("book_id"),
                "title": title,
                "label": item.get("label"),
                "creator": safe_text_array(item.get("creator"), max_items=20),
                "publisher": item.get("publisher"),
                "issued": item.get("issued"),
                "isbn": item.get("isbn"),
                "isbn_array": safe_text_array(item.get("isbn_array"), max_items=20),
                "lod_id": item.get("lod_id"),
                "kdc": item.get("kdc"),
                "keywords": safe_text_array(item.get("book_keyword") or item.get("keyword"), max_items=60, split_commas=True),
                "description": clean_text(item.get("book_description") or item.get("description"), max_length=5000),
            },
            "abstract": {
                "book_abstract_id": item.get("book_abstract_id"),
                "book_abstract_content_hash": item.get("book_abstract_content_hash"),
                "summary": item.get("book_abstract_summary") or item.get("summary"),
                "expert_review": item.get("book_abstract_expert_review") or item.get("expert_review"),
                "critique": item.get("book_abstract_critique") or item.get("critique"),
                "target_text": safe_text_array(item.get("target_text") or item.get("book_abstract_target_text"), max_items=40, split_commas=True),
                "utility_text": safe_text_array(item.get("utility_text") or item.get("book_abstract_utility_text"), max_items=40, split_commas=True),
                "search_intent": safe_text_array(item.get("search_intent") or item.get("book_abstract_search_intent"), max_items=40, split_commas=True),
                "keyword_bm25": safe_text_array(item.get("keyword_bm25") or item.get("book_abstract_keyword_bm25"), max_items=80, split_commas=True),
            },
        }
    )


def build_clustering_source_record(item: Mapping[str, Any]) -> Dict[str, Any]:
    return {
        "book_id": clean_text(item.get("book_id")),
        "summary": clean_text(item.get("book_abstract_summary") or item.get("summary")),
        "expert_review": clean_text(item.get("book_abstract_expert_review") or item.get("expert_review")),
        "target_text": safe_text_array(item.get("target_text") or item.get("book_abstract_target_text"), split_commas=True),
        "utility_text": safe_text_array(item.get("utility_text") or item.get("book_abstract_utility_text"), split_commas=True),
        "search_intent": safe_text_array(item.get("search_intent") or item.get("book_abstract_search_intent"), split_commas=True),
        "keyword_bm25": safe_text_array(item.get("keyword_bm25") or item.get("book_abstract_keyword_bm25"), split_commas=True),
    }


def _embedding_content_from_record(record: Mapping[str, Any]) -> str:
    book = record.get("book", {}) if isinstance(record, Mapping) else {}
    abstract = record.get("abstract", {}) if isinstance(record, Mapping) else {}
    content_parts = [
        f"title: {clean_text(book.get('title'))}",
        f"creator: {', '.join(safe_text_array(book.get('creator')))}",
        f"publisher: {clean_text(book.get('publisher'))}",
        f"issued: {clean_text(book.get('issued'))}",
        f"kdc: {clean_text(book.get('kdc'))}",
        f"book keywords: {', '.join(safe_text_array(book.get('keywords')))}",
        f"book description: {clean_text(book.get('description'))}",
        f"summary: {clean_text(abstract.get('summary'))}",
        f"expert review: {clean_text(abstract.get('expert_review'))}",
        f"critique: {clean_text(abstract.get('critique'))}",
        f"target audience: {', '.join(safe_text_array(abstract.get('target_text')))}",
        f"reader utility: {', '.join(safe_text_array(abstract.get('utility_text')))}",
        f"search intent: {', '.join(safe_text_array(abstract.get('search_intent')))}",
        f"search keywords: {', '.join(safe_text_array(abstract.get('keyword_bm25')))}",
    ]
    return "\n".join(part for part in content_parts if clean_text(part.split(":", 1)[-1]))


def _build_clustering_content(record: Mapping[str, Any]) -> str:
    summary = clean_text(record.get("summary"))
    if not summary:
        raise ValueError(f"Core attribute 'summary' missing or empty for record: {record.get('book_id')}")
    return "\n".join(
        [
            summary,
            "",
            f"Target: {_safe_join(safe_text_array(record.get('target_text')))}",
            f"Utility: {_safe_join(safe_text_array(record.get('utility_text')))}",
            f"Search Intent: {_safe_join(safe_text_array(record.get('search_intent')))}",
            f"Keywords: {_safe_join(safe_text_array(record.get('keyword_bm25')))}",
        ]
    )


def build_clustering_embedding_text(item_or_record: Mapping[str, Any]) -> str:
    """Build a Gemini Embedding 2 symmetric clustering input."""
    if "summary" in item_or_record and "book" not in item_or_record:
        return f"task: clustering | query: \n{_build_clustering_content(item_or_record)}".strip()
    record = build_book_embedding_source_record(item_or_record)
    content = _embedding_content_from_record(record)
    if not content:
        raise ValueError("empty symmetric embedding content")
    return f"task: clustering | query: {content}"


def build_book_search_embedding_text_asymmetric(item: Mapping[str, Any]) -> str:
    """Build a Gemini Embedding 2 asymmetric document input."""
    record = build_book_embedding_source_record(item)
    title = clean_text(record.get("book", {}).get("title")) or "Untitled"
    creator = ", ".join(safe_text_array(record.get("book", {}).get("creator")))
    title_with_creator = f"{title} {creator}".strip()
    abstract = record.get("abstract", {}) if isinstance(record, Mapping) else {}
    summary = clean_text(abstract.get("summary"))
    if not summary:
        raise ValueError("empty asymmetric embedding summary")
    critique = clean_text(abstract.get("critique"))
    return "\n".join(
        [
            f"title: {title_with_creator} | text: ",
            summary,
            critique,
            "",
            f"Target: {_safe_join(safe_text_array(abstract.get('target_text')))}",
            f"Utility: {_safe_join(safe_text_array(abstract.get('utility_text')))}",
            f"Search: {_safe_join(safe_text_array(abstract.get('search_intent')))}",
            f"Keywords: {_safe_join(safe_text_array(abstract.get('keyword_bm25')))}",
        ]
    ).strip()


def build_embedding_content_hash(
    *,
    raw_text: str,
    model_id: str,
    target_dim: int,
    task_type: str,
    text_builder_version: str = TEXT_BUILDER_VERSION,
) -> str:
    return hash_source_record(
        {
            "kind": "embedding-input",
            "provider": "google",
            "model": model_id,
            "target_dim": target_dim,
            "task_type": task_type,
            "text_builder_version": text_builder_version,
            "raw_text": raw_text,
        }
    )


def build_embedding_metadata(
    model_id: str,
    task_type: str,
    *,
    target_dim: int = 768,
    content_hash: Optional[str] = None,
    source_record_hash: Optional[str] = None,
    source: Optional[str] = None,
    pipeline_version: str = TEXT_BUILDER_VERSION,
    normalized: bool = True,
) -> Dict[str, Any]:
    metadata: Dict[str, Any] = {
        "provider": "google",
        "model": model_id,
        "taskType": task_type,
        "outputDimensionality": target_dim,
        "normalizedL2": normalized,
        "textBuilderVersion": pipeline_version,
        "hash": {
            "algo": HASH_ALGORITHM,
            "encoding": HASH_ENCODING,
        },
    }
    if content_hash:
        metadata["contentHash"] = content_hash
        metadata["hash"]["content_hash"] = content_hash
    if source_record_hash:
        metadata["sourceRecordHash"] = source_record_hash
    if source:
        metadata["source"] = source
    return metadata
