"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DemoReadingTest } from "../../../../../demo/demoreading";
import ReadingMainPage from "@/components/Test/Reading/ReadingMainPage";

export default function TestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [test, setTest] = useState(null);
  const testId = params.id;

  useEffect(() => {
    if (testId) {
      const foundTest = DemoReadingTest.find((t) => t.id === parseInt(testId));
      if (foundTest) {
        setTest(foundTest);
      } else {
        router.push("/demotest");
      }
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
        testType="demo"
        title={test.title}
      />
    </div>
  );
}
