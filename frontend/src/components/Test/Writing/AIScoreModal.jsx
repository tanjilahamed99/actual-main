"use client";

import { X, TrendingUp, Award, AlertCircle } from "lucide-react";

export default function AIScoreModal({ score, onClose }) {
  if (!score) return null;

  const { overallBand, criteria, strengths, improvements, vocabUpgrades } =
    score;

  return (
    <div
      className="fixed inset-0 z-[400] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-start justify-between border-b border-gray-200 bg-white px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              AI Band Score
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-[#1a3b6e]">
                {overallBand}
              </span>
              <span className="text-[12px] text-gray-500">/ 9.0</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full border border-gray-200 p-1.5 text-gray-500 hover:border-gray-400 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Criteria */}
        <div className="px-5 py-4">
          <h3 className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-gray-900">
            <Award className="h-4 w-4 text-[#1a3b6e]" />
            Score breakdown
          </h3>
          <div className="space-y-2">
            {Object.entries(criteria || {}).map(([key, c]) => (
              <div
                key={key}
                className="rounded border border-gray-200 bg-gray-50 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-gray-900">
                    {key}
                  </span>
                  <span className="font-mono text-[15px] font-bold text-[#1a3b6e]">
                    {c.band}
                  </span>
                </div>
                <p className="mt-1 text-[12px] leading-snug text-gray-600">
                  {c.comment}
                </p>
                {c.examples && c.examples.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {c.examples.map((ex, i) => (
                      <li
                        key={i}
                        className="border-l-2 border-gray-300 pl-2 text-[11.5px] italic text-gray-500"
                      >
                        "{ex}"
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        {strengths && strengths.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4">
            <h3 className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-green-700">
              <TrendingUp className="h-4 w-4" />
              Strengths
            </h3>
            <ul className="space-y-1.5">
              {strengths.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[12.5px] text-gray-700"
                >
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {improvements && improvements.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4">
            <h3 className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-amber-700">
              <AlertCircle className="h-4 w-4" />
              Improvements
            </h3>
            <ul className="space-y-1.5">
              {improvements.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[12.5px] text-gray-700"
                >
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Vocab upgrades */}
        {vocabUpgrades && vocabUpgrades.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4">
            <h3 className="mb-2 text-[13px] font-bold text-indigo-700">
              Vocabulary upgrades
            </h3>
            <div className="space-y-2">
              {vocabUpgrades.map((v, i) => (
                <div
                  key={i}
                  className="rounded border border-indigo-100 bg-indigo-50 p-2.5"
                >
                  <p className="text-[12.5px]">
                    <span className="text-indigo-400 line-through">
                      {v.original}
                    </span>
                    {" → "}
                    <span className="font-bold text-indigo-900">
                      {v.better}
                    </span>
                  </p>
                  {v.why && (
                    <p className="mt-0.5 text-[11.5px] text-indigo-700">
                      {v.why}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-white px-5 py-3">
          <button
            onClick={onClose}
            className="w-full rounded bg-[#1a3b6e] py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#0f2a52]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}