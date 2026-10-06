// app/demo/page.jsx
"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { Lock, Sparkles, BookOpen, Headphones, PenLine } from "lucide-react";

/**
 * Reading Demo — placeholder page.
 * The demo flow isn't built yet, so we show a "coming soon" screen
 * that keeps the Navbar link useful without exposing any test data.
 */
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-ink">
          <svg
            className="h-4 w-4"
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

        {/* Hero card */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-line bg-paper-raised">
          <div className="relative px-8 py-14 text-center sm:px-12 sm:py-20">
            {/* Soft glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(600px 200px at 50% 0%, rgba(212, 175, 55, 0.18), transparent 70%)",
              }}
            />

            <div className="relative">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft/30 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-gold">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                Coming Soon
              </span>

              {/* Heading */}
              <h1 className="mt-6 font-display text-3xl text-ink sm:text-5xl">
                Reading Demo Test
              </h1>

              <p className="mx-auto mt-4 max-w-xl font-sans text-base text-muted sm:text-lg">
                We&apos;re putting the finishing touches on the free IELTS
                Reading demo. Real passages, real questions, real feedback — no
                account required.
              </p>

              {/* Mock preview tiles */}
              <div className="mx-auto mt-10 grid max-w-lg gap-3 sm:grid-cols-3">
                {[
                  { icon: BookOpen, label: "3 Passages" },
                  { icon: Lock, label: "40 Questions" },
                  { icon: Headphones, label: "Timed Mode" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center justify-center gap-2 rounded-xl border border-line bg-paper px-4 py-3 font-sans text-sm text-ink-soft">
                    <Icon
                      className="h-4 w-4 text-indigo-deep"
                      strokeWidth={2}
                    />
                    {label}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex w-full items-center justify-center rounded-full border border-line px-6 py-3 font-sans text-sm font-medium text-ink transition-all duration-200 hover:border-indigo-deep/40 hover:text-indigo-deep sm:w-auto">
                  Back to home
                </Link>

                <button
                  type="button"
                  disabled
                  className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-indigo-deep/30 px-6 py-3 font-sans text-sm font-medium text-paper/70 sm:w-auto">
                  <Lock className="h-4 w-4" strokeWidth={2} />
                  Not available yet
                </button>
              </div>

              {/* Small hint */}
              <p className="mt-6 font-sans text-xs text-muted">
                Meanwhile, explore our{" "}
                <Link
                  href="/"
                  className="font-medium text-indigo-deep hover:underline">
                  full test collection
                </Link>{" "}
                — updated weekly.
              </p>
            </div>
          </div>
        </div>

        {/* What's coming — small roadmap */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "Real passages",
              body: "Pulled from actual IELTS Reading papers — no watered-down practice content.",
            },
            {
              icon: Headphones,
              title: "Full timer",
              body: "60-minute countdown with per-passage progress just like exam day.",
            },
            {
              icon: PenLine,
              title: "Instant scoring",
              body: "See your band estimate and question-by-question breakdown right away.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-line bg-paper-raised p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-deep/10 text-indigo-deep">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <h3 className="mt-4 font-display text-lg text-ink">{title}</h3>
              <p className="mt-1.5 font-sans text-sm leading-relaxed text-muted">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
