"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const skills = [
  {
    letter: "L",
    name: "Listening koro",
    count: "2,480",
    desc: "Audio prompts and answer sheets exactly as they appeared in the test, including the accents and pacing students found hardest.",
    tint: "bg-sage-soft text-sage",
  },
  {
    letter: "R",
    name: "Reading",
    count: "3,120",
    desc: "Full passages with the actual question types attached — matching headings, True/False/Not Given, and sentence completion.",
    tint: "bg-gold-soft/40 text-gold",
  },
  {
    letter: "W",
    name: "Writing",
    count: "1,860",
    desc: "Task 1 charts and Task 2 prompts, paired with band-scored sample answers so you can see what a 7 actually looks like.",
    tint: "bg-sage-soft text-sage",
  },
  {
    letter: "S",
    name: "Speaking",
    count: "2,910",
    desc: "Part 1, 2, and 3 cue cards reported straight after the interview, organised by the month they were used.",
    tint: "bg-gold-soft/40 text-gold",
  },
];

const steps = [
  {
    n: "01",
    title: "A test taker sits the exam",
    desc: "Within a day or two of their test, they write down what they can remember — the passage topic, the cue card, the exact Task 2 question.",
  },
  {
    n: "02",
    title: "Our reviewers check it",
    desc: "Every submission is cross-referenced against other reports from the same test centre and date before it's marked verified.",
  },
  {
    n: "03",
    title: "It goes into the archive",
    desc: "Sorted by skill, date, and region, so you can search for what's been appearing at your test centre this month.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <Navbar />

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="paper-texture pointer-events-none absolute inset-0 opacity-70" />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-12 sm:gap-14 sm:px-6 sm:pb-20 sm:pt-16 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-28 lg:pt-24">
            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper-raised px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted sm:px-3.5 sm:text-xs">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                Reported by test takers, not guessed by us
              </div>

              <h1 className="mt-6 font-display text-4xl leading-[1.1] text-ink sm:text-5xl sm:leading-[1.08] lg:text-[3.4rem]">
                The IELTS questions
                <br className="hidden sm:block" />
                students <span className="italic text-indigo">
                  actually
                </span>{" "}
                saw.
              </h1>

              <p className="mt-6 max-w-lg font-sans text-base leading-relaxed text-muted sm:text-lg">
                Every passage, cue card, and Task 2 prompt on this site was sat
                by a real candidate within the last few weeks — then checked by
                our team before it&apos;s published. No predictions, no AI
                guesses.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#skills"
                  className="rounded-full bg-gold px-6 py-3.5 text-center font-sans text-[15px] font-semibold text-indigo-deep transition hover:bg-gold-soft">
                  Start with this week&apos;s set
                </a>
                <a
                  href="#process"
                  className="rounded-full border border-ink/20 px-6 py-3.5 text-center font-sans text-[15px] font-medium text-ink-soft transition hover:border-ink/40 hover:text-ink">
                  See how questions are verified
                </a>
              </div>

              <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-line pt-6 sm:gap-6 sm:max-w-md">
                <div>
                  <dt className="font-mono text-xl text-indigo-deep sm:text-2xl">
                    10.3k
                  </dt>
                  <dd className="mt-1 text-xs text-muted sm:text-sm">
                    verified questions
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xl text-indigo-deep sm:text-2xl">
                    54
                  </dt>
                  <dd className="mt-1 text-xs text-muted sm:text-sm">
                    countries reporting
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-xl text-indigo-deep sm:text-2xl">
                    weekly
                  </dt>
                  <dd className="mt-1 text-xs text-muted sm:text-sm">
                    new additions
                  </dd>
                </div>
              </dl>
            </div>

            {/* Right: signature stamped exam card */}
            <div className="relative mx-auto w-full max-w-[22rem] pt-4 sm:max-w-md lg:mx-0">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-indigo-deep/[0.04]" />

              <div className="-rotate-1 rounded-2xl border border-ink/10 bg-paper-raised p-5 shadow-[0_25px_60px_-25px_rgba(22,29,52,0.35)] sm:-rotate-2 sm:p-8">
                <div className="flex items-start justify-between gap-3 border-b border-line pb-4 sm:items-center">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted sm:text-[11px]">
                      IELTS Academic · Reading
                    </p>
                    <p className="mt-1 font-display text-base text-ink sm:text-lg">
                      Passage 2, Question 6
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-sage-soft px-2.5 py-1 font-mono text-[10px] text-sage sm:px-3 sm:text-[11px]">
                    Band 7 pass rate
                  </span>
                </div>

                <p className="mt-5 font-sans text-sm leading-relaxed text-ink-soft sm:text-[15px]">
                  &ldquo;According to the writer, the main reason coastal cities
                  adopted the drainage system was...&rdquo;
                </p>

                <div className="mt-5 space-y-2.5">
                  {[
                    "A. cost, not climate",
                    "B. an earlier flooding event",
                    "C. pressure from insurers",
                  ].map((opt) => (
                    <div
                      key={opt}
                      className="rounded-lg border border-line px-3.5 py-2.5 font-sans text-sm text-muted">
                      {opt}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 font-mono text-[11px] text-muted">
                  <span>Reported · Manila, Jul 2026</span>
                  <span>#RC-2291</span>
                </div>
              </div>

              {/* stamp */}
              <div className="absolute -right-2 -top-2 flex h-16 w-16 rotate-[14deg] items-center justify-center rounded-full border-[3px] border-clay/70 text-clay sm:-right-6 sm:-top-5 sm:h-28 sm:w-28">
                <span className="text-center font-mono text-[7px] font-medium uppercase leading-tight tracking-wider sm:text-[10px]">
                  Verified
                  <br />
                  real exam
                  <br />· 2026 ·
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Skills grid */}
        <section id="skills" className="border-t border-line bg-paper-raised">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:px-8">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-wider text-muted">
                All four skills
              </p>
              <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl sm:leading-tight lg:text-4xl">
                Sorted the way you&apos;ll actually revise.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2">
              {skills.map((s) => (
                <a
                  key={s.name}
                  href="#"
                  className="group rounded-2xl border border-line p-6 transition hover:border-ink/25 hover:shadow-[0_20px_40px_-30px_rgba(22,29,52,0.4)] sm:p-7">
                  <div className="flex items-start justify-between">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full font-display text-lg ${s.tint}`}>
                      {s.letter}
                    </span>
                    <span className="font-mono text-sm text-muted">
                      {s.count}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl text-ink">
                    {s.name}
                  </h3>
                  <p className="mt-2 font-sans text-[15px] leading-relaxed text-muted">
                    {s.desc}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-indigo-deep transition group-hover:gap-2.5">
                    Browse {s.name.toLowerCase()}
                    <span aria-hidden>→</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="process" className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:px-8">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-wider text-muted">
                How a question gets here
              </p>
              <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl lg:text-4xl">
                Three steps, always in this order.
              </h2>
            </div>

            <div className="mt-10 grid gap-8 sm:mt-12 sm:grid-cols-3 sm:gap-8">
              {steps.map((step, i) => (
                <div key={step.n} className="relative pl-0">
                  <span className="font-mono text-sm text-gold">{step.n}</span>
                  <h3 className="mt-3 font-display text-xl text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-sans text-[15px] leading-relaxed text-muted">
                    {step.desc}
                  </p>
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute -right-5 top-2 hidden font-display text-xl text-line sm:block">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial band */}
        <section id="stories" className="bg-indigo-deep">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 md:px-8">
            <p className="font-mono text-xs uppercase tracking-wider text-gold-soft">
              From the archive&apos;s readers
            </p>
            <blockquote className="mt-6 max-w-2xl font-display text-xl leading-snug text-paper sm:text-2xl sm:leading-snug lg:text-3xl">
              &ldquo;The cue card in my Speaking test was word-for-word the one
              I&apos;d read three days earlier. I already had a structure for it
              before I sat down.&rdquo;
            </blockquote>
            <p className="mt-5 font-sans text-sm text-paper/60">
              Nadia R. — took the test in Jakarta, scored Band 7.5
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-paper-raised">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-20 md:px-8">
            <div>
              <h2 className="font-display text-2xl text-ink sm:text-3xl lg:text-4xl">
                This week&apos;s set is already up.
              </h2>
              <p className="mt-3 max-w-md font-sans text-[15px] text-muted">
                Free to browse. New reports come in every day from test centres
                around the world.
              </p>
            </div>
            <a
              href="#skills"
              className="w-full shrink-0 rounded-full bg-gold px-7 py-3.5 text-center font-sans text-[15px] font-semibold text-indigo-deep transition hover:bg-gold-soft sm:w-auto">
              Browse this week&apos;s questions
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
