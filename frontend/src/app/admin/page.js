// app/admin/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileEdit,
  ArrowRight,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { adminGetStats, adminGetReadingTests, adminGetUsers } from "@/actions/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [statsRes, testsRes, usersRes] = await Promise.all([
          adminGetStats(),
          adminGetReadingTests({ limit: 5, sort: "updatedAt", order: "desc" }),
          adminGetUsers(),
        ]);

        if (cancelled) return;

        setStats(statsRes.data?.stats ?? null);
        setRecentTests(testsRes.data?.test ?? []);

        // Only surface users awaiting approval
        const pending = (usersRes.data?.users ?? []).filter(
          (u) => u.status === "pending",
        );
        setPendingUsers(pending.slice(0, 5));
      } catch (err) {
        console.error("admin dashboard load failed", err);
        if (!cancelled) setError("Failed to load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <LoadingShell />;
  if (error) return <ErrorShell message={error} />;
  if (!stats) return <ErrorShell message="No data available." />;

  const { reading, users } = stats;

  // ---- Stat cards from real counts ----
  const cards = [
    {
      label: "Reading tests",
      value: reading.total,
      delta: `${reading.published} published`,
      tint: "indigo",
      icon: BookOpen,
    },
    {
      label: "Drafts in progress",
      value: reading.draft,
      delta: `${reading.main} main · ${reading.extra} extra`,
      tint: "gold",
      icon: FileEdit,
    },
    {
      label: "Total users",
      value: users.total,
      delta: `${users.approved} approved`,
      tint: "sage",
      icon: Users,
    },
    {
      label: "Awaiting approval",
      value: users.pending,
      delta: users.pending > 0 ? "Needs review" : "All caught up",
      tint: users.pending > 0 ? "clay" : "sage",
      icon: Clock,
      href: "/admin/users",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {cards.map((c, i) => (
          <DashboardStatCard key={c.label} {...c} delay={i * 60} />
        ))}
      </div>

      {/* ── Reading tests by status ── */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-ink sm:text-xl">
            Reading content
          </h2>
          <Link
            href="/admin/reading"
            className="text-sm font-medium text-indigo-deep hover:underline"
          >
            Manage
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BreakdownCard
            label="Total"
            value={reading.total}
            href="/admin/reading"
            accent="indigo"
          />
          <BreakdownCard
            label="Published"
            value={reading.published}
            href="/admin/reading?status=published"
            accent="sage"
          />
          <BreakdownCard
            label="Drafts"
            value={reading.draft}
            href="/admin/reading?status=draft"
            accent="gold"
          />
          <BreakdownCard
            label="Main tests"
            value={reading.main}
            href="/admin/reading?priority=main"
            accent="indigo"
          />
        </div>
      </section>

      {/* ── Two-column: recent tests + pending users ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent reading tests */}
        <section className="rounded-2xl border border-line bg-paper-raised p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">Recently edited</h2>
            <Link
              href="/admin/reading"
              className="inline-flex items-center gap-1 text-xs text-indigo-deep hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-line">
            {recentTests.length === 0 ? (
              <EmptyRow text="No reading tests yet." />
            ) : (
              recentTests.map((t) => (
                <Link
                  key={t._id}
                  href={`/admin/reading/${t._id}`}
                  className="-mx-2 flex items-center justify-between rounded-lg px-2 py-3 transition-colors duration-200 hover:bg-paper/60"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-deep/10 font-mono text-xs text-indigo-deep">
                      {t.testNumber}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">{t.title}</p>
                      <p className="text-xs text-muted">
                        {t.priority === "main" ? "Main" : "Extra"} ·{" "}
                        {t.status === "published" ? "Published" : "Draft"}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted">
                    {new Date(t.updatedAt).toISOString().slice(0, 10)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Pending user approvals */}
        <section className="rounded-2xl border border-line bg-paper-raised p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">
              Pending approvals
            </h2>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1 text-xs text-indigo-deep hover:underline"
            >
              Manage users <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-line">
            {pendingUsers.length === 0 ? (
              <EmptyRow text="No pending users — you're all caught up." />
            ) : (
              pendingUsers.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-soft/40 font-display text-sm text-gold">
                      {(u.name?.[0] ?? u.email?.[0] ?? "?").toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">
                        {u.name ?? "Unnamed"}
                      </p>
                      <p className="truncate text-xs text-muted">{u.email}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-clay/10 px-2.5 py-1 font-mono text-[11px] text-clay">
                    Pending
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─────────────────── components ─────────────────── */

function DashboardStatCard({
  label,
  value,
  delta,
  tint,
  icon: Icon,
  href,
  delay = 0,
}) {
  const tintMap = {
    indigo: "bg-indigo-deep/10 text-indigo-deep",
    gold: "bg-gold-soft/40 text-gold",
    sage: "bg-sage-soft text-sage",
    clay: "bg-clay/10 text-clay",
  };

  const Wrapper = href ? Link : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="animate-fade-in-up block rounded-2xl border border-line bg-paper-raised p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_20px_40px_-30px_rgba(22,29,52,0.4)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
          tintMap[tint] ?? tintMap.indigo
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <p className="mt-4 font-display text-2xl text-ink">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 font-sans text-xs text-muted">{label}</p>
      <p className="mt-2 font-sans text-[11px] text-muted/80">{delta}</p>
    </Wrapper>
  );
}

function BreakdownCard({ label, value, href, accent = "indigo" }) {
  const accentMap = {
    indigo: "text-indigo-deep",
    sage: "text-sage",
    gold: "text-gold",
    clay: "text-clay",
  };

  return (
    <Link
      href={href}
      className="group rounded-2xl border border-line bg-paper-raised p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-[0_20px_40px_-30px_rgba(22,29,52,0.4)]"
    >
      <p className="font-mono text-[11px] uppercase tracking-wider text-muted">
        {label}
      </p>
      <p
        className={`mt-2 font-display text-2xl ${
          accentMap[accent] ?? accentMap.indigo
        }`}
      >
        {value.toLocaleString()}
      </p>
      <p className="mt-2 inline-flex items-center gap-1 font-sans text-xs text-muted transition-colors duration-200 group-hover:text-indigo-deep">
        View
        <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
      </p>
    </Link>
  );
}

function EmptyRow({ text }) {
  return (
    <div className="flex items-center justify-center py-8 text-sm text-muted">
      {text}
    </div>
  );
}

function LoadingShell() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted" strokeWidth={2} />
    </div>
  );
}

function ErrorShell({ message }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
      <AlertCircle className="h-8 w-8 text-clay" strokeWidth={1.8} />
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}