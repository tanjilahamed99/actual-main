// components/Test/IntroModal.jsx
import { MODULE_REGISTRY } from "@/features/Useteststore";

const MODULE_INTRO = {
  reading: {
    title: (num) => `Academic Reading — Test ${num}`,
    parts: "3 passages",
    questions: "40 questions",
    instructions: [
      "Read each passage carefully before answering the questions that follow it.",
      "Select any text in the passage to highlight it for reference.",
      "Drag headings directly onto the passage paragraphs where required.",
      "Use the Notes panel to record your thinking as you work.",
      "Use the part tabs at the bottom of the screen to move between passages.",
      "The timer continues after it reaches zero. You must click Submit to finish the test.",
    ],
    cta: "Start Test",
  },
  listening: {
    title: (num) => `Academic Listening — Test ${num}`,
    parts: "4 parts",
    questions: "40 questions",
    instructions: [
      "Each part shares a single continuous audio recording.",
      "The recording cannot be paused or replayed once it begins.",
      "Select any text to highlight it or add a note.",
      "Use the part tabs at the bottom of the screen to move between sections.",
      "Use the grid icon to jump directly to any question.",
      "The timer continues after it reaches zero. You must click Submit to finish the test.",
    ],
    cta: "Start Test",
  },
  writing: {
    title: (num) => `Academic Writing — Test ${num}`,
    parts: "2 tasks",
    questions: "150 / 250 words",
    instructions: [
      "Task 1 — Summarise the visual information in at least 150 words.",
      "Task 2 — Write an essay response in at least 250 words.",
      "Use the arrows at the bottom of the screen to move between tasks.",
      "Your word count is tracked automatically as you write.",
      "Select any prompt text to highlight it or add a note.",
      "The timer continues after it reaches zero. You must click Submit to finish the test.",
    ],
    cta: "Start Test",
  },
};

export default function IntroModal({ onStart, type, num }) {
  const config = MODULE_INTRO[type];
  const durationMin = MODULE_REGISTRY[type]?.durationMin;

  if (!config) return null;

  return (
    <div className="fixed inset-0 z-300 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg shadow-2xl">
        {/* ── Formal header bar, matches the in-test top bar ── */}
        <div className="flex items-center gap-2.5 bg-red-700 px-5 py-3">
          <span className="w-6 h-6 bg-white text-red-700 text-[13px] font-bold rounded-sm flex items-center justify-center shrink-0">
            E
          </span>
          <span className="text-white text-[13px] font-semibold tracking-wide">
            {config.title(num)}
          </span>
        </div>

        <div className="px-6 py-6 sm:px-7 sm:py-7">
          {/* ── Structured info row, not prose ── */}
          <div className="grid grid-cols-3 border border-gray-200 rounded-sm mb-6 divide-x divide-gray-200">
            <div className="px-3 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">
                Duration
              </p>
              <p className="text-[13px] font-semibold text-gray-900">
                {durationMin} min
              </p>
            </div>
            <div className="px-3 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">
                Format
              </p>
              <p className="text-[13px] font-semibold text-gray-900">
                {config.parts}
              </p>
            </div>
            <div className="px-3 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-0.5">
                Scope
              </p>
              <p className="text-[13px] font-semibold text-gray-900">
                {config.questions}
              </p>
            </div>
          </div>

          {/* ── Numbered instructions, exam-notice style ── */}
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">
            Instructions
          </p>
          <ol className="space-y-2.5 mb-7">
            {config.instructions.map((text, i) => (
              <li key={i} className="flex gap-2.5 text-[13px] text-gray-700 leading-relaxed">
                <span className="text-gray-400 font-mono text-[12px] shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ol>

          <button
            onClick={onStart}
            className="w-full py-3 bg-gray-900 text-white font-semibold text-[13px] tracking-wide rounded-sm hover:bg-gray-800 transition-colors">
            {config.cta}
          </button>
        </div>
      </div>
    </div>
  );
}