"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Eye, ExternalLink, Pencil, AlertCircle } from "lucide-react";
import { getAllWritingTest } from "@/actions/writing";
import SearchBar from "../_components/SearchBar";
import Pagination from "../_components/Pagination";

const PAGE_SIZE = 10;

export default function AdminWritingList() {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [search, status]);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllWritingTest({
        q: search || undefined,
        status: status || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setRows(data.test ?? []);
      setMeta(data.pagination ?? { total: 0, totalPages: 1 });
    } catch {
      setError("Could not load writing tests.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-sm text-muted">
          {loading
            ? "Loading…"
            : `${meta.total} writing test${meta.total === 1 ? "" : "s"} in the archive.`}
        </p>
        <Link
          href="/admin/writing/new"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 font-sans text-sm font-semibold text-indigo-deep transition hover:bg-gold-soft"
        >
          <Plus className="h-4 w-4" />
          Add test
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-raised p-4 sm:flex-row sm:items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search writing tests…"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-full border border-line bg-paper-raised px-4 py-2.5 font-sans text-sm text-ink outline-none transition focus:border-gold sm:ml-auto"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-2 rounded-2xl border border-line bg-paper-raised p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-line/40" />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-10 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-line bg-paper-raised p-10 text-center text-sm text-muted">
          No writing tests yet.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-line bg-paper-raised">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="border-b border-line bg-paper text-left text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 font-medium">Test</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">
                    Parts
                  </th>
                  <th className="hidden px-4 py-3 font-medium lg:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((t) => (
                  <tr key={t._id} className="transition-colors hover:bg-paper/60">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{t.title}</p>
                      <p className="text-xs text-muted">
                        WT-{t.testNumber} · {t.priority}
                      </p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="font-mono text-xs text-muted">
                        {t.parts?.length ?? 0} part
                        {t.parts?.length === 1 ? "" : "s"}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <span
                        className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase ${
                          t.status === "published"
                            ? "bg-sage-soft text-sage"
                            : "bg-gold-soft/40 text-gold"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          href={`/writing/${t.testNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-indigo-deep/40 hover:text-indigo-deep"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Preview
                        </Link>
                        <Link
                          href={`/admin/writing/${t._id}`}
                          className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-indigo-deep/40 hover:text-indigo-deep"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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