"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft, Save, Loader2, Plus, Trash2, AlertCircle, Code,
} from "lucide-react";
import {
  createWritingTest,
  updateWritingTest,
  getSingleWritingTest,
} from "@/actions/writing";

const EMPTY_PART = () => ({
  label: "Part 1",
  subtitle: "",
  subtitleFull: "",
  minWords: 150,
  hasCharts: false,
  prompt: "",
  charts: [],
});

const EMPTY_FORM = {
  testNumber: "",
  title: "",
  priority: "main",
  status: "draft",
  parts: [EMPTY_PART()],
};

export default function WritingForm({ mode = "create", testId }) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit || !testId) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await getSingleWritingTest(testId);
        if (cancelled) return;
        const t = data?.test;
        if (!t) throw new Error("Not found");
        setForm({
          testNumber: t.testNumber ?? "",
          title: t.title ?? "",
          priority: t.priority ?? "main",
          status: t.status ?? "draft",
          parts: (t.parts ?? []).map((p) => ({
            ...EMPTY_PART(),
            ...p,
            charts: p.charts ?? [],
          })),
        });
      } catch {
        setError("Failed to load writing test.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEdit, testId]);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const addPart = () => {
    if (form.parts.length >= 2) return;
    const nextIdx = form.parts.length + 1;
    setForm((f) => ({
      ...f,
      parts: [
        ...f.parts,
        {
          ...EMPTY_PART(),
          label: `Part ${nextIdx}`,
          minWords: nextIdx === 1 ? 150 : 250,
        },
      ],
    }));
  };

  const updatePart = (i, patch) =>
    setForm((f) => ({
      ...f,
      parts: f.parts.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
    }));

  const removePart = (i) =>
    setForm((f) => ({ ...f, parts: f.parts.filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    setError(null);
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.testNumber && form.testNumber !== 0)
      return setError("Test number is required.");
    if (form.parts.length === 0)
      return setError("At least one part is required.");
    for (const [i, p] of form.parts.entries()) {
      if (!p.prompt?.trim())
        return setError(`Part ${i + 1} needs a prompt.`);
      if (!p.minWords || p.minWords < 1)
        return setError(`Part ${i + 1} needs a valid minimum word count.`);
    }

    setSaving(true);
    try {
      const payload = {
        testNumber: Number(form.testNumber),
        title: form.title.trim(),
        priority: form.priority,
        status: form.status,
        parts: form.parts.map((p) => ({
          label: p.label,
          subtitle: p.subtitle,
          subtitleFull: p.subtitleFull,
          minWords: Number(p.minWords),
          hasCharts: !!p.hasCharts,
          prompt: p.prompt,
          charts: p.hasCharts ? p.charts : [],
        })),
      };

      if (isEdit) {
        await updateWritingTest(testId, payload);
        toast.success("Writing test updated");
      } else {
        await createWritingTest(payload);
        toast.success("Writing test created");
      }
      router.push("/admin/writing");
    } catch (err) {
      const msg =
        err?.response?.data?.message ?? "Failed to save. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/writing"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted hover:border-ink/30 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-display text-xl text-ink sm:text-2xl">
            {isEdit ? "Edit writing test" : "New writing test"}
          </h1>
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
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 font-sans text-sm text-red-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {/* Test details */}
      <section className="rounded-2xl border border-line bg-paper-raised p-5">
        <h2 className="font-display text-base text-ink">Test details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Test number">
            <input
              type="number"
              min="1"
              value={form.testNumber}
              onChange={(e) => setField("testNumber", e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Title">
            <input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className={inputCls}
              placeholder="Academic Writing — Test 12"
            />
          </Field>
          <Field label="Priority">
            <select
              value={form.priority}
              onChange={(e) => setField("priority", e.target.value)}
              className={inputCls}
            >
              <option value="main">Main test</option>
              <option value="extra">Extra practice</option>
            </select>
          </Field>
          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => setField("status", e.target.value)}
              className={inputCls}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
        </div>
      </section>

      {/* Parts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base text-ink">
            Parts ({form.parts.length})
          </h2>
          {form.parts.length < 2 && (
            <button
              type="button"
              onClick={addPart}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 font-sans text-xs font-medium transition hover:border-indigo-deep/40 hover:text-indigo-deep"
            >
              <Plus className="h-3.5 w-3.5" /> Add part
            </button>
          )}
        </div>

        {form.parts.map((p, i) => (
          <PartEditor
            key={i}
            index={i}
            part={p}
            onChange={(patch) => updatePart(i, patch)}
            onRemove={() => removePart(i)}
            canRemove={form.parts.length > 1}
          />
        ))}
      </section>
    </div>
  );
}

// ─────────────────────────

function PartEditor({ index, part, onChange, onRemove, canRemove }) {
  return (
    <div className="rounded-2xl border border-line bg-paper-raised">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-deep/10 font-mono text-xs font-semibold text-indigo-deep">
            {index + 1}
          </span>
          <input
            value={part.label}
            onChange={(e) => onChange({ label: e.target.value })}
            className="rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-ink hover:border-line focus:border-indigo-deep focus:outline-none"
          />
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted transition hover:border-red-300 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        )}
      </div>

      <div className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Subtitle (mobile)">
            <input
              value={part.subtitle ?? ""}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              className={inputCls}
              placeholder="Spend ~20 min. Write at least 150 words."
            />
          </Field>
          <Field label="Subtitle (full)">
            <input
              value={part.subtitleFull ?? ""}
              onChange={(e) => onChange({ subtitleFull: e.target.value })}
              className={inputCls}
              placeholder="You should spend about 20 minutes on this task…"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Minimum words">
            <input
              type="number"
              min="1"
              value={part.minWords}
              onChange={(e) => onChange({ minWords: Number(e.target.value) })}
              className={inputCls}
            />
          </Field>
          <Field label="Has charts?">
            <select
              value={part.hasCharts ? "yes" : "no"}
              onChange={(e) => onChange({ hasCharts: e.target.value === "yes" })}
              className={inputCls}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </Field>
        </div>

        <Field label="Prompt">
          <textarea
            value={part.prompt}
            onChange={(e) => onChange({ prompt: e.target.value })}
            rows={6}
            className={`${inputCls} resize-y font-serif leading-relaxed`}
            placeholder="Paste the task prompt here. Use blank lines to separate paragraphs."
          />
        </Field>

        {part.hasCharts && (
          <ChartsEditor
            charts={part.charts ?? []}
            onChange={(charts) => onChange({ charts })}
          />
        )}
      </div>
    </div>
  );
}

function ChartsEditor({ charts, onChange }) {
  const addChart = () =>
    onChange([
      ...charts,
      {
        kind: "pie",
        title: "",
        segments: [{ label: "", value: 0, color: "#ccc", pattern: "solid" }],
      },
    ]);

  const updateChart = (i, patch) =>
    onChange(charts.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));

  const removeChart = (i) => onChange(charts.filter((_, idx) => idx !== i));

  return (
    <div className="rounded-xl border border-dashed border-line bg-paper p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-indigo-deep" />
          <span className="font-sans text-xs font-semibold text-ink">
            Charts ({charts.length})
          </span>
        </div>
        <button
          type="button"
          onClick={addChart}
          className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:border-indigo-deep/40 hover:text-indigo-deep"
        >
          <Plus className="h-3 w-3" /> Add chart
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {charts.map((c, i) => (
          <ChartEditor
            key={i}
            chart={c}
            onChange={(patch) => updateChart(i, patch)}
            onRemove={() => removeChart(i)}
          />
        ))}
      </div>

      <p className="mt-3 font-sans text-[11px] text-muted">
        Each chart is stored as JSON matching one of the supported kinds —
        pie, bar, line, table, process, map, change_table.
      </p>
    </div>
  );
}

function ChartEditor({ chart, onChange, onRemove }) {
  const [raw, setRaw] = useState(() => JSON.stringify(chart, null, 2));
  const [jsonError, setJsonError] = useState(null);

  // Reset raw when switching kinds
  useEffect(() => {
    setRaw(JSON.stringify(chart, null, 2));
  }, [chart.kind]);

  const applyRaw = () => {
    try {
      const parsed = JSON.parse(raw);
      onChange(parsed);
      setJsonError(null);
    } catch (e) {
      setJsonError("Invalid JSON: " + e.message);
    }
  };

  return (
    <div className="rounded-lg border border-line bg-paper-raised p-3">
      <div className="flex items-center gap-2">
        <select
          value={chart.kind}
          onChange={(e) => {
            // reset the chart content when kind changes
            const defaults = {
              pie: { kind: "pie", title: "", segments: [] },
              bar: {
                kind: "bar",
                title: "",
                xLabels: [],
                yMax: 100,
                yStep: 20,
                yUnit: "",
                xUnit: "",
                series: [],
              },
              line: {
                kind: "line",
                title: "",
                xLabels: [],
                yMax: 100,
                yStep: 20,
                yUnit: "",
                xUnit: "",
                series: [],
              },
              table: { kind: "table", title: "", columns: [], rows: [] },
              process: { kind: "process", title: "", rows: [] },
              map: { kind: "map", titleBefore: "Before", titleAfter: "After" },
              change_table: { kind: "change_table", title: "", rows: [] },
            };
            onChange(defaults[e.target.value]);
          }}
          className="rounded-md border border-line bg-paper px-2 py-1 font-mono text-xs"
        >
          <option value="pie">pie</option>
          <option value="bar">bar</option>
          <option value="line">line</option>
          <option value="table">table</option>
          <option value="process">process</option>
          <option value="map">map</option>
          <option value="change_table">change_table</option>
        </select>

        <button
          type="button"
          onClick={onRemove}
          className="ml-auto inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-xs text-muted hover:border-red-300 hover:text-red-600"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        onBlur={applyRaw}
        rows={8}
        className="mt-2 w-full rounded-md border border-line bg-paper p-2 font-mono text-[11px] leading-relaxed text-ink outline-none focus:border-indigo-deep"
        spellCheck={false}
      />

      {jsonError && (
        <p className="mt-1 font-mono text-[11px] text-red-600">{jsonError}</p>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-sans text-xs font-medium text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 font-sans text-sm text-ink placeholder:text-muted/70 outline-none transition focus:border-indigo-deep focus:ring-2 focus:ring-indigo-deep/20";