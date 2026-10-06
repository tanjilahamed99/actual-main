// app/dashboard/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/features/Useauthstore";
import { useModuleTestStore } from "@/features/Useteststore";
import { getAllReadingTest } from "@/actions/test";
import {
  BookOpen,
  Flame,
  Clock,
  Target,
  Lock,
  ArrowRight,
  CheckCircle2,
  Circle,
  TrendingUp,
  Loader2,
} from "lucide-react";

const STATUS_COPY = {
  pending: {
    title: "Your account is pending approval",
    body: "An admin needs to approve your account before you can start reading tests. This usually doesn't take long.",
  },
  rejected: {
    title: "Your account request was rejected",
    body: "If you think this is a mistake, please reach out to support.",
  },
  suspended: {
    title: "Your account has been suspended",
    body: "Contact support for details on restoring access.",
  },
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { getSession } = useModuleTestStore();

  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);

  // ---- Fetch published tests (lightweight list) ----
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await getAllReadingTest();
        if (!cancelled && data?.success) setTests(data.test ?? []);
      } catch (err) {
        // 403 is fine — a pending user just sees the locked banner
        console.error("dashboard: failed to load tests", err);
      } finally {
        if (!cancelled) setLoadingTests(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // ---- Derive stats from real sessions ----
  const stats = useMemo(() => {
    const completed = tests
      .map((t) => ({
        test: t,
        session: getSession("reading", t._id),
      }))
      .filter(({ session }) => session?.status === "completed");

    const scores = completed
      .map(({ session }) => session?.score ?? session?.band)
      .filter((n) => typeof n === "number");

    const avg = scores.length
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : "—";

    const totalMinutes = completed.reduce(
      (sum, { session }) => sum + (session?.timeSpentMinutes ?? 0),
      0,
    );
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const timeStudied =
      totalMinutes > 0 ? `${hours}h ${String(mins).padStart(2, "0")}m` : "—";

    const streak = computeStreak(completed.map((c) => c.session));

    return [
      {
        label: "Tests completed",
        value: String(completed.length),
        icon: CheckCircle2,
      },
      { label: "Average band score", value: avg, icon: Target },
      { label: "Day streak", value: String(streak), icon: Flame },
      { label: "Time studied", value: timeStudied, icon: Clock },
    ];
  }, [tests, getSession]);

  // ---- Recent activity (last 4 completed attempts) ----
  const recent = useMemo(() => {
    return tests
      .map((t) => ({ test: t, session: getSession("reading", t._id) }))
      .filter(
        ({ session }) =>
          session?.status === "completed" && (session?.completedAt || session?.updatedAt),
      )
      .sort(
        (a, b) =>
          new Date(b.session.completedAt ?? b.session.updatedAt) -
          new Date(a.session.completedAt ?? a.session.updatedAt),
      )
      .slice(0, 4)
      .map(({ test, session }) => ({
        title: test.title ?? `Reading Test-${test.testNumber}`,
        type: "Reading",
        score: session?.score ?? session?.band ?? null,
        date: new Date(
          session.completedAt ?? session.updatedAt,
        ).toISOString().slice(0, 10),
        testNumber: test.testNumber,
      }));
  }, [tests, getSession]);

  // ---- Next steps: unfinished tests + a completion goal ----
  const nextSteps = useMemo(() => {
    const notStarted = tests
      .filter((t) => {
        const s = getSession("reading", t._id);
        return !s || s.status !== "completed";
      })
      .slice(0, 3)
      .map((t) => ({
        label: `Start ${t.title ?? `Reading Test-${t.testNumber}`}`,
        href: `/reading/${t.testNumber}`,
        done: false,
      }));

    const hasCompletedAny = tests.some(
      (t) => getSession("reading", t._id)?.status === "completed",
    );

    return [
      ...notStarted,
      {
        label: "Complete at least 3 reading tests",
        done: tests.filter(
          (t) => getSession("reading", t._id)?.status === "completed",
        ).length >= 3,
      },
      {
        label: hasCompletedAny ? "Attempt a full mock test" : "Finish your first test",
        done: false,
      },
    ].slice(0, 4);
  }, [tests, getSession]);

  if (!user) return <LoadingShell />;

  const isLocked = user.status && user.status !== "approved";
  const initial = (user.name?.[0] ?? user.email?.[0] ?? "?").toUpperCase();

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-indigo-deep font-display text-xl text-paper">
              {initial}
            </span>
            <div>
              <h1 className="font-display text-2xl text-ink sm:text-3xl">
                Welcome back{user.name ? `, ${user.name}` : ""}
              </h1>
              <p className="mt-1 text-sm text-muted">{user.email}</p>
            </div>
          </div>

          {user.status && (
            <span
              className={`self-start rounded-full px-3 py-1.5 font-mono text-xs capitalize sm:self-auto ${
                user.status === "approved"
                  ? "bg-sage-soft text-sage"
                  : "bg-clay/10 text-clay"
              }`}
            >
              {user.status}
            </span>
          )}
        </div>

        {/* Status banner for non-approved accounts */}
        {isLocked && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-paper-raised p-5">
            <Lock className="mt-0.5 h-5 w-5 shrink-0 text-clay" strokeWidth={1.8} />
            <div>
              <p className="font-medium text-ink">
                {STATUS_COPY[user.status]?.title ?? "Your access is limited"}
              </p>
              <p className="mt-1 text-sm text-muted">
                {STATUS_COPY[user.status]?.body ??
                  "Contact support for more information."}
              </p>
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-line bg-paper-raised p-5"
            >
              <stat.icon className="h-5 w-5 text-indigo-deep" strokeWidth={1.8} />
              <p className="mt-3 font-display text-2xl text-ink">
                {loadingTests ? <Skeleton /> : stat.value}
              </p>
              <p className="mt-1 text-xs text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Recent activity */}
          <div className="rounded-2xl border border-line bg-paper-raised p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-ink">Recent activity</h2>
              <Link
                href="/reading"
                className="text-xs text-indigo-deep hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="mt-4 divide-y divide-line">
              {loadingTests ? (
                <EmptyRow text="Loading…" spinner />
              ) : recent.length === 0 ? (
                <EmptyRow text="No completed tests yet — take your first one to see it here." />
              ) : (
                recent.map((item) => (
                  <Link
                    key={item.title + item.date}
                    href={`/reading/${item.testNumber}`}
                    className="flex items-center justify-between py-3 transition-colors duration-200 hover:bg-paper/60 -mx-2 px-2 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-deep/10 text-indigo-deep">
                        <BookOpen className="h-4 w-4" strokeWidth={1.8} />
                      </span>
                      <div>
                        <p className="text-sm text-ink">{item.title}</p>
                        <p className="text-xs text-muted">
                          {item.type} · {item.date}
                        </p>
                      </div>
                    </div>
                    {item.score != null && (
                      <span className="rounded-full bg-gold-soft/40 px-2.5 py-1 font-mono text-xs text-gold">
                        Band {item.score}
                      </span>
                    )}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Next steps + quick action */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-line bg-paper-raised p-5">
              <h2 className="font-semibold text-ink">Next steps</h2>
              <div className="mt-4 space-y-3">
                {loadingTests ? (
                  <EmptyRow text="Loading…" spinner compact />
                ) : nextSteps.length === 0 ? (
                  <EmptyRow text="You're all caught up." compact />
                ) : (
                  nextSteps.map((step) => (
                    <Link
                      key={step.label}
                      href={step.href ?? "#"}
                      className={`flex items-center gap-2.5 text-sm ${
                        step.href ? "hover:text-indigo-deep" : ""
                      }`}
                    >
                      {step.done ? (
                        <CheckCircle2
                          className="h-4 w-4 shrink-0 text-sage"
                          strokeWidth={1.8}
                        />
                      ) : (
                        <Circle
                          className="h-4 w-4 shrink-0 text-muted"
                          strokeWidth={1.8}
                        />
                      )}
                      <span
                        className={
                          step.done ? "text-muted line-through" : "text-ink"
                        }
                      >
                        {step.label}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-paper-raised p-5">
              <h2 className="font-semibold text-ink">Continue practicing</h2>
              <p className="mt-1 text-sm text-muted">
                Jump back into a reading test.
              </p>

              {isLocked ? (
                <button
                  type="button"
                  disabled
                  className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-sm text-muted"
                >
                  <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                  Locked
                </button>
              ) : (
                <Link
                  href="/reading"
                  className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-indigo-deep px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-ink"
                >
                  Go to Reading
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function computeStreak(sessions) {
  const days = new Set(
    sessions
      .map((s) => s?.completedAt ?? s?.updatedAt)
      .filter(Boolean)
      .map((d) => new Date(d).toISOString().slice(0, 10)),
  );

  if (days.size === 0) return 0;

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) streak++;
    else if (i > 0) break; // first miss ends the streak
  }
  return streak;
}

function LoadingShell() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <Loader2 className="h-6 w-6 animate-spin text-muted" strokeWidth={2} />
    </div>
  );
}

function Skeleton() {
  return (
    <span className="inline-block h-7 w-16 animate-pulse rounded-md bg-line/40 align-middle" />
  );
}

function EmptyRow({ text, spinner = false, compact = false }) {
  return (
    <div
      className={`flex items-center gap-2 text-sm text-muted ${
        compact ? "" : "py-6"
      }`}
    >
      {spinner && (
        <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
      )}
      {text}
    </div>
  );
}