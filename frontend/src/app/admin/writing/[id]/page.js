// [id]/page.jsx
"use client";
import { useParams } from "next/navigation";
import WritingForm from "../../_components/WritingForm";
export default function EditWritingTestPage() {
  const { id } = useParams();
  return <WritingForm mode="edit" testId={id} />;
}
