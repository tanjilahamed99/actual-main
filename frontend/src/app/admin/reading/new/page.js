"use client";

import { useRouter } from "next/navigation";
import ReadingTestForm from "../../_components/ReadingTestForm";
import { createReadingTest } from "@/actions/admin";

export default function NewReadingTestPage() {
  const router = useRouter();

  async function handleCreate(payload) {
    await createReadingTest(payload);
    router.push("/admin/reading");
  }

  return <ReadingTestForm onSubmit={handleCreate} submitLabel="Save test" />;
}
