"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
} from "lucide-react";
import { checkGrammar } from "@/actions/grammar";
import { suggestVocab } from "@/lib/writingVocab";

export default function WritingFeedbackPanel({ answer, minWords }) {
  const [issues, setIssues] = useState([]);
  const [checking, setChecking] = useState(false);

  const wordCount = useMemo(() => {
    if (!answer || !answer.trim()) return 0;
    return answer.trim().split(/\s+/).length;
  }, [answer]);

  const vocabHits = useMemo(() => suggestVocab(answer), [answer]);

  // Debounced grammar check
  useEffect(() => {
    if (!answer || answer.trim().length < 30) {
      setIssues([]);
      return;
    }

    let cancelled = false;
    setChecking(true);

    const id = setTimeout(async () => {
      try {
        const matches = await checkGrammar(answer);
        if (!cancelled) setIssues(matches);
      } catch {
        if (!cancelled) setIssues([]);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }, 3000);

    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [answer]);

  const pct = minWords > 0 ? Math.min(100, (wordCount / minWords) * 100) : 0;
  const met = wordCount >= minWords;

  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-gray-900">Feedback</h3>
        {checking && (
          <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
            <Loader2 className="h-3 w-3 animate-spin" /> Checking…
          </span>
        )}
      </div>

      {/* Word count bar */}
      <div className="mt-3">
        <div className="flex justify-between text-[11px] text-gray-500">
          <span>Word count</span>
          <span className={met ? "font-bold text-green-600" : "text-gray-600"}>
            {wordCount} / {minWords}
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              met ? "bg-green-500" : "bg-amber-500"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Grammar issues */}
      {issues.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
            <span className="text-[12px] font-semibold text-gray-800">
              Grammar & Style ({issues.length})
            </span>
          </div>
          <ul className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
            {issues.slice(0, 6).map((m, i) => (
              <li
                key={i}
                className="rounded border border-amber-200 bg-amber-50 px-2 py-1.5 text-[11.5px] leading-snug text-amber-900"
              >
                <p>{m.message}</p>
                {m.replacements && m.replacements.length > 0 && (
                  <p className="mt-1 text-[11px]">
                    <span className="font-semibold">Try:</span>{" "}
                    {m.replacements
                      .slice(0, 3)
                      .map((r) => r.value)
                      .join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
          {issues.length > 6 && (
            <p className="mt-1 text-[11px] text-gray-400">
              + {issues.length - 6} more
            </p>
          )}
        </div>
      )}

      {/* Vocabulary upgrades */}
      {vocabHits.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-[12px] font-semibold text-gray-800">
              Vocabulary upgrades
            </span>
          </div>
          <ul className="max-h-44 space-y-1 overflow-y-auto pr-1">
            {vocabHits.slice(0, 5).map((v, i) => (
              <li
                key={i}
                className="rounded border border-indigo-100 bg-indigo-50 px-2 py-1.5 text-[11.5px] leading-snug text-indigo-900"
              >
                <span className="text-indigo-400 line-through">{v.word}</span>
                {" → "}
                <span className="font-semibold">
                  {v.suggestions.join(", ")}
                </span>
              </li>
            ))}
          </ul>
          {vocabHits.length > 5 && (
            <p className="mt-1 text-[11px] text-gray-400">
              + {vocabHits.length - 5} more
            </p>
          )}
        </div>
      )}

      {/* All clear */}
      {!issues.length && !vocabHits.length && wordCount >= 20 && !checking && (
        <div className="mt-4 flex items-center gap-1.5 text-[11.5px] text-gray-400">
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
          Looking good so far.
        </div>
      )}
    </div>
  );
}