"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Trophy,
  FileText,
  ChevronDown,
} from "lucide-react";
import {
  getPublicWritingTest,
  getMyWritingAttempts,
} from "@/actions/writing";
import MainWritingPage from "@/components/Test/Writing/MainWritingPage";

function countWords(text) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export default function WritingTestPage() {
  const { id } = useParams();
  const router = useRouter();

  const [test, setTest] = useState(null);
  const [myAttempt, setMyAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  // ?retake=1 skips the review screen
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("retake") === "1") setShowPlayer(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!id) return;

      try {
        const testRes = await getPublicWritingTest(id);
        if (cancelled) return;
        if (!testRes?.data?.test) {
          setError("This writing test isn't available.");
          return;
        }
        setTest(testRes.data.test);

        try {
          const attRes = await getMyWritingAttempts();
          if (cancelled) return;
          const list = attRes?.data?.attempts ?? [];
          const mine = list.find(
            (a) => String(a.testNumber) === String(id),
          );
          setMyAttempt(mine ?? null);
        } catch {
          // no attempts yet — that's fine
        }
      } catch (err) {
        if (cancelled) return;
        const status = err?.response?.status;
        if (status === 403) {
          setError(
            "Your account is not approved yet. Please wait for admin approval.",
          );
          return;
        }
        if (status === 401) {
          setError("Please log in to continue.");
          return;
        }
        if (status === 404) {
          setError("This writing test isn't available.");
          return;
        }
        setError(err?.response?.data?.message ?? "Failed to load the test.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Loader2 className="h-6 w-6 animate-spin text-muted" strokeWidth={2} />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-4 text-center">
        <AlertCircle className="h-8 w-8 text-clay" strokeWidth={1.8} />
        <p className="max-w-md font-sans text-sm text-muted">
          {error ?? "Test not found."}
        </p>
        <Link
          href="/writing"
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-deep px-5 py-2.5 font-sans text-sm font-medium text-paper hover:bg-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to writing tests
        </Link>
      </div>
    );
  }

  const isMarked = myAttempt?.status === "marked";
  const isPending = myAttempt?.status === "submitted";

  // ────────────────────────────────────────────────────────────
  // Review screen
  // ────────────────────────────────────────────────────────────
  if (myAttempt && !showPlayer) {
    return (
      <div className="min-h-screen bg-paper">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:px-8">
          {/* Back */}
          <Link
            href="/writing"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to writing tests
          </Link>

          {/* Test header */}
          <h1 className="mt-6 font-display text-2xl text-ink sm:text-3xl">
            {test.title}
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted">
            WT-{test.testNumber} · {test.parts?.length ?? 0} parts
          </p>

          {/* ── Status card ── */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-paper-raised">
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              {isMarked ? (
                <CheckCircle2
                  className="h-5 w-5 shrink-0 text-sage"
                  strokeWidth={2}
                />
              ) : (
                <Clock className="h-5 w-5 shrink-0 text-gold" strokeWidth={2} />
              )}
              <div className="flex-1">
                <p className="font-display text-base text-ink">
                  {isMarked ? "Marked by teacher" : "Awaiting review"}
                </p>
                <p className="mt-0.5 font-sans text-xs text-muted">
                  Submitted {new Date(myAttempt.submittedAt).toLocaleString()}
                  {isMarked && myAttempt.markedAt && (
                    <>
                      {" "}
                      · Marked {new Date(myAttempt.markedAt).toLocaleString()}
                    </>
                  )}
                </p>
              </div>
              {isMarked && myAttempt.overallBand != null && (
                <div className="text-right">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                    Overall
                  </p>
                  <p className="font-display text-2xl font-bold text-indigo-deep">
                    {myAttempt.overallBand}
                  </p>
                </div>
              )}
            </div>

            {/* Overall band banner */}
            {isMarked && myAttempt.overallBand != null && (
              <div className="border-b border-line px-5 py-4">
                <div className="flex items-center gap-3 rounded-xl border border-sage-soft bg-sage-soft/40 p-4">
                  <Trophy
                    className="h-6 w-6 shrink-0 text-sage"
                    strokeWidth={1.8}
                  />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-sage/80">
                      Overall band score
                    </p>
                    <p className="font-display text-2xl font-bold text-sage">
                      {myAttempt.overallBand}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pending notice */}
            {isPending && (
              <div className="border-b border-line px-5 py-4">
                <p className="font-sans text-[13px] leading-relaxed text-muted">
                  Your answers are saved and waiting to be reviewed. You will
                  see your band score and feedback on this page once a teacher
                  marks them.
                </p>
              </div>
            )}

            {/* General feedback (if marked) */}
            {isMarked && myAttempt.generalFeedback && (
              <div className="border-b border-line bg-indigo-deep/5 px-5 py-4">
                <p className="font-sans text-xs font-semibold uppercase tracking-wider text-indigo-deep">
                  Teacher&apos;s overall feedback
                </p>
                <p className="mt-2 whitespace-pre-line font-sans text-[13.5px] leading-relaxed text-ink">
                  {myAttempt.generalFeedback}
                </p>
              </div>
            )}
          </div>

          {/* ── Answers + per-part marks ── */}
          <div className="mt-8 space-y-6">
            {test.parts?.map((part, i) => {
              // Prefer the attempt's stored answer; fall back to the test
              const stored = myAttempt.answers?.find(
                (a) => a.partIndex === i,
              );
              const answerText = stored?.answer ?? "";
              const wordCount = countWords(answerText);
              const minWords = part.minWords ?? 150;

              // Per-part mark
              const mark = myAttempt.marks?.find(
                (m) => m.partIndex === i,
              );

              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-line bg-paper-raised"
                >
                  {/* Part header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-deep/10 font-mono text-xs font-semibold text-indigo-deep">
                        {i + 1}
                      </span>
                      <span className="font-display text-base text-ink">
                        {part.label}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold ${
                          wordCount >= minWords
                            ? "bg-sage-soft text-sage"
                            : "bg-gold-soft/40 text-gold"
                        }`}
                      >
                        {wordCount} / {minWords} words
                      </span>
                    </div>

                    {mark?.overallBand != null && (
                      <span className="rounded-full bg-indigo-deep/10 px-2.5 py-1 font-mono text-xs font-semibold text-indigo-deep">
                        Band {mark.overallBand}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
                    {/* Left: prompt + answer */}
                    <div className="border-b border-line p-5 lg:border-b-0 lg:border-r">
                      {/* Prompt (collapsible) */}
                      <details className="group mb-3 rounded-lg border border-line bg-paper px-3 py-2">
                        <summary className="flex cursor-pointer items-center justify-between text-xs font-semibold text-muted">
                          <span className="inline-flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            Show prompt
                          </span>
                          <ChevronDown
                            className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
                            strokeWidth={2}
                          />
                        </summary>
                        <p className="mt-2 whitespace-pre-line font-sans text-[12.5px] leading-relaxed text-ink-soft">
                          {part.prompt}
                        </p>
                      </details>

                      {/* Student's answer */}
                      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
                        Your answer
                      </p>
                      <div className="rounded-lg border border-line bg-paper p-4">
                        {answerText.trim() ? (
                          <p className="whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed text-ink">
                            {answerText}
                          </p>
                        ) : (
                          <p className="italic font-sans text-[13px] text-muted">
                            No answer submitted for this part.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: criteria + feedback */}
                    <div className="bg-paper p-5">
                      {mark ? (
                        <>
                          <p className="mb-3 font-mono text-[10px] uppercase tracking-wider text-muted">
                            Criteria
                          </p>

                          <div className="grid grid-cols-2 gap-2">
                            {["TA", "CC", "LR", "GRA"].map((c) => (
                              <div
                                key={c}
                                className="rounded border border-line bg-paper-raised p-2 text-center"
                              >
                                <p className="font-mono text-[10px] uppercase text-muted">
                                  {c}
                                </p>
                                <p className="mt-0.5 font-display text-lg text-ink">
                                  {mark[c]?.band ?? "—"}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Criterion comments */}
                          {["TA", "CC", "LR", "GRA"].some(
                            (c) => mark[c]?.comment,
                          ) && (
                            <div className="mt-4 space-y-2">
                              {["TA", "CC", "LR", "GRA"].map((c) =>
                                mark[c]?.comment ? (
                                  <p
                                    key={c}
                                    className="font-sans text-[12px] leading-relaxed text-ink-soft"
                                  >
                                    <span className="font-mono text-[10px] uppercase text-muted">
                                      {c}:
                                    </span>{" "}
                                    {mark[c].comment}
                                  </p>
                                ) : null,
                              )}
                            </div>
                          )}

                          {/* Per-part feedback */}
                          {mark.feedback && (
                            <div className="mt-4 rounded-lg border border-line bg-paper-raised p-3">
                              <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                                Feedback
                              </p>
                              <p className="whitespace-pre-line font-sans text-[12.5px] leading-relaxed text-ink">
                                {mark.feedback}
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <Clock
                            className="h-6 w-6 text-muted/60"
                            strokeWidth={1.8}
                          />
                          <p className="mt-2 font-sans text-[12px] text-muted">
                            Not marked yet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Actions ── */}
          <div className="mt-8 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => setShowPlayer(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-paper-raised px-5 py-2.5 font-sans text-sm font-medium text-ink transition hover:border-indigo-deep/40 hover:text-indigo-deep"
            >
              <Sparkles className="h-4 w-4" strokeWidth={2} />
              Take this test again
            </button>
            <Link
              href="/writing"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-indigo-deep px-5 py-2.5 font-sans text-sm font-medium text-paper transition hover:bg-ink"
            >
              Back to writing tests
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────
  // Player
  // ────────────────────────────────────────────────────────────
  return <MainWritingPage testId={test.testNumber} test={test} />;
}