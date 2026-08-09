"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTestStore } from "@/features/Useteststore";
import { useExitGuard } from "@/hooks/Useexitguard";
import {
  DoneScreen,
  ListeningQuestionBlock,
  NoteModal,
  NotesPanel,
  SelectionPopup,
  useHighlightsAndNotes,
  PartAudioBar,
  HighlightRoot,
} from "@/components/Test/Listening/AllCompo";
import IntroModal from "@/components/Test/IntroModal";
import { BottomNav } from "@/components/Test/BottomNav";

const TOTAL_SEC = 40 * 60;

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const PARTS = [
  { label: "Part 1", qRange: "1–10", s: 1, e: 10 },
  { label: "Part 2", qRange: "11–20", s: 11, e: 20 },
  { label: "Part 3", qRange: "21–30", s: 21, e: 30 },
  { label: "Part 4", qRange: "31–40", s: 31, e: 40 },
];

// ── ROOT ──────────────────────────────────────
export default function MainListeningTest({
  AUDIO_SRC,
  testId,
  listeningQuestions,
}) {
  const router = useRouter();
  const [phase, setPhase] = useState("intro");
  const [active, setActive] = useState(0);
  const [vals, setVals] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_SEC);
  const [focusMode, setFocusMode] = useState(false);
  const { saveAllAnswers, submitSection } = useTestStore();

  const scrollRef = useRef(null);
  const pendingScrollQ = useRef(null);
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [audioCur, setAudioCur] = useState(0);
  const [audioDur, setAudioDur] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setAudioCur(el.currentTime);
    const onMeta = () => setAudioDur(el.duration);
    const onEnded = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggleAudio = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    playing ? el.pause() : el.play();
    setPlaying((p) => !p);
  }, [playing]);

  const audioProps = {
    playing,
    onToggle: toggleAudio,
    cur: audioCur,
    dur: audioDur,
  };

  // Fire pending scroll after active part changes & content re-renders
  useEffect(() => {
    if (pendingScrollQ.current === null) return;
    const qNum = pendingScrollQ.current;
    pendingScrollQ.current = null;
    // rAF ensures the new section has painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(`q-${qNum}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.style.transition = "outline 0s";
          el.style.outline = "2px solid #9ca3af";
          el.style.outlineOffset = "4px";
          el.style.borderRadius = "8px";
          setTimeout(() => {
            el.style.outline = "";
            el.style.outlineOffset = "";
            el.style.borderRadius = "";
          }, 2000);
        }
      });
    });
  }, [active]); // runs every time active changes

  // Navigate to a specific question number
  const scrollToQuestion = useCallback(
    (qNum) => {
      const partIdx = PARTS.findIndex((p) => qNum >= p.s && qNum <= p.e);
      if (partIdx === -1) return;
      if (partIdx !== active) {
        // Switch part first — scroll fires in useEffect above
        pendingScrollQ.current = qNum;
        setActive(partIdx);
      } else {
        // Already on correct part — scroll immediately
        requestAnimationFrame(() => {
          const el = document.getElementById(`q-${qNum}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.style.transition = "outline 0s";
            el.style.outline = "2px solid #9ca3af";
            el.style.outlineOffset = "4px";
            el.style.borderRadius = "8px";
            setTimeout(() => {
              el.style.outline = "";
              el.style.outlineOffset = "";
              el.style.borderRadius = "";
            }, 2000);
          }
        });
      }
    },
    [active],
  );

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
  } = useHighlightsAndNotes();

  const guardActive = phase === "test";
  const handleForcedExit = useCallback(async () => {
    audioRef.current?.pause();
    const formattedAnswers = {};
    Object.entries(vals).forEach(([qNum, answer]) => {
      formattedAnswers[`question_${qNum}`] = answer;
    });
    saveAllAnswers("listening", formattedAnswers);
    submitSection("listening");
    setPhase("done");
    router.push(`/full-test/${testId}/reading`);
  }, [vals, saveAllAnswers, submitSection, testId, router]);

  const { guardedPush } = useExitGuard({
    active: guardActive,
    onConfirmExit: handleForcedExit,
    message:
      "Your listening test is in progress. Leaving now will auto-submit your current answers.",
  });

  useEffect(() => {
    if (phase !== "test") return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [phase, timeLeft]);

  const onChange = (n, v) => setVals((p) => ({ ...p, [n]: v }));

  const handleSubmit = useCallback(() => {
    audioRef.current?.pause();
    const formattedAnswers = {};
    Object.entries(vals).forEach(([qNum, answer]) => {
      formattedAnswers[`question_${qNum}`] = answer;
    });
    saveAllAnswers("listening", formattedAnswers);
    submitSection("listening");
    setPhase("done");
    setTimeout(() => {
      router.push(`/full-test/${testId}/reading`);
    }, 2000);
  }, [vals, saveAllAnswers, submitSection, testId, router]);

  const urgent = timeLeft < 300;
  const totalAnswered = Object.values(vals).filter((v) => v !== "").length;
  const submitted = phase === "done";
  const sp = { vals, onChange, highlights, onSelect: handleSelect, audioProps };

  if (phase === "done") return <DoneScreen />;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white w-full">
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />

      {phase === "intro" && (
        <IntroModal
          onStart={() => setPhase("test")}
          num={testId}
          type={"listening"}
        />
      )}

      {phase === "test" && (
        <>
          {/* TOP BAR */}
          <div className="flex items-center bg-red-50 border-b border-red-200 px-3 h-10 flex-shrink-0 w-full">
            <span className="w-7 h-7 bg-red-700 text-white text-[13px] font-bold rounded-md flex items-center justify-center flex-shrink-0">
              E
            </span>
            <div className="flex-1 text-center text-[13px] font-medium text-gray-700">
              Full-Test Listening Test {testId} (Online Test)
            </div>
          </div>

          {/* SUB BAR */}
          <div className="flex items-center bg-white border-b border-gray-200 px-3 h-9 shrink-0 w-full gap-2">
            <button
              className="flex items-center gap-1.5 border border-gray-300 rounded-md px-2.5 py-0.5 text-[12px] text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => setFocusMode((f) => !f)}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
              Focus
            </button>

            {/* Timer */}
            <div className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-semibold text-gray-800">
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
                className={`font-mono font-bold tabular-nums ${urgent ? "text-red-600 animate-pulse" : ""}`}>
                {fmt(timeLeft)}
              </span>
            </div>

            {/* Notes button */}
            <button
              onClick={() => setShowNotesPanel(true)}
              className="flex items-center gap-1.5 border border-gray-300 rounded-md px-2.5 py-0.5 text-[12px] text-gray-600 hover:bg-gray-50 transition-colors relative">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Notes
              {notes.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {notes.length}
                </span>
              )}
            </button>

            <span className="text-[12px] text-gray-400 tabular-nums">
              {totalAnswered}/40
            </span>
          </div>

          {/* PART LABEL BAR */}
          {!focusMode && (
            <div className="flex items-baseline gap-2 bg-white border-b border-gray-200 px-4 py-2 shrink-0 w-full">
              <span className="text-[14px] font-bold text-gray-900">
                {PARTS[active].label}
              </span>
              <span className="text-[13px] text-gray-500">
                Questions {PARTS[active].qRange}
              </span>
            </div>
          )}

          {/* PROGRESS BAR */}
          <div className="h-0.75 bg-gray-100 shrink-0 w-full">
            <div
              className="h-full bg-gray-900 transition-all duration-500"
              style={{ width: `${(totalAnswered / 40) * 100}%` }}
            />
          </div>

          {/* SCROLLABLE CONTENT — full width, left-aligned */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto bg-white w-full">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6 pb-8 space-y-5">
              {active === 0 && (
                <>
                  <HighlightRoot
                    id="part-0"
                    highlights={highlights}
                    onSelect={handleSelect}>
                    <PartAudioBar
                      part={PARTS[0].label.replace("Part ", "")}
                      qRange={PARTS[0].qRange}
                      {...audioProps}
                    />
                    {listeningQuestions.section1.questions.map((block, idx) => (
                      <ListeningQuestionBlock
                        key={idx}
                        block={block}
                        highlights={highlights}
                        onChange={onChange}
                        onSelect={handleSelect}
                        submitted={submitted}
                        vals={vals}
                      />
                    ))}
                  </HighlightRoot>
                </>
              )}
              {active === 1 && (
                <>
                  <HighlightRoot
                    id="part-1"
                    highlights={highlights}
                    onSelect={handleSelect}>
                    <PartAudioBar
                      part={PARTS[1].label.replace("Part ", "")}
                      qRange={PARTS[1].qRange}
                      {...audioProps}
                    />
                    {listeningQuestions.section2.questions.map((block, idx) => (
                      <ListeningQuestionBlock
                        key={idx}
                        block={block}
                        highlights={highlights}
                        onChange={onChange}
                        onSelect={handleSelect}
                        submitted={submitted}
                        vals={vals}
                      />
                    ))}
                  </HighlightRoot>
                </>
              )}
              {active === 2 && (
                <>
                  <HighlightRoot
                    id="part-2"
                    highlights={highlights}
                    onSelect={handleSelect}>
                    <PartAudioBar
                      part={PARTS[2].label.replace("Part ", "")}
                      qRange={PARTS[2].qRange}
                      {...audioProps}
                    />
                    {listeningQuestions.section3.questions.map((block, idx) => (
                      <ListeningQuestionBlock
                        key={idx}
                        block={block}
                        highlights={highlights}
                        onChange={onChange}
                        onSelect={handleSelect}
                        submitted={submitted}
                        vals={vals}
                      />
                    ))}
                  </HighlightRoot>
                </>
              )}
              {active === 3 && (
                <>
                  <HighlightRoot
                    id="part-3"
                    highlights={highlights}
                    onSelect={handleSelect}>
                    <PartAudioBar
                      part={PARTS[3].label.replace("Part ", "")}
                      qRange={PARTS[3].qRange}
                      {...audioProps}
                    />
                    {listeningQuestions.section4.questions.map((block, idx) => (
                      <ListeningQuestionBlock
                        key={idx}
                        block={block}
                        highlights={highlights}
                        onChange={onChange}
                        onSelect={handleSelect}
                        submitted={submitted}
                        vals={vals}
                      />
                    ))}
                  </HighlightRoot>
                </>
              )}
            </div>
          </div>

          {/* BOTTOM NAV */}
          <BottomNav
            active={active}
            setActive={(i) => {
              setActive(i);
              scrollRef.current?.scrollTo({ top: 0 });
            }}
            vals={vals}
            onSubmit={handleSubmit}
            scrollToQuestion={scrollToQuestion}
            PARTS={[
              { label: "Part 1", qRange: "1–10", s: 1, e: 10 },
              { label: "Part 2", qRange: "11–20", s: 11, e: 20 },
              { label: "Part 3", qRange: "21–30", s: 21, e: 30 },
              { label: "Part 4", qRange: "31–40", s: 31, e: 40 },
            ]}
          />

          {/* SELECTION POPUP */}
          {selection && !showNoteModal && (
            <SelectionPopup
              selection={selection}
              isHighlighted={isHighlighted}
              onHighlight={handleHighlight}
              onClear={handleClear}
              onNote={handleNoteOpen}
              onDismiss={dismiss}
            />
          )}

          {/* NOTE MODAL */}
          {showNoteModal && (
            <NoteModal
              selection={pendingNoteSelection}
              existingNote=""
              onSave={handleNoteSave}
              onClose={() => setShowNoteModal(false)}
            />
          )}

          {/* NOTES PANEL */}
          {showNotesPanel && (
            <NotesPanel
              notes={notes}
              onDelete={handleNoteDelete}
              onClose={() => setShowNotesPanel(false)}
            />
          )}
        </>
      )}

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        .transition-ring { transition: box-shadow 0.3s; }
        ::highlight(app-highlight-part-0),
::highlight(app-highlight-part-1),
::highlight(app-highlight-part-2),
::highlight(app-highlight-part-3) {
  background-color: #fef08a;
  color: #713f12;
}
      `}</style>
    </div>
  );
}
