"use client";

import { useEffect, useMemo, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Loader2,
  PenLine,
  ArrowUpRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Trophy,
  RotateCcw,
  Eye,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  listPublicWritingTests,
  getMyWritingAttempts,
} from "@/actions/writing";

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const KIND_LABELS = {
  pie: "Pie chart",
  bar: "Bar chart",
  line: "Line graph",
  table: "Table",
  process: "Process diagram",
  map: "Map",
  change_table: "Change table",
};

const KIND_OPTIONS = [
  { value: "", label: "All types" },
  { value: "pie", label: "Pie chart" },
  { value: "bar", label: "Bar chart" },
  { value: "line", label: "Line graph" },
  { value: "table", label: "Table" },
  { value: "process", label: "Process diagram" },
  { value: "map", label: "Map" },
  { value: "change_table", label: "Change table" },
];

const PRIORITY_OPTIONS = [
  { value: "", label: "All" },
  { value: "main", label: "Main" },
  { value: "extra", label: "Extra" },
];

const PAGE_SIZE = 12;

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

export default function WritingListPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-paper">
          <Loader2 className="h-5 w-5 animate-spin text-muted" />
        </div>
      }
    >
      <WritingListInner />
    </Suspense>
  );
}

function WritingListInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── URL is the source of truth ──
  const urlQ = searchParams.get("q") ?? "";
  const urlKind = searchParams.get("kind") ?? "";
  const urlPriority = searchParams.get("priority") ?? "";
  const urlPage = Math.max(
    1,
    parseInt(searchParams.get("page") ?? "1", 10) || 1,
  );

  const [searchInput, setSearchInput] = useState(urlQ);
  const [debouncedQ, setDebouncedQ] = useState(urlQ);

  const [tests, setTests] = useState([]);
  const [attemptsByTest, setAttemptsByTest] = useState({});
  const [pagination, setPagination] = useState({
    page: urlPage,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // sync local input with URL (back/forward)
  useEffect(() => {
    setSearchInput(urlQ);
    setDebouncedQ(urlQ);
  }, [urlQ]);

  // debounce search
  useEffect(() => {
    const id = setTimeout(() => {
      if (searchInput.trim() !== debouncedQ) {
        setDebouncedQ(searchInput.trim());
      }
    }, 350);
    return () => clearTimeout(id);
  }, [searchInput, debouncedQ]);

  // write filters to URL (resets page)
  const pushFilters = useCallback(
    (next) => {
      const params = new URLSearchParams(searchParams.toString());
      const apply = (key, val) => {
        if (val) params.set(key, val);
        else params.delete(key);
      };
      if ("q" in next) apply("q", next.q);
      if ("kind" in next) apply("kind", next.kind);
      if ("priority" in next) apply("priority", next.priority);
      if ("q" in next || "kind" in next || "priority" in next) {
        params.delete("page");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // sync debounced search → URL
  useEffect(() => {
    if (debouncedQ !== urlQ) pushFilters({ q: debouncedQ });
  }, [debouncedQ, urlQ, pushFilters]);

  // attempts (once)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyWritingAttempts().catch(() => ({
          data: { attempts: [] },
        }));
        if (cancelled) return;
        const map = {};
        for (const a of res.data?.attempts ?? []) {
          const key = String(a.testNumber);
          if (!map[key]) map[key] = a;
        }
        setAttemptsByTest(map);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // tests
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const res = await listPublicWritingTests({
          q: urlQ,
          kind: urlKind,
          priority: urlPriority,
          page: urlPage,
          limit: PAGE_SIZE,
        });
        if (cancelled) return;
        setTests(res.data?.test ?? []);
        setPagination(
          res.data?.pagination ?? {
            page: urlPage,
            total: 0,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        );
      } catch {
        if (!cancelled) setError("Failed to load writing tests.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [urlQ, urlKind, urlPriority, urlPage]);

  const goToPage = useCallback(
    (n) => {
      const params = new URLSearchParams(searchParams.toString());
      if (n <= 1) params.delete("page");
      else params.set("page", String(n));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [router, pathname, searchParams],
  );

  // Back button — prefer in-app back, fall back to home
  const handleBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }, [router]);

  const hasActiveFilters = urlQ || urlKind || urlPriority || urlPage > 1;

  const clearFilters = () => {
    setSearchInput("");
    setDebouncedQ("");
    router.replace(pathname, { scroll: false });
  };

  const pageWindow = useMemo(() => {
    const total = pagination.totalPages;
    const cur = pagination.page;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = new Set([1, total, cur, cur - 1, cur + 1]);
    if (cur <= 3) [2, 3, 4].forEach((p) => pages.add(p));
    if (cur >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => pages.add(p));
    const sorted = [...pages]
      .filter((p) => p >= 1 && p <= total)
      .sort((a, b) => a - b);
    const out = [];
    let prev = 0;
    for (const p of sorted) {
      if (prev && p - prev > 1) out.push("…");
      out.push(p);
      prev = p;
    }
    return out;
  }, [pagination.totalPages, pagination.page]);

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8 md:px-10">
        {/* ── Back ── */}
        <button
          onClick={handleBack}
          className="group mb-8 inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-line transition-all group-hover:-translate-x-0.5 group-hover:border-indigo-deep/40">
            <ArrowLeft className="h-3 w-3" strokeWidth={2.2} />
          </span>
          Back
        </button>

        {/* ── Header ── */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <span className="h-px w-6 bg-ink/25" />
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted">
              Practice · Academic
            </p>
          </div>
          <h1 className="mt-1 font-display text-[27px] leading-tight tracking-tight text-ink sm:text-[32px]">
            Writing Tests
          </h1>
          <p className="mt-1.5 max-w-xl font-sans text-[13px] leading-relaxed text-muted">
            Task 1 & Task 2 with authentic IELTS prompts. Submit for expert
            marking and detailed band feedback.
          </p>
        </div>

        {/* ── Sticky filter bar ── */}
        <div className="sticky top-0 z-20 -mx-5 mt-8 px-5 py-3 sm:-mx-8 sm:px-8 md:-mx-10 md:px-10">
          <div className="flex flex-col gap-2.5 rounded-xl border border-line bg-paper-raised/95 p-3 shadow-[0_1px_2px_rgba(22,29,52,0.04)] backdrop-blur-sm sm:flex-row sm:items-center">
            {/* search */}
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted/70"
                strokeWidth={2}
              />
              <input
                type="text"
                placeholder="Search title or prompt…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-lg border border-line bg-paper py-2 pl-9 pr-9 font-sans text-[13px] text-ink outline-none transition placeholder:text-muted/60 focus:border-indigo-deep/50"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted/70 transition hover:text-ink"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              )}
            </div>

            <select
              value={urlKind}
              onChange={(e) => pushFilters({ kind: e.target.value })}
              className="cursor-pointer rounded-lg border border-line bg-paper px-3 py-2 font-sans text-[13px] text-ink outline-none transition focus:border-indigo-deep/50"
            >
              {KIND_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <select
              value={urlPriority}
              onChange={(e) => pushFilters({ priority: e.target.value })}
              className="cursor-pointer rounded-lg border border-line bg-paper px-3 py-2 font-sans text-[13px] text-ink outline-none transition focus:border-indigo-deep/50"
            >
              {PRIORITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 font-sans text-[12px] font-medium text-muted transition hover:text-ink"
              >
                <X className="h-3 w-3" strokeWidth={2} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Result count ── */}
        {!loading && !error && (
          <div className="mt-5 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              {pagination.total} {pagination.total === 1 ? "test" : "tests"}
              {pagination.totalPages > 1 && (
                <>
                  {" · "}
                  page {pagination.page} of {pagination.totalPages}
                </>
              )}
            </p>
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="mt-20 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted" />
          </div>
        ) : error ? (
          <div className="mt-10 rounded-xl border border-line bg-paper-raised p-10 text-center font-sans text-[13px] text-muted">
            {error}
          </div>
        ) : tests.length === 0 ? (
          <div className="mt-10 rounded-xl border border-line bg-paper-raised p-10 text-center font-sans text-[13px] text-muted">
            No writing tests match your filters.
          </div>
        ) : (
          <>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tests.map((t) => (
                <WritingTestCard
                  key={t._id}
                  test={t}
                  attempt={attemptsByTest[String(t.testNumber)] ?? null}
                />
              ))}
            </div>

            {/* ── Pagination ── */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center">
                <nav
                  className="flex items-center gap-0.5 rounded-full border border-line bg-paper-raised p-1"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={!pagination.hasPrev}
                    aria-label="Previous page"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                  </button>

                  {pageWindow.map((p, i) =>
                    p === "…" ? (
                      <span
                        key={`e-${i}`}
                        className="select-none px-1.5 font-mono text-[12px] text-muted/60"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        aria-current={p === pagination.page ? "page" : undefined}
                        className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 font-mono text-[12px] transition ${
                          p === pagination.page
                            ? "bg-indigo-deep text-paper"
                            : "text-ink hover:bg-paper"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={!pagination.hasNext}
                    aria-label="Next page"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────

function WritingTestCard({ test, attempt }) {
  const status = attempt?.status;
  const isMarked = status === "marked";
  const isPending = status === "submitted";

  const kinds = useMemo(() => {
    const set = new Set();
    for (const part of test.parts ?? []) {
      for (const c of part.charts ?? []) {
        if (c?.kind) set.add(c.kind);
      }
    }
    return Array.from(set);
  }, [test.parts]);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-paper-raised p-4 transition-all duration-200 hover:border-indigo-deep/30 hover:shadow-[0_16px_32px_-24px_rgba(22,29,52,0.28)]">
      {/* top hairline accent on hover */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-deep/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
          WT-{String(test.testNumber).padStart(3, "0")}
        </span>

        {isMarked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-sage-soft/60 px-2 py-[3px] font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] text-sage">
            <CheckCircle2 className="h-2.5 w-2.5" strokeWidth={2.5} />
            Marked
          </span>
        )}
        {isPending && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft/40 px-2 py-[3px] font-mono text-[9.5px] font-semibold uppercase tracking-[0.08em] text-gold">
            <Clock className="h-2.5 w-2.5" strokeWidth={2.5} />
            Pending
          </span>
        )}
        {!status && (
          <span className="rounded-full border border-line px-2 py-[3px] font-mono text-[9.5px] uppercase tracking-[0.08em] text-muted">
            {test.priority}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-3 font-display text-[15px] leading-snug tracking-tight text-ink transition-colors group-hover:text-indigo-deep">
        {test.title}
      </h3>

      {/* Meta */}
      <p className="mt-1 font-sans text-[11.5px] text-muted">
        {test.parts?.length ?? 0} task
        {test.parts?.length === 1 ? "" : "s"}
        {kinds.length > 0 && (
          <>
            {" · "}
            {kinds.map((k) => KIND_LABELS[k] ?? k).join(", ")}
          </>
        )}
      </p>

      {/* Band */}
      {isMarked && attempt.overallBand != null && (
        <div className="mt-3 flex items-center gap-2.5 rounded-lg border border-sage-soft/70 bg-sage-soft/30 px-3 py-2">
          <Trophy className="h-4 w-4 shrink-0 text-sage" strokeWidth={1.8} />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-sage/80">
              Overall band
            </p>
            <p className="font-display text-[16px] font-semibold leading-tight text-sage">
              {attempt.overallBand}
            </p>
          </div>
        </div>
      )}

      {/* Submitted */}
      {attempt && (
        <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted/80">
          {isMarked ? "Marked" : "Submitted"}{" "}
          {new Date(
            isMarked ? attempt.markedAt : attempt.submittedAt,
          ).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </p>
      )}

      {/* Actions */}
      <div className="mt-3.5 flex items-center justify-between border-t border-line pt-3">
        {!attempt ? (
          <Link
            href={`/writing/${test.testNumber}`}
            className="inline-flex items-center gap-1.5 font-sans text-[12.5px] font-medium text-indigo-deep transition-all hover:gap-2"
          >
            <PenLine className="h-3 w-3" strokeWidth={2.2} />
            Start test
            <ArrowUpRight className="h-3 w-3" strokeWidth={2.2} />
          </Link>
        ) : (
          <div className="flex w-full items-center gap-1.5">
            <Link
              href={`/writing/${test.testNumber}`}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-md border border-line px-2 py-1.5 font-sans text-[11.5px] font-medium text-ink transition hover:border-indigo-deep/40 hover:text-indigo-deep"
            >
              <Eye className="h-3 w-3" strokeWidth={2} />
              View
            </Link>
            <Link
              href={`/writing/${test.testNumber}?retake=1`}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-indigo-deep px-2 py-1.5 font-sans text-[11.5px] font-medium text-paper transition hover:bg-ink"
            >
              <RotateCcw className="h-3 w-3" strokeWidth={2} />
              Retake
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}