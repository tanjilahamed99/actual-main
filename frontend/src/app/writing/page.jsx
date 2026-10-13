"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  PenLine,
  ArrowRight,
  CheckCircle2,
  Clock,
  Trophy,
  RotateCcw,
  Eye,
} from "lucide-react";
import {
  listPublicWritingTests,
  getMyWritingAttempts,
} from "@/actions/writing";

export default function WritingListPage() {
  const [tests, setTests] = useState([]);
  const [attemptsByTest, setAttemptsByTest] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [testsRes, attemptsRes] = await Promise.all([
          listPublicWritingTests(),
          getMyWritingAttempts().catch(() => ({ data: { attempts: [] } })),
        ]);

        if (cancelled) return;

        setTests(testsRes.data?.test ?? []);

        // Build a lookup: testNumber → latest attempt
        const list = attemptsRes.data?.attempts ?? [];
        const map = {};
        for (const a of list) {
          const key = String(a.testNumber);
          if (!map[key]) map[key] = a; // already sorted desc by submittedAt
        }
        setAttemptsByTest(map);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load writing tests.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <p className="font-sans text-sm text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:px-8">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">
          Writing Tests
        </h1>
        <p className="mt-2 font-sans text-sm text-muted">
          Task 1 and Task 2 with real IELTS prompts. Submit for teacher marking.
        </p>

        {tests.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-line bg-paper-raised p-10 text-center font-sans text-sm text-muted">
            No writing tests available yet.
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tests.map((t) => (
              <WritingTestCard
                key={t._id}
                test={t}
                attempt={attemptsByTest[String(t.testNumber)] ?? null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────

function WritingTestCard({ test, attempt }) {
  const status = attempt?.status; // undefined | "submitted" | "marked"
  const isMarked = status === "marked";
  const isPending = status === "submitted";

  return (
    <div className="group relative flex flex-col rounded-2xl border border-line bg-paper-raised p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-deep/30 hover:shadow-[0_20px_40px_-30px_rgba(22,29,52,0.4)]">
      {/* Top badges */}
      <div className="flex items-start justify-between">
        <span className="rounded-full bg-indigo-deep/10 px-3 py-1 font-mono text-xs font-medium text-indigo-deep">
          WT-{test.testNumber}
        </span>

        {/* Status badge */}
        {isMarked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-sage-soft px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-sage">
            <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
            Marked
          </span>
        )}
        {isPending && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft/40 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-gold">
            <Clock className="h-3 w-3" strokeWidth={2.5} />
            Pending
          </span>
        )}
        {!status && (
          <span className="rounded-full bg-gold-soft/40 px-3 py-1 font-mono text-xs font-medium text-gold">
            {test.priority}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-4 font-display text-lg text-ink transition-colors group-hover:text-indigo-deep">
        {test.title}
      </h3>

      {/* Meta */}
      <p className="mt-1 font-sans text-xs text-muted">
        {test.parts?.length ?? 0} task
        {test.parts?.length === 1 ? "" : "s"}
      </p>

      {/* Band score chip — only if marked */}
      {isMarked && attempt.overallBand != null && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-sage-soft bg-sage-soft/40 px-3.5 py-2.5">
          <Trophy className="h-5 w-5 shrink-0 text-sage" strokeWidth={1.8} />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-wider text-sage/80">
              Overall band
            </p>
            <p className="font-display text-xl font-bold text-sage">
              {attempt.overallBand}
            </p>
          </div>
        </div>
      )}

      {/* Submitted-at line */}
      {attempt && (
        <p className="mt-3 font-mono text-[11px] text-muted">
          {isMarked ? "Marked" : "Submitted"}{" "}
          {new Date(
            isMarked ? attempt.markedAt : attempt.submittedAt,
          ).toLocaleDateString()}
        </p>
      )}

      {/* Actions */}
      <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
        {!attempt ? (
          <Link
            href={`/writing/${test.testNumber}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-deep transition-all group-hover:gap-2.5"
          >
            <PenLine className="h-3.5 w-3.5" strokeWidth={2} />
            Start test
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <div className="flex w-full items-center gap-2">
            <Link
              href={`/writing/${test.testNumber}`}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs font-medium text-ink transition hover:border-indigo-deep/40 hover:text-indigo-deep"
            >
              <Eye className="h-3.5 w-3.5" strokeWidth={2} />
              View
            </Link>
            <Link
              href={`/writing/${test.testNumber}?retake=1`}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-indigo-deep px-3 py-2 text-xs font-medium text-paper transition hover:bg-ink"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
              Retake
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}