"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import {
  Clock,
  CheckCircle,
  Circle,
  ArrowLeft,
  Award,
  Volume2,
  LogOut,
} from "lucide-react";
import {
  SECTION_ORDER,
  useTestStore,
  selectSections,
  selectActiveSectionId,
  selectIsComplete,
} from "@/features/Useteststore";
import {
  ExitModal,
  ResultsSummary,
  SectionCard,
  useWritingEvals,
} from "@/components/Test/TestView/TestView";
import { useSessionInit } from "@/hooks/Usesessioninit";
import { SECTION_META } from "@/mock/SectionMeta";

export default function TestMainPage({
  testId,
  listeningAnswer,
  readingAnswer,
}) {
  const router = useRouter();
  const testTitle = `IELTS Full Mock Test ${testId}`;
  const testType = "Academic";
  const testBand = "6.5 – 7.5";

  const { resetSession } = useTestStore();
  const sections = useTestStore(selectSections);
  const activeSectionId = useTestStore(selectActiveSectionId);
  const isComplete = useTestStore(selectIsComplete);

  const { ready } = useSessionInit(testId, testTitle);

  // Writing scores/feedback live in the backend, set by the admin
  // panel once graded. Keyed by test number (t.testId) — same key
  // useTestStore's sessions use — NOT by the Mongo _id.
  const { writingEvals } = useWritingEvals();

  const completedCount = SECTION_ORDER.filter(
    (id) =>
      sections[id].status === "completed" || sections[id].status === "time-up",
  ).length;
  const progressPct = (completedCount / SECTION_ORDER.length) * 100;

  const testIsActive = SECTION_ORDER.some(
    (id) =>
      sections[id].status !== "locked" && sections[id].status !== "not-started",
  );

  const handleRetake = () => {
    resetSession(testId);
    // Re-init — useSessionInit will re-run automatically when testId changes,
    // but since testId is stable here, manually call initSession after reset:
    useTestStore.getState().initSession(testId, testTitle);
    toast.success("Test reset! You can start fresh.", { duration: 2000 });
  };

  // ── Exit guard (unchanged) ─────────────────────────────────
  const [showExitModal, setShowExitModal] = useState(false);
  const testIsActiveRef = useRef(false);
  const pendingNavRef = useRef("/full-test");
  const confirmedExitRef = useRef(false);
  testIsActiveRef.current = testIsActive;

  useEffect(() => {
    window.history.pushState({ testGuard: true }, "");
  }, []);

  useEffect(() => {
    const handle = () => {
      if (testIsActiveRef.current && !confirmedExitRef.current) {
        window.history.pushState({ testGuard: true }, "");
        pendingNavRef.current = "/full-test";
        setShowExitModal(true);
      }
    };
    window.addEventListener("popstate", handle);
    return () => window.removeEventListener("popstate", handle);
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (testIsActiveRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, []);

  const guardedNavigate = useCallback(
    (dest) => {
      if (testIsActiveRef.current) {
        pendingNavRef.current = dest;
        setShowExitModal(true);
      } else router.push(dest);
    },
    [router],
  );

  const handleExitConfirm = useCallback(() => {
    confirmedExitRef.current = true;
    setShowExitModal(false);
    setTimeout(() => router.push(pendingNavRef.current), 300);
  }, [router]);

  const handleExitCancel = useCallback(() => setShowExitModal(false), []);

  // ── Loading state while session is being fetched from server ─
  if (!ready) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#faf7f2" }}>
        <div className="flex flex-col items-center gap-3">
          {/* Simple spinner — replace with your design system's loader */}
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#c8963e", borderTopColor: "transparent" }}
          />
          <p className="text-sm font-medium" style={{ color: "#9ca3af" }}>
            Loading your test session…
          </p>
        </div>
      </div>
    );
  }

  // ── Render (identical to your original — only initSession useEffect removed) ──
  return (
    <>
      <Toaster
        position="top-center"
        expand={false}
        richColors
        toastOptions={{
          style: {
            fontFamily: "'Outfit', sans-serif",
            borderRadius: "16px",
            fontSize: "13px",
            border: "1px solid rgba(200,150,62,0.2)",
          },
        }}
      />

      <ExitModal
        open={showExitModal}
        onConfirm={handleExitConfirm}
        onCancel={handleExitCancel}
        hasProgress={testIsActive}
      />

      <div
        className="min-h-screen flex flex-col"
        style={{ background: "#faf7f2" }}>
        {/* ── STICKY TOP BAR ──────────────────────────────────── */}
        <div
          className="sticky top-0 z-40"
          style={{
            background: "rgba(8,16,30,0.97)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(200,150,62,0.15)",
          }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
            {/* Back */}
            <button
              onClick={() => guardedNavigate("/full-test")}
              className="flex items-center gap-1.5 text-sm font-medium shrink-0"
              style={{
                color: "rgba(255,255,255,0.5)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c8963e")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
              }>
              <ArrowLeft size={15} /> Back
            </button>

            {/* Test label */}
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-bold tracking-widest uppercase truncate"
                style={{ color: "#c8963e" }}>
                Mock Test — {String(testId).padStart(2, "0")}
              </p>
            </div>

            {/* Free Scoring badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0"
              style={{
                background: "rgba(200,150,62,0.15)",
                color: "#c8963e",
                border: "1px solid rgba(200,150,62,0.3)",
              }}>
              <Award size={12} /> Free Scoring
            </div>

            {/* Exit button */}
            <button
              onClick={() => guardedNavigate("/full-test")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shrink-0"
              style={{
                background: "rgba(245,101,101,0.12)",
                color: "#f87171",
                border: "1px solid rgba(245,101,101,0.25)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(245,101,101,0.22)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(245,101,101,0.12)")
              }>
              <LogOut size={13} /> Exit Test
            </button>
          </div>
        </div>

        {/* ── PROGRESS HEADER ─────────────────────────────────── */}
        <div
          className="border-b"
          style={{ background: "white", borderColor: "rgba(8,16,30,0.07)" }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5">
            {/* Title row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
                    style={{
                      background: "rgba(124,111,247,0.1)",
                      color: "#7c6ff7",
                      border: "1px solid rgba(124,111,247,0.25)",
                    }}>
                    {testType}
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      background: "rgba(200,150,62,0.1)",
                      color: "#c8963e",
                      border: "1px solid rgba(200,150,62,0.25)",
                    }}>
                    Band {testBand}
                  </span>
                </div>
                <h1
                  className="text-2xl sm:text-3xl font-bold"
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    color: "#08101e",
                  }}>
                  {testTitle}
                </h1>
              </div>

              {/* Total time box */}
              <div
                className="flex flex-col items-end shrink-0 gap-1 px-4 py-2.5 rounded-2xl"
                style={{
                  background: "rgba(8,16,30,0.03)",
                  border: "1px solid rgba(8,16,30,0.07)",
                }}>
                <div
                  className="flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: "#9ca3af" }}>
                  <Clock size={12} /> Total Time
                </div>
                <span
                  className="text-lg font-bold"
                  style={{ color: "#08101e" }}>
                  2h 45m
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#5a6272" }}>
                  Overall Progress
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: "#c8963e" }}>
                  {completedCount} / {SECTION_ORDER.length} sections
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(8,16,30,0.07)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${progressPct}%`,
                    background: "linear-gradient(90deg,#c8963e,#e8b96a)",
                    boxShadow:
                      progressPct > 0 ? "0 0 8px rgba(200,150,62,0.5)" : "none",
                  }}
                />
              </div>

              {/* Section step pills */}
              <div className="flex items-center gap-1.5 mt-3">
                {SECTION_META.map((meta, i) => {
                  const st = sections[meta.id].status;
                  const done = st === "completed" || st === "time-up";
                  const active = activeSectionId === meta.id;
                  return (
                    <div
                      key={meta.id}
                      className="flex items-center gap-1.5 flex-1">
                      <div
                        className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-300"
                        style={{
                          background: done
                            ? "rgba(34,201,138,0.1)"
                            : active
                              ? meta.accentBg
                              : "rgba(8,16,30,0.03)",
                          border: `1px solid ${done ? "rgba(34,201,138,0.25)" : active ? meta.accentBorder : "rgba(8,16,30,0.06)"}`,
                        }}>
                        {done ? (
                          <CheckCircle
                            size={11}
                            style={{ color: "#22c98a", flexShrink: 0 }}
                          />
                        ) : (
                          <Circle
                            size={11}
                            style={{
                              color: active ? meta.accent : "#d1d5db",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <span
                          className="text-[10px] font-bold truncate"
                          style={{
                            color: done
                              ? "#22c98a"
                              : active
                                ? meta.accent
                                : "#9ca3af",
                          }}>
                          {meta.name}
                        </span>
                      </div>
                      {i < SECTION_META.length - 1 && (
                        <div
                          className="w-3 h-px shrink-0"
                          style={{
                            background: done
                              ? "rgba(34,201,138,0.4)"
                              : "rgba(8,16,30,0.1)",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION CARDS OR RESULTS ─────────────────────────── */}
        <main className="flex-1 py-8 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            {isComplete ? (
              <ResultsSummary
                onRetake={handleRetake}
                LISTENING_ANSWER_KEY={listeningAnswer}
                READING_ANSWER_KEY={readingAnswer}
                writingEval={writingEvals[testId]}
              />
            ) : (
              <>
                {/* Exam tip banner */}
                <div
                  className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
                  style={{
                    background: "rgba(200,150,62,0.07)",
                    border: "1px solid rgba(200,150,62,0.2)",
                  }}>
                  <Volume2
                    size={15}
                    style={{ color: "#c8963e", flexShrink: 0, marginTop: 1 }}
                  />
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#5a6272" }}>
                    <strong style={{ color: "#c8963e" }}>Exam tip:</strong>{" "}
                    Complete sections in order. Each section unlocks after the
                    previous one is submitted. Your answers are saved
                    automatically — you can leave and return.
                  </p>
                </div>

                {SECTION_META.map((meta) => (
                  <SectionCard
                    key={meta.id}
                    meta={meta}
                    testId={testId}
                    listeningAnswer={listeningAnswer}
                    readingAnswer={readingAnswer}
                    writingEval={writingEvals[testId]}
                  />
                ))}
              </>
            )}
            <div className="h-8" />
          </div>
        </main>
      </div>
    </>
  );
}