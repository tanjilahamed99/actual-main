"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Search,
  Loader2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Layers,
  Filter,
  X,
} from "lucide-react";
import { getAllPassages } from "@/actions/admin";
import SearchBar from "../_components/SearchBar";
import Pagination from "../_components/Pagination";

const PAGE_SIZE = 20;

export default function AdminPassagesPage() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [page, setPage] = useState(1);

  // reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, priority]);

  const fetchPassages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllPassages({
        q: search || undefined,
        status: status || undefined,
        priority: priority || undefined,
        page,
        limit: PAGE_SIZE,
        sort: "testNumber",
        order: "asc",
      });
      setRows(data.passages ?? []);
      setMeta(data.pagination ?? { total: 0, totalPages: 1 });
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

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
  };

  const hasActiveFilters = !!(search || status || priority);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
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
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-4 py-2 font-sans text-xs font-medium text-ink transition hover:border-indigo-deep/40 hover:text-indigo-deep"
        >
          <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
          Manage tests
        </Link>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-raised p-4 sm:flex-row sm:items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by passage title, label, or test title…"
        />

        <div className="flex flex-wrap gap-2 sm:ml-auto">
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
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2.5 font-sans text-sm text-muted transition hover:border-indigo-deep/40 hover:text-ink"
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
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-10 text-center font-sans text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
          <button onClick={fetchPassages} className="underline">
            Retry
          </button>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-line bg-paper-raised p-10 text-center font-sans text-sm text-muted">
          No passages match your search.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-line bg-paper-raised">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-b border-line bg-paper text-left text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-medium">Passage</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">
                    Test
                  </th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Questions
                  </th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium"> </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((p) => (
                  <PassageRow key={`${p.testId}-${p.passageId}`} row={p} />
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={meta.totalPages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────

function PassageRow({ row }) {
  return (
    <tr className="transition-colors hover:bg-paper/60">
      {/* Passage cell */}
      <td className="px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-deep/10 font-mono text-xs font-semibold text-indigo-deep">
            {row.passageId}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">
              {row.passageTitle || "(untitled passage)"}
            </p>
            <p className="truncate text-xs text-muted">
              {row.passageLabel ?? `Passage ${row.passageId}`}
              {row.passageSubtitle ? ` · ${row.passageSubtitle}` : ""}
            </p>
          </div>
        </div>
      </td>

      {/* Test cell */}
      <td className="hidden px-4 py-3 sm:table-cell">
        <Link
          href={`/admin/reading/${row.testId}`}
          className="group inline-flex items-center gap-1.5 text-ink transition hover:text-indigo-deep"
        >
          <span className="font-mono text-xs text-muted">
            RT-{row.testNumber}
          </span>
          <span className="truncate">{row.testTitle}</span>
          <ExternalLink
            className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100"
            strokeWidth={2}
          />
        </Link>
      </td>

      {/* Question count */}
      <td className="hidden px-4 py-3 md:table-cell">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
          <Layers className="h-3.5 w-3.5" strokeWidth={1.8} />
          {row.questionBlockCount} block
          {row.questionBlockCount === 1 ? "" : "s"}
        </span>
      </td>

      {/* Status pills */}
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

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <Link
          href={`/admin/reading/${row.testId}`}
          className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-ink transition hover:border-indigo-deep/40 hover:text-indigo-deep"
        >
          Open
        </Link>
      </td>
    </tr>
  );
}

function StatusPill({ label, tone = "indigo" }) {
  const map = {
    indigo: "bg-indigo-deep/10 text-indigo-deep",
    sage: "bg-sage-soft text-sage",
    gold: "bg-gold-soft/40 text-gold",
    clay: "bg-clay/10 text-clay",
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
    <div className="overflow-hidden rounded-2xl border border-line bg-paper-raised">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse border-b border-line bg-line/20 last:border-0"
        />
      ))}
    </div>
  );
}

const selectCls =
  "rounded-full border border-line bg-paper-raised px-4 py-2.5 font-sans text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";