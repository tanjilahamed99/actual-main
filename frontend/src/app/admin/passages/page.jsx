"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Eye,
  ExternalLink,
  AlertCircle,
  BookOpen,
  Layers,
  X,
  Pencil,
  Copy,
  Filter,
} from "lucide-react";
import { getAllPassages, getDuplicatePassages } from "@/actions/admin";
import SearchBar from "../_components/SearchBar";
import Pagination from "../_components/Pagination";

const PAGE_SIZE = 20;

// Normalise a title for comparison: trim, collapse spaces, lowercase.
function normalizeTitle(t) {
  return (t ?? "").trim().replace(/\s+/g, " ").toLowerCase();
}

export default function AdminPassagesPage() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);

  // Filter to only show duplicates (on the current page)
  const [duplicatesOnly, setDuplicatesOnly] = useState(false);

  // Global duplicate map (fetched from backend)
  const [duplicateMap, setDuplicateMap] = useState(new Map()); // normalizedTitle -> count
  const [duplicateTotals, setDuplicateTotals] = useState({ groups: 0, passages: 0 });


  useEffect(() => setPage(1), [search, status, priority]);

  const fetchPassages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [pageRes, dupRes] = await Promise.all([
        getAllPassages({
          q: search || undefined,
          status: status || undefined,
          priority: priority || undefined,
          page,
          limit: PAGE_SIZE,
          sort: "testNumber",
          order: "asc",
        }),
        getDuplicatePassages(),
      ]);

      setRows(pageRes.data.passages ?? []);
      setMeta(pageRes.data.pagination ?? { total: 0, totalPages: 1 });

      // Build a normalized-title → count map for the whole DB
      const map = new Map();
      for (const g of dupRes.data.groups ?? []) {
        map.set(g.normalizedTitle, g.count);
      }
      setDuplicateMap(map);
      setDuplicateTotals({
        groups: dupRes.data.totalGroups ?? 0,
        passages: dupRes.data.totalPassages ?? 0,
      });
    } catch (err) {
      console.error("Failed to load passages:", err);
      setError("Could not load passages. Please try again.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, page]);

  useEffect(() => {
    fetchPassages();
  }, [fetchPassages]);

  // ── Duplicate helpers ──────────────────────────────────────────
  const isDuplicateTitle = useCallback(
    (title) => {
      const key = normalizeTitle(title);
      return (duplicateMap.get(key) ?? 0) > 1;
    },
    [duplicateMap],
  );

  const getDuplicateCount = useCallback(
    (title) => duplicateMap.get(normalizeTitle(title)) ?? 0,
    [duplicateMap],
  );

  // Rows filtered by "duplicates only" toggle
  const visibleRows = useMemo(() => {
    if (!duplicatesOnly) return rows;
    return rows.filter((r) => isDuplicateTitle(r.passageTitle));
  }, [rows, duplicatesOnly, isDuplicateTitle]);

  // Counts for the banner
  const duplicateTitleCount = duplicateTotals.groups;
  const duplicateRowCount = duplicateTotals.passages;

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setDuplicatesOnly(false);
  };
  const hasActiveFilters = !!(search || status || priority || duplicatesOnly);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-xl text-ink sm:text-2xl">
            Passages
          </h1>
          <p className="mt-1 font-sans text-sm text-muted">
            {loading
              ? "Loading passages…"
              : `${meta.total} passage${meta.total === 1 ? "" : "s"} across all reading tests.`}
          </p>
        </div>
        <Link
          href="/admin/reading"
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-line px-4 py-2 font-sans text-xs font-medium text-ink transition hover:border-indigo-deep/40 hover:text-indigo-deep sm:self-auto"
        >
          <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
          Manage tests
        </Link>
      </div>

      {/* Duplicate summary banner */}
      {!loading && duplicateTitleCount > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-gold/40 bg-gold-soft/20 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Copy
              className="mt-0.5 h-5 w-5 shrink-0 text-gold"
              strokeWidth={1.8}
            />
            <div>
              <p className="font-sans text-sm font-medium text-ink">
                {duplicateTitleCount} duplicate title
                {duplicateTitleCount === 1 ? "" : "s"} in the database
              </p>
              <p className="mt-0.5 font-sans text-xs text-muted">
                {duplicateRowCount} passage
                {duplicateRowCount === 1 ? "" : "s"} share a title with another.
                {duplicatesOnly
                  ? " Showing only duplicates on this page."
                  : " Click below to filter this page."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDuplicatesOnly((v) => !v)}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-full px-4 py-2 font-sans text-xs font-medium transition sm:self-auto ${
              duplicatesOnly
                ? "bg-gold text-indigo-deep hover:bg-gold/90"
                : "border border-gold/50 text-ink hover:bg-gold-soft/40"
            }`}
          >
            <Filter className="h-3.5 w-3.5" strokeWidth={2} />
            {duplicatesOnly ? "Showing duplicates" : "Show duplicates only"}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-raised p-4 lg:flex-row lg:items-center">
        <div className="w-full lg:max-w-sm">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by title, label, or test…"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:ml-auto">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={selectCls}
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={selectCls}
          >
            <option value="">All priorities</option>
            <option value="main">Main test</option>
            <option value="extra">Extra practice</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-4 py-2.5 font-sans text-sm text-muted transition hover:border-indigo-deep/40 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <SkeletonList rows={8} />
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-10 text-center font-sans text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
          <button onClick={fetchPassages} className="underline">
            Retry
          </button>
        </div>
      ) : visibleRows.length === 0 ? (
        <div className="rounded-2xl border border-line bg-paper-raised p-10 text-center font-sans text-sm text-muted">
          {duplicatesOnly
            ? "No duplicate titles on this page. Try a different page or clear filters."
            : "No passages match your search."}
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 sm:hidden">
            {visibleRows.map((p,idx) => (
              <PassageCard
                key={idx}
                row={p}
                duplicateCount={getDuplicateCount(p.passageTitle)}
                onView={() => setViewing(p)}
              />
            ))}
          </div>

          {/* Desktop / tablet table */}
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-paper-raised sm:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] font-sans text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper text-left text-xs uppercase tracking-wider text-muted">
                    <th className="px-4 py-3 font-medium">Passage</th>
                    <th className="px-4 py-3 font-medium">Test</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">
                      Questions
                    </th>
                    <th className="hidden px-4 py-3 font-medium lg:table-cell">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {visibleRows.map((p,idx) => (
                    <PassageRow
                     key={idx}
                      row={p}
                      duplicateCount={getDuplicateCount(p.passageTitle)}
                      onView={() => setViewing(p)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            page={page}
            totalPages={meta.totalPages}
            onChange={setPage}
          />
        </>
      )}

      {viewing && (
        <PassageModal passage={viewing} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Shared bits
// ─────────────────────────────────────────────

function DuplicateBadge({ count }) {
  if (!count || count < 2) return null;
  return (
    <span
      className="ml-2 inline-flex items-center gap-1 rounded-full bg-clay/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-clay"
      title={`This title appears ${count} times across all tests`}
    >
      <Copy className="h-3 w-3" strokeWidth={2} />
      ×{count}
    </span>
  );
}

// ─────────────────────────────────────────────
// Mobile card
// ─────────────────────────────────────────────

function PassageCard({ row, duplicateCount, onView }) {
  const isDupe = duplicateCount > 1;

  return (
    <div
      className={`rounded-2xl border bg-paper-raised p-4 ${
        isDupe ? "border-clay/40" : "border-line"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-deep/10 font-mono text-xs font-semibold text-indigo-deep">
          {row.passageId}
        </span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-medium text-ink">
            {row.passageTitle || "(untitled passage)"}
            <DuplicateBadge count={duplicateCount} />
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted">
            {row.passageLabel ?? `Passage ${row.passageId}`}
            {row.passageSubtitle ? ` · ${row.passageSubtitle}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
        <Link
          href={`/admin/reading/${row.testId}`}
          className="inline-flex items-center gap-1 text-xs text-ink transition hover:text-indigo-deep"
        >
          <span className="font-mono text-[11px] text-muted">
            RT-{row.testNumber}
          </span>
          <span className="max-w-[140px] truncate">{row.testTitle}</span>
        </Link>

        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-line/40 px-2 py-0.5 font-mono text-[10px] text-muted">
          <Layers className="h-3 w-3" strokeWidth={2} />
          {row.questionBlockCount}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <StatusPill
          label={row.testStatus === "published" ? "Published" : "Draft"}
          tone={row.testStatus === "published" ? "sage" : "gold"}
        />
        <StatusPill
          label={row.testPriority === "main" ? "Main" : "Extra"}
          tone="indigo"
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center justify-center gap-1 rounded-full border border-line px-2 py-2 text-xs text-ink transition hover:border-indigo-deep/40 hover:text-indigo-deep active:scale-[0.97]"
        >
          <Eye className="h-3.5 w-3.5" strokeWidth={2} />
          View
        </button>
        <Link
          href={`/reading/${row.testNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1 rounded-full border border-line px-2 py-2 text-xs text-muted transition hover:border-indigo-deep/40 hover:text-indigo-deep active:scale-[0.97]"
        >
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
          Preview
        </Link>
        <Link
          href={`/admin/reading/edit/${row.testId}`}
          className="inline-flex items-center justify-center gap-1 rounded-full border border-line px-2 py-2 text-xs text-muted transition hover:border-indigo-deep/40 hover:text-indigo-deep active:scale-[0.97]"
        >
          <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
          Edit
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Desktop / tablet row
// ─────────────────────────────────────────────

function PassageRow({ row, duplicateCount, onView }) {
  const isDupe = duplicateCount > 1;

  return (
    <tr
      className={`transition-colors ${
        isDupe ? "bg-clay/5 hover:bg-clay/10" : "hover:bg-paper/60"
      }`}
    >
      <td className="px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-deep/10 font-mono text-xs font-semibold text-indigo-deep">
            {row.passageId}
          </span>
          <div className="min-w-0">
            <p className="flex items-center truncate font-medium text-ink">
              <span className="truncate">
                {row.passageTitle || "(untitled passage)"}
              </span>
              <DuplicateBadge count={duplicateCount} />
            </p>
            <p className="truncate text-xs text-muted">
              {row.passageLabel ?? `Passage ${row.passageId}`}
              {row.passageSubtitle
                ? ` · ${row.passageSubtitle.slice(0, 40)}${row.passageSubtitle.length > 40 ? "…" : ""}`
                : ""}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <Link
          href={`/admin/reading/${row.testId}`}
          className="group inline-flex items-center gap-1.5 text-ink transition hover:text-indigo-deep"
        >
          <span className="font-mono text-xs text-muted">
            RT-{row.testNumber}
          </span>
          <span className="truncate">{row.testTitle}</span>
          <ExternalLink
            className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            strokeWidth={2}
          />
        </Link>
      </td>

      <td className="hidden px-4 py-3 md:table-cell">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
          <Layers className="h-3.5 w-3.5" strokeWidth={1.8} />
          {row.questionBlockCount} block
          {row.questionBlockCount === 1 ? "" : "s"}
        </span>
      </td>

      <td className="hidden px-4 py-3 lg:table-cell">
        <div className="flex flex-wrap gap-1.5">
          <StatusPill
            label={row.testStatus === "published" ? "Published" : "Draft"}
            tone={row.testStatus === "published" ? "sage" : "gold"}
          />
          <StatusPill
            label={row.testPriority === "main" ? "Main" : "Extra"}
            tone="indigo"
          />
        </div>
      </td>

      <td className="px-4 py-3 text-right">
        <div className="inline-flex items-center gap-1.5">
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-xs text-ink transition hover:border-indigo-deep/40 hover:text-indigo-deep"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="hidden xl:inline">View</span>
          </button>

          <Link
            href={`/reading/${row.testNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-indigo-deep/40 hover:text-indigo-deep"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="hidden xl:inline">Preview</span>
          </Link>

          <Link
            href={`/admin/reading/edit/${row.testNumber}`}
            className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-indigo-deep/40 hover:text-indigo-deep"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
            <span className="hidden xl:inline">Edit</span>
          </Link>
        </div>
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────

function PassageModal({ passage, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-line bg-paper-raised shadow-2xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-deep/10 font-mono text-xs font-semibold text-indigo-deep">
                {passage.passageId}
              </span>
              <p className="truncate font-sans text-xs uppercase tracking-wider text-muted">
                {passage.passageLabel ?? `Passage ${passage.passageId}`}
              </p>
            </div>
            <h2 className="mt-2 line-clamp-2 font-display text-lg text-ink sm:text-xl">
              {passage.passageTitle || "(untitled passage)"}
            </h2>
            <p className="mt-1 truncate font-sans text-xs text-muted">
              RT-{passage.testNumber} · {passage.testTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition hover:border-ink/30 hover:text-ink"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-wrap gap-1.5">
            <StatusPill
              label={passage.testStatus === "published" ? "Published" : "Draft"}
              tone={passage.testStatus === "published" ? "sage" : "gold"}
            />
            <StatusPill
              label={
                passage.testPriority === "main"
                  ? "Main test"
                  : "Extra practice"
              }
              tone="indigo"
            />
            <StatusPill
              label={`${passage.questionBlockCount} question block${
                passage.questionBlockCount === 1 ? "" : "s"
              }`}
              tone="muted"
            />
          </div>

          <div className="mt-5 rounded-xl border border-line bg-paper p-4">
            <p className="whitespace-pre-wrap font-serif text-[15px] leading-relaxed text-ink">
              {passage.passageText || (
                <span className="italic text-muted">
                  This passage doesn&apos;t have body text saved yet. Open the
                  test to add or edit it.
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line px-5 py-3 sm:flex-row sm:items-center sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="order-2 w-full rounded-full border border-line px-4 py-2 font-sans text-sm text-ink transition hover:border-ink/30 sm:order-1 sm:w-auto"
          >
            Close
          </button>
          <Link
            href={`/admin/reading/${passage.testId}`}
            className="order-1 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gold px-4 py-2 font-sans text-sm font-semibold text-indigo-deep transition hover:bg-gold-soft sm:order-2 sm:w-auto"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
            Open in test editor
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function StatusPill({ label, tone = "indigo" }) {
  const map = {
    indigo: "bg-indigo-deep/10 text-indigo-deep",
    sage: "bg-sage-soft text-sage",
    gold: "bg-gold-soft/40 text-gold",
    clay: "bg-clay/10 text-clay",
    muted: "bg-line/40 text-muted",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide ${
        map[tone] ?? map.indigo
      }`}
    >
      {label}
    </span>
  );
}

function SkeletonList({ rows = 6 }) {
  return (
    <>
      <div className="space-y-3 sm:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl border border-line bg-line/20"
          />
        ))}
      </div>
      <div className="hidden overflow-hidden rounded-2xl border border-line bg-paper-raised sm:block">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse border-b border-line bg-line/20 last:border-0"
          />
        ))}
      </div>
    </>
  );
}

const selectCls =
  "w-full rounded-full border border-line bg-paper-raised px-4 py-2.5 font-sans text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20 sm:w-auto";