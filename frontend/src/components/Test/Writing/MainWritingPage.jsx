"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, BookOpen, X } from "lucide-react";

import { useModuleTestStore } from "@/features/Useteststore";
import { useExitGuard } from "@/hooks/Useexitguard";

import {
  WritingHighlightRoot,
  WritingNoteModal,
  WritingNotesPanel,
  WritingSelectionPopup,
  useWritingHighlightsAndNotes,
} from "@/components/Test/Writing/Writinghighlightnotes";

import {
  BottomNav,
  CompletionModal,
  ConfirmModal,
  ResultModal,
  AnswersReviewModal,
  useDivider,
} from "@/components/Test/Writing/WritingAllComponents";

import ChartRenderer from "./ChartRenderer";
import WritingFeedbackPanel from "./WritingFeedbackPanel";
import IntroModal from "@/components/Test/IntroModal";
import { submitWritingAttempt } from "@/actions/writing";

// ✅ Import the resources
import { TASK_1_RESOURCES, TASK_2_RESOURCES } from "@/lib/writingResources";

const TOTAL_SEC = 60 * 60;

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function countWords(text) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

const MainWritingPage = ({ testId, test }) => {
  const router = useRouter();
  const PARTS = test?.parts ?? [];

  const [phase, setPhase] = useState("intro");
  const [activePart, setActivePart] = useState(0);
  const [answers, setAnswers] = useState(() => PARTS.map(() => ""));
  const [timeLeft, setTimeLeft] = useState(TOTAL_SEC);
  const [showResult, setShowResult] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showAnswersReview, setShowAnswersReview] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);

  // ✅ State for the Resources panel
  const [showResources, setShowResources] = useState(false);

  // Submission
  const [submitting, setSubmitting] = useState(false);

  const submitted = phase === "done";
  const { split, containerRef, onMouseDown } = useDivider(48);

  const { initModule, startModule, saveAllAnswers, submitModule } =
    useModuleTestStore();

  const {
    highlights,
    notes,
    selection,
    isHighlighted,
    showNoteModal,
    showNotesPanel,
    pendingNoteSelection,
    setShowNoteModal,
    setShowNotesPanel,
    handleSelect,
    handleHighlight,
    handleClear,
    handleNoteOpen,
    handleNoteSave,
    handleNoteDelete,
    dismiss,
  } = useWritingHighlightsAndNotes();

  const guardActive = phase === "test";

  const answerPayload = Object.fromEntries(
    answers.map((a, i) => [`part_${i + 1}`, a]),
  );

  useEffect(() => {
    if (!test?.testNumber) return;
    initModule("writing", testId, test?.title ?? `Writing Test ${testId}`);
  }, [testId, test?.testNumber, test?.title, initModule]);

  useEffect(() => {
    if (phase !== "test") return;
    if (timeLeft <= 0) {
      handleConfirm();
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  useEffect(() => setPromptOpen(false), [activePart]);

  const handleForcedExit = useCallback(async () => {
    saveAllAnswers("writing", testId, answerPayload);
    submitModule("writing", testId);
    setPhase("done");
    setTimeout(() => router.push("/writing"), 2000);
  }, [answerPayload, saveAllAnswers, submitModule, testId, router]);

  const { guardedPush } = useExitGuard({
    active: guardActive,
    onConfirmExit: handleForcedExit,
    message:
      "Your test is in progress. Leaving now will auto-submit your current answers.",
  });

  const handleConfirm = async () => {
    setShowConfirm(false);
    setSubmitting(true);

    try {
      const payload = {
        testId: test?._id,
        testNumber: Number(testId),
        testTitle: test?.title ?? "",
        answers: PARTS.map((p, i) => ({
          partIndex: i,
          label: p.label,
          prompt: p.prompt,
          minWords: p.minWords,
          answer: answers[i] ?? "",
          wordCount: countWords(answers[i] ?? ""),
        })),
      };

      await submitWritingAttempt(testId, payload);
      toast.success("Your answers have been submitted for marking.");
    } catch (err) {
      const status = err?.response?.status;
      const msg =
        err?.response?.data?.message ??
        "Failed to submit. Please check your connection and try again.";
      if (status === 403) {
        toast.error("Your account isn't approved yet.");
      } else {
        toast.error(msg);
      }
      setSubmitting(false);
      return;
    }

    setPhase("done");
    saveAllAnswers("writing", testId, answerPayload);
    submitModule("writing", testId);
    setShowResult(true);
    setSubmitting(false);
  };

  const handleResultDone = () => {
    setShowResult(false);
    setShowCompletion(true);
  };

  const handleViewAnswers = () => {
    setShowCompletion(false);
    setShowAnswersReview(true);
  };

  const handleBackToTests = () => {
    setShowCompletion(false);
    router.push("/writing");
  };

  const handleStart = () => {
    startModule("writing", testId);
    setPhase("test");
  };

  const setAnswer = (i, v) =>
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });

  const handleSubmitClick = () => setShowConfirm(true);

  const part = PARTS[activePart];

  if (!part) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-sm text-gray-500">
        This writing test has no parts yet.
      </div>
    );
  }

  const promptZoneId = `prompt-part-${activePart}`;
  const promptZoneIdMobile = `prompt-part-${activePart}-mobile`;

  const chartsBlock =
    part.hasCharts && part.charts?.length > 0 ? (
      <div className="mt-5 space-y-6">
        {part.charts.map((chart, i) => (
          <ChartRenderer key={i} chart={chart} />
        ))}
      </div>
    ) : null;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white text-[#1a1a1a]">
      {/* ── MODALS ── */}
      {phase === "intro" && (
        <IntroModal onStart={handleStart} num={testId} type={"writing"} />
      )}

      {showResult && (
        <ResultModal
          answers={answers}
          PARTS={PARTS}
          onDone={handleResultDone}
        />
      )}

      {showCompletion && (
        <CompletionModal
          onViewAnswers={handleViewAnswers}
          onBackToTests={handleBackToTests}
        />
      )}

      {showConfirm && !showResult && !showCompletion && (
        <ConfirmModal
          answers={answers}
          onConfirm={handleConfirm}
          onCancel={() => !submitting && setShowConfirm(false)}
          PARTS={PARTS}
        />
      )}

      {showAnswersReview && (
        <AnswersReviewModal
          answers={answers}
          PARTS={PARTS}
          onClose={() => setShowAnswersReview(false)}
        />
      )}

      {/* ✅ RESOURCES DRAWER */}
      {showResources && (
        <div className="fixed inset-0 z-[250] flex justify-end">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setShowResources(false)}
          />
          <div className="relative flex h-full w-full max-w-md animate-slide-in-right flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="font-bold text-gray-900">Writing Resources</h2>
                <p className="text-xs text-gray-500">
                  {activePart === 0 ? "Task 1 Templates & Vocab" : "Task 2 Ideas & Vocab"}
                </p>
              </div>
              <button
                onClick={() => setShowResources(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-5 pb-20">
              {activePart === 0 ? (
                // TASK 1 CONTENT
                <>
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900">
                      Templates
                    </h3>
                    {TASK_1_RESOURCES.templates.map((t, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                      >
                        <p className="text-sm font-semibold text-gray-800">
                          {t.title}
                        </p>
                        {t.content && (
                          <p className="mt-1 text-xs text-gray-600">{t.content}</p>
                        )}
                        {t.template && (
                          <div className="mt-2 rounded border border-gray-200 bg-white p-2 font-mono text-xs text-indigo-700">
                            {t.template}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900">
                      High-Score Vocabulary
                    </h3>
                    {TASK_1_RESOURCES.vocabulary.map((v, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                      >
                        <p className="mb-2 text-sm font-semibold text-gray-800">
                          {v.category}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {v.words.map((w, j) => (
                            <span
                              key={j}
                              className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700"
                            >
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                // TASK 2 CONTENT
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-900">
                    Topic Ideas
                  </h3>
                  {TASK_2_RESOURCES.map((topic, i) => (
                    <details
                      key={i}
                      className="group overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <summary className="flex cursor-pointer items-center justify-between p-3 text-sm font-semibold text-gray-800 hover:bg-gray-100">
                        {topic.category}
                        <span className="text-gray-400 transition-transform group-open:rotate-180">
                          ▼
                        </span>
                      </summary>
                      <div className="border-t border-gray-200 bg-white p-3 pt-0">
                        <ul className="mt-2 list-disc space-y-1.5 pl-4">
                          {topic.points.map((p, j) => (
                            <li
                              key={j}
                              className="text-xs leading-relaxed text-gray-600"
                            >
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Submitting overlay ── */}
      {submitting && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/40">
          <div className="flex items-center gap-3 rounded-lg bg-white px-5 py-4 shadow-xl">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-deep" />
            <span className="font-sans text-sm text-ink">
              Submitting your answers…
            </span>
          </div>
        </div>
      )}

      {phase !== "intro" && !showCompletion && (
        <>
          {/* ── TOP BAR ── */}
          {!focusMode && (
            <div className="flex h-9 flex-shrink-0 items-center border-b border-[#f0b8be] bg-[#f8d7da] px-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[3px] bg-[#c0392b] text-[13px] font-bold text-white">
                M
              </div>
              <div className="flex-1 truncate px-2 text-center text-[12px] text-gray-600 sm:text-[13px]">
                {test?.title ?? `Writing Test ${testId}`} (Online Test)
              </div>
            </div>
          )}

          {/* ── SUB BAR ── */}
          <div className="flex h-[34px] flex-shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-3">
            <button
              onClick={() => setFocusMode((f) => !f)}
              className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded border border-gray-300 bg-white px-2 py-[3px] text-[12px] text-gray-700 transition-colors hover:bg-gray-50 sm:px-2.5"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
              <span className="hidden sm:inline">Focus</span>
            </button>

            <div className="mx-auto flex items-center gap-1.5 text-[13px] font-semibold text-gray-800">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              <span
                className={`font-mono text-[13px] font-bold${
                  timeLeft < 300 ? " animate-pulse text-red-600" : ""
                }`}
              >
                {fmt(timeLeft)}
              </span>
            </div>

            {/* ✅ Resources Button */}
            <button
              onClick={() => setShowResources(true)}
              className="flex flex-shrink-0 items-center gap-1.5 rounded border border-gray-300 bg-white px-2 py-[3px] text-[12px] text-gray-700 transition-colors hover:bg-gray-50 sm:px-2.5"
            >
              <BookOpen width="12" height="12" strokeWidth="2.5" />
              <span className="hidden sm:inline">Resources</span>
            </button>

            <button
              onClick={() => setShowNotesPanel(true)}
              className="relative flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded border border-gray-300 bg-white px-2 py-[3px] text-[12px] text-gray-700 transition-colors hover:bg-gray-50 sm:px-2.5"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span className="hidden sm:inline">Notes</span>
              {notes.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  {notes.length}
                </span>
              )}
            </button>
          </div>

          {/* ── PART HEADER ── */}
          {!focusMode && (
            <div className="flex flex-shrink-0 flex-col gap-0.5 border-b border-gray-200 bg-white px-3.5 py-1.5 sm:flex-row sm:items-baseline sm:gap-2.5">
              <span className="text-[13px] font-bold text-gray-900">
                {part.label}
              </span>
              <span className="text-[11px] leading-tight text-gray-500 sm:text-[12px]">
                <span className="sm:hidden">{part.subtitle}</span>
                <span className="hidden sm:inline">{part.subtitleFull}</span>
              </span>
            </div>
          )}

          {/* ── DESKTOP split ── */}
          <div
            className="hidden min-h-0 flex-1 overflow-hidden md:flex"
            ref={containerRef}
          >
            <div
              className="shrink-0 overflow-y-auto border-r border-gray-200 bg-white"
              style={{ width: `${split}%` }}
            >
              <WritingHighlightRoot
                zoneId={promptZoneId}
                highlightKey={`app-highlight-writing-${activePart}`}
                highlights={highlights}
                onSelect={handleSelect}
              >
                <div className="px-5 pb-14 pt-4 text-lg text-[#1a1a1a]">
                  <p style={{ whiteSpace: "pre-line" }}>{part.prompt}</p>
                  {chartsBlock}
                </div>
              </WritingHighlightRoot>
            </div>

            <div
              className="relative flex w-2 shrink-0 cursor-col-resize items-center justify-center border-l border-r border-gray-300 bg-gray-200 transition-colors hover:bg-gray-300"
              onMouseDown={onMouseDown}
              onTouchStart={onMouseDown}
            >
              <button
                className="absolute flex h-7 w-5 cursor-col-resize flex-row items-center justify-center rounded-[3px] border border-gray-300 bg-white text-black shadow-sm hover:bg-gray-50"
                onMouseDown={onMouseDown}
                onTouchStart={onMouseDown}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15,18 9,12 15,6" />
                </svg>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </button>
            </div>

            <div
              className="flex shrink-0 flex-col overflow-y-auto bg-white"
              style={{ width: `${100 - split}%` }}
            >
              <div className="flex flex-1 flex-col px-4 py-3.5">
                <fieldset className="flex min-h-0 flex-1 flex-col rounded-[3px] border border-gray-300 px-2.5 pb-2 pt-1.5">
                  <legend className="px-1 text-[11px] text-gray-500">
                    {part.label} Answer
                  </legend>
                  <textarea
                    className="min-h-80 w-full flex-1 resize-none border-none bg-transparent py-1 text-[14px] leading-[1.75] text-[#1a1a1a] outline-none placeholder:text-[13px] placeholder:italic placeholder:text-gray-300"
                    style={{ fontFamily: "Arial, sans-serif" }}
                    value={answers[activePart]}
                    onChange={(e) =>
                      !submitted && setAnswer(activePart, e.target.value)
                    }
                    placeholder={`Enter your ${part.label.toLowerCase()} answer...`}
                    readOnly={submitted}
                    spellCheck
                  />
                  <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-1.5">
                    <span className="text-[11px] text-gray-400">
                      Word Count:{" "}
                      <span
                        className={`font-bold ${
                          countWords(answers[activePart]) >= part.minWords
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {countWords(answers[activePart])}
                      </span>
                      <span className="text-gray-300"> / {part.minWords}</span>
                    </span>
                    {countWords(answers[activePart]) >= part.minWords && (
                      <span className="text-[11px] font-semibold text-green-600">
                        ✓ Minimum met
                      </span>
                    )}
                  </div>
                </fieldset>

                <WritingFeedbackPanel
                  answer={answers[activePart]}
                  minWords={part.minWords}
                />
              </div>
            </div>
          </div>

          {/* ── MOBILE ── */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:hidden">
            <div
              className={`shrink-0 overflow-hidden border-b border-gray-200 bg-white transition-all duration-300 ${
                promptOpen ? "max-h-[45vh]" : "max-h-0"
              }`}
            >
              <WritingHighlightRoot
                zoneId={promptZoneIdMobile}
                highlightKey={`app-highlight-writing-mobile-${activePart}`}
                highlights={highlights}
                onSelect={handleSelect}
              >
                <div
                  className="max-h-[45vh] overflow-y-auto px-4 pb-5 pt-3"
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: "#1a1a1a",
                  }}
                >
                  <p style={{ whiteSpace: "pre-line" }}>{part.prompt}</p>
                  {chartsBlock}
                </div>
              </WritingHighlightRoot>
            </div>

            <button
              onClick={() => setPromptOpen((o) => !o)}
              className="flex w-full shrink-0 items-center justify-center gap-1.5 border-b border-gray-200 bg-gray-50 py-1.5 text-[11.5px] font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform duration-200 ${
                  promptOpen ? "rotate-180" : ""
                }`}
              >
                <polyline points="6,9 12,15 18,9" />
              </svg>
              {promptOpen ? "Hide prompt" : "View prompt & charts"}
            </button>

            <div className="flex-1 overflow-y-auto bg-white">
              <div className="flex h-full flex-col px-3 py-3">
                <fieldset className="flex min-h-0 flex-1 flex-col rounded-[3px] border border-gray-300 px-2.5 pb-2 pt-1.5">
                  <legend className="px-1 text-[11px] text-gray-500">
                    {part.label} Answer
                  </legend>
                  <textarea
                    className="min-h-60 w-full flex-1 resize-none border-none bg-transparent py-1 text-[14px] leading-[1.75] text-[#1a1a1a] outline-none placeholder:text-[13px] placeholder:italic placeholder:text-gray-300"
                    style={{ fontFamily: "Arial, sans-serif" }}
                    value={answers[activePart]}
                    onChange={(e) =>
                      !submitted && setAnswer(activePart, e.target.value)
                    }
                    placeholder={`Enter your ${part.label.toLowerCase()} answer...`}
                    readOnly={submitted}
                    spellCheck
                  />
                  <div className="mt-1 flex items-center justify-between border-t border-gray-100 pt-1.5">
                    <span className="text-[11px] text-gray-400">
                      {countWords(answers[activePart])} / {part.minWords} words
                    </span>
                  </div>
                </fieldset>

                <WritingFeedbackPanel
                  answer={answers[activePart]}
                  minWords={part.minWords}
                />
              </div>
            </div>
          </div>

          {/* ── BOTTOM NAV ── */}
          <BottomNav
            active={activePart}
            setActive={setActivePart}
            answers={answers}
            onSubmit={handleSubmitClick}
            submitted={submitted}
            PARTS={PARTS}
          />
        </>
      )}

      {/* ── HIGHLIGHT / NOTE OVERLAYS ── */}
      {selection && !showNoteModal && (
        <WritingSelectionPopup
          selection={selection}
          isHighlighted={isHighlighted}
          onHighlight={handleHighlight}
          onClear={handleClear}
          onNote={handleNoteOpen}
          onDismiss={dismiss}
        />
      )}

      {showNoteModal && (
        <WritingNoteModal
          selection={pendingNoteSelection}
          existingNote=""
          onSave={handleNoteSave}
          onClose={() => setShowNoteModal(false)}
        />
      )}

      {showNotesPanel && (
        <WritingNotesPanel
          notes={notes}
          onDelete={handleNoteDelete}
          onClose={() => setShowNotesPanel(false)}
        />
      )}

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        ::highlight(app-highlight-writing-0),
        ::highlight(app-highlight-writing-1),
        ::highlight(app-highlight-writing-mobile-0),
        ::highlight(app-highlight-writing-mobile-1) {
          background-color: #fef08a;
          color: #713f12;
        }
        
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MainWritingPage;