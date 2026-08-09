"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import QuestionsTable from "../_components/QuestionsTable";
import { getAllReadingTest } from "@/actions/test";

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
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await getAllReadingTest();
        setTests(data.test);
      } catch (err) {
        console.error("Failed to load reading tests:", err);
        setTests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const rows = tests.map(toRow);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl font-sans text-sm text-muted">
          {loading
            ? "Loading reading tests…"
            : `${tests.length} reading tests in the archive, spanning matching headings, True/False/Not Given, and sentence completion across all three passage types.`}
        </p>
        <Link
          href="/admin/reading/new"
          className="shrink-0 rounded-full bg-gold px-5 py-2.5 font-sans text-sm font-semibold text-indigo-deep transition-all duration-200 hover:bg-gold-soft hover:shadow-md active:scale-[0.98]">
          + Add test
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-line bg-paper-raised p-10 text-center text-sm text-muted">
          Loading…
        </div>
      ) : (
        <QuestionsTable rows={rows} typeLabel="Priority" />
      )}
    </div>
  );
}
