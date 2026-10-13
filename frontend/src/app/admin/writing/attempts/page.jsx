"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  Eye,
  CheckCircle2,
  Clock,
  User as UserIcon,
  BookOpen,
} from "lucide-react";
import { getAllWritingAttempts } from "@/actions/writing";
import SearchBar from "../../_components/SearchBar";
import Pagination from "../../_components/Pagination";

const PAGE_SIZE = 20;

export default function AdminWritingAttempts() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [search, status]);

  const fetchAttempts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllWritingAttempts({
        q: search || undefined,
        status: status || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setRows(data.attempts ?? []);
      setMeta(data.pagination ?? { total: 0, totalPages: 1 });
    } catch {
      setError("Could not load attempts.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl text-ink sm:text-2xl">
          Writing Submissions
        </h1>
        <p className="mt-1 font-sans text-sm text-muted">
          {loading
            ? "Loading…"
            : `${meta.total} submission${meta.total === 1 ? "" : "s"} — mark the ones pending review.`}
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-raised p-4 sm:flex-row sm:items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by student email, name, or test…"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-full border border-line bg-paper-raised px-4 py-2.5 font-sans text-sm text-ink outline-none transition focus:border-gold sm:ml-auto"
        >
          <option value="">All statuses</option>
          <option value="submitted">Pending review</option>
          <option value="marked">Marked</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-2 rounded-2xl border border-line bg-paper-raised p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-line/40" />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-line bg-paper-raised p-10 text-center text-sm text-muted">
          No submissions yet.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-line bg-paper-raised">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] font-sans text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper text-left text-xs uppercase tracking-wider text-muted">
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Test</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((a) => (
                    <tr key={a._id} className="hover:bg-paper/60">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">
                          {a.userName ?? "—"}
                        </p>
                        <p className="text-xs text-muted">{a.userEmail}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-ink">{a.testTitle}</p>
                        <p className="text-xs text-muted">
                          WT-{a.testNumber}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-muted">
                          {new Date(a.submittedAt).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {a.status === "marked" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sage-soft px-2.5 py-1 text-[10px] font-semibold uppercase text-sage">
                            <CheckCircle2 className="h-3 w-3" />
                            Marked
                            {a.overallBand != null && ` · ${a.overallBand}`}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft/40 px-2.5 py-1 text-[10px] font-semibold uppercase text-gold">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/writing/attempts/${a._id}`}
                          className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-ink transition hover:border-indigo-deep/40 hover:text-indigo-deep"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {a.status === "marked" ? "View" : "Review"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            page={page}
            totalPages={meta.totalPages}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}