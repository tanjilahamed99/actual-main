"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAllReadingTest } from "@/actions/test";
import QuestionsTable from "../_components/QuestionsTable";
import SearchBar from "../_components/SearchBar";
import Pagination from "../_components/Pagination";
import { useUrlState, useUrlBatch } from "@/hooks/useUrlState";

const PAGE_SIZE = 10;

function toRow(test) {
  return {
    id: test._id,
    displayId: `RT-${test.testNumber}`,
    title: test.title,
    testNumber: test.testNumber,
    type: test.priority === "main" ? "Main test" : "Extra practice",
    passages: test.questions?.length ?? 0,
    date: new Date(test.updatedAt).toISOString().slice(0, 10),
    status: test.status === "published" ? "Published" : "Draft",
  };
}

export default function ReadingAdmin() {
  // ---- URL is the source of truth ----
  const [search] = useUrlState("q", "");
  const [status] = useUrlState("status", "");
  const [priority] = useUrlState("priority", "");
  const [pageStr] = useUrlState("page", "1");
  const page = Math.max(1, parseInt(pageStr, 10) || 1);
  const patchUrl = useUrlBatch();

  const setPage = useCallback(
    (p) => patchUrl({ page: p === 1 ? null : p }),
    [patchUrl],
  );

  const applyFilter = useCallback(
    (patch) => patchUrl({ ...patch, page: null }),
    [patchUrl],
  );

  // ---- data ----
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ totalPages: 1, total: 0 });

  const fetchTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getAllReadingTest({
        q: search || undefined,
        status: status || undefined,
        priority: priority || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setTests(data.test ?? []);
      setMeta(data.pagination ?? { totalPages: 1, total: 0 });
    } catch (err) {
      console.error("Failed to load reading tests:", err);
      setTests([]);
      setError("Could not load reading tests. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, page]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const rows = useMemo(() => tests.map(toRow), [tests]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl font-sans text-sm text-muted">
          {loading
            ? "Loading reading tests…"
            : `${meta.total} reading test${meta.total === 1 ? "" : "s"} in the archive.`}
        </p>
        <Link
          href="/admin/reading/new"
          className="shrink-0 rounded-full bg-gold px-5 py-2.5 font-sans text-sm font-semibold text-indigo-deep transition-all duration-200 hover:bg-gold-soft hover:shadow-md active:scale-[0.98]"
        >
          + Add test
        </Link>
      </div>

      {/* filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-raised p-4 sm:flex-row sm:items-center">
        <SearchBar
          value={search}
          onChange={(v) => applyFilter({ q: v || null })}
          placeholder="Search title, passage, or test number…"
        />

        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <select
            value={status}
            onChange={(e) => applyFilter({ status: e.target.value || null })}
            className="rounded-full border border-line bg-paper-raised px-4 py-2.5 font-sans text-sm
                       text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
          >
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={priority}
            onChange={(e) => applyFilter({ priority: e.target.value || null })}
            className="rounded-full border border-line bg-paper-raised px-4 py-2.5 font-sans text-sm
                       text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
          >
            <option value="">All priorities</option>
            <option value="main">Main test</option>
            <option value="extra">Extra practice</option>
          </select>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={PAGE_SIZE} />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center font-sans text-sm text-red-700">
          {error}{" "}
          <button onClick={fetchTests} className="underline">
            Retry
          </button>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-line bg-paper-raised p-10 text-center font-sans text-sm text-muted">
          No tests match your filters.
        </div>
      ) : (
        <>
          <div data-table-anchor>
            <QuestionsTable rows={rows} typeLabel="Priority" />
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

function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-2 rounded-2xl border border-line bg-paper-raised p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-line/40" />
      ))}
    </div>
  );
}