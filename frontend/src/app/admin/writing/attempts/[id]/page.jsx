"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  AlertCircle,
  Save,
  CheckCircle2,
} from "lucide-react";
import {
  getWritingAttemptById,
  markWritingAttempt,
} from "@/actions/writing";

const CRITERIA = ["TA", "CC", "LR", "GRA"];
const CRITERIA_LABELS = {
  TA: "Task Achievement",
  CC: "Coherence & Cohesion",
  LR: "Lexical Resource",
  GRA: "Grammar Range & Accuracy",
};

const BANDS = [0, 1, 2, 3, 4, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

export default function MarkAttemptPage() {
  const { id } = useParams();
  const router = useRouter();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // marks[partIndex][criteria] = { band, comment }
  const [marks, setMarks] = useState([]);
  const [generalFeedback, setGeneralFeedback] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getWritingAttemptById(id);
        const a = data?.attempt;
        if (!a) throw new Error("Not found");
        setAttempt(a);

        const existing = Array.isArray(a.marks) && a.marks.length > 0
          ? a.marks
          : a.answers.map((ans, i) => ({
              partIndex: i,
              TA: { band: null, comment: "" },
              CC: { band: null, comment: "" },
              LR: { band: null, comment: "" },
              GRA: { band: null, comment: "" },
              overallBand: null,
              feedback: "",
            }));

        // normalize marks array length to match answers
        const normalized = a.answers.map((_, i) => existing[i] ?? {
          partIndex: i,
          TA: { band: null, comment: "" },
          CC: { band: null, comment: "" },
          LR: { band: null, comment: "" },
          GRA: { band: null, comment: "" },
          overallBand: null,
          feedback: "",
        });

        setMarks(normalized);
        setGeneralFeedback(a.generalFeedback ?? "");
      } catch {
        setError("Failed to load submission.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const updateCriterion = (partIdx, criterion, patch) => {
    setMarks((prev) =>
      prev.map((m, i) =>
        i === partIdx
          ? { ...m, [criterion]: { ...m[criterion], ...patch } }
          : m,
      ),
    );
  };

  const updatePart = (partIdx, patch) => {
    setMarks((prev) =>
      prev.map((m, i) => (i === partIdx ? { ...m, ...patch } : m)),
    );
  };

  const autoComputePartBand = (m) => {
    const bands = CRITERIA.map((c) => m[c]?.band).filter(
      (b) => typeof b === "number",
    );
    if (bands.length < 4) return null;
    const avg = bands.reduce((s, b) => s + b, 0) / bands.length;
    return Math.round(avg * 2) / 2;
  };

  const handleSave = async () => {
    setError(null);

    // basic validation
    for (let i = 0; i < marks.length; i++) {
      const m = marks[i];
      const missing = CRITERIA.filter(
        (c) => typeof m[c]?.band !== "number",
      );
      if (missing.length > 0) {
        setError(
          `Please score all four criteria for Part ${i + 1} (missing: ${missing.join(", ")}).`,
        );
        return;
      }
    }

    setSaving(true);
    try {
      // compute per-part overall band
      const normalized = marks.map((m) => {
        const perPart = autoComputePartBand(m);
        return { ...m, overallBand: perPart };
      });

      // overall = average of part overallBands
      const overalls = normalized
        .map((m) => m.overallBand)
        .filter((n) => typeof n === "number");
      const overallBand = overalls.length
        ? Math.round((overalls.reduce((s, b) => s + b, 0) / overalls.length) * 2) / 2
        : null;

      await markWritingAttempt(id, {
        marks: normalized,
        overallBand,
        generalFeedback,
      });

      toast.success("Marks saved");
      router.push("/admin/writing/attempts");
    } catch (err) {
      const msg =
        err?.response?.data?.message ?? "Failed to save. Please try again.";
      toast.error(msg);
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }

  if (error && !attempt) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-sm text-red-700">
        <AlertCircle className="h-4 w-4" />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/writing/attempts"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-ink/30 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-xl text-ink sm:text-2xl">
              {attempt.userName ?? "Student"} ·{" "}
              <span className="text-muted">{attempt.testTitle}</span>
            </h1>
            <p className="mt-1 font-sans text-xs text-muted">
              {attempt.userEmail} · Submitted{" "}
              {new Date(attempt.submittedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 font-sans text-sm font-semibold text-indigo-deep transition hover:bg-gold-soft disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving…" : "Save marks"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Parts */}
      {attempt.answers.map((ans, i) => {
        const m = marks[i] ?? {};
        const partBand = autoComputePartBand(m);

        return (
          <section
            key={i}
            className="rounded-2xl border border-line bg-paper-raised"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-deep/10 font-mono text-xs font-semibold text-indigo-deep">
                  {i + 1}
                </span>
                <span className="font-display text-base text-ink">
                  {ans.label}
                </span>
                <span className="font-mono text-xs text-muted">
                  {ans.wordCount ?? "?"} / {ans.minWords ?? 150} words
                </span>
              </div>
              <span className="rounded-full bg-indigo-deep/10 px-3 py-1 font-mono text-xs font-semibold text-indigo-deep">
                Part band: {partBand != null ? partBand : "—"}
              </span>
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-[1fr_1fr]">
              {/* Left — student's answer */}
              <div className="space-y-3">
                <details className="rounded-lg border border-line bg-paper px-3 py-2">
                  <summary className="cursor-pointer text-xs font-semibold text-muted">
                    Show prompt
                  </summary>
                  <p className="mt-2 whitespace-pre-line text-[12.5px] leading-relaxed text-ink-soft">
                    {ans.prompt}
                  </p>
                </details>
                <div className="max-h-[500px] overflow-y-auto rounded-lg border border-line bg-paper p-4">
                  <p className="whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed text-ink">
                    {ans.answer || (
                      <span className="italic text-muted">
                        No answer submitted.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Right — marking form */}
              <div className="space-y-4">
                {CRITERIA.map((c) => (
                  <div key={c} className="space-y-1.5">
                    <label className="flex items-center justify-between font-sans text-xs font-semibold text-ink">
                      <span>
                        {c} — {CRITERIA_LABELS[c]}
                      </span>
                      <select
                        value={m[c]?.band ?? ""}
                        onChange={(e) =>
                          updateCriterion(i, c, {
                            band:
                              e.target.value === ""
                                ? null
                                : Number(e.target.value),
                          })
                        }
                        className="rounded-md border border-line bg-paper px-2 py-1 font-mono text-xs"
                      >
                        <option value="">—</option>
                        {BANDS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </label>
                    <textarea
                      value={m[c]?.comment ?? ""}
                      onChange={(e) =>
                        updateCriterion(i, c, { comment: e.target.value })
                      }
                      rows={2}
                      placeholder={`Comment on ${CRITERIA_LABELS[c]}…`}
                      className="w-full resize-y rounded-md border border-line bg-paper px-3 py-2 text-[12.5px] text-ink outline-none focus:border-indigo-deep"
                    />
                  </div>
                ))}

                <div className="space-y-1.5">
                  <label className="block font-sans text-xs font-semibold text-ink">
                    Overall feedback for this part
                  </label>
                  <textarea
                    value={m.feedback ?? ""}
                    onChange={(e) =>
                      updatePart(i, { feedback: e.target.value })
                    }
                    rows={3}
                    placeholder="General comment, strengths, next steps…"
                    className="w-full resize-y rounded-md border border-line bg-paper px-3 py-2 text-[12.5px] text-ink outline-none focus:border-indigo-deep"
                  />
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* General feedback */}
      <section className="rounded-2xl border border-line bg-paper-raised p-5">
        <label className="mb-2 block font-sans text-sm font-semibold text-ink">
          General feedback (visible to the student)
        </label>
        <textarea
          value={generalFeedback}
          onChange={(e) => setGeneralFeedback(e.target.value)}
          rows={4}
          className="w-full resize-y rounded-md border border-line bg-paper px-3 py-2 text-[13px] text-ink outline-none focus:border-indigo-deep"
          placeholder="Overall notes, band trajectory, recommendations…"
        />
      </section>

      {/* Bottom save */}
      <div className="flex items-center justify-end gap-2">
        <Link
          href="/admin/writing/attempts"
          className="rounded-full border border-line px-4 py-2.5 text-sm text-ink transition hover:border-ink/30"
        >
          Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-indigo-deep transition hover:bg-gold-soft disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {saving ? "Saving…" : "Save marks"}
        </button>
      </div>
    </div>
  );
}