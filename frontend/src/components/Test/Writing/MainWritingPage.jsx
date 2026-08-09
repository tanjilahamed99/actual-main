"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTestStore } from "@/features/Useteststore";
import { useExitGuard } from "@/hooks/Useexitguard";

import { WritingHighlightRoot,WritingNoteModal,WritingNotesPanel,WritingSelectionPopup,useWritingHighlightsAndNotes } from "@/components/Test/Writing/Writinghighlightnotes";

import {
  BottomNav,
  CompletionModal,
  ConfirmModal,
  ResultModal,
  useDivider,
  LineChart,
  ProcessDiagram,
  BarChart,
  ChangeTable,
  MapPair,
  PieChart,
  TableChart,
} from "@/components/Test/Writing/WritingAllComponents";
import IntroModal from "@/components/Test/IntroModal";

const TOTAL_SEC = 60 * 60;

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function countWords(text) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

const MainWritingPage = ({
  testId,
  WRITING_PART,
  WRITING_PROCESS,
  WRITING_CHANGE,
  WRITING_BAR,
  WRITING_MAP,
  WRITING_TABLE_COFFEE,
  WRITING_TABLE_TEA,
  WRITING_PIE_EMISSIONS,
  WRITING_PIE_ENERGY,
  WRITING_LINE,
}) => {
  const router = useRouter();
  const [phase, setPhase] = useState("intro");
  const [activePart, setActivePart] = useState(0);
  const [answers, setAnswers] = useState(["", ""]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SEC);
  const [showResult, setShowResult] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const submitted = phase === "done";
  const { split, containerRef, onMouseDown } = useDivider(48);

  const { saveAllAnswers, submitSection } = useTestStore();

  // ── HIGHLIGHTS & NOTES ──
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

  const handleForcedExit = useCallback(async () => {
    saveAllAnswers("writing", { part_1: answers[0], part_2: answers[1] });
    submitSection("writing");
    setPhase("done");
    setTimeout(() => {
      router.push(`/full-test/${testId}`);
    }, 2000);
  }, [answers, saveAllAnswers, submitSection, testId, router]);

  const { guardedPush } = useExitGuard({
    active: guardActive,
    onConfirmExit: handleForcedExit,
    message:
      "Your test is in progress. Leaving now will auto-submit your current answers.",
  });

  const handleConfirm = () => {
    setShowConfirm(false);
    setPhase("done");
    setShowResult(true);
    saveAllAnswers("writing", { part_1: answers[0], part_2: answers[1] });
    submitSection("writing");
    setTimeout(() => {
      setShowResult(false);
      setShowCompletion(true);
    }, 2000);
  };

  useEffect(() => {
    if (phase !== "test") return;
    if (timeLeft <= 0) {
      handleConfirm();
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [phase, timeLeft]);

  // Reset prompt panel when switching parts on mobile
  useEffect(() => {
    setPromptOpen(false);
  }, [activePart]);

  const setAnswer = (i, v) =>
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });

  const handleSubmitClick = () => setShowConfirm(true);

  const handleViewResults = () => {
    setShowCompletion(false);
    router.push(`/full-test/${testId}`);
  };

  const part = WRITING_PART[activePart];

  // Unique zone IDs per part so highlights don't bleed across parts
  const promptZoneId = `prompt-part-${activePart}`;
  const promptZoneIdMobile = `prompt-part-${activePart}-mobile`;

  const chartsBlock = (
    <div className="mt-5">
      {WRITING_PROCESS && <ProcessDiagram {...WRITING_PROCESS} />}
      {WRITING_BAR && <BarChart {...WRITING_BAR} />}
      {WRITING_CHANGE && <ChangeTable {...WRITING_CHANGE} />}
      {WRITING_MAP && <MapPair {...WRITING_MAP} />}
      {WRITING_PIE_ENERGY && (
        <PieChart
          title={WRITING_PIE_ENERGY.title}
          segments={WRITING_PIE_ENERGY.segments}
        />
      )}
      {WRITING_PIE_EMISSIONS && (
        <PieChart
          title={WRITING_PIE_EMISSIONS.title}
          segments={WRITING_PIE_EMISSIONS.segments}
        />
      )}
      {WRITING_TABLE_COFFEE && (
        <TableChart
          title={WRITING_TABLE_COFFEE.title}
          columns={WRITING_TABLE_COFFEE.columns}
          rows={WRITING_TABLE_COFFEE.rows}
        />
      )}
      {WRITING_TABLE_TEA && (
        <TableChart
          title={WRITING_TABLE_TEA.title}
          columns={WRITING_TABLE_TEA.columns}
          rows={WRITING_TABLE_TEA.rows}
        />
      )}
      {WRITING_LINE && <LineChart {...WRITING_LINE} />}
    </div>
  );

  return (
    <div className=" bg-white h-screen flex flex-col overflow-hidden text-[#1a1a1a]">
      {/* MODALS */}
      {phase === "intro" && (
        <IntroModal
          onStart={() => setPhase("test")}
          num={testId}
          type={"writing"}
        />
      )}
      {showResult && <ResultModal answers={answers} PARTS={WRITING_PART} />}
      {showCompletion && <CompletionModal onViewResults={handleViewResults} />}
      {showConfirm && !showResult && !showCompletion && (
        <ConfirmModal
          answers={answers}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
          PARTS={WRITING_PART}
        />
      )}

      {phase !== "intro" && !showCompletion && (
        <>
          {/* ── TOP BAR ── */}
          {!focusMode && (
            <div className="flex items-center bg-[#f8d7da] border-b border-[#f0b8be] px-3 h-9 flex-shrink-0">
              <div className="w-6 h-6 bg-[#c0392b] text-white text-[13px] font-bold flex items-center justify-center rounded-[3px] flex-shrink-0">
                M
              </div>
              <div className="flex-1 text-center text-[12px] sm:text-[13px] text-gray-600 truncate px-2">
                Full-Test Writing Test {testId} (Online Test)
              </div>
            </div>
          )}

          {/* ── SUB BAR ── */}
          <div className="flex items-center gap-2 bg-white border-b border-gray-200 px-3 h-[34px] flex-shrink-0">
            {/* Focus toggle */}
            <button
              onClick={() => setFocusMode((f) => !f)}
              className="flex items-center gap-1.5 border border-gray-300 rounded bg-white text-gray-700 text-[12px] px-2 sm:px-2.5 py-[3px] cursor-pointer hover:bg-gray-50 transition-colors flex-shrink-0">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
              <span className="hidden sm:inline">Focus</span>
            </button>

            {/* Timer */}
            <div className="flex items-center gap-1.5 mx-auto text-[13px] font-semibold text-gray-800">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              <span
                className={`font-mono text-[13px] font-bold${timeLeft < 300 ? " text-red-600 animate-pulse" : ""}`}>
                {fmt(timeLeft)}
              </span>
            </div>

            {/* Notes button */}
            <button
              onClick={() => setShowNotesPanel(true)}
              className="flex items-center gap-1.5 border border-gray-300 rounded bg-white text-gray-700 text-[12px] px-2 sm:px-2.5 py-[3px] cursor-pointer hover:bg-gray-50 transition-colors relative flex-shrink-0">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <span className="hidden sm:inline">Notes</span>
              {notes.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {notes.length}
                </span>
              )}
            </button>

            {/* Menu stub */}
            <button className="border-none bg-transparent cursor-pointer text-gray-500 p-1 flex items-center hover:text-gray-900 flex-shrink-0">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          {/* ── PART HEADER ── */}
          {!focusMode && (
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2.5 bg-white border-b border-gray-200 px-3.5 py-1.5 flex-shrink-0">
              <span className="text-[13px] font-bold text-gray-900">
                {part.label}
              </span>
              <span className="text-[11px] sm:text-[12px] text-gray-500 leading-tight">
                <span className="sm:hidden">{part.subtitle}</span>
                <span className="hidden sm:inline">{part.subtitleFull}</span>
              </span>
            </div>
          )}

          {/* ── MAIN BODY ── */}

          {/* DESKTOP: side-by-side split layout */}
          <div
            className="hidden md:flex flex-1 overflow-hidden min-h-0"
            ref={containerRef}>
            <div
              className="overflow-y-auto shrink-0 border-r border-gray-200 bg-white"
              style={{ width: `${split}%` }}>
              <WritingHighlightRoot
                zoneId={promptZoneId}
                highlightKey={`app-highlight-writing-${activePart}`}
                highlights={highlights}
                onSelect={handleSelect}>
                <div className="px-5 pt-4 pb-14 text-lg text-[#1a1a1a]">
                  <p style={{ whiteSpace: "pre-line" }}>{part.prompt}</p>
                  {part.hasCharts && chartsBlock}
                </div>
              </WritingHighlightRoot>
            </div>

            {/* DIVIDER */}
            <div
              className="w-2 shrink-0 bg-gray-200 cursor-col-resize flex items-center justify-center relative border-l border-r border-gray-300 hover:bg-gray-300 transition-colors"
              onMouseDown={onMouseDown}
              onTouchStart={onMouseDown}>
              <button
                className="absolute flex flex-row items-center justify-center w-5 h-7 border border-gray-300 rounded-[3px] bg-white cursor-col-resize shadow-sm text-black hover:bg-gray-50 hover:text-black-900"
                onMouseDown={onMouseDown}
                onTouchStart={onMouseDown}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5">
                  <polyline points="15,18 9,12 15,6" />
                </svg>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5">
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </button>
            </div>

            {/* RIGHT: Answer */}
            <div
              className="overflow-y-auto shrink-0 bg-white flex flex-col"
              style={{ width: `${100 - split}%` }}>
              <div className="flex-1 flex flex-col px-4 py-3.5">
                <fieldset className="flex-1 flex flex-col border border-gray-300 rounded-[3px] px-2.5 pt-1.5 pb-2 min-h-0">
                  <legend className="text-[11px] text-gray-500 px-1">
                    {part.label} Answer
                  </legend>
                  <textarea
                    className="flex-1 w-full min-h-80 border-none outline-none resize-none text-[14px] leading-[1.75] text-[#1a1a1a] bg-transparent py-1 placeholder:text-gray-300 placeholder:italic placeholder:text-[13px]"
                    style={{ fontFamily: "Arial, sans-serif" }}
                    value={answers[activePart]}
                    onChange={(e) =>
                      !submitted && setAnswer(activePart, e.target.value)
                    }
                    placeholder={`Enter your ${part.label.toLowerCase()} answer...`}
                    readOnly={submitted}
                    spellCheck
                  />
                  <div className="flex items-center justify-between pt-1.5 border-t border-gray-100 mt-1">
                    <span className="text-[11px] text-gray-400">
                      Word Count:{" "}
                      <span
                        className={`font-bold ${
                          countWords(answers[activePart]) >= part.minWords
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}>
                        {countWords(answers[activePart])}
                      </span>
                      <span className="text-gray-300"> / {part.minWords}</span>
                    </span>
                    {countWords(answers[activePart]) >= part.minWords && (
                      <span className="text-[11px] text-green-600 font-semibold">
                        ✓ Minimum met
                      </span>
                    )}
                  </div>
                </fieldset>
              </div>
            </div>
          </div>

          {/* MOBILE: stacked layout */}
          <div className="flex md:hidden flex-col flex-1 overflow-hidden min-h-0">
            {/* Collapsible prompt panel */}
            <div
              className={`shrink-0 border-b border-gray-200 bg-white overflow-hidden transition-all duration-300 ${promptOpen ? "max-h-[45vh]" : "max-h-0"}`}>
              <WritingHighlightRoot
                zoneId={promptZoneIdMobile}
                highlightKey={`app-highlight-writing-mobile-${activePart}`}
                highlights={highlights}
                onSelect={handleSelect}>
                <div
                  className="overflow-y-auto max-h-[45vh] px-4 pt-3 pb-5"
                  style={{
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: "#1a1a1a",
                  }}>
                  <p style={{ whiteSpace: "pre-line" }}>{part.prompt}</p>
                  {part.hasCharts && chartsBlock}
                </div>
              </WritingHighlightRoot>
            </div>

            {/* Prompt toggle pill */}
            <button
              onClick={() => setPromptOpen((o) => !o)}
              className="shrink-0 flex items-center justify-center gap-1.5 w-full py-1.5 bg-gray-50 border-b border-gray-200 text-[11.5px] font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform duration-200 ${promptOpen ? "rotate-180" : ""}`}>
                <polyline points="6,9 12,15 18,9" />
              </svg>
              {promptOpen ? "Hide prompt" : "View prompt & charts"}
            </button>

            {/* Answer area */}
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="flex flex-col h-full px-3 py-3">
                <fieldset className="flex flex-col flex-1 border border-gray-300 rounded-[3px] px-2.5 pt-1.5 pb-2 min-h-0">
                  <legend className="text-[11px] text-gray-500 px-1">
                    {part.label} Answer
                  </legend>
                  <textarea
                    className="flex-1 w-full min-h-60 border-none outline-none resize-none text-[14px] leading-[1.75] text-[#1a1a1a] bg-transparent py-1 placeholder:text-gray-300 placeholder:italic placeholder:text-[13px]"
                    style={{ fontFamily: "Arial, sans-serif" }}
                    value={answers[activePart]}
                    onChange={(e) =>
                      !submitted && setAnswer(activePart, e.target.value)
                    }
                    placeholder={`Enter your ${part.label.toLowerCase()} answer...`}
                    readOnly={submitted}
                    spellCheck
                  />
                  <div className="flex items-center justify-between pt-1.5 border-t border-gray-100 mt-1">
                    <span className="text-[11px] text-gray-400">
                      {countWords(answers[activePart])} / {part.minWords} words
                    </span>
                  </div>
                </fieldset>
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
            PARTS={WRITING_PART}
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
      `}</style>
    </div>
  );
};

export default MainWritingPage;