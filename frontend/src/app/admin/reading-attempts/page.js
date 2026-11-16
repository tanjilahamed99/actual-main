"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Search, History, Trash2 } from "lucide-react";
import {
  adminGetAllReadingAttempts,
  adminDeleteReadingAttempt,
} from "@/actions/admin";

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function AdminReadingAttemptsPage() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const { data } = await adminGetAllReadingAttempts();
      if (data.success) setAttempts(data.attempts || []);
    } catch (err) {
      toast.error("Failed to load attempts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminDeleteReadingAttempt(deleteId);
      setAttempts((prev) => prev.filter((a) => a._id !== deleteId));
      toast.success("Attempt deleted");
    } catch (err) {
      toast.error("Failed to delete attempt");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredAttempts = attempts.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.userName?.toLowerCase().includes(q) ||
      a.userEmail?.toLowerCase().includes(q) ||
      a.testTitle?.toLowerCase().includes(q) ||
      String(a.testNumber).includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Reading Attempts</h1>
          <p className="mt-1 font-sans text-sm text-muted">
            Track all student scores and previous attempts.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2 sm:max-w-xs">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search name, email, or test…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent font-sans text-sm text-ink placeholder:text-muted focus:outline-none"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl border border-line bg-paper-raised">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted" />
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-display text-2xl text-ink/20">No attempts yet</p>
            <p className="mt-2 font-sans text-sm text-muted">
              When students take tests, their scores will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line font-mono text-[11px] uppercase tracking-wider text-muted">
                  <th className="px-5 py-3 font-medium">Student</th>
                  <th className="px-5 py-3 font-medium">Test</th>
                  <th className="px-5 py-3 font-medium">Current Score</th>
                  <th className="px-5 py-3 font-medium">Previous Attempts</th>
                  <th className="px-5 py-3 font-medium">Time Taken</th>
                  <th className="px-5 py-3 font-medium">Submitted</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {filteredAttempts.map((attempt) => (
                  <tr key={attempt._id} className="text-sm hover:bg-paper">
                    {/* Student */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{attempt.userName}</p>
                      <p className="font-mono text-[11px] text-muted">
                        {attempt.userEmail}
                      </p>
                    </td>

                    {/* Test */}
                    <td className="px-5 py-4">
                      <p className="text-ink">{attempt.testTitle}</p>
                      <p className="font-mono text-[11px] text-muted">
                        Test #{attempt.testNumber}
                      </p>
                    </td>

                    {/* Current Score */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                          Band {attempt.band}
                        </span>
                        <span className="text-xs text-muted">
                          {attempt.score} / {attempt.totalQuestions}
                        </span>
                      </div>
                    </td>

                    {/* Previous Attempts */}
                    <td className="px-5 py-4">
                      {attempt.previousScores &&
                      attempt.previousScores.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {attempt.previousScores.map((prev, i) => (
                            <span
                              key={i}
                              title={`Scored ${prev.score}/${attempt.totalQuestions} on ${formatDate(prev.date)}`}
                              className="inline-flex items-center gap-1 rounded bg-paper border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">
                              <History className="h-3 w-3" />
                              {prev.band}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs italic text-muted">
                          First attempt
                        </span>
                      )}
                    </td>

                    {/* Time */}
                    <td className="px-5 py-4 font-mono text-xs text-muted">
                      {formatTime(attempt.timeSpentSeconds || 0)}
                    </td>

                    {/* Submitted */}
                    <td className="px-5 py-4 font-mono text-xs text-muted">
                      {formatDate(attempt.submittedAt)}
                    </td>

                    {/* Delete */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setDeleteId(attempt._id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-clay/10 hover:text-clay"
                        title="Delete attempt">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && filteredAttempts.length > 0 && (
          <div className="border-t border-line p-4 font-sans text-sm text-muted">
            Showing {filteredAttempts.length} of {attempts.length} attempts
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-paper-raised p-6 shadow-2xl">
            <h3 className="text-center font-display text-lg text-ink">
              Delete Attempt?
            </h3>
            <p className="mt-2 text-center font-sans text-sm text-muted">
              This will permanently remove the student&apos;s score and history
              for this test.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-full border border-line py-2.5 font-sans text-sm font-medium text-ink-soft hover:bg-paper">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-full bg-clay py-2.5 font-sans text-sm font-semibold text-white hover:bg-clay/90">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
