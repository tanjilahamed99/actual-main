"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { readingData } from "@/mock/reading";
import ReadingMainPage from "@/components/Test/Reading/ReadingMainPage";
import { getSingleReadingTest } from "@/actions/test";

export default function TestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState(null);
  const testId = params.id;

  useEffect(() => {
    if (testId) {
      const fetch = async () => {
        const { data } = await getSingleReadingTest(testId);
        if (data.success) {
          setTest(data.test);
        }
      };
      fetch();
    }
  }, [testId, router]);

  if (!test) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-deep border-r-transparent"></div>
          <p className="mt-4 text-muted">Loading test...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ReadingMainPage
        ANSWER_KEY={test.answers}
        testId={testId}
        ReadingPassage={test.questions}
        testType="main"
        title={test.title}
      />
    </div>
  );
}
