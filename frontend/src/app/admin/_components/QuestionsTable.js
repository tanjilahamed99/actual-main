"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { deleteReadingTest } from "@/actions/admin";

const statusStyles = {
  Published: "bg-sage-soft text-sage",
  Draft: "bg-gold-soft/50 text-gold",
};

export default function QuestionsTable({ rows, typeLabel = "Type" }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [deletingId, setDeletingId] = useState(null);
  const [localRows, setLocalRows] = useState(rows);

  // Keep localRows in sync whenever the parent hands us a fresh list
  // (e.g. after it refetches), without losing an in-flight optimistic delete.
  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  const filtered = useMemo(() => {
    return localRows.filter((r) => {
      const matchesQuery =
        query.trim() === "" ||
        r.title.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "All" || r.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [localRows, query, status]);

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;

    setDeletingId(id);
    try {
      const { data } = await deleteReadingTest(id);
      if (!data?.success) throw new Error(data?.message || "Delete failed");

      setLocalRows((prev) => prev.filter((r) => r.id !== id));
      toast.success("Reading test deleted.");
    } catch (err) {
      toast.error(err.message || "Could not delete this test — try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-paper-raised">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2 sm:max-w-xs sm:flex-1">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4 shrink-0 text-muted">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
            />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search by test title…"
            className="w-full bg-transparent font-sans text-sm text-ink placeholder:text-muted focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["All", "Published", "Draft"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 font-sans text-xs font-medium transition-colors duration-200 ${
                status === s
                  ? "bg-indigo-deep text-paper"
                  : "bg-paper text-muted hover:text-ink"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line font-mono text-[11px] uppercase tracking-wider text-muted">
              <th className="px-5 py-3 font-medium">Test</th>
              <th className="px-5 py-3 font-medium">{typeLabel}</th>
              <th className="px-5 py-3 font-medium">Passages</th>
              <th className="px-5 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr
                key={r.id}
                className="animate-fade-in-up border-b border-line/70 text-sm transition-colors duration-150 last:border-0 hover:bg-paper"
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                <td className="max-w-70 px-5 py-4">
                  <p className="truncate font-sans text-ink">{r.title}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted">
                    #{r.displayId}
                  </p>
                </td>
                <td className="px-5 py-4 font-sans text-muted">{r.type}</td>
                <td className="px-5 py-4 font-sans text-muted">{r.passages}</td>
                <td className="px-5 py-4 font-mono text-xs text-muted">
                  {r.date}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${statusStyles[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/admin/reading/edit/${r.testNumber}`}
                      aria-label="Edit"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-paper-raised hover:text-indigo-deep">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-4 w-4">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.5 3.5 4 4L8 20H4v-4L16.5 3.5Z"
                        />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      aria-label="Delete"
                      disabled={deletingId === r.id}
                      onClick={() => handleDelete(r.id, r.title)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-clay/10 hover:text-clay disabled:opacity-40">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        className="h-4 w-4">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7H7Z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center font-sans text-sm text-muted">
                  No tests match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-line p-4 font-sans text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p>
          Showing <span className="text-ink">{filtered.length}</span> of{" "}
          <span className="text-ink">{localRows.length}</span> tests
        </p>
      </div>
    </div>
  );
}
