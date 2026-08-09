"use client";

import { useState } from "react";
import {
  QUESTION_TYPES,
  QUESTION_TEMPLATES,
  emptyPassage,
} from "@/lib/questionTemplates";

const HEADINGS_LIST_PLACEHOLDER = `[
  { "id": "i", "text": "Early years" },
  { "id": "ii", "text": "A change of focus" }
]`;

const PARAGRAPH_QUESTIONS_PLACEHOLDER = `{
  "A": 14,
  "B": 15,
  "C": 16
}`;

function blankPassage(n) {
  return { ...emptyPassage(n), headingsListText: "", paragraphQuestionsText: "" };
}

// Converts a saved test document (from the API) into this form's editable state.
export function testToFormState(test) {
  return {
    testNumber: String(test.testNumber ?? ""),
    title: test.title ?? "",
    priority: test.priority ?? "main",
    status: test.status ?? "draft",
    answersJson: JSON.stringify(test.answers ?? {}, null, 2),
    passages: (test.questions ?? []).map((pg) => ({
      id: pg.id,
      label: pg.label ?? "",
      title: pg.title ?? "",
      subtitle: pg.subtitle ?? "",
      text: pg.text ?? "",
      headingsListText: pg.headingsList
        ? JSON.stringify(pg.headingsList, null, 2)
        : "",
      paragraphQuestionsText: pg.paragraphQuestions
        ? JSON.stringify(pg.paragraphQuestions, null, 2)
        : "",
      questions: (pg.questions ?? []).map((block) => ({
        type: block.type,
        json: JSON.stringify(block, null, 2),
      })),
    })),
  };
}

const DEFAULT_STATE = {
  testNumber: "",
  title: "",
  priority: "main",
  status: "draft",
  answersJson: "{\n  \n}",
  passages: [blankPassage(1)],
};

export default function ReadingTestForm({
  initialValues,
  onSubmit,
  submitLabel = "Save test",
}) {
  const [form, setForm] = useState(initialValues ?? DEFAULT_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const updatePassage = (idx, patch) =>
    setForm((f) => ({
      ...f,
      passages: f.passages.map((pg, i) => (i === idx ? { ...pg, ...patch } : pg)),
    }));

  const addPassage = () =>
    setForm((f) => ({ ...f, passages: [...f.passages, blankPassage(f.passages.length + 1)] }));

  const removePassage = (idx) =>
    setForm((f) => ({ ...f, passages: f.passages.filter((_, i) => i !== idx) }));

  const addBlock = (passageIdx, type) => {
    if (!type) return;
    const json = JSON.stringify(QUESTION_TEMPLATES[type], null, 2);
    setForm((f) => ({
      ...f,
      passages: f.passages.map((pg, i) =>
        i === passageIdx ? { ...pg, questions: [...pg.questions, { type, json }] } : pg
      ),
    }));
  };

  const updateBlockJson = (passageIdx, blockIdx, json) =>
    setForm((f) => ({
      ...f,
      passages: f.passages.map((pg, i) =>
        i === passageIdx
          ? { ...pg, questions: pg.questions.map((q, j) => (j === blockIdx ? { ...q, json } : q)) }
          : pg
      ),
    }));

  const removeBlock = (passageIdx, blockIdx) =>
    setForm((f) => ({
      ...f,
      passages: f.passages.map((pg, i) =>
        i === passageIdx ? { ...pg, questions: pg.questions.filter((_, j) => j !== blockIdx) } : pg
      ),
    }));

  function buildPayload() {
    const nextErrors = {};

    let parsedAnswers;
    try {
      parsedAnswers = JSON.parse(form.answersJson);
    } catch {
      nextErrors.answers = 'Answer key must be valid JSON, e.g. { "1": "TRUE" }.';
    }

    if (!form.testNumber || !form.title) {
      nextErrors.meta = "Test number and title are required.";
    }

    const builtPassages = form.passages.map((pg, i) => {
      if (pg.questions.length === 0) {
        nextErrors[`passage-${i}`] = "Add at least one question block to this passage.";
      }

      const builtQuestions = pg.questions.map((q, j) => {
        try {
          return JSON.parse(q.json);
        } catch {
          nextErrors[`block-${i}-${j}`] = "Invalid JSON in this block.";
          return null;
        }
      });

      let headingsList = null;
      const headingsText = (pg.headingsListText ?? "").trim();
      if (headingsText) {
        try {
          headingsList = JSON.parse(headingsText);
        } catch {
          nextErrors[`headingsList-${i}`] = "Invalid JSON in headings list.";
        }
      }

      let paragraphQuestions = null;
      const paragraphText = (pg.paragraphQuestionsText ?? "").trim();
      if (paragraphText) {
        try {
          paragraphQuestions = JSON.parse(paragraphText);
        } catch {
          nextErrors[`paragraphQuestions-${i}`] = "Invalid JSON in paragraph → question mapping.";
        }
      }

      return {
        id: pg.id,
        label: pg.label,
        title: pg.title,
        subtitle: pg.subtitle,
        text: pg.text,
        headingsList,
        paragraphQuestions,
        questions: builtQuestions,
      };
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return null;

    return {
      testNumber: Number(form.testNumber),
      title: form.title,
      priority: form.priority,
      status: form.status,
      answers: parsedAnswers,
      questions: builtPassages,
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = buildPayload();
    if (!payload) return;

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err.response?.data?.message || err.message || "Network error — try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-24 font-sans text-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-cream">
          {initialValues ? "Edit reading test" : "New reading test"}
        </h1>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-gold px-5 py-2.5 font-semibold text-indigo-deep transition-all duration-200 hover:bg-gold-soft disabled:opacity-50"
        >
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>

      {errors.submit && <p className="text-red-400">{errors.submit}</p>}
      {errors.meta && <p className="text-red-400">{errors.meta}</p>}

      {/* Test meta */}
      <section className="grid gap-4 rounded-2xl border border-gray-500 p-5 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-muted">Test number</span>
          <input
            value={form.testNumber}
            onChange={(e) => set({ testNumber: e.target.value })}
            type="number"
            className="w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 mt-2"
            placeholder="e.g. 3"
          />
        </label>

        <label className="space-y-1">
          <span className="text-muted">Title</span>
          <input
            value={form.title}
            onChange={(e) => set({ title: e.target.value })}
            className="w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 mt-2"
            placeholder="Reading Test-3"
          />
        </label>

        <label className="space-y-1">
          <span className="text-muted">Priority</span>
          <select
            value={form.priority}
            onChange={(e) => set({ priority: e.target.value })}
            className="w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 mt-2"
          >
            <option value="main">Main</option>
            <option value="extra">Extra</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-muted">Status</span>
          <select
            value={form.status}
            onChange={(e) => set({ status: e.target.value })}
            className="w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 mt-2"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </section>

      {/* Passages */}
      {form.passages.map((pg, pIdx) => (
        <section key={pIdx} className="space-y-4 rounded-2xl border border-gray-500 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-cream">Passage {pIdx + 1}</h2>
            {form.passages.length > 1 && (
              <button
                type="button"
                onClick={() => removePassage(pIdx)}
                className="text-xs text-red-400 hover:underline"
              >
                Remove passage
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={pg.label}
              onChange={(e) => updatePassage(pIdx, { label: e.target.value })}
              placeholder="Label, e.g. Passage 1"
              className="rounded-lg border border-gray-500 bg-transparent px-3 py-2"
            />
            <input
              value={pg.title}
              onChange={(e) => updatePassage(pIdx, { title: e.target.value })}
              placeholder="Passage title"
              className="rounded-lg border border-gray-500 bg-transparent px-3 py-2"
            />
          </div>

          <input
            value={pg.subtitle}
            onChange={(e) => updatePassage(pIdx, { subtitle: e.target.value })}
            placeholder="Subtitle (optional)"
            className="w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 mt-2"
          />

          <textarea
            value={pg.text}
            onChange={(e) => updatePassage(pIdx, { text: e.target.value })}
            placeholder="Passage text"
            rows={8}
            className="w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 mt-2 font-mono text-xs leading-relaxed"
          />

          {/* Heading matching */}
          <div className="space-y-3 border-t border-gray-500 pt-4">
            <h3 className="text-muted">
              Heading matching{" "}
              <span className="text-[11px] text-gray-500">
                (leave blank if this passage isn't a heading-matching question)
              </span>
            </h3>

            <div>
              <label className="text-xs text-muted">Headings list</label>
              <textarea
                value={pg.headingsListText ?? ""}
                onChange={(e) => updatePassage(pIdx, { headingsListText: e.target.value })}
                placeholder={HEADINGS_LIST_PLACEHOLDER}
                rows={5}
                className="mt-1 w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 font-mono text-xs leading-relaxed"
              />
              {errors[`headingsList-${pIdx}`] && (
                <p className="text-red-400 text-xs">{errors[`headingsList-${pIdx}`]}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-muted">Paragraph → question number mapping</label>
              <textarea
                value={pg.paragraphQuestionsText ?? ""}
                onChange={(e) => updatePassage(pIdx, { paragraphQuestionsText: e.target.value })}
                placeholder={PARAGRAPH_QUESTIONS_PLACEHOLDER}
                rows={5}
                className="mt-1 w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 font-mono text-xs leading-relaxed"
              />
              {errors[`paragraphQuestions-${pIdx}`] && (
                <p className="text-red-400 text-xs">{errors[`paragraphQuestions-${pIdx}`]}</p>
              )}
            </div>
          </div>

          {/* Question blocks */}
          <div className="space-y-3 border-t border-gray-500 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-muted">Question blocks</h3>
              <select
                defaultValue=""
                onChange={(e) => {
                  addBlock(pIdx, e.target.value);
                  e.target.value = "";
                }}
                className="rounded-lg border border-gray-500 bg-transparent px-3 py-1.5 text-xs"
              >
                <option value="" disabled>+ Add block…</option>
                {QUESTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {errors[`passage-${pIdx}`] && (
              <p className="text-red-400 text-xs">{errors[`passage-${pIdx}`]}</p>
            )}

            {pg.questions.map((block, bIdx) => (
              <div key={bIdx} className="space-y-2 rounded-lg border border-gray-500 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gold">{block.type}</span>
                  <button
                    type="button"
                    onClick={() => removeBlock(pIdx, bIdx)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <textarea
                  value={block.json}
                  onChange={(e) => updateBlockJson(pIdx, bIdx, e.target.value)}
                  rows={10}
                  className="w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 mt-2 font-mono text-xs leading-relaxed"
                />
                {errors[`block-${pIdx}-${bIdx}`] && (
                  <p className="text-red-400 text-xs">{errors[`block-${pIdx}-${bIdx}`]}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <button
        type="button"
        onClick={addPassage}
        className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold hover:bg-white/5"
      >
        + Add passage
      </button>

      {/* Answer key */}
      <section className="space-y-2 rounded-2xl border border-gray-500 p-5">
        <h2 className="font-semibold text-cream">Answer key</h2>
        <p className="text-xs text-muted">
          Flat map of question number → answer, e.g. {`{ "1": "TRUE", "24": ["C","D","E"] }`}
        </p>
        <textarea
          value={form.answersJson}
          onChange={(e) => set({ answersJson: e.target.value })}
          rows={10}
          className="w-full rounded-lg border border-gray-400 bg-transparent px-3 py-2 mt-2 font-mono text-xs leading-relaxed"
        />
        {errors.answers && <p className="text-red-400 text-xs">{errors.answers}</p>}
      </section>
    </form>
  );
}