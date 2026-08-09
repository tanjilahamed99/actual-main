"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import ReadingTestForm, {
  testToFormState,
} from "@/app/admin/_components/ReadingTestForm";
import { getSingleReadingTest } from "@/actions/test";
import { updateReadingTest } from "@/actions/admin";

export default function EditReadingTestPage() {
  const router = useRouter();
  const { id } = useParams();

  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTest() {
      try {
        const { data } = await getSingleReadingTest(id);
        if (!cancelled) {
          setInitialValues(testToFormState(data.test));
        }
      } catch {
        if (!cancelled) setLoadError("Could not load this reading test.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTest();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleUpdate(payload) {
    await updateReadingTest(id, payload);
    router.push("/admin/reading");
  }

  if (loading) {
    return <p className="p-8 text-sm text-muted">Loading test…</p>;
  }

  if (loadError || !initialValues) {
    return (
      <p className="p-8 text-sm text-red-400">
        {loadError || "Test not found."}
      </p>
    );
  }

  // key forces a clean remount with the fetched data instead of merging
  // into whatever default state the form briefly held before the fetch resolved
  return (
    <ReadingTestForm
      key={id}
      initialValues={initialValues}
      onSubmit={handleUpdate}
      submitLabel="Update test"
    />
  );
}
