"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import { useModuleTestStore } from "@/features/Useteststore";
import { getAllReadingTest } from "@/actions/test";
import { UserRoute } from "@/pages/PrivateRoutes";

const PAGE_SIZE = 9;

function MainReadingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { getSession } = useModuleTestStore();
  
  const [readingData, setReadingData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  
  const urlQ = searchParams.get("q") ?? "";
  const urlType = searchParams.get("type") ?? "all";
  const urlPriority = searchParams.get("priority") ?? "all";
  const urlStatus = searchParams.get("status") ?? "all";
  const urlPage = Math.max(
    1,
    parseInt(searchParams.get("page") ?? "1", 10) || 1,
  );

  useEffect(() => {
    setIsVisible(true);
    const fetch = async () => {
      const { data } = await getAllReadingTest();
      if (data.success) {
        setReadingData([...data.test]);
      }
    };
    fetch();
  }, []);

  const [searchInput, setSearchInput] = useState(urlQ);
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
          getSession("reading", String(test.testNumber))?.status === "completed";
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
        (t) => getSession("reading", String(t.testNumber))?.status === "completed",
      ).length,
    [readingData, getSession],
  );

  const selectClass =
    "w-full sm:w-auto rounded-xl border border-line bg-paper-raised py-2.5 pl-3 pr-8 font-sans text-xs font-semibold text-ink shadow-sm outline-none transition-all focus:border-indigo-deep focus:ring-2 focus:ring-indigo-deep/20 cursor-pointer appearance-none";

  return (
    <UserRoute>
      <div className="min-h-screen bg-paper selection:bg-gold/30 pb-16">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8">
          
          {/* ── HEADER SECTION ── */}
          <div 
            className={`mb-10 transition-all duration-700 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-xs font-semibold text-muted transition-colors hover:text-ink"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-line bg-paper-raised transition-colors group-hover:border-ink/20">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </div>
              Back to Home
            </Link>
            
            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <h1 className="font-display text-2xl text-ink sm:text-3xl">
                  Reading Tests
                </h1>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted">
                  Practice with real IELTS Reading questions collected from actual past exams.
                </p>
              </div>

              {/* Premium Stats Display */}
              <div className="flex shrink-0 gap-6 rounded-xl border border-line/60 bg-paper-raised p-4 shadow-sm">
                <div>
                  <p className="font-sans text-xl font-bold text-ink">{readingData.length}</p>
                  <p className="mt-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-muted">Total Tests</p>
                </div>
                <div className="w-px bg-line/60" />
                <div>
                  <p className="font-sans text-xl font-bold text-green-600">{completedCount}</p>
                  <p className="mt-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-muted">Completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── FILTER BAR (Sticky) ── */}
          <div className="sticky top-4 z-30 mb-6 rounded-2xl border border-line bg-paper/90 p-2 shadow-sm backdrop-blur-md">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              
              {/* Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search test titles..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full rounded-xl border border-transparent bg-paper-raised py-2.5 pl-10 pr-4 font-sans text-sm text-ink outline-none transition-all placeholder:text-muted/70 hover:border-line focus:border-indigo-deep focus:ring-2 focus:ring-indigo-deep/20"
                />
                <svg
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                {typeOptions.length > 2 && (
                  <select
                    value={urlType}
                    onChange={(e) => updateParams({ type: e.target.value, page: null })}
                    className={selectClass}
                  >
                    {typeOptions.map((t, idx) => (
                      <option key={idx} value={t}>
                        {t === "all" ? "All Types" : t}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={urlPriority}
                  onChange={(e) => updateParams({ priority: e.target.value, page: null })}
                  className={selectClass}
                >
                  {priorityOptions.map((p) => (
                    <option key={p} value={p}>
                      {p === "all" ? "All Priorities" : p}
                    </option>
                  ))}
                </select>

                <select
                  value={urlStatus}
                  onChange={(e) => updateParams({ status: e.target.value, page: null })}
                  className={selectClass}
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="not-started">Not Started</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="shrink-0 whitespace-nowrap rounded-xl border border-line px-3 py-2.5 font-sans text-xs font-semibold text-muted transition-colors hover:bg-paper-raised hover:text-ink"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Result count */}
          <p className={`mb-4 text-xs font-semibold uppercase tracking-wider text-muted transition-opacity duration-150 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
            {filteredTests.length} Test{filteredTests.length !== 1 ? "s" : ""} Found
            {hasActiveFilters ? " (Filtered)" : ""}
          </p>

          {/* ── TEST CARDS GRID ── */}
          <div
            id="test-grid"
            className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-150 ease-out ${isTransitioning ? "opacity-0" : "opacity-100"}`}
          >
            {displayedTests.length > 0 ? (
              displayedTests.map((test, i) => {
                const session = getSession("reading", String(test.testNumber));
                const isCompleted = session?.status === "completed";

                return (
                  <Link
                    key={test.testNumber}
                    href={`/reading/${test.testNumber}`}
                    style={{ animationDelay: `${i * 50}ms` }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-paper-raised p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-deep/30 hover:shadow-[0_15px_30px_-15px_rgba(22,29,52,0.15)] animate-fade-up"
                  >
                    {/* Top decorative gradient line */}
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-deep/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Completed Ribbon */}
                    {isCompleted && (
                      <div className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-lg bg-green-600/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-green-700 border-b border-l border-green-600/20">
                        <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Completed
                      </div>
                    )}

                    {/* Card Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <span className="rounded-md bg-indigo-deep/5 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-indigo-deep">
                        {test.type || "Academic"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 font-sans text-base font-semibold leading-snug text-ink transition-colors group-hover:text-indigo-deep">
                      {test.title}
                    </h3>

                    {/* Content Meta */}
                    <div className="mt-auto flex items-center gap-3 border-t border-line/50 pt-4 text-xs font-medium text-muted">
                      <div className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-muted/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {test.questions.length} Passages
                      </div>
                      <div className="h-1 w-1 rounded-full bg-line" />
                      <div className="flex items-center gap-1.5">
                        <svg className="h-3.5 w-3.5 text-muted/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        60 Mins
                      </div>
                    </div>

                    {/* Action Row */}
                    <div className="mt-4 flex items-center justify-between border-t border-line/50 pt-4">
                      <span className="font-sans text-xs font-bold text-indigo-deep transition-all group-hover:gap-1.5 inline-flex items-center gap-1">
                        {isCompleted ? "Retake Test" : "Start Test"}
                        <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                      <span className="font-mono text-[10px] font-medium text-muted">
                        40 Qs
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-line py-16 text-center animate-fade-up">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper-raised border border-line">
                  <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="font-sans text-sm font-semibold text-ink">No tests found</p>
                <p className="mt-1 font-sans text-xs text-muted">Try adjusting your filters.</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 rounded-full bg-indigo-deep px-5 py-2 font-sans text-xs font-bold text-paper transition-all hover:bg-ink"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-8 items-center justify-center rounded-lg border border-line px-3 text-xs font-semibold text-muted transition-all hover:bg-paper-raised hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-xs text-muted">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                        p === currentPage
                          ? "bg-indigo-deep text-paper shadow-sm"
                          : "border border-transparent text-muted hover:border-line hover:bg-paper-raised hover:text-ink"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-8 items-center justify-center rounded-lg border border-line px-3 text-xs font-semibold text-muted transition-all hover:bg-paper-raised hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
        <Footer />

        <style jsx global>{`
          @keyframes fade-up {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fade-up 0.3s ease-out both;
          }
          /* Hides scrollbar for the filter row on mobile */
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    </UserRoute>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper flex items-center justify-center text-sm text-muted">Loading...</div>}>
      <MainReadingPage />
    </Suspense>
  );
}