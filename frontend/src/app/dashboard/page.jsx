"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/Useauthstore";
import {
  BookOpen,
  Flame,
  Clock,
  Target,
  Lock,
  ArrowRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { UserRoute } from "@/pages/PrivateRoutes";

// ── Static placeholder data — swap for real endpoints once you have them ──
const STATS = [
  { label: "Tests completed", value: "12", icon: CheckCircle2 },
  { label: "Average band score", value: "6.5", icon: Target },
  { label: "Day streak", value: "4", icon: Flame },
  { label: "Time studied", value: "8h 40m", icon: Clock },
];

const RECENT_ACTIVITY = [
  {
    title: "Reading Test-3",
    type: "Reading",
    score: "7.0",
    date: "2026-08-07",
  },
  {
    title: "Reading Test-1",
    type: "Reading",
    score: "6.5",
    date: "2026-08-04",
  },
  {
    title: "Grammar — Conditionals",
    type: "Grammar",
    score: null,
    date: "2026-08-02",
  },
  {
    title: "Reading Test-2",
    type: "Reading",
    score: "6.0",
    date: "2026-07-30",
  },
];

const NEXT_STEPS = [
  { label: "Finish Reading Test-4", done: false },
  { label: "Review conditionals grammar module", done: true },
  { label: "Take a full mock test", done: false },
];

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
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 md:px-8">
        <p className="text-muted">
          You need to be logged in to view your dashboard.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-flex rounded-full bg-indigo-deep px-5 py-2.5 text-sm font-medium text-paper hover:bg-ink">
          Log in
        </Link>
      </div>
    );
  }

  const isLocked = user.status && user.status !== "approved";
  const initial = (user.name?.[0] ?? user.email?.[0] ?? "?").toUpperCase();

  return (
    <UserRoute>
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
                }`}>
                {user.status}
              </span>
            )}
          </div>

          {/* Status banner for non-approved accounts */}
          {isLocked && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-paper-raised p-5">
              <Lock
                className="mt-0.5 h-5 w-5 shrink-0 text-clay"
                strokeWidth={1.8}
              />
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

          {/* Stats grid — static for now */}
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-line bg-paper-raised p-5">
                <stat.icon
                  className="h-5 w-5 text-indigo-deep"
                  strokeWidth={1.8}
                />
                <p className="mt-3 font-display text-2xl text-ink">
                  {stat.value}
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
                  href="/demo"
                  className="text-xs text-indigo-deep hover:underline">
                  View all
                </Link>
              </div>

              <div className="mt-4 divide-y divide-line">
                {RECENT_ACTIVITY.map((item) => (
                  <div
                    key={item.title + item.date}
                    className="flex items-center justify-between py-3">
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
                    {item.score && (
                      <span className="rounded-full bg-gold-soft/40 px-2.5 py-1 font-mono text-xs text-gold">
                        Band {item.score}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Next steps + quick action */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-line bg-paper-raised p-5">
                <h2 className="font-semibold text-ink">Next steps</h2>
                <div className="mt-4 space-y-3">
                  {NEXT_STEPS.map((step) => (
                    <div
                      key={step.label}
                      className="flex items-center gap-2.5 text-sm">
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
                        }>
                        {step.label}
                      </span>
                    </div>
                  ))}
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
                    className="mt-4 inline-flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-full border border-line px-4 py-2.5 text-sm text-muted">
                    <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                    Locked
                  </button>
                ) : (
                  <Link
                    href="/reading"
                    className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-indigo-deep px-4 py-2.5 text-sm font-medium text-paper transition hover:bg-ink">
                    Go to Reading
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserRoute>
  );
}
