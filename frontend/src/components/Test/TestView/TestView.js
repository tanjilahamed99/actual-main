"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Headphones,
  BookOpen,
  PenLine,
  Clock,
  CheckCircle,
  ChevronRight,
  Play,
  Lock,
  Info,
  Award,
  AlertTriangle,
  X,
  LogOut,
  RotateCcw,
} from "lucide-react";
import {
  SECTION_ORDER,
  useTestStore,
  makeInitialSections,
} from "@/features/Useteststore";
import { getMyTests } from "@/action/test";

function normalise(s) {
  return (s || "").toLowerCase().trim().replace(/\s+/g, " ");
}

function calculateScore(answers, answerKey) {
  let correct = 0;
  let total = 0;

  Object.entries(answerKey).forEach(([qNum, correctAnswer]) => {
    total++;
    const userAnswer = answers[`question_${qNum}`];

    if (!userAnswer) return;

    if (Array.isArray(correctAnswer)) {
      const normalisedCorrects = correctAnswer.map(normalise);
      if (normalisedCorrects.includes(normalise(userAnswer))) {
        correct++;
      }
    } else {
      if (normalise(userAnswer) === normalise(correctAnswer)) {
        correct++;
      }
    }
  });

  return {
    score: correct,
    total,
    percentage: Math.round((correct / total) * 100),
  };
}

function getAnsweredCount(answers) {
  return Object.values(answers).filter(
    (a) => a !== null && a !== "" && a !== undefined,
  ).length;
}

// ── IELTS BAND CONVERSION TABLES ──────────────────────────────
const LISTENING_BAND_TABLE = [
  { min: 39, band: 9.0 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8.0 },
  { min: 32, band: 7.5 },
  { min: 30, band: 7.0 },
  { min: 26, band: 6.5 },
  { min: 23, band: 6.0 },
  { min: 18, band: 5.5 },
  { min: 16, band: 5.0 },
  { min: 13, band: 4.5 },
  { min: 11, band: 4.0 },
  { min: 8, band: 3.5 },
  { min: 6, band: 3.0 },
  { min: 4, band: 2.5 },
  { min: 2, band: 2.0 },
  { min: 1, band: 1.5 },
  { min: 0, band: 1.0 },
];

const READING_BAND_TABLE = [
  { min: 39, band: 9.0 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8.0 },
  { min: 33, band: 7.5 },
  { min: 30, band: 7.0 },
  { min: 27, band: 6.5 },
  { min: 23, band: 6.0 },
  { min: 19, band: 5.5 },
  { min: 15, band: 5.0 },
  { min: 13, band: 4.5 },
  { min: 10, band: 4.0 },
  { min: 8, band: 3.5 },
  { min: 6, band: 3.0 },
  { min: 4, band: 2.5 },
  { min: 2, band: 2.0 },
  { min: 1, band: 1.5 },
  { min: 0, band: 1.0 },
];

function rawToBand(rawScore, table) {
  for (const row of table) {
    if (rawScore >= row.min) return row.band;
  }
  return table[table.length - 1].band;
}

function roundIELTSBand(avg) {
  const whole = Math.floor(avg);
  const remainder = avg - whole;
  if (remainder < 0.25) return whole;
  if (remainder < 0.75) return whole + 0.5;
  return whole + 1;
}

function formatBand(band) {
  return band.toFixed(1);
}

const BAND_DESCRIPTIONS = {
  9: "Expert user",
  8.5: "Very good user",
  8: "Very good user",
  7.5: "Good user",
  7: "Good user",
  6.5: "Competent user",
  6: "Competent user",
  5.5: "Modest user",
  5: "Modest user",
  4.5: "Limited user",
  4: "Limited user",
  3.5: "Extremely limited user",
  3: "Extremely limited user",
  2.5: "Intermittent user",
  2: "Intermittent user",
  1.5: "Non user",
  1: "Non user",
};

function getBandDescription(band) {
  return BAND_DESCRIPTIONS[band] ?? "Non user";
}

// ─── Shared hook: fetch + key writing evaluations by testId ──
// Same fix as the dashboard: backend attempts are keyed by test
// number (t.testId, e.g. "1"), NOT by t._id. Keying by testId
// matches how `sessions` in useTestStore is keyed, so lookups
// like `writingEvals[testId]` actually resolve.
export function useWritingEvals() {
  const [writingEvals, setWritingEvals] = useState({});
  const [writingEvalsLoading, setWritingEvalsLoading] = useState(true);

  const reload = useCallback(async () => {
    setWritingEvalsLoading(true);
    try {
      const { data } = await getMyTests();
      const map = {};
      (data?.tests ?? []).forEach((t) => {
        map[t.testId] = {
          writingStatus: t.writingStatus,
          writingEvaluation: t.writingEvaluation,
        };
      });
      setWritingEvals(map);
    } catch (err) {
      console.error("Failed to load writing evaluations", err);
    } finally {
      setWritingEvalsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { writingEvals, writingEvalsLoading, reload };
}

// ─── Status badge config ──────────────────────────────────────

function statusStyle(s) {
  const map = {
    "not-started": {
      label: "Not Started",
      color: "#9ca3af",
      bg: "rgba(156,163,175,0.08)",
      border: "rgba(156,163,175,0.2)",
    },
    "in-progress": {
      label: "In Progress",
      color: "#f5a623",
      bg: "rgba(245,166,35,0.1)",
      border: "rgba(245,166,35,0.3)",
    },
    completed: {
      label: "Completed",
      color: "#22c98a",
      bg: "rgba(34,201,138,0.1)",
      border: "rgba(34,201,138,0.3)",
    },
    "time-up": {
      label: "Time Up",
      color: "#f56565",
      bg: "rgba(245,101,101,0.1)",
      border: "rgba(245,101,101,0.3)",
    },
    locked: {
      label: "Locked",
      color: "#9ca3af",
      bg: "rgba(156,163,175,0.08)",
      border: "rgba(156,163,175,0.2)",
    },
  };
  return map[s] ?? map["locked"];
}

// ─── Exit Modal ───────────────────────────────────────────────

export function ExitModal({ open, onConfirm, onCancel, hasProgress }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: "rgba(8,16,30,0.75)",
          backdropFilter: "blur(8px)",
        }}
        onClick={onCancel}>
        <div
          className="relative w-full max-w-md rounded-3xl overflow-hidden"
          style={{
            background: "white",
            boxShadow: "0 32px 80px rgba(8,16,30,0.25)",
            animation: "modalPop 0.3s cubic-bezier(0.22,1,0.36,1) forwards",
          }}
          onClick={(e) => e.stopPropagation()}>
          <div
            className="h-1 w-full"
            style={{
              background: "linear-gradient(90deg,#c8963e,#e8b96a,#c8963e)",
              backgroundSize: "200% auto",
              animation: "shimmer 4s linear infinite",
            }}
          />
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(8,16,30,0.06)",
              border: "1px solid rgba(8,16,30,0.08)",
              cursor: "pointer",
            }}>
            <X size={14} style={{ color: "#9ca3af" }} />
          </button>

          <div className="px-8 pt-8 pb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{
                background: "rgba(245,101,101,0.1)",
                border: "1.5px solid rgba(245,101,101,0.25)",
              }}>
              <AlertTriangle size={24} style={{ color: "#f56565" }} />
            </div>

            <h2
              className="text-2xl font-bold mb-2"
              style={{
                fontFamily: "'DM Serif Display', serif",
                color: "#08101e",
              }}>
              Exit Test?
            </h2>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "#5a6272" }}>
              {hasProgress
                ? "You are in the middle of a test. Leaving will not delete your progress — you can resume later."
                : "Are you sure you want to exit the test?"}
            </p>

            {hasProgress && (
              <div
                className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-5"
                style={{
                  background: "rgba(200,150,62,0.07)",
                  border: "1px solid rgba(200,150,62,0.2)",
                }}>
                <Info
                  size={13}
                  style={{ color: "#c8963e", flexShrink: 0, marginTop: 1 }}
                />
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "#c8963e" }}>
                  Your answers are <strong>auto-saved</strong>. You can return
                  to this test and continue from where you left off.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold"
                style={{
                  background: "rgba(8,16,30,0.05)",
                  color: "#08101e",
                  border: "1.5px solid rgba(8,16,30,0.1)",
                  cursor: "pointer",
                }}>
                Continue Test
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold"
                style={{
                  background: "linear-gradient(135deg,#f56565,#fc8181)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(245,101,101,0.35)",
                }}>
                <LogOut size={14} /> Yes, Exit
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
        @keyframes shimmer {
          0%   { background-position: 0%   center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </>
  );
}

// ─── Countdown Badge ──────────────────────────────────────────

function CountdownBadge({ secondsLeft, totalSeconds }) {
  const m = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const s = String(secondsLeft % 60).padStart(2, "0");
  const urgent = secondsLeft < 300;
  const pct = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;

  return (
    <div className="flex flex-col items-end gap-1">
      <span
        className="text-xl font-bold tabular-nums"
        style={{ color: urgent ? "#f56565" : "#c8963e" }}>
        {m}:{s}
      </span>
      <div
        className="w-24 h-1 rounded-full overflow-hidden"
        style={{ background: "rgba(8,16,30,0.08)" }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: urgent
              ? "linear-gradient(90deg,#f56565,#fc8181)"
              : "linear-gradient(90deg,#c8963e,#e8b96a)",
            transition: "width 1s linear",
          }}
        />
      </div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────
// NEW: accepts `writingEval` ({ writingStatus, writingEvaluation })
// for this specific testId, fetched via useWritingEvals() in the
// parent page and passed down as writingEvals[testId].
export function SectionCard({
  meta,
  testId,
  readingAnswer,
  listeningAnswer,
  writingEval,
}) {
  const router = useRouter();
  const { sessions, activeTestId, startSection } = useTestStore();

  const session = sessions[activeTestId] ?? null;
  const sectionState = session?.sections[meta.id] ?? {
    status: "locked",
    answers: {},
    secondsLeft: meta.durationMin * 60,
  };

  const status = sectionState.status;
  const st = statusStyle(status);
  const answers = sectionState.answers;
  const answeredCount = getAnsweredCount(answers);

  const locked = status === "locked";
  const completed = status === "completed" || status === "time-up";
  const inProgress = status === "in-progress";
  const notStarted = status === "not-started";

  const [expanded, setExpanded] = useState(notStarted || inProgress);
  const Icon = meta.icon;

  // Score + band calculation for completed sections
  let scoreDisplay = null;
  if (completed && meta.id === "listening") {
    const { score, total } = calculateScore(answers, listeningAnswer);
    const band = rawToBand(score, LISTENING_BAND_TABLE);
    scoreDisplay = { correct: score, total, answered: answeredCount, band };
  } else if (completed && meta.id === "reading") {
    const { score, total } = calculateScore(answers, readingAnswer);
    const band = rawToBand(score, READING_BAND_TABLE);
    scoreDisplay = { correct: score, total, answered: answeredCount, band };
  } else if (completed && meta.id === "writing") {
    const writingReviewed = writingEval?.writingStatus === "reviewed";
    scoreDisplay = writingReviewed
      ? {
          band: writingEval.writingEvaluation.overallBand,
          answered: answeredCount,
          reviewed: true,
          feedback: writingEval.writingEvaluation.feedback,
        }
      : { pending: true, answered: answeredCount };
  }

  useEffect(() => {
    if (notStarted || inProgress) setExpanded(true);
  }, [status, notStarted, inProgress]);

  function handleStart() {
    startSection(meta.id);
    toast.success(`${meta.name} section started!`, {
      description: "Your timer is now running. Good luck!",
      duration: 2500,
    });
    router.push(`/full-test/${testId}/${meta.id}`);
  }

  function handleContinue() {
    router.push(`/full-test/${testId}/${meta.id}`);
  }

  function handleRetake() {
    startSection(meta.id);
    router.push(`/full-test/${testId}/${meta.id}`);
  }

  return (
    <div
      className="rounded-3xl border overflow-hidden transition-all duration-300"
      style={{
        background: "white",
        borderColor: inProgress
          ? meta.accentBorder
          : completed
            ? "rgba(34,201,138,0.25)"
            : "rgba(8,16,30,0.08)",
        boxShadow: inProgress
          ? `0 8px 32px rgba(8,16,30,0.08), 0 0 0 1px ${meta.accentBorder}`
          : "0 2px 8px rgba(8,16,30,0.04)",
        opacity: locked ? 0.5 : 1,
      }}>
      {/* ── Card header ── */}
      <button
        onClick={() => !locked && setExpanded((e) => !e)}
        disabled={locked}
        className="w-full flex items-center gap-4 px-6 py-5 text-left"
        style={{
          background: inProgress
            ? meta.accentBg
            : completed
              ? "rgba(34,201,138,0.04)"
              : "transparent",
          cursor: locked ? "default" : "pointer",
          border: "none",
        }}>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: completed
              ? "rgba(34,201,138,0.12)"
              : inProgress
                ? meta.accentBg
                : "rgba(8,16,30,0.04)",
            border: `1.5px solid ${completed ? "rgba(34,201,138,0.3)" : inProgress ? meta.accentBorder : "rgba(8,16,30,0.08)"}`,
          }}>
          {completed ? (
            <CheckCircle size={20} style={{ color: "#22c98a" }} />
          ) : locked ? (
            <Lock size={18} style={{ color: "#9ca3af" }} />
          ) : (
            <Icon
              size={20}
              style={{ color: inProgress ? meta.accent : "#9ca3af" }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span
              className="text-[10px] font-bold tracking-widest uppercase"
              style={{ color: "#9ca3af" }}>
              Section {SECTION_ORDER.indexOf(meta.id) + 1}
            </span>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                color: st.color,
                background: st.bg,
                border: `1px solid ${st.border}`,
              }}>
              {inProgress && (
                <span
                  className="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse"
                  style={{ background: "#f5a623", display: "inline-block" }}
                />
              )}
              {st.label}
            </span>
            {completed && scoreDisplay?.band != null && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  color: meta.accent,
                  background: meta.accentBg,
                  border: `1px solid ${meta.accentBorder}`,
                }}>
                Band {formatBand(scoreDisplay.band)}
              </span>
            )}
            {completed &&
              meta.id === "writing" &&
              scoreDisplay?.pending && (
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    color: "#f5a623",
                    background: "rgba(245,166,35,0.1)",
                    border: "1px solid rgba(245,166,35,0.3)",
                  }}>
                  Awaiting Review
                </span>
              )}
          </div>
          <h3
            className="font-bold text-base leading-tight"
            style={{
              color: "#08101e",
              fontFamily: "'DM Serif Display', serif",
            }}>
            {meta.fullName}
          </h3>
          <div
            className="flex flex-wrap gap-3 mt-1 text-xs"
            style={{ color: "#9ca3af" }}>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {meta.duration}
            </span>
            <span className="flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: meta.accent }}
              />
              {meta.questions} {meta.questions === 1 ? "task" : "questions"}
            </span>
          </div>
        </div>

        <div className="shrink-0">
          {inProgress ? (
            <CountdownBadge
              secondsLeft={sectionState.secondsLeft}
              totalSeconds={meta.durationMin * 60}
            />
          ) : (
            <ChevronRight
              size={18}
              style={{
                color: "#9ca3af",
                transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.25s ease",
              }}
            />
          )}
        </div>
      </button>

      {/* ── Expandable body ── */}
      <div
        style={{
          maxHeight: expanded && !locked ? 600 : 0,
          overflow: "hidden",
          transition: "max-height 0.45s cubic-bezier(0.22,1,0.36,1)",
        }}>
        <div className="px-6 pb-6">
          <div
            className="h-px mb-5"
            style={{ background: "rgba(8,16,30,0.06)" }}
          />

          <p
            className="text-sm leading-relaxed mb-5"
            style={{ color: "#5a6272" }}>
            {meta.description}
          </p>

          {completed && scoreDisplay && (
            <div
              className="rounded-2xl p-4 mb-5"
              style={{
                background: meta.accentBg,
                border: `1px solid ${meta.accentBorder}`,
              }}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} style={{ color: "#22c98a" }} />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#22c98a" }}>
                    Section Completed
                  </span>
                </div>
                <div className="text-sm">
                  <span style={{ color: "#5a6272" }}>Questions answered: </span>
                  <span className="font-bold" style={{ color: meta.accent }}>
                    {scoreDisplay.answered} / {meta.questions}
                  </span>
                </div>
                {"correct" in scoreDisplay && (
                  <div className="text-sm">
                    <span style={{ color: "#5a6272" }}>Correct answers: </span>
                    <span className="font-bold" style={{ color: "#22c98a" }}>
                      {scoreDisplay.correct} / {scoreDisplay.total}
                    </span>
                  </div>
                )}
                {"band" in scoreDisplay && scoreDisplay.band != null && (
                  <div className="text-sm">
                    <span style={{ color: "#5a6272" }}>Band score: </span>
                    <span className="font-bold" style={{ color: meta.accent }}>
                      {formatBand(scoreDisplay.band)}
                    </span>
                  </div>
                )}
                {"pending" in scoreDisplay && (
                  <div className="text-sm">
                    <span
                      className="font-semibold"
                      style={{ color: "#f5a623" }}>
                      Pending Review
                    </span>
                  </div>
                )}
              </div>

              {/* Writing feedback, shown once reviewed */}
              {meta.id === "writing" && scoreDisplay.reviewed && (
                <div
                  className="mt-4 pt-4"
                  style={{ borderTop: `1px solid ${meta.accentBorder}` }}>
                  {scoreDisplay.feedback && (
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#5a6272" }}>
                      {scoreDisplay.feedback}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div
            className="rounded-2xl p-4 mb-5"
            style={{
              background: "rgba(8,16,30,0.025)",
              border: "1px solid rgba(8,16,30,0.07)",
            }}>
            <div className="flex items-center gap-2 mb-3">
              <Info size={13} style={{ color: "#c8963e" }} />
              <span
                className="text-xs font-bold tracking-wider uppercase"
                style={{ color: "#c8963e" }}>
                Test Instructions
              </span>
            </div>
            <ul className="flex flex-col gap-2">
              {meta.instructions.map((inst, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs leading-relaxed"
                  style={{ color: "#5a6272" }}>
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold"
                    style={{
                      background: meta.accentBg,
                      color: meta.accent,
                      border: `1px solid ${meta.accentBorder}`,
                    }}>
                    {i + 1}
                  </span>
                  {inst}
                </li>
              ))}
            </ul>
          </div>

          {completed ? (
            <div className="flex items-center gap-3 flex-wrap">
              <div
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold"
                style={{
                  background: "rgba(34,201,138,0.1)",
                  color: "#22c98a",
                  border: "1px solid rgba(34,201,138,0.25)",
                }}>
                <CheckCircle size={15} /> Section Completed
              </div>
              <button
                onClick={handleRetake}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold"
                style={{
                  background: "rgba(8,16,30,0.06)",
                  color: "#5a6272",
                  border: "1px solid rgba(8,16,30,0.08)",
                  cursor: "pointer",
                }}>
                <RotateCcw size={14} /> Retake
              </button>
            </div>
          ) : inProgress ? (
            <button
              onClick={handleContinue}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold"
              style={{
                background: `linear-gradient(135deg,${meta.accent},${meta.accent}dd)`,
                color: "white",
                border: "none",
                cursor: "pointer",
                boxShadow: `0 6px 20px ${meta.accent}40`,
              }}>
              <Play size={14} /> Continue Test <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold"
              style={{
                background: `linear-gradient(135deg,${meta.accent},${meta.accent}dd)`,
                color: "white",
                border: "none",
                cursor: "pointer",
                boxShadow: `0 6px 20px ${meta.accent}40`,
              }}>
              <Play size={14} /> Start Test <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Results Summary ──────────────────────────────────────────
// NEW: accepts `writingEval` for the active session's testId.
// Overall Band remains Listening+Reading only (matches your
// existing disclaimer copy at the bottom) — Writing is now shown
// with its real band once reviewed, instead of being hardcoded
// to "Pending" forever.
export function ResultsSummary({
  onRetake,
  LISTENING_ANSWER_KEY,
  READING_ANSWER_KEY,
  writingEval,
}) {
  const { sessions, activeTestId } = useTestStore();
  const session = sessions[activeTestId];

  if (!session) return null;

  const { sections } = session;

  const listeningAnswers = sections.listening.answers;
  const listeningScore = calculateScore(listeningAnswers, LISTENING_ANSWER_KEY);
  const listeningAnswered = getAnsweredCount(listeningAnswers);
  const listeningBand = rawToBand(listeningScore.score, LISTENING_BAND_TABLE);

  const readingAnswers = sections.reading.answers;
  const readingScore = calculateScore(readingAnswers, READING_ANSWER_KEY);
  const readingAnswered = getAnsweredCount(readingAnswers);
  const readingBand = rawToBand(readingScore.score, READING_BAND_TABLE);

  const writingAnswers = sections.writing.answers;
  const writingAnswered = getAnsweredCount(writingAnswers);
  const writingCompleted =
    sections.writing.status === "completed" ||
    sections.writing.status === "time-up";

  const writingReviewed = writingEval?.writingStatus === "reviewed";
  const writingBand = writingReviewed
    ? writingEval.writingEvaluation.overallBand
    : null;
  const writingFeedback = writingReviewed
    ? writingEval.writingEvaluation.feedback
    : null;

  const totalScore = listeningScore.score + readingScore.score;
  const totalPossible = listeningScore.total + readingScore.total;

  const rawAverage = (listeningBand + readingBand) / 2;
  const overallBand = roundIELTSBand(rawAverage);
  const bandDescription = getBandDescription(overallBand);

  return (
    <div
      className="rounded-3xl p-8"
      style={{
        background: "#08101e",
        border: "1px solid rgba(200,150,62,0.2)",
      }}>
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{
            background: "rgba(200,150,62,0.12)",
            border: "1.5px solid rgba(200,150,62,0.3)",
          }}>
          <Award size={36} style={{ color: "#c8963e" }} />
        </div>
        <h2
          className="text-3xl mb-2"
          style={{ fontFamily: "'DM Serif Display', serif", color: "white" }}>
          Test Completed! 🎉
        </h2>
        <p className="text-sm mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>
          You have successfully completed all sections. Here&apos;s your
          performance summary.
        </p>

        <div
          className="inline-flex flex-col items-center gap-1 px-8 py-4 rounded-2xl mt-4"
          style={{
            background: "rgba(200,150,62,0.1)",
            border: "1px solid rgba(200,150,62,0.25)",
          }}>
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "rgba(200,150,62,0.7)" }}>
            Estimated Band Score (L+R)
          </span>
          <span className="text-5xl font-bold" style={{ color: "#c8963e" }}>
            {formatBand(overallBand)}
          </span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {bandDescription} · {totalScore}/{totalPossible} correct
          </span>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Listening */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(124,111,247,0.1)",
            border: "1px solid rgba(124,111,247,0.2)",
          }}>
          <div className="flex items-center gap-3 mb-3">
            <Headphones size={20} style={{ color: "#7c6ff7" }} />
            <h3 className="text-base font-bold text-white">Listening</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold" style={{ color: "#7c6ff7" }}>
              {listeningScore.score}/40
            </p>
            <span
              className="text-sm font-bold px-2 py-0.5 rounded-md"
              style={{
                background: "rgba(124,111,247,0.15)",
                color: "#7c6ff7",
              }}>
              Band {formatBand(listeningBand)}
            </span>
          </div>
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.5)" }}>
            Answered: {listeningAnswered}/40 · Correct: {listeningScore.score}
          </p>
          <div
            className="mt-3 h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${listeningScore.percentage}%`,
                background: "#7c6ff7",
              }}
            />
          </div>
          <p className="text-xs mt-1.5" style={{ color: "#7c6ff7" }}>
            {listeningScore.percentage}% Score
          </p>
        </div>

        {/* Reading */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(59,158,255,0.1)",
            border: "1px solid rgba(59,158,255,0.2)",
          }}>
          <div className="flex items-center gap-3 mb-3">
            <BookOpen size={20} style={{ color: "#3b9eff" }} />
            <h3 className="text-base font-bold text-white">Reading</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold" style={{ color: "#3b9eff" }}>
              {readingScore.score}/40
            </p>
            <span
              className="text-sm font-bold px-2 py-0.5 rounded-md"
              style={{
                background: "rgba(59,158,255,0.15)",
                color: "#3b9eff",
              }}>
              Band {formatBand(readingBand)}
            </span>
          </div>
          <p
            className="text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.5)" }}>
            Answered: {readingAnswered}/40 · Correct: {readingScore.score}
          </p>
          <div
            className="mt-3 h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${readingScore.percentage}%`,
                background: "#3b9eff",
              }}
            />
          </div>
          <p className="text-xs mt-1.5" style={{ color: "#3b9eff" }}>
            {readingScore.percentage}% Score
          </p>
        </div>

        {/* Writing */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(34,201,138,0.1)",
            border: "1px solid rgba(34,201,138,0.2)",
          }}>
          <div className="flex items-center gap-3 mb-3">
            <PenLine size={20} style={{ color: "#22c98a" }} />
            <h3 className="text-base font-bold text-white">Writing</h3>
          </div>

          {writingReviewed ? (
            <>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold" style={{ color: "#22c98a" }}>
                  Band {formatBand(writingBand)}
                </p>
              </div>
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.5)" }}>
                Tasks submitted: {writingAnswered}/2
              </p>
              <div
                className="mt-3 h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.1)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(writingBand / 9) * 100}%`,
                    background: "#22c98a",
                  }}
                />
              </div>
              <p className="text-xs mt-1.5" style={{ color: "#22c98a" }}>
                Reviewed by an expert
              </p>
              {writingFeedback && (
                <p
                  className="text-xs mt-2 leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.6)" }}>
                  {writingFeedback}
                </p>
              )}
            </>
          ) : writingCompleted ? (
            <>
              <p className="text-2xl font-bold" style={{ color: "#f5a623" }}>
                Pending
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "rgba(255,255,255,0.5)" }}>
                Tasks submitted: {writingAnswered}/2
              </p>
              <div
                className="mt-3 h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.1)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: "100%", background: "#f5a623" }}
                />
              </div>
              <p className="text-xs mt-1.5" style={{ color: "#f5a623" }}>
                Awaiting Expert Review
              </p>
            </>
          ) : (
            <p
              className="text-xl font-bold"
              style={{ color: "rgba(255,255,255,0.3)" }}>
              Not Started
            </p>
          )}
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold"
          style={{
            background: "linear-gradient(135deg,#c8963e,#e8b96a)",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}>
          <RotateCcw size={14} /> Retake Full Test
        </button>
        <Link
          href="/#contact"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}>
          Get Expert Writing Feedback →
        </Link>
      </div>

      <p
        className="text-xs text-center mt-5"
        style={{ color: "rgba(255,255,255,0.3)" }}>
        * Overall Band Score (L+R) is the average of Listening and Reading
        bands, rounded per IELTS convention, and does not include Writing.
        Writing is scored separately once an expert has reviewed your
        submission.
      </p>
    </div>
  );
}