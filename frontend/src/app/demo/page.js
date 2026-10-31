"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DemoReadingTest } from "../../../demo/demoreading";
import Footer from "@/components/Footer";
import { useModuleTestStore } from "@/features/Useteststore";

export default function DemoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const { getSession } = useModuleTestStore();

  // Fade-in animation on load
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const filteredTests = DemoReadingTest.filter((test) =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalQuestions = DemoReadingTest.reduce(
    (acc, test) => acc + Object.keys(test.answers).length,
    0
  );

  return (
    <div className="min-h-screen bg-paper selection:bg-gold/30">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:px-8">
        
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
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold"></span>
                </span>
                Free Demo Archive
              </div>
              <h1 className="font-display text-2xl text-ink sm:text-3xl">
                Experience the <span className="italic text-indigo-deep">real</span> test.
              </h1>
              <p className="mt-2 font-sans text-sm leading-relaxed text-muted">
                Practice with actual IELTS Reading questions collected from recent test-takers. No sign-up required.
              </p>
            </div>

            {/* Premium Stats Display */}
            <div className="flex shrink-0 gap-6 rounded-xl border border-line/60 bg-paper-raised p-4 shadow-sm">
              <div>
                <p className="font-sans text-xl font-bold text-ink">{DemoReadingTest.length}</p>
                <p className="mt-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-muted">Full Tests</p>
              </div>
              <div className="w-px bg-line/60" />
              <div>
                <p className="font-sans text-xl font-bold text-indigo-deep">{totalQuestions}</p>
                <p className="mt-0.5 font-sans text-[10px] font-semibold uppercase tracking-wider text-muted">Questions</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── SEARCH BAR (Sticky & Elegant) ── */}
        <div className="sticky top-4 z-30 mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search demo tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-line bg-paper-raised py-3 pl-12 pr-4 font-sans text-sm text-ink shadow-sm outline-none transition-all placeholder:text-muted/70 hover:border-ink/20 focus:border-indigo-deep focus:ring-4 focus:ring-indigo-deep/10"
            />
            <svg
              className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* ── TEST CARDS GRID ── */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map((test, index) => {
            const session = getSession("reading", test.id);
            const isCompleted = session?.status === "completed";

            return (
              <Link
                key={test.id}
                href={`/demo/reading/${test.id}`}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-paper-raised p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-deep/30 hover:shadow-[0_15px_30px_-15px_rgba(22,29,52,0.15)] ${
                  isVisible ? "animate-fade-up" : "opacity-0"
                }`}
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
                  <span className="rounded-full border border-line bg-paper px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-muted">
                    {test.priority}
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
                    {Object.keys(test.answers).length} Qs
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredTests.length === 0 && (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-line py-16 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper-raised border border-line">
              <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="font-sans text-sm font-semibold text-ink">No tests found</p>
            <p className="mt-1 font-sans text-xs text-muted">Try searching for a different title.</p>
          </div>
        )}

        {/* ── STATS / FOOTER CTA ── */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-line bg-ink px-6 py-10 text-center shadow-xl sm:px-10">
          <h2 className="font-display text-xl text-paper sm:text-2xl">
            Ready for the real exam?
          </h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-paper/70">
            The demo is just a taste. Create a free account to access our full archive of real past papers, built-in timers, and Band 9 resources.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-gold px-6 py-2.5 font-sans text-xs font-bold text-indigo-deep transition-all hover:bg-gold-soft hover:shadow-md active:scale-95"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-paper/20 bg-transparent px-6 py-2.5 font-sans text-xs font-bold text-paper transition-all hover:bg-paper/10"
            >
              Log In
            </Link>
          </div>
        </div>

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
          animation: fade-up 0.3s ease-out both;
        }
      `}</style>
    </div>
  );
}