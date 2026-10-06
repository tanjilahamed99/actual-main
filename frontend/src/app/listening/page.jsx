// app/listening/page.jsx
"use client";

import Link from "next/link";
import Footer from "@/components/Footer";
import { Lock, Sparkles, Headphones, Clock, AudioLines } from "lucide-react";

/**
 * Listening — placeholder page.
 * The listening flow isn't built yet, so we show a "coming soon"
 * screen that keeps the Navbar link useful without exposing any data.
 */
export default function ListeningPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-ink"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
                Listening Tests
              </h1>

              <p className="mx-auto mt-4 max-w-xl font-sans text-base text-muted sm:text-lg">
                We&apos;re building the full IELTS Listening experience —
                four sections, native audio, real question types, and instant
                band-estimate feedback.
              </p>

              {/* Mock preview tiles */}
              <div className="mx-auto mt-10 grid max-w-lg gap-3 sm:grid-cols-3">
                {[
                  { icon: AudioLines, label: "4 Sections" },
                  { icon: Headphones, label: "40 Questions" },
                  { icon: Clock, label: "30 Min Audio" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center justify-center gap-2 rounded-xl border border-line bg-paper px-4 py-3 font-sans text-sm text-ink-soft"
                  >
                    <Icon className="h-4 w-4 text-indigo-deep" strokeWidth={2} />
                    {label}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex w-full items-center justify-center rounded-full border border-line px-6 py-3 font-sans text-sm font-medium text-ink transition-all duration-200 hover:border-indigo-deep/40 hover:text-indigo-deep sm:w-auto"
                >
                  Back to home
                </Link>

                <button
                  type="button"
                  disabled
                  className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-indigo-deep/30 px-6 py-3 font-sans text-sm font-medium text-paper/70 sm:w-auto"
                >
                  <Lock className="h-4 w-4" strokeWidth={2} />
                  Not available yet
                </button>
              </div>

              {/* Small hint */}
              <p className="mt-6 font-sans text-xs text-muted">
                Meanwhile, try our{" "}
                <Link
                  href="/reading"
                  className="font-medium text-indigo-deep hover:underline"
                >
                  Reading tests
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
              icon: AudioLines,
              title: "Four sections",
              body: "Everyday conversation → academic monologue, exactly like the real exam.",
            },
            {
              icon: Headphones,
              title: "Native audio",
              body: "Recorded with real UK, Australian, and North American accents.",
            },
            {
              icon: Clock,
              title: "Timed playback",
              body: "One full play-through with a 10-minute transfer window at the end.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-line bg-paper-raised p-6"
            >
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