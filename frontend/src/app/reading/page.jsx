// app/demo/page.jsx
"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import { useModuleTestStore } from "@/features/Useteststore";
import { getAllReadingTest } from "@/actions/test";
import { UserRoute } from "@/pages/PrivateRoutes";

const PAGE_SIZE = 9;

function DemoPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { getSession } = useModuleTestStore();
  const [readingData, setReadingData] = useState([]);
  const urlQ = searchParams.get("q") ?? "";
  const urlType = searchParams.get("type") ?? "all";
  const urlPriority = searchParams.get("priority") ?? "all";
  const urlStatus = searchParams.get("status") ?? "all";
  const urlPage = Math.max(
    1,
    parseInt(searchParams.get("page") ?? "1", 10) || 1,
  );

  useEffect(() => {
    const fetch = async () => {
      const { data } = await getAllReadingTest();
      if (data.success) {
        setReadingData([...data.test]);
      }
    };
    fetch();
  }, []);

  const [searchInput, setSearchInput] = useState(urlQ);
  // Drives the grid's cross-fade whenever the visible result set changes
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      if (searchInput !== urlQ)
        updateParams({ q: searchInput || null, page: null });
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const updateParams = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "all" || value === "")
          params.delete(key);
        else params.set(key, value);
      });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // Fixed: was [] — these stayed empty forever since readingData
  // loads asynchronously after this first computes.
  const typeOptions = useMemo(
    () => ["all", ...new Set(readingData.map((t) => t.type))],
    [readingData],
  );
  const priorityOptions = useMemo(
    () => ["all", ...new Set(readingData.map((t) => t.priority))],
    [readingData],
  );

  const filteredTests = useMemo(() => {
    return readingData.filter((test) => {
      if (urlQ && !test.title.toLowerCase().includes(urlQ.toLowerCase()))
        return false;
      if (urlType !== "all" && test.type !== urlType) return false;
      if (urlPriority !== "all" && test.priority !== urlPriority) return false;
      if (urlStatus !== "all") {
        const completed =
          getSession("reading", test._id)?.status === "completed";
        if (urlStatus === "completed" && !completed) return false;
        if (urlStatus === "not-started" && completed) return false;
      }
      return true;
    });
  }, [readingData, urlQ, urlType, urlPriority, urlStatus, getSession]);

  const totalPages = Math.max(1, Math.ceil(filteredTests.length / PAGE_SIZE));
  const currentPage = Math.min(urlPage, totalPages);

  useEffect(() => {
    if (urlPage !== currentPage)
      updateParams({ page: currentPage === 1 ? null : String(currentPage) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const pageTests = filteredTests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // ── Cross-fade the grid whenever the visible slice changes ──
  // Fixed: added `readingData` to deps — this effect only re-ran on
  // filter/page changes before, so when the async fetch resolved and
  // populated readingData, displayedTests never got refreshed and
  // stayed stuck at its initial empty value.
  const [displayedTests, setDisplayedTests] = useState(pageTests);
  useEffect(() => {
    setIsTransitioning(true);
    const id = setTimeout(() => {
      setDisplayedTests(pageTests);
      setIsTransitioning(false);
    }, 150);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlQ, urlType, urlPriority, urlStatus, currentPage, readingData]);

  const goToPage = (p) => {
    updateParams({ page: p === 1 ? null : String(p) });
    document
      .getElementById("test-grid")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hasActiveFilters =
    urlQ || urlType !== "all" || urlPriority !== "all" || urlStatus !== "all";

  const clearFilters = () => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  };

  const completedCount = useMemo(
    () =>
      readingData.filter(
        (t) => getSession("reading", t._id)?.status === "completed",
      ).length,
    [readingData, getSession],
  );

  const selectClass =
    "rounded-full border border-line bg-paper-raised px-4 py-3 text-sm text-ink transition-all duration-200 ease-out focus:border-indigo-deep focus:outline-none focus:ring-2 focus:ring-indigo-deep/20 hover:border-indigo-deep/30 cursor-pointer";

  return (
    <UserRoute>
      <div className="min-h-screen bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors duration-200">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to home
            </Link>
            <h1 className="mt-4 font-display text-3xl text-ink sm:text-4xl">
              Reading Tests
            </h1>
            <p className="mt-2 text-muted">
              Practice with real IELTS questions from actual tests
            </p>
          </div>

          {/* ── Filter bar ── */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search tests..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-full border border-line bg-paper-raised px-5 py-3 pl-12 font-sans text-sm text-ink placeholder:text-muted transition-all duration-200 ease-out focus:border-indigo-deep focus:outline-none focus:ring-2 focus:ring-indigo-deep/20 hover:border-indigo-deep/30"
              />
              <svg
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <select
              value={urlType}
              onChange={(e) =>
                updateParams({ type: e.target.value, page: null })
              }
              className={selectClass}>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All types" : t}
                </option>
              ))}
            </select>

            <select
              value={urlPriority}
              onChange={(e) =>
                updateParams({ priority: e.target.value, page: null })
              }
              className={selectClass}>
              {priorityOptions.map((p) => (
                <option key={p} value={p}>
                  {p === "all" ? "All priorities" : p}
                </option>
              ))}
            </select>

            <select
              value={urlStatus}
              onChange={(e) =>
                updateParams({ status: e.target.value, page: null })
              }
              className={selectClass}>
              <option value="all">All status</option>
              <option value="completed">Completed</option>
              <option value="not-started">Not started</option>
            </select>

            {/* ── Always mounted — animates in place instead of
              shifting the row when it appears/disappears ── */}
            <button
              onClick={clearFilters}
              aria-hidden={!hasActiveFilters}
              tabIndex={hasActiveFilters ? 0 : -1}
              className={`shrink-0 rounded-full border border-line px-4 py-3 text-sm text-muted hover:text-ink hover:border-indigo-deep/40 transition-all duration-200 ease-out ${
                hasActiveFilters
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none w-0 !px-0 !py-0 border-0 overflow-hidden"
              }`}>
              Clear
            </button>
          </div>

          {/* Result count — fades with the grid */}
          <p
            className={`mb-4 text-sm text-muted transition-opacity duration-150 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}>
            {filteredTests.length} test{filteredTests.length !== 1 ? "s" : ""}{" "}
            found
            {hasActiveFilters ? " (filtered)" : ""}
          </p>

          {/* Test Cards Grid — cross-fades on filter/page change, staggers in */}
          <div
            id="test-grid"
            className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-150 ease-out ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}>
            {displayedTests.length > 0 ? (
              displayedTests.map((test, i) => {
                const session = getSession("reading", test._id);
                const isCompleted = session?.status === "completed";

                return (
                  <Link
                    key={test._id}
                    href={`/reading/${test.testNumber}`}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className="animate-fade-up group relative rounded-2xl border border-line bg-paper-raised p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-indigo-deep/30 hover:shadow-[0_20px_40px_-30px_rgba(22,29,52,0.4)]">
                    {isCompleted && (
                      <span className="absolute -top-2.5 -right-2.5 flex items-center gap-1 bg-green-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                        Completed
                      </span>
                    )}

                    <div className="flex items-start justify-between">
                      <span className="rounded-full bg-indigo-deep/10 px-3 py-1 font-mono text-xs font-medium text-indigo-deep">
                        {test.type}
                      </span>
                      <span className="rounded-full bg-gold-soft/40 px-3 py-1 font-mono text-xs font-medium text-gold">
                        {test.priority}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-xl text-ink transition-colors duration-200 group-hover:text-indigo-deep">
                      {test.title}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <span>{test.questions.length} passages</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {test.questions.map((q, idx) => (
                        <span
                          key={idx}
                          className="rounded-full border border-line px-2.5 py-1 text-[10px] text-muted">
                          {q.label}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                      <span className="text-sm font-medium text-indigo-deep inline-flex items-center gap-1.5 transition-all duration-200 group-hover:gap-2.5">
                        {isCompleted ? "Retake test" : "Start test"}
                        <span
                          aria-hidden
                          className="transition-transform duration-200 group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                      <span className="text-xs text-muted">
                        {test.answers && typeof test.answers === "object"
                          ? Object.keys(test.answers).length
                          : 0}{" "}
                        questions
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center animate-fade-up">
                <p className="text-muted mb-3">
                  No tests found matching your filters.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-deep font-medium hover:underline transition-all duration-200">
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1.5">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-line text-sm text-muted transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-deep/40 hover:text-ink">
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1,
                )
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-2 text-sm text-muted">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                        p === currentPage
                          ? "bg-indigo-deep text-white scale-100"
                          : "border border-line text-muted hover:border-indigo-deep/40 hover:text-ink"
                      }`}>
                      {p}
                    </button>
                  ),
                )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-line text-sm text-muted transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:border-indigo-deep/40 hover:text-ink">
                Next →
              </button>
            </div>
          )}
        </div>
        <Footer />

        <style jsx global>{`
          @keyframes fade-up {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-up {
            animation: fade-up 0.35s ease-out both;
          }
        `}</style>
      </div>
    </UserRoute>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={null}>
      <DemoPageInner />
    </Suspense>
  );
}
