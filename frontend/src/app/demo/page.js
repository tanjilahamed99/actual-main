"use client";

import { useState } from "react";
import Link from "next/link";
import { DemoReadingTest } from "../../../demo/demoreading";
import Footer from "@/components/Footer";
import { useModuleTestStore } from "@/features/Useteststore";

export default function DemoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { getSession } = useModuleTestStore();

  const filteredTests = DemoReadingTest.filter((test) =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors">
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
            Demo Tests
          </h1>
          <p className="mt-2 text-muted">
            Practice with real IELTS questions from actual tests
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-line bg-paper-raised px-5 py-3 pl-12 font-sans text-sm text-ink placeholder:text-muted focus:border-indigo-deep focus:outline-none focus:ring-2 focus:ring-indigo-deep/20"
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
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map((test) => {
            const session = getSession("reading", test.id);
            const isCompleted = session?.status === "completed";

            return (
              <Link
                key={test.id}
                href={`/demo/reading/${test.id}`}
                className="group relative rounded-2xl border border-line bg-paper-raised p-6 transition-all hover:border-indigo-deep/30 hover:shadow-[0_20px_40px_-30px_rgba(22,29,52,0.4)]">
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
                <h3 className="mt-4 font-display text-xl text-ink group-hover:text-indigo-deep transition-colors">
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
                  <span className="text-sm font-medium text-indigo-deep group-hover:gap-2.5 inline-flex items-center gap-1.5 transition-all">
                    Start test
                    <span aria-hidden>→</span>
                  </span>
                  <span className="text-xs text-muted">
                    {Object.keys(test.answers).length} questions
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Stats */}
        <div className="mt-12 rounded-2xl border border-line bg-paper-raised p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <dt className="font-mono text-2xl text-indigo-deep">
                {DemoReadingTest.length}
              </dt>
              <dd className="mt-1 text-sm text-muted">Total tests</dd>
            </div>
            <div>
              <dt className="font-mono text-2xl text-indigo-deep">
                {DemoReadingTest.reduce(
                  (acc, test) => acc + test.questions.length,
                  0,
                )}
              </dt>
              <dd className="mt-1 text-sm text-muted">Total passages</dd>
            </div>
            <div>
              <dt className="font-mono text-2xl text-indigo-deep">
                {DemoReadingTest.reduce(
                  (acc, test) => acc + Object.keys(test.answers).length,
                  0,
                )}
              </dt>
              <dd className="mt-1 text-sm text-muted">Total questions</dd>
            </div>
            <div>
              <dt className="font-mono text-2xl text-indigo-deep">Free</dt>
              <dd className="mt-1 text-sm text-muted">
                Always free to practice
              </dd>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
