import { useState, useEffect, useRef, useCallback } from "react";

const supportsCSSHighlight =
  typeof window !== "undefined" &&
  "Highlight" in window &&
  !!window.CSS?.highlights;

// ── SCORING ────────────────────────────────────
export function scoreReadingAnswers(vals, answerKey) {
  const results = [];
  let correct = 0;

  Object.entries(answerKey).forEach(([n, correctData]) => {
    const userAnswer = vals[n] ?? "";
    let isCorrect = false;
    const isRichFormat =
      typeof correctData === "object" &&
      correctData !== null &&
      !Array.isArray(correctData);
    const correctAnswer = isRichFormat ? correctData.answer : correctData;

    if (Array.isArray(correctAnswer)) {
      isCorrect = correctAnswer.some(
        (c) => normalise(c) === normalise(userAnswer),
      );
    } else {
      isCorrect = normalise(correctAnswer) === normalise(userAnswer);
    }

    if (isCorrect) correct += 1;
    results.push({ n, userAnswer, correctAnswer, isCorrect });
  });

  const total = Object.keys(answerKey).length;
  const wrong = total - correct;
  const { band, desc } = getBand(correct);

  return { correct, wrong, total, band, desc, results };
}

// ── OFFSET HELPERS ────────────────────────────
export function getTextOffset(container, node, offset) {
  const range = document.createRange();
  range.selectNodeContents(container);
  try {
    range.setEnd(node, offset);
  } catch {
    return container.textContent.length;
  }
  return range.toString().length;
}

export function getNodeAtCharOffset(container, targetOffset) {
  let total = 0;
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null,
  );
  let node = walker.nextNode();
  let last = null;
  while (node) {
    const len = node.textContent.length;
    if (total + len >= targetOffset)
      return { node, offset: targetOffset - total };
    total += len;
    last = node;
    node = walker.nextNode();
  }
  return last ? { node: last, offset: last.textContent.length } : null;
}

// ── HIGHLIGHT ROOT ────────────
export function HighlightRoot({
  zoneId,
  highlightKey,
  highlights,
  onSelect,
  children,
}) {
  const ref = useRef(null);
  const cssKey = highlightKey || zoneId;

  const handlePointerUp = useCallback(
    (e) => {
      if (["INPUT", "BUTTON", "SELECT"].includes(e.target.tagName)) return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;
      const raw = sel.toString();
      if (!raw.trim()) return;

      const range = sel.getRangeAt(0);
      const container = ref.current;
      if (!container) return;
      if (
        !container.contains(range.startContainer) ||
        !container.contains(range.endContainer)
      )
        return;

      const a = getTextOffset(
        container,
        range.startContainer,
        range.startOffset,
      );
      const b = getTextOffset(container, range.endContainer, range.endOffset);
      if (a === b) return;
      const [start, end] = a < b ? [a, b] : [b, a];
      const selectedText = container.textContent.slice(start, end);
      if (!selectedText.trim()) return;

      const rect = range.getBoundingClientRect();
      onSelect({
        zoneId,
        start,
        end,
        selectedText,
        rect: {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
        },
      });
    },
    [zoneId, onSelect],
  );

  useEffect(() => {
    if (!supportsCSSHighlight) return;
    const container = ref.current;
    if (!container) return;
    const mine = highlights.filter((h) => h.zoneId === zoneId);
    const ranges = mine
      .map((h) => {
        const s = getNodeAtCharOffset(container, h.start);
        const en = getNodeAtCharOffset(container, h.end);
        if (!s || !en) return null;
        try {
          const r = document.createRange();
          r.setStart(s.node, s.offset);
          r.setEnd(en.node, en.offset);
          return r;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    if (ranges.length)
      window.CSS.highlights.set(cssKey, new Highlight(...ranges));
    else window.CSS.highlights.delete(cssKey);
    return () => window.CSS.highlights.delete(cssKey);
  }, [highlights, zoneId, cssKey]);

  return (
    <div
      ref={ref}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
      style={{ cursor: "text" }}>
      {children}
    </div>
  );
}

export function HighlightableText({ text }) {
  return <span style={{ cursor: "text" }}>{text}</span>;
}

// ── EXPLANATION MODAL ────────────────────
export function ExplanationModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl animate-fade-up">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Answer Explanation
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-lg p-1">
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              Location
            </span>
            <p className="text-sm font-semibold text-indigo-600 mt-0.5">
              {data.location || "Not provided"}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              Explanation
            </span>
            <p className="text-sm text-gray-700 leading-relaxed mt-0.5">
              {data.explanation || "No explanation provided for this question."}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
          Got it
        </button>
      </div>
    </div>
  );
}

// ── HELPER FOR REVIEW MODE COLORS ───────────────────
function getReviewState(qNum, studentAns, ANSWER_KEY) {
  const data =
    ANSWER_KEY[qNum] ||
    ANSWER_KEY[String(qNum)] ||
    ANSWER_KEY[`question_${qNum}`];
  if (!data) return { isRich: false, isCorrect: false, correctAnswer: null };

  const isRich =
    typeof data === "object" && data !== null && !Array.isArray(data);
  const correctAnswer = isRich ? data.answer : data;

  let isCorrect = false;
  if (Array.isArray(correctAnswer)) {
    isCorrect = correctAnswer
      .map((a) => String(a).trim().toLowerCase())
      .includes(String(studentAns).trim().toLowerCase());
  } else {
    isCorrect =
      String(studentAns).trim().toLowerCase() ===
        String(correctAnswer).trim().toLowerCase() && studentAns !== "";
  }

  return { isRich, isCorrect, correctAnswer, data };
}

// ── EXPLAIN BUTTON ────────────────────
function ExplainButton({ qNum, ANSWER_KEY, studentAns }) {
  const [open, setOpen] = useState(false);

  // Get data, checking for string/number keys
  const data =
    ANSWER_KEY?.[qNum] ||
    ANSWER_KEY?.[String(qNum)] ||
    ANSWER_KEY?.[`question_${qNum}`];

  // ✅ THE SAFE CHECK: If it's a simple string (old format) or missing data, hide the button.
  if (
    !data ||
    typeof data !== "object" ||
    (!data.explanation && !data.location)
  ) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-2 inline-flex items-center gap-1.5 rounded bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600 transition hover:bg-indigo-100 border border-indigo-100">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        Explain Q{qNum}
      </button>
      <ExplanationModal
        isOpen={open}
        onClose={() => setOpen(false)}
        data={data}
      />
    </>
  );
}

// ── SELECTION POPUP ────────────────────────────
export function SelectionPopup({
  selection,
  isHighlighted,
  onHighlight,
  onClear,
  onNote,
  onDismiss,
}) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ top: -999, left: -999, ready: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pw = el.offsetWidth || 160;
    const ph = el.offsetHeight || 44;
    const { rect } = selection;
    const cx = (rect.left + rect.right) / 2;
    let top = rect.top - ph - 10;
    if (top < 8) top = rect.bottom + 10;
    const left = Math.max(8, Math.min(cx - pw / 2, window.innerWidth - pw - 8));
    setPos({ top, left, ready: true });
  }, [selection]);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onDismiss();
    };
    document.addEventListener("mousedown", h);
    document.addEventListener("touchstart", h);
    return () => {
      document.removeEventListener("mousedown", h);
      document.removeEventListener("touchstart", h);
    };
  }, [onDismiss]);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        zIndex: 600,
        top: pos.top,
        left: pos.left,
        opacity: pos.ready ? 1 : 0,
        pointerEvents: pos.ready ? "auto" : "none",
        background: "#1e293b",
        borderRadius: 8,
        padding: "5px 6px",
        boxShadow: "0 8px 28px rgba(0,0,0,.28)",
        display: "flex",
        gap: 6,
        transition: "opacity .1s",
      }}>
      {!isHighlighted ? (
        <button
          style={{
            border: "none",
            borderRadius: 6,
            padding: "7px 12px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            background: "#fef08a",
            color: "#713f12",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
          onClick={onHighlight}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Highlight
        </button>
      ) : (
        <button
          style={{
            border: "none",
            borderRadius: 6,
            padding: "7px 12px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            background: "#fee2e2",
            color: "#991b1b",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
          onClick={onClear}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Clear
        </button>
      )}
      {onNote && (
        <button
          style={{
            border: "none",
            borderRadius: 6,
            padding: "7px 12px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            background: "#dbeafe",
            color: "#1e40af",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
          onClick={onNote}>
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
          Note
        </button>
      )}
    </div>
  );
}

// ── NOTE MODAL ───
export function NoteModal({ selection, existingNote, onSave, onClose }) {
  const [text, setText] = useState(existingNote || "");
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 700,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,.2)",
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#111827",
              margin: 0,
            }}>
            Add Note
          </h3>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#6b7280",
              fontSize: 18,
            }}>
            ✕
          </button>
        </div>
        {selection?.selectedText && (
          <div
            style={{
              background: "#fef9c3",
              border: "1px solid #fde68a",
              borderRadius: 6,
              padding: "8px 12px",
              fontSize: 13,
              color: "#713f12",
              marginBottom: 12,
              lineHeight: 1.5,
            }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "block",
                marginBottom: 4,
                color: "#92400e",
              }}>
              Selected text
            </span>
            "{selection.selectedText}"
          </div>
        )}
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your note here…"
          style={{
            width: "100%",
            minHeight: 100,
            border: "1.5px solid #d1d5db",
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 14,
            color: "#111827",
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
            lineHeight: 1.6,
            boxSizing: "border-box",
          }}
        />
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
            justifyContent: "flex-end",
          }}>
          <button
            onClick={onClose}
            style={{
              border: "1.5px solid #d1d5db",
              borderRadius: 7,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              background: "#fff",
              color: "#374151",
            }}>
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(text.trim());
              onClose();
            }}
            style={{
              border: "none",
              borderRadius: 7,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              background: "#1e293b",
              color: "#fff",
            }}>
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

// ── NOTES PANEL ────────────────────────────────
export function NotesPanel({ notes, onDelete, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 650,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div
        style={{
          background: "#fff",
          width: "min(380px, 100vw)",
          height: "100vh",
          overflowY: "auto",
          boxShadow: "-8px 0 32px rgba(0,0,0,.15)",
          display: "flex",
          flexDirection: "column",
        }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            flexShrink: 0,
          }}>
          <div>
            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#111827",
                margin: 0,
              }}>
              My Notes
            </h3>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
              {notes.length} note{notes.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "#6b7280",
              fontSize: 20,
            }}>
            ✕
          </button>
        </div>
        <div
          style={{
            flex: 1,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}>
          {notes.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#9ca3af",
              }}>
              <p style={{ fontSize: 14 }}>
                No notes yet. Select text and click "Note" to add one.
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: 8,
                  padding: "12px 14px",
                }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#92400e",
                    marginBottom: 6,
                  }}>
                  Selected text
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "#713f12",
                    marginBottom: 8,
                    lineHeight: 1.5,
                  }}>
                  "{note.selectedText}"
                </p>
                {note.text && (
                  <>
                    <div
                      style={{
                        height: 1,
                        background: "#fde68a",
                        marginBottom: 8,
                      }}
                    />
                    <p
                      style={{
                        fontSize: 13.5,
                        color: "#1f2937",
                        lineHeight: 1.6,
                        margin: 0,
                      }}>
                      {note.text}
                    </p>
                  </>
                )}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: 8,
                  }}>
                  <button
                    onClick={() => onDelete(note.id)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#ef4444",
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── COMBINED HIGHLIGHTS + NOTES HOOK ──────────
export function useHighlightsAndNotes() {
  const [highlights, setHighlights] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selection, setSelection] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [pendingNoteSelection, setPendingNoteSelection] = useState(null);

  const isHighlighted = selection
    ? highlights.some(
        (h) =>
          h.zoneId === selection.zoneId &&
          h.start <= selection.start &&
          h.end >= selection.end,
      )
    : false;
  const handleSelect = useCallback((sel) => setSelection(sel), []);

  const handleHighlight = useCallback(() => {
    if (!selection) return;
    const { zoneId, start, end } = selection;
    setHighlights((prev) => {
      const overlapping = prev.filter(
        (h) => h.zoneId === zoneId && h.end >= start && h.start <= end,
      );
      const others = prev.filter((h) => !overlapping.includes(h));
      const mergedStart = Math.min(start, ...overlapping.map((h) => h.start));
      const mergedEnd = Math.max(end, ...overlapping.map((h) => h.end));
      return [
        ...others,
        {
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          zoneId,
          start: mergedStart,
          end: mergedEnd,
        },
      ];
    });
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  }, [selection]);

  const handleClear = useCallback(() => {
    if (!selection) return;
    const { zoneId, start, end } = selection;
    setHighlights((prev) => {
      const result = [];
      prev.forEach((h) => {
        if (h.zoneId !== zoneId || h.end <= start || h.start >= end) {
          result.push(h);
          return;
        }
        if (h.start < start)
          result.push({ id: h.id + "-a", zoneId, start: h.start, end: start });
        if (h.end > end)
          result.push({ id: h.id + "-b", zoneId, start: end, end: h.end });
      });
      return result;
    });
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  }, [selection]);

  const handleNoteOpen = useCallback(() => {
    if (!selection) return;
    setPendingNoteSelection(selection);
    setShowNoteModal(true);
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  }, [selection]);

  const handleNoteSave = useCallback(
    (text) => {
      if (!pendingNoteSelection) return;
      setNotes((p) => [
        ...p,
        {
          id: Date.now().toString(),
          zoneId: pendingNoteSelection.zoneId,
          selectedText: pendingNoteSelection.selectedText,
          text,
        },
      ]);
      setPendingNoteSelection(null);
    },
    [pendingNoteSelection],
  );

  const handleNoteDelete = useCallback(
    (id) => setNotes((p) => p.filter((n) => n.id !== id)),
    [],
  );
  const dismiss = useCallback(() => {
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  return {
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
  };
}

// ── Helper: splits text into segments ──
function splitBoldCapsSegments(text) {
  if (!text) return [{ text: "", bold: false }];
  const regex = /\b[A-Z]+(?:\/[A-Z]+)?(?:\s+[A-Z]+(?:\/[A-Z]+)?)*\b/g;
  const segments = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const matched = match[0];
    const words = matched.split(/\s+/);
    const hasSubstantialWord = words.some(
      (w) => w.replace("/", "").length >= 3,
    );
    if (!hasSubstantialWord) continue;
    if (match.index > lastIndex)
      segments.push({ text: text.slice(lastIndex, match.index), bold: false });
    segments.push({ text: matched, bold: true });
    lastIndex = match.index + matched.length;
  }
  if (lastIndex < text.length)
    segments.push({ text: text.slice(lastIndex), bold: false });
  return segments.length ? segments : [{ text, bold: false }];
}

function renderInstructionText(baseId, text, highlights, onSelect) {
  const segments = splitBoldCapsSegments(text);
  return segments.map((seg, i) => (
    <span key={i} className={seg.bold ? "font-bold" : undefined}>
      <HighlightableText
        id={`${baseId}-seg${i}`}
        text={seg.text}
        highlights={highlights}
        onSelect={onSelect}
      />
    </span>
  ));
}

export function SectionLabel({
  part,
  qRange,
  instruction,
  sub,
  onSelect,
  highlights,
  note,
}) {
  return (
    <div className="mb-6">
      {qRange && (
        <p className="text-xl font-semibold tracking-widest text-[#1e293b] mb-3">
          <HighlightableText
            id={"section-label-question-title" + qRange + part}
            text={qRange}
            highlights={highlights}
            onSelect={onSelect}
          />
        </p>
      )}
      {sub && (
        <p className="text-md text-[#000000]">
          {renderInstructionText(
            "section-label-question-title" + sub + qRange,
            sub,
            highlights,
            onSelect,
          )}
        </p>
      )}
      {instruction && (
        <p className="text-md text-[#000000] leading-snug mt-5">
          {renderInstructionText(
            "section-label-question-title" + qRange + instruction,
            instruction,
            highlights,
            onSelect,
          )}
        </p>
      )}
      {note && (
        <p className="text-md mt-3 text-[#000000]">
          {renderInstructionText(
            "reading-note" + note + qRange,
            note,
            highlights,
            onSelect,
          )}
        </p>
      )}
    </div>
  );
}

export function normalise(s) {
  return (s || "").toLowerCase().trim().replace(/\s+/g, " ");
}

export function useDivider(initial = 50) {
  const [split, setSplit] = useState(initial);
  const dragging = useRef(false);
  const containerRef = useRef(null);
  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    const move = (ev) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const pct = Math.min(
        80,
        Math.max(20, ((clientX - rect.left) / rect.width) * 100),
      );
      setSplit(pct);
    };
    const up = () => {
      dragging.current = false;
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("mouseup", up);
    document.addEventListener("touchend", up);
  }, []);
  return { split, setSplit, containerRef, onMouseDown };
}

export function getBand(score) {
  if (score >= 39) return { band: "9.0", desc: "Expert user" };
  if (score >= 37) return { band: "8.5", desc: "Very good user" };
  if (score >= 35) return { band: "8.0", desc: "Very good user" };
  if (score >= 33) return { band: "7.5", desc: "Good user" };
  if (score >= 30) return { band: "7.0", desc: "Good user" };
  if (score >= 27) return { band: "6.5", desc: "Competent user" };
  if (score >= 23) return { band: "6.0", desc: "Competent user" };
  if (score >= 19) return { band: "5.5", desc: "Modest user" };
  if (score >= 15) return { band: "5.0", desc: "Modest user" };
  if (score >= 13) return { band: "4.5", desc: "Limited user" };
  if (score >= 10) return { band: "4.0", desc: "Limited user" };
  return { band: "3.5", desc: "Extremely limited user" };
}

// export function QNum({ n }) {
//   return <span className="inline-flex items-center justify-center min-w-7 h-7 px-1 border rounded text-base font-bold shrink-0 border-gray-300 text-black">{n}</span>;
// }

// ── TFNG ──────────────────────────────────────
export function TFNGBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
  isReviewMode,
  ANSWER_KEY,
}) {
  const optLetters = ["A", "B", "C"];
  return (
    <div className="mb-5 p-3 sm:p-4">
      <div className="mb-3">
        <SectionLabel
          part={block.part}
          qRange={block.heading}
          sub={block.title}
          highlights={highlights}
          onSelect={onSelect}
        />
        {block.optionLabels && (
          <div className="rounded mb-2 grid gap-3">
            {block.options.map((opt) => (
              <div
                key={opt}
                className="flex gap-2 text-[11.5px] sm:text-base mb-0.5 flex-wrap">
                <span className="font- text-[#000000] min-w-18.75 sm:min-w-22.5">
                  <HighlightableText
                    id={"reading-true-false" + opt}
                    text={opt}
                    highlights={highlights}
                    onSelect={onSelect}
                  />
                </span>
                <span className="text-[#000000]">
                  <HighlightableText
                    id={"reading-true-false" + block.optionLabels[opt]}
                    text={block.optionLabels[opt]}
                    highlights={highlights}
                    onSelect={onSelect}
                  />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        {block.items.map(({ n, text }) => {
          const studentAns = vals[n] ?? "";
          const { isCorrect, correctAnswer } = getReviewState(
            n,
            studentAns,
            ANSWER_KEY,
          );

          return (
            <div
              key={n}
              id={`q-${n}`}
              className="border-b border-gray-100 py-4 last:border-b-0 last:pb-0">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-7 h-7 border border-gray-800 flex items-center justify-center text-[13px] sm:text-base font-medium text-[#000000] shrink-0 rounded-xs">
                  {n}
                </div>
                <p
                  className="text-[13px] sm:text-lg text-[#000000] leading-relaxed flex-1 pt-0.5"
                  style={{ WebkitUserSelect: "text" }}>
                  <HighlightableText
                    id={`tfng-${n}`}
                    text={text}
                    highlights={highlights}
                    onSelect={onSelect}
                  />
                </p>
              </div>
              <div className="flex flex-col gap-3 pl-10">
                {block.options.map((opt, i) => {
                  const isSelected = vals[n] === opt;
                  const isCorrectOption = correctAnswer === opt;

                  let radioClass = isSelected
                    ? "border-blue-700"
                    : "border-gray-400";
                  let textClass = "text-[#000000]";

                  if (isReviewMode) {
                    if (isCorrectOption) {
                      radioClass = "border-green-600 bg-green-50";
                      textClass = "text-green-700 font-bold";
                    } else if (isSelected && !isCorrectOption) {
                      radioClass = "border-red-600 bg-red-50";
                      textClass = "text-red-600 line-through";
                    } else {
                      radioClass = "border-gray-300 opacity-50";
                      textClass = "text-gray-400";
                    }
                  }

                  return (
                    <label
                      key={opt}
                      className={`flex items-center gap-2.5 select-none ${submitted ? "cursor-default" : "cursor-pointer"}`}
                      onClick={() => !submitted && onChange(n, opt)}>
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-lg font-medium shrink-0 ${isReviewMode ? "bg-gray-100 text-gray-500" : "bg-gray-200 text-[#000000]"}`}>
                        {optLetters[i]}
                      </span>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${radioClass}`}>
                        {isSelected && (
                          <span
                            className={`w-2 h-2 rounded-full ${isReviewMode && !isCorrectOption ? "bg-red-600" : isReviewMode && isCorrectOption ? "bg-green-600" : "bg-blue-700"}`}
                          />
                        )}
                      </span>
                      <span
                        className={`text-[13px] sm:text-lg whitespace-nowrap transition-colors ${textClass}`}
                        style={{
                          WebkitUserSelect: "text",
                          userSelect: "text",
                          cursor: "text",
                        }}
                        onMouseDown={(e) => e.stopPropagation()}>
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
              {isReviewMode && (
                <div className="pl-10 mt-2">
                  <ExplainButton
                    qNum={n}
                    ANSWER_KEY={ANSWER_KEY}
                    studentAns={studentAns}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ShortBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
  isReviewMode,
  ANSWER_KEY,
}) {
  // ✅ Pass index to guarantee a unique key
  const renderItem = ({ n, text, afterText }, index) => {
    // If n is "example", append the index to the key. Otherwise, just use n.
    const uniqueKey = n !== undefined ? `q-${n}-${index}` : `item-${index}`;
    
    const studentAns = vals[n] ?? "";
    const { isCorrect, correctAnswer } = getReviewState(
      n,
      studentAns,
      ANSWER_KEY,
    );

    const showCorrection = isReviewMode && !isCorrect; 

    return (
      <li
        key={uniqueKey}
        id={n !== undefined ? `q-${n}` : undefined}
        className="py-2 text-lg text-[#000000] leading-relaxed">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          
          <HighlightableText
            id={`short-${uniqueKey}`}
            text={text}
            highlights={highlights}
            onSelect={onSelect}
          />

          {n !== undefined && n !== "example" && (
            <span
              className="inline-flex items-center gap-1 mx-0.5 align-middle"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}>
              
              {showCorrection && (
                <span className="text-green-600 font-bold mr-1 bg-green-50 px-2 py-0.5 rounded border border-green-200 text-base whitespace-nowrap">
                  {Array.isArray(correctAnswer)
                    ? correctAnswer.join(" OR ")
                    : correctAnswer}
                </span>
              )}

              <span
                className={`inline-flex items-center justify-center border font-bold shrink-0 ${
                  isReviewMode 
                    ? (isCorrect ? "border-green-600 bg-green-50 text-green-700" : "border-red-600 bg-red-50 text-red-700") 
                    : "border-gray-400 bg-white text-[#000000]"
                }`}
                style={{
                  width: 26,
                  height: 30,
                  fontSize: 14,
                  borderRadius: "2px 0 0 2px",
                }}>
                {n}
              </span>
              <input
                type="text"
                value={studentAns}
                onChange={(e) => !submitted && onChange(n, e.target.value)}
                style={{
                  width: 150,
                  height: 30,
                  borderRadius: "0 2px 2px 0",
                  borderLeft: "none",
                }}
                className={`border bg-white outline-none text-base px-2 transition-colors 
                  ${
                    isReviewMode
                      ? isCorrect
                        ? "border-green-600 text-green-700 font-semibold"
                        : "border-red-600 text-red-600 line-through"
                      : "border-gray-400 text-[#000000] focus:border-gray-700"
                  }
                `}
                readOnly={submitted}
                placeholder={isReviewMode && !studentAns ? "Blank" : ""}
              />
            </span>
          )}

          {afterText && (
            <HighlightableText
              id={`short-${uniqueKey}-after`}
              text={afterText}
              highlights={highlights}
              onSelect={onSelect}
            />
          )}
        </div>

        {isReviewMode && n !== undefined && n !== "example" && (
          <div className="mt-1">
            <ExplainButton
              qNum={n}
              ANSWER_KEY={ANSWER_KEY}
              studentAns={studentAns}
            />
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="mb-5 pb-5">
      <SectionLabel
        part={block.part}
        qRange={block.heading}
        instruction={block.sub}
        sub={block.title}
        highlights={highlights}
        onSelect={onSelect}
      />
      {block.questionTitle && (
        <h2 className="text-base font-bold tracking-[0.08em] text-[#000000] mb-2">
          <HighlightableText
            id={"reading-" + block.questionTitle}
            text={block.questionTitle}
            highlights={highlights}
            onSelect={onSelect}
          />
        </h2>
      )}
      {block.themeTitle && (
        <h2 className="text-base font-semibold tracking-[0.08em] text-[#000000] mt-5 mb-2">
          <HighlightableText
            id={"reading-" + block.themeTitle}
            text={block.themeTitle}
            highlights={highlights}
            onSelect={onSelect}
          />
        </h2>
      )}

      {block.bulletPoint ? (
        <ul className="list-disc pl-5 mt-2">
          {block.items.map(renderItem)}
        </ul>
      ) : (
        <div className="mt-2">
          {block.items.map(renderItem)}
        </div>
      )}
    </div>
  );
}
// ── TABLE ─────────────────────────────────────
export function CellContent({
  parts,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
  cellId,
  isReviewMode,
  ANSWER_KEY,
}) {
  return (
    <span>
      {parts.map((part, i) => {
        if (part.text !== undefined)
          return (
            <span key={i} style={{ whiteSpace: "pre-line" }}>
              <HighlightableText
                id={`cell-${cellId}-${i}`}
                text={part.text}
                highlights={highlights}
                onSelect={onSelect}
              />
            </span>
          );
        const n = part.n;
        const studentAns = vals[n] ?? "";
        const { isCorrect, correctAnswer } = getReviewState(
          n,
          studentAns,
          ANSWER_KEY,
        );

        return (
          <span
            key={i}
            className="inline-flex flex-col items-start gap-1 my-0.5">
            <span className="inline-flex items-center gap-1 flex-wrap">
              {isReviewMode && studentAns !== "" && !isCorrect && (
                <span className="text-green-600 font-bold text-xs bg-green-50 px-1.5 py-0.5 rounded border border-green-200 mr-1">
                  {Array.isArray(correctAnswer)
                    ? correctAnswer.join(" OR ")
                    : correctAnswer}
                </span>
              )}
              <span
                className={`inline-flex items-center justify-center min-w-4.5 h-5 border rounded text-[10px] font-bold ${isReviewMode ? (isCorrect ? "border-green-600 bg-green-50 text-green-700" : "border-red-600 bg-red-50 text-red-700") : "border-gray-300 text-gray-500"}`}>
                {n}
              </span>
              <input
                type="text"
                value={studentAns}
                onChange={(e) => !submitted && onChange(n, e.target.value)}
                className={`border rounded px-1.5 py-0.5 text-xs outline-none w-20 sm:w-28 ${isReviewMode ? (isCorrect ? "border-green-600 text-green-700 font-semibold" : "border-red-600 text-red-600 line-through") : "border-dashed border-gray-400 bg-gray-50 focus:border-blue-700 focus:border-solid"}`}
                placeholder="Answer"
                readOnly={submitted}
              />
            </span>
            {isReviewMode && (
              <ExplainButton
                qNum={n}
                ANSWER_KEY={ANSWER_KEY}
                studentAns={studentAns}
              />
            )}
          </span>
        );
      })}
    </span>
  );
}

export function TableBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
  isReviewMode,
  ANSWER_KEY,
}) {
  return (
    <div className="mb-5 bg-white border border-gray-200 rounded p-3 sm:p-4">
      <div className="mb-3">
        <div className="text-[10px] font-bold uppercase tracking-wide text-blue-900 mb-1">
          {block.heading}
        </div>
        <p className="text-sm font-semibold text-gray-900 leading-snug mb-1">
          {block.title}
        </p>
        {block.sub && (
          <p className="text-[12.5px] text-gray-500 leading-relaxed whitespace-pre-line">
            {block.sub}
          </p>
        )}
      </div>
      <div className="overflow-x-auto -mx-3 sm:-mx-4">
        <div className="min-w-125 px-3 sm:px-4">
          <table className="w-full border-collapse text-[11px] sm:text-[12.5px]">
            <thead>
              <tr>
                {block.headers.map((h) => (
                  <th
                    key={h}
                    className="bg-blue-50 border border-gray-300 px-2 py-1.5 text-left font-bold text-blue-900 text-[10px] sm:text-xs whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => {
                const allParts = [...(row.col2 || []), ...(row.col3 || [])];
                const firstQ = allParts.find((p) => p.n !== undefined)?.n;
                return (
                  <tr key={ri} id={firstQ ? `q-${firstQ}` : undefined}>
                    <td className="border border-gray-200 px-2 py-1.5 font-bold text-gray-900 align-top whitespace-nowrap">
                      {row.col0}
                    </td>
                    <td className="border border-gray-200 px-2 py-1.5 text-gray-700 align-top whitespace-nowrap">
                      {row.col1}
                    </td>
                    <td className="border border-gray-200 px-2 py-1.5 text-gray-700 align-top leading-relaxed">
                      <CellContent
                        parts={row.col2}
                        vals={vals}
                        onChange={onChange}
                        submitted={submitted}
                        highlights={highlights}
                        onSelect={onSelect}
                        cellId={`r${ri}-c2`}
                        isReviewMode={isReviewMode}
                        ANSWER_KEY={ANSWER_KEY}
                      />
                    </td>
                    <td className="border border-gray-200 px-2 py-1.5 text-gray-700 align-top leading-relaxed">
                      <CellContent
                        parts={row.col3}
                        vals={vals}
                        onChange={onChange}
                        submitted={submitted}
                        highlights={highlights}
                        onSelect={onSelect}
                        cellId={`r${ri}-c3`}
                        isReviewMode={isReviewMode}
                        ANSWER_KEY={ANSWER_KEY}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── HEADINGS ──────────────────────────────────
export function HeadingsBlock({
  block,
  passage,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
  isReviewMode,
  ANSWER_KEY,
}) {
  return (
    <div className="mb-5 ">
      <div className="mb-3">
        <SectionLabel
          part={block.part}
          qRange={block.heading}
          instruction={block.title}
          sub={block.sub}
          highlights={highlights}
          onSelect={onSelect}
        />
      </div>
      <div className=" p-2.5 mb-4">
        <p className="text-[12px] font-bold uppercase tracking-wide text-[#000000] mb-2">
          List of Headings — drag from here onto the passage paragraphs
        </p>
        <div className="flex flex-col gap-1">
          {passage.headingsList?.map((h, idx) => {
            const placedNs = block.items.filter(
              (item) => normalise(vals[item.n]) === h.id,
            );
            const placed = placedNs.length > 0;
            return (
              <div
                key={idx}
                className={`flex items-start gap-2 bg-white border rounded px-2.5 py-1.5 text-base transition-all select-none ${placed ? "opacity-30 cursor-not-allowed" : "cursor-grab hover:border-blue-700 hover:shadow-sm"}`}
                draggable={!placed && !submitted}
                onDragStart={
                  !placed && !submitted
                    ? (e) => {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("heading-id", h.id);
                      }
                    : undefined
                }>
                <span className="font-bold text-[#000000] font-mono min-w-5">
                  {h.id}
                </span>
                <span className="text-[#000000]">{h.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {block.items.map(({ n, label }) => {
          const placedId = vals[n] ? normalise(vals[n]) : null;
          const heading = placedId
            ? passage.headingsList?.find((h) => h.id === placedId)
            : null;
          const studentAns = vals[n] ?? "";
          const { isCorrect, correctAnswer } = getReviewState(
            n,
            studentAns,
            ANSWER_KEY,
          );

          return (
            <div
              key={n}
              id={`q-${n}`}
              className={`flex flex-col gap-1 border rounded px-2.5 py-1.5 text-base transition-all ${isReviewMode ? (isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") : heading ? "border-blue-400 bg-blue-50" : "border-dashed border-gray-300 bg-gray-50"}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("heading-id");
                if (id && !submitted) onChange(n, id);
              }}>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#000000] px-1.5 py-0.5 rounded font-mono shrink-0">
                  {label}
                </span>
                {isReviewMode && studentAns && !isCorrect && (
                  <span className="text-green-600 font-bold text-sm bg-white px-2 rounded border border-green-200">
                    Correct: {correctAnswer}
                  </span>
                )}
                {heading ? (
                  <>
                    <span
                      className={`font-bold font-mono text-[13px] ${isReviewMode ? (isCorrect ? "text-green-700" : "text-red-600 line-through") : "text-[#000000]"}`}>
                      {heading.id}
                    </span>
                    <span
                      className={`text-[16px] flex-1 leading-snug ${isReviewMode ? (isCorrect ? "text-green-700 font-medium" : "text-red-600 line-through") : "text-[#000000]"}`}>
                      {heading.text}
                    </span>
                    {!submitted && (
                      <button
                        className="text-gray-400 hover:text-red-500 text-[14px] shrink-0 ml-auto"
                        onClick={() => onChange(n, "")}>
                        ✕
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-[11px] text-gray-400 italic flex-1">
                    Drop heading here
                  </span>
                )}
              </div>
              {isReviewMode && (
                <ExplainButton
                  qNum={n}
                  ANSWER_KEY={ANSWER_KEY}
                  studentAns={studentAns}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MCQBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
  isReviewMode,
  ANSWER_KEY,
}) {
  return (
    <div className="mb-5 p-3 sm:p-4">
      <div className="mb-3">
        <SectionLabel
          part={block.part}
          qRange={block.heading}
          instruction={block.sub}
          sub={block.title}
          highlights={highlights}
          onSelect={onSelect}
        />
      </div>
      <div>
        {block.items.map(({ n, text, options }) => {
          const studentAns = vals[n] ?? "";
          const { isCorrect, correctAnswer } = getReviewState(
            n,
            studentAns,
            ANSWER_KEY,
          );

          return (
            <div
              key={n}
              id={`q-${n}`}
              className="border-b border-gray-100 py-4 last:border-b-0 last:pb-0">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-7 h-7 border border-gray-800 flex items-center justify-center text-[13px] sm:text-base font-medium text-[#000000] shrink-0 rounded-xs">
                  {n}
                </div>
                {text && (
                  <p className="text-[13px] sm:text-lg text-[#000000] leading-relaxed flex-1 pt-0.5">
                    <HighlightableText
                      id={`mcq-q${n}`}
                      text={text}
                      highlights={highlights}
                      onSelect={onSelect}
                    />
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3 pl-10">
                {options.map((opt) => {
                  const isSelected = vals[n] === opt.id;
                  const isCorrectOption = correctAnswer === opt.id;

                  let radioClass = isSelected
                    ? "border-blue-700"
                    : "border-gray-400";
                  let textClass = "text-[#000000]";
                  let labelClass = "bg-gray-200 text-[#000000]";

                  if (isReviewMode) {
                    if (isCorrectOption) {
                      radioClass = "border-green-600 bg-green-50";
                      textClass = "text-green-700 font-bold";
                      labelClass = "bg-green-100 text-green-700";
                    } else if (isSelected && !isCorrectOption) {
                      radioClass = "border-red-600 bg-red-50";
                      textClass = "text-red-600 line-through";
                      labelClass = "bg-red-100 text-red-600";
                    } else {
                      radioClass = "border-gray-300 opacity-50";
                      textClass = "text-gray-400 opacity-50";
                      labelClass = "bg-gray-100 text-gray-400 opacity-50";
                    }
                  }

                  return (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-2.5 select-none ${submitted ? "cursor-default" : "cursor-pointer"}`}
                      onClick={() => !submitted && onChange(n, opt.id)}>
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-lg font-medium shrink-0 mt-0.5 transition-colors ${labelClass}`}>
                        {opt.id}
                      </span>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1.5 transition-colors ${radioClass}`}>
                        {isSelected && (
                          <span
                            className={`w-2 h-2 rounded-full ${isReviewMode && !isCorrectOption ? "bg-red-600" : isReviewMode && isCorrectOption ? "bg-green-600" : "bg-blue-700"}`}
                          />
                        )}
                      </span>
                      <span
                        className={`text-lg leading-snug transition-colors ${textClass}`}
                        style={{
                          WebkitUserSelect: "text",
                          userSelect: "text",
                          cursor: "text",
                        }}
                        onMouseDown={(e) => e.stopPropagation()}>
                        <HighlightableText
                          id={`mcq-q${n}-opt-${opt.id}`}
                          text={opt.text}
                          highlights={highlights}
                          onSelect={onSelect}
                        />
                      </span>
                    </label>
                  );
                })}
              </div>
              {isReviewMode && (
                <div className="pl-10 mt-3">
                  <ExplainButton
                    qNum={n}
                    ANSWER_KEY={ANSWER_KEY}
                    studentAns={studentAns}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MULTI-SELECT MCQ ──────────────────────────
export function MultiSelectMCQBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
  isReviewMode,
  ANSWER_KEY,
}) {
  const labels = ["A", "B", "C", "D", "E", "F", "G", "H"];

  
  return (
    <div className="mb-5 p-3">
      <SectionLabel
        part={block.part}
        qRange={block.heading}
        highlights={highlights}
        onSelect={onSelect}
        sub={block.sub}
      />
      {block.items.map((item) => {
        const nums = item.n;
        const maxSelect = nums.length;
        const selected = nums.map((n) => vals[n] ?? "").filter(Boolean);

        const handleToggle = (label) => {
          if (submitted) return;
          if (selected.includes(label)) {
            const targetNum = nums.find((n) => vals[n] === label);
            onChange(targetNum, "");
          } else {
            if (selected.length >= maxSelect) return;
            const emptyNum = nums.find((n) => !vals[n]);
            if (emptyNum !== undefined) onChange(emptyNum, label);
          }
        };

        return (
          <div
            key={nums[0]}
            id={`q-${nums[0]}`}
            className="mb-5 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="min-w-7 h-7 px-1.5 border border-gray-800 flex items-center justify-center text-[13px] sm:text-base font-medium text-[#000000] shrink-0 rounded-[2px]">
                {nums[0]}–{nums[nums.length - 1]}
              </div>
              <span className="text-[11px] sm:text-xs bg-blue-50 text-[#000000] border border-blue-200 px-2 py-0.5 rounded font-semibold">
                Choose {maxSelect} letters
              </span>
            </div>
            <p className="text-lg text-[#000000] leading-relaxed mb-3 pl-10">
              <HighlightableText
                id={`multichoice-q${nums[0]}`}
                text={item.q}
                highlights={highlights}
                onSelect={onSelect}
              />
            </p>
            <div className="flex flex-col gap-3 pl-10">
              {item.opts.map((opt, i) => {
                const label = labels[i];
                const isSelected = selected.includes(label);
                const correctArr =
                  ANSWER_KEY[nums[0]]?.answer || ANSWER_KEY[nums[0]] || [];
                const isCorrectOption =
                  Array.isArray(correctArr) && correctArr.includes(label);
                const isDisabled = !isSelected && selected.length >= maxSelect;

                let badgeClass = isSelected
                  ? ""
                  : isDisabled
                    ? "bg-gray-100 text-gray-400"
                    : "bg-gray-200 text-[#000000]";
                let checkboxClass = isSelected
                  ? "border-blue-700 bg-blue-700"
                  : isDisabled
                    ? "border-gray-200"
                    : "border-gray-400";
                let labelClass = isSelected
                  ? ""
                  : isDisabled
                    ? "text-gray-400"
                    : "text-[#000000]";

                if (isReviewMode) {
                  if (isCorrectOption) {
                    badgeClass = "bg-green-100 text-green-700";
                    checkboxClass = "border-green-600 bg-green-600";
                    labelClass = "text-green-700 font-bold";
                  } else if (isSelected && !isCorrectOption) {
                    badgeClass = "bg-red-100 text-red-600";
                    checkboxClass = "border-red-600 bg-red-600";
                    labelClass = "text-red-600 line-through";
                  } else {
                    badgeClass = "bg-gray-100 text-gray-400 opacity-50";
                    checkboxClass = "border-gray-200 opacity-50";
                    labelClass = "text-gray-400 opacity-50";
                  }
                }

                return (
                  <label
                    key={label}
                    className={`flex items-start gap-2.5 select-none ${!submitted && !isDisabled ? "cursor-pointer" : isDisabled ? "cursor-not-allowed" : ""}`}
                    onClick={() => !isReviewMode && handleToggle(label)}>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-md font-medium shrink-0 mt-0.5 transition-colors ${badgeClass}`}>
                      {label}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-[3px] border-2 flex items-center justify-center shrink-0 mt-1.5 transition-colors ${checkboxClass}`}>
                      {(isSelected || (isReviewMode && isCorrectOption)) && (
                        <svg
                          viewBox="0 0 12 12"
                          className="w-3 h-3 text-white"
                          fill="none">
                          <path
                            d="M2.5 6.5L4.75 8.75L9.5 3.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`flex-1 text-lg leading-snug transition-colors ${labelClass}`}
                      style={{
                        WebkitUserSelect: "text",
                        userSelect: "text",
                        cursor: "text",
                      }}
                      onMouseDown={(e) => e.stopPropagation()}>
                      <HighlightableText
                        id={`multichoice-q${nums[0]}-opt${i}`}
                        text={opt}
                        highlights={highlights}
                        onSelect={onSelect}
                      />
                    </span>
                  </label>
                );
              })}
            </div>
            {isReviewMode && (
              <div className="pl-10 mt-3">
                <ExplainButton
                  qNum={nums[0]}
                  ANSWER_KEY={ANSWER_KEY}
                  studentAns={selected.join(", ")}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── PARA MATCH DRAG ─────────────────────────
export function ParaMatchDragBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
  isReviewMode,
  ANSWER_KEY,
}) {
  const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
  return (
    <div className="mb-5 p-3 sm:p-4">
      <div className="mb-3">
        <SectionLabel
          part={block.part}
          qRange={block.heading}
          instruction={block.sub}
          sub={block.title}
          highlights={highlights}
          onSelect={onSelect}
          note={block.note}
        />
      </div>
      {block?.optionsList?.options?.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-medium text-[#000000] mb-2">
            {block.optionsList.heading}
          </h2>
          <div className="flex flex-col gap-1">
            {block.optionsList.options.map((opt) => (
              <div
                key={opt.id}
                className="text-[13px] sm:text-base text-[#000000]">
                <strong>{opt.id}.</strong>{" "}
                <HighlightableText
                  id={`matrix-opt-${block.heading}-${opt.id}`}
                  text={opt.text}
                  highlights={highlights}
                  onSelect={onSelect}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col">
        {block.items.map(({ n, text }) => {
          const v = vals[n] ?? "";
          const { isCorrect, correctAnswer } = getReviewState(n, v, ANSWER_KEY);

          return (
            <div
              key={n}
              id={`q-${n}`}
              className="flex items-center gap-2 py-2.5 border-b border-gray-100 last:border-b-0">
              <QNum n={n} submitted={submitted} vals={vals} />
              <span className="flex-1 text-[13px] sm:text-lg text-[#000000] leading-relaxed">
                <HighlightableText
                  id={`paramatch-${n}`}
                  text={text}
                  highlights={highlights}
                  onSelect={onSelect}
                />
              </span>

              {isReviewMode && v && !isCorrect && (
                <span className="text-green-600 font-bold text-sm bg-green-50 px-2 py-0.5 rounded border border-green-200">
                  {correctAnswer}
                </span>
              )}

              <select
                value={v}
                disabled={submitted}
                onChange={(e) => onChange(n, e.target.value)}
                className={`shrink-0 border rounded px-1.5 py-1 text-sm font-bold outline-none cursor-pointer transition-colors bg-white ${isReviewMode ? (isCorrect ? "border-green-600 text-green-700" : "border-red-600 text-red-600 line-through") : "border-gray-400 text-[#000000] focus:border-blue-700"}`}>
                <option value="">–</option>
                {LETTERS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              {isReviewMode && (
                <ExplainButton
                  qNum={n}
                  ANSWER_KEY={ANSWER_KEY}
                  studentAns={v}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SummaryCompleteBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
  isReviewMode,
  ANSWER_KEY,
}) {
  const H = (id, text) => (
    <HighlightableText
      id={id}
      text={text}
      highlights={highlights}
      onSelect={onSelect}
    />
  );
  return (
    <div className="mb-5 p-3 sm:p-4">
      <div className="mb-3">
        <SectionLabel
          part={block.part}
          qRange={block.heading}
          highlights={highlights}
          onSelect={onSelect}
          note={block.sub}
          instruction={block.title}
        />
      </div>
      {block.questionTitle && (
        <h2 className="text-base font-bold tracking-[0.08em] text-[#000000] my-3">
          {H("reading" + block.questionTitle, block.questionTitle)}
        </h2>
      )}
      {block.themeTitle && (
        <h2 className="text-base font-semibold tracking-[0.08em] text-[#000000] mt-5">
          {H("reading" + block.themeTitle, block.themeTitle)}
        </h2>
      )}
      <p className="text-base sm:text-lg text-[#000000] leading-[2.2]">
        {block.items.map((seg, i) => {
          if (seg.text !== undefined)
            return (
              <span key={i}>
                <HighlightableText
                  id={`summary-seg-${i}`}
                  text={seg.text}
                  highlights={highlights}
                  onSelect={onSelect}
                />
              </span>
            );

          const n = seg.n;
          const v = vals[n] ?? "";
          const { isCorrect, correctAnswer } = getReviewState(n, v, ANSWER_KEY);

          // ✅ Always show correct answer if reviewing and wrong/blank
          const showCorrection = isReviewMode && !isCorrect;

          return (
            <span
              key={i}
              className="inline-flex items-center gap-1 align-middle mx-1"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}>
              {/* ✅ SHOW CORRECT ANSWER TO THE LEFT (Even if blank) */}
              {showCorrection && (
                <span className="text-green-600 font-bold bg-green-50 border border-green-200 px-2 py-0.5 rounded text-sm whitespace-nowrap mr-1">
                  {Array.isArray(correctAnswer)
                    ? correctAnswer.join(" OR ")
                    : correctAnswer}
                </span>
              )}

              <span
                className={`inline-flex items-center justify-center border font-bold shrink-0 ${isReviewMode ? (isCorrect ? "border-green-600 bg-green-50 text-green-700" : "border-red-600 bg-red-50 text-red-700") : "border-gray-400 bg-white text-[#000000]"}`}
                style={{
                  width: 22,
                  height: 28,
                  fontSize: 11,
                  borderRadius: "2px 0 0 2px",
                  userSelect: "none",
                }}>
                {n}
              </span>
              <input
                type="text"
                value={v}
                onChange={(e) => !submitted && onChange(n, e.target.value)}
                style={{
                  width: 150,
                  height: 28,
                  borderRadius: "0 2px 2px 0",
                  borderLeft: "none",
                }}
                className={`border bg-white outline-none text-base px-2 transition-colors ${isReviewMode ? (isCorrect ? "border-green-600 text-green-700 font-semibold" : "border-red-600 text-red-600 line-through") : "border-gray-400 text-[#000000]"}`}
                readOnly={submitted}
                placeholder={isReviewMode && !v ? "Blank" : ""}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
              />

              {isReviewMode && (
                <ExplainButton
                  qNum={n}
                  ANSWER_KEY={ANSWER_KEY}
                  studentAns={v}
                />
              )}
            </span>
          );
        })}
      </p>
    </div>
  );
}

// ── SENTENCE ENDING ─────────────────────────
export function SentenceEndingBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
  isReviewMode,
  ANSWER_KEY,
}) {
  const options = block.endingsList?.options ?? [];
  return (
    <div className="mb-5 p-3 sm:p-4">
      <div className="mb-3">
        <SectionLabel
          part={block.part}
          qRange={block.heading}
          instruction={block.title}
          sub={block.sub}
          highlights={highlights}
          onSelect={onSelect}
        />
      </div>
      {options.length > 0 && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50/60 p-3">
          <h2 className="mb-2 text-sm font-bold text-[#000000]">
            {block.endingsList?.heading || "List of endings"}
          </h2>
          <div className="flex flex-col gap-1">
            {options.map((opt) => (
              <div
                key={opt.id}
                className="text-[13px] sm:text-base text-[#000000]">
                <strong>{opt.id}.</strong>{" "}
                <HighlightableText
                  id={`sentence-ending-opt-${block.heading}-${opt.id}`}
                  text={opt.text}
                  highlights={highlights}
                  onSelect={onSelect}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {block.items.map(({ n, text }) => {
          const v = vals[n] ?? "";
          const { isCorrect, correctAnswer } = getReviewState(n, v, ANSWER_KEY);
          return (
            <div
              key={n}
              id={`q-${n}`}
              className="flex flex-col gap-2 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 border border-gray-800 flex items-center justify-center text-[13px] sm:text-base font-medium text-[#000000] shrink-0 rounded-xs">
                  {n}
                </div>
                <p className="flex-1 pt-0.5 text-[13px] sm:text-lg leading-relaxed text-[#000000]">
                  <HighlightableText
                    id={`sentence-ending-${n}`}
                    text={text}
                    highlights={highlights}
                    onSelect={onSelect}
                  />
                </p>
              </div>
              <div className="pl-10 flex items-center gap-3">
                {isReviewMode && v && !isCorrect && (
                  <span className="text-green-600 font-bold text-sm bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    {correctAnswer}
                  </span>
                )}
                <select
                  value={v}
                  disabled={submitted}
                  onChange={(e) => onChange(n, e.target.value)}
                  className={`shrink-0 border rounded px-2 py-1 text-sm font-bold outline-none cursor-pointer transition-colors bg-white ${isReviewMode ? (isCorrect ? "border-green-600 text-green-700" : "border-red-600 text-red-600 line-through") : "border-gray-400 text-[#000000]"}`}>
                  <option value="">–</option>
                  {options.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.id}
                    </option>
                  ))}
                </select>
              </div>
              {isReviewMode && (
                <div className="pl-10 mt-1">
                  <ExplainButton
                    qNum={n}
                    ANSWER_KEY={ANSWER_KEY}
                    studentAns={v}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── DIAGRAM ─────────────────────────
export function DiagramBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
  isReviewMode,
  ANSWER_KEY,
}) {
  return (
    <div className="mb-5 p-3 sm:p-4">
      <SectionLabel
        part={block.part}
        qRange={block.heading}
        instruction={block.sub}
        sub={block.title}
        highlights={highlights}
        onSelect={onSelect}
      />
      <div className="my-4 flex justify-center">
        <img
          src={block.imageUrl}
          alt={block.imageAlt || "diagram"}
          className="max-w-full h-auto border border-gray-200 rounded"
          draggable={false}
        />
      </div>
      <ul className="flex flex-col gap-2.5 mt-4">
        {block.items.map(({ n, text, afterText }) => {
          const v = vals[n] ?? "";
          const { isCorrect, correctAnswer } = getReviewState(n, v, ANSWER_KEY);
          return (
            <li
              key={n}
              id={`q-${n}`}
              className="flex flex-col gap-1 text-base sm:text-lg text-[#000000] leading-relaxed">
              <div className="flex items-center gap-2 flex-wrap">
                {isReviewMode && !isCorrect && (
                  <span className="text-green-600 font-bold bg-green-50 border border-green-200 px-2 py-0.5 rounded text-sm">
                    {Array.isArray(correctAnswer)
                      ? correctAnswer.join(" OR ")
                      : correctAnswer}
                  </span>
                )}
                <span
                  className={`inline-flex items-center justify-center border font-bold shrink-0 ${isReviewMode ? (isCorrect ? "border-green-600 bg-green-50 text-green-700" : "border-red-600 bg-red-50 text-red-700") : "border-gray-400 bg-white text-[#000000]"}`}
                  style={{
                    width: 26,
                    height: 30,
                    fontSize: 13,
                    borderRadius: "2px 0 0 2px",
                  }}>
                  {n}
                </span>
                <input
                  type="text"
                  value={v}
                  onChange={(e) => !submitted && onChange(n, e.target.value)}
                  readOnly={submitted}
                  className={`border bg-white outline-none text-base px-2 ${isReviewMode ? (isCorrect ? "border-green-600 text-green-700 font-semibold" : "border-red-600 text-red-600 line-through") : "border-gray-400 text-[#000000] focus:border-gray-700"}`}
                  style={{
                    width: 160,
                    height: 30,
                    borderRadius: "0 2px 2px 0",
                    borderLeft: "none",
                  }}
                />
                {text && (
                  <span>
                    <HighlightableText
                      id={`diagram-${n}`}
                      text={text}
                      highlights={highlights}
                      onSelect={onSelect}
                    />
                  </span>
                )}
                {afterText && (
                  <span>
                    <HighlightableText
                      id={`diagram-${n}-after`}
                      text={afterText}
                      highlights={highlights}
                      onSelect={onSelect}
                    />
                  </span>
                )}
              </div>
              {isReviewMode && (
                <div className="mt-1">
                  <ExplainButton
                    qNum={n}
                    ANSWER_KEY={ANSWER_KEY}
                    studentAns={v}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── PASSAGE RENDERER ─────────────────────────
export function PassageContent({
  passage,
  highlights,
  handleSelect,
  vals,
  onChange,
  submitted,
  isReviewMode,
  ANSWER_KEY,
}) {
  const paragraphs = passage.text.split(/\n\n+/);
  const paraLabelRe = /^\[Paragraph ([A-Z])\]\s*/;

  return (
    <div className="w-full px-4 sm:px-8 py-5 sm:py-6 pb-20 max-w-3xl mx-auto">
      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded mb-3">
        {passage.label}
      </span>
      <h1 className="text-xl sm:text-2xl font-bold text-[#000000] mb-1.5 leading-snug">
        {passage.title}
      </h1>
      <p className="text-base text-[#000000] italic mb-4 leading-relaxed">
        {passage.subtitle}
      </p>
      <div className="w-10 h-0.5 bg-blue-900 mb-5" />

      {paragraphs.map((para, i) => {
        const match = para.match(paraLabelRe);
        const paraLetter = match ? match[1] : null;
        const headingQNum =
          match && passage.paragraphQuestions
            ? passage.paragraphQuestions[paraLetter]
            : null;

        // Clean the text so the sentence splitter works perfectly
        const cleanPara = para.replace(paraLabelRe, "");

        // If it's a heading paragraph, show the drop-zone header above the text
        const HeadingHeader = headingQNum ? (
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#000000] bg-blue-100 px-1.5 py-0.5 rounded font-mono shrink-0">
              Para {paraLetter}
            </span>
            {isReviewMode && (
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-gray-700">
                {/* If they are reviewing, we show the result */}
                {(() => {
                  const data = ANSWER_KEY[headingQNum];
                  const isRich = typeof data === "object";
                  const correctAnswer = isRich ? data.answer : data;
                  const studentAns = vals[headingQNum];
                  const isCorrect =
                    String(studentAns).toLowerCase() ===
                    String(correctAnswer).toLowerCase();
                  return isCorrect ? (
                    <span className="text-green-600">
                      Correct: {correctAnswer}
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Correct Answer: {correctAnswer}
                    </span>
                  );
                })()}
              </span>
            )}
          </div>
        ) : null;

        if (!isReviewMode || !ANSWER_KEY) {
          // Test taking mode (normal text, drop zones)
          return (
            <div key={i} className="mb-4">
              {headingQNum ? (
                <ParagraphWithHeadingDrop
                  paraText={cleanPara}
                  paraLabel={`Para ${paraLetter}`}
                  questionN={headingQNum}
                  vals={vals}
                  onChange={onChange}
                  submitted={submitted}
                  headingsList={passage.headingsList}
                  highlights={highlights}
                  handleSelect={handleSelect}
                  isReviewMode={isReviewMode}
                  ANSWER_KEY={ANSWER_KEY}
                />
              ) : (
                <p
                  className="text-base sm:text-lg leading-[1.85] text-[#000000] select-text"
                  style={{ WebkitUserSelect: "text" }}>
                  <HighlightableText
                    id={`passage-${passage.id}-para-${i}`}
                    text={para}
                    highlights={highlights}
                    onSelect={handleSelect}
                  />
                </p>
              )}
            </div>
          );
        }

        // Review Mode: Highlight logic runs for BOTH headings and normal text
        const sentences = cleanPara.match(/[^.!?]+[.!?]+/g) || [cleanPara];

        return (
          <div key={i} className="mb-4">
            {HeadingHeader}

            {sentences.map((sentence, sIdx) => {
              const matchingQs = Object.entries(ANSWER_KEY).filter(
                ([qNum, data]) => {
                  if (!data || typeof data !== "object" || !data.quote)
                    return false;

                  const cleanSentence = sentence
                    .replace(/[^\w\s]/gi, "")
                    .toLowerCase()
                    .trim();
                  const cleanQuote = data.quote
                    .replace(/[^\w\s]/gi, "")
                    .toLowerCase()
                    .trim();

                  const quoteStart = cleanQuote.slice(0, 30);
                  return (
                    cleanSentence.includes(cleanQuote) ||
                    (quoteStart.length > 10 &&
                      cleanSentence.includes(quoteStart))
                  );
                },
              );

              const isAnswerSentence = matchingQs.length > 0;

              return (
                <span
                  key={sIdx}
                  className={`transition-colors duration-300 ${
                    isAnswerSentence
                      ? "bg-yellow-200 border-b-2 border-yellow-400 pb-0.5 px-0.5 rounded-sm"
                      : ""
                  }`}>
                  <HighlightableText
                    id={`passage-${passage.id}-para-${i}-sent-${sIdx}`}
                    text={sentence}
                    highlights={highlights}
                    onSelect={handleSelect}
                  />
                  {isAnswerSentence && (
                    <span className="inline-flex ml-1.5 align-middle">
                      {matchingQs.map(([num, data]) => {
                        const studentAns = vals[num] || "";
                        const correctAnswer = data.answer;
                        let isCorrect = false;

                        if (Array.isArray(correctAnswer)) {
                          isCorrect = correctAnswer
                            .map((a) => String(a).trim().toLowerCase())
                            .includes(String(studentAns).trim().toLowerCase());
                        } else {
                          isCorrect =
                            String(studentAns).trim().toLowerCase() ===
                              String(correctAnswer).trim().toLowerCase() &&
                            studentAns !== "";
                        }

                        return (
                          <span
                            key={num}
                            className={`inline-flex items-center justify-center px-1.5 h-5 rounded-full text-white text-[10px] font-bold shadow-sm mr-1 ${isCorrect ? "bg-green-600" : "bg-red-500"}`}>
                            {num} {isCorrect ? "✓" : "✕"}
                          </span>
                        );
                      })}
                    </span>
                  )}{" "}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function ParagraphWithHeadingDrop({
  paraText,
  paraLabel,
  questionN,
  vals,
  onChange,
  submitted,
  headingsList,
  highlights,
  handleSelect,
}) {
  const [dragOver, setDragOver] = useState(false);
  const placedId = vals[questionN] ? normalise(vals[questionN]) : null;
  const heading = placedId
    ? headingsList?.find((h) => h.id === placedId)
    : null;
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const id = e.dataTransfer.getData("heading-id");
    if (!id || submitted) return;
    onChange(questionN, id);
  };

  return (
    <div className="mb-6">
      <div
        className="mb-2 flex items-center gap-2"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}>
        <span className="text-[10px] font-bold text-[#000000] bg-blue-100 px-1.5 py-0.5 rounded font-mono shrink-0">
          {paraLabel}
        </span>
        <div
          className={`flex-1 min-h-8 border rounded px-2 py-1 flex items-center gap-2 transition-all ${dragOver ? "border-blue-700 bg-blue-50 border-solid shadow-sm" : heading ? "border-blue-600 bg-blue-50 border-solid" : "border-dashed border-gray-300 bg-gray-50/60"}`}>
          {heading ? (
            <>
              <span className="font-bold font-mono text-[11px] text-[#000000]">
                {heading.id}
              </span>
              <span className="text-base flex-1 leading-snug text-[#000000]">
                {heading.text}
              </span>
              {!submitted && (
                <button
                  className="text-gray-400 hover:text-red-600 text-base shrink-0"
                  onClick={() => onChange(questionN, "")}>
                  ✕
                </button>
              )}
            </>
          ) : (
            <span className="text-base text-gray-400 italic">
              {dragOver ? "Release to assign heading" : "Drop heading here"}
            </span>
          )}
        </div>
      </div>

      <p
        className="text-[14px] sm:text-lg leading-[1.85] text-[#000000] select-text"
        style={{ WebkitUserSelect: "text" }}>
        <HighlightableText
          id={`para-${paraLabel}-${questionN}`}
          text={paraText}
          highlights={highlights}
          onSelect={handleSelect}
        />
      </p>
    </div>
  );
}

export function QNum({ n }) {
  return (
    <span className="inline-flex items-center justify-center min-w-7 h-7 px-1 border rounded text-base font-bold shrink-0 border-gray-300 text-black">
      {n}
    </span>
  );
}

export function RestoreAnswersPopup({ onRestore, onDiscard }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[500] flex items-center justify-between border-t border-gray-300 bg-white px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] sm:px-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        Would you like to restore your answers?
        <button
          onClick={onDiscard}
          className="ml-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-red-700">
          No, delete them
        </button>
        <button
          onClick={onRestore}
          className="rounded-full bg-green-600 px-5 py-1 text-xs font-bold text-white transition hover:bg-green-700">
          Yes
        </button>
      </div>
    </div>
  );
}

function getOfficialReadingBand(correct, total) {
  const scaled = Math.round((correct / total) * 40);
  if (scaled >= 39) return "9.0";
  if (scaled >= 37) return "8.5";
  if (scaled >= 35) return "8.0";
  if (scaled >= 33) return "7.5";
  if (scaled >= 30) return "7.0";
  if (scaled >= 27) return "6.5";
  if (scaled >= 23) return "6.0";
  if (scaled >= 19) return "5.5";
  if (scaled >= 15) return "5.0";
  if (scaled >= 13) return "4.5";
  if (scaled >= 10) return "4.0";
  if (scaled >= 6) return "3.5";
  if (scaled >= 3) return "3.0";
  return "2.5";
}

export function ResultModal({
  vals,
  ANSWER_KEY,
  onClose,
  onRestart,
  onReview,
}) {
  const totalQuestions = Object.keys(ANSWER_KEY || {}).length;
  let correctCount = 0;

  const sortedKeys = Object.keys(ANSWER_KEY || {}).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ""), 10);
    const numB = parseInt(b.replace(/\D/g, ""), 10);
    return numA - numB;
  });

  sortedKeys.forEach((key) => {
    const studentAns = String(vals[key] || "")
      .trim()
      .toLowerCase();
    const correctData = ANSWER_KEY[key] || "";

    // Check if it's the new Rich Format
    const isRichFormat =
      typeof correctData === "object" &&
      correctData !== null &&
      !Array.isArray(correctData);
    const correctAnsRaw = isRichFormat ? correctData.answer : correctData;

    let isCorrect = false;
    if (Array.isArray(correctAnsRaw)) {
      const normalizedArray = correctAnsRaw.map((a) =>
        String(a).trim().toLowerCase(),
      );
      isCorrect = normalizedArray.includes(studentAns);
    } else {
      const correctAns = String(correctAnsRaw || "")
        .trim()
        .toLowerCase();
      isCorrect = studentAns === correctAns && studentAns !== "";
    }

    if (isCorrect) correctCount++;
  });

  const band = getOfficialReadingBand(correctCount, totalQuestions);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Test Results</h2>
            <p className="mt-1 text-sm text-gray-500">
              You scored{" "}
              <strong className="text-indigo-600">{correctCount}</strong> out of{" "}
              {totalQuestions}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Est. Band
            </p>
            <p className="text-2xl font-bold text-green-600">{band}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-[50px_1fr_1fr] bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-wider sm:grid-cols-[60px_1fr_1fr]">
              <div>Q#</div>
              <div>Your Answer</div>
              <div>Correct Answer</div>
            </div>
            <div className="divide-y divide-gray-100">
              {sortedKeys.map((key) => {
                const qNum = key.replace(/\D/g, "");
                const studentAns = vals[key] || "";
                const correctData = ANSWER_KEY[key] || "";
                const isRichFormat =
                  typeof correctData === "object" &&
                  correctData !== null &&
                  !Array.isArray(correctData);
                const correctAnsRaw = isRichFormat
                  ? correctData.answer
                  : correctData;
                let isCorrect = false;
                if (Array.isArray(correctAnsRaw)) {
                  const normalizedArray = correctAnsRaw.map((a) =>
                    String(a).trim().toLowerCase(),
                  );
                  isCorrect = normalizedArray.includes(
                    String(studentAns).trim().toLowerCase(),
                  );
                } else {
                  isCorrect =
                    String(studentAns).trim().toLowerCase() ===
                      String(correctAnsRaw).trim().toLowerCase() &&
                    studentAns !== "";
                }
                return (
                  <div
                    key={key}
                    className={`flex flex-col px-4 py-3 text-sm transition-colors ${isCorrect ? "bg-green-50/30 hover:bg-green-50/60" : "bg-red-50/30 hover:bg-red-50/60"}`}>
                    <div className="grid grid-cols-[50px_1fr_1fr] items-center gap-2 sm:grid-cols-[60px_1fr_1fr]">
                      <div className="font-mono font-bold text-gray-500">
                        {qNum}
                      </div>
                      <div className="pr-2">
                        {studentAns ? (
                          <span
                            className={`font-medium ${isCorrect ? "text-green-700" : "text-red-600 line-through"}`}>
                            {studentAns}
                          </span>
                        ) : (
                          <span className="italic text-gray-400">Blank</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">
                          {Array.isArray(correctAnsRaw)
                            ? correctAnsRaw.join(" OR ")
                            : correctAnsRaw}
                        </span>
                        {isCorrect ? (
                          <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                            ✓
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                            ✕
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            onClick={onRestart}
            className="w-full rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto">
            Retake Test
          </button>
          <button
            onClick={onReview}
            className="w-full rounded-lg border-2 border-indigo-600 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 sm:w-auto">
            Review Answers in Test
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:w-auto">
            Back to Tests
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MATRIX MATCH (radio grid, e.g. "List of People") ──
export function MatrixMatchBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
  isReviewMode,
  ANSWER_KEY,
}) {
  const letters = block?.optionsList?.options?.map((o) => o.id);
  return (
    <div className="mb-5 p-3 sm:p-4">
      <div className="mb-3">
        <SectionLabel
          part={block.part}
          qRange={block.heading}
          instruction={block.sub}
          sub={block.title}
          highlights={highlights}
          onSelect={onSelect}
        />
      </div>
      {!block.optionsList.optionHide && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-[#000000] mb-2">
            {block.optionsList.heading}
          </h2>
          <div className="flex flex-col gap-1">
            {block.optionsList.options.map((opt) => (
              <div
                key={opt.id}
                className="text-[13px] sm:text-base text-[#000000]">
                <strong>{opt.id}.</strong>{" "}
                <HighlightableText
                  id={`matrix-opt-${block.heading}-${opt.id}`}
                  text={opt.text}
                  highlights={highlights}
                  onSelect={onSelect}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="overflow-x-auto -mx-3 sm:-mx-4">
        <div className="min-w-125 px-3 sm:px-4">
          <table className="w-full border-collapse text-[12px] sm:text-[13px]">
            <thead>
              <tr>
                <th className="border border-gray-500 bg-gray-50 px-2 py-1.5" />
                {letters?.map((l) => (
                  <th
                    key={l}
                    className="border border-gray-500 bg-gray-50 px-2 py-1.5 text-center font-bold text-[#000000] w-10">
                    {l}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.items.map(({ n, text }) => {
                const v = vals[n] ?? "";
                const { isCorrect, correctAnswer } = getReviewState(
                  n,
                  v,
                  ANSWER_KEY,
                );
                return (
                  <tr key={n} id={`q-${n}`}>
                    <td className="border border-gray-500 px-2 py-2 align-top">
                      <div className="flex items-start gap-2">
                        <QNum n={n} submitted={submitted} vals={vals} />
                        <span className="text-[13px] sm:text-base text-[#000000] leading-relaxed">
                          <HighlightableText
                            id={`matrix-item-${n}`}
                            text={text}
                            highlights={highlights}
                            onSelect={onSelect}
                          />
                        </span>
                      </div>
                      {isReviewMode && v && !isCorrect && (
                        <div className="text-green-600 font-bold text-xs bg-green-50 px-1.5 py-0.5 rounded border border-green-200 mt-2">
                          Correct: {correctAnswer}
                        </div>
                      )}
                      {isReviewMode && (
                        <div className="mt-2">
                          <ExplainButton
                            qNum={n}
                            ANSWER_KEY={ANSWER_KEY}
                            studentAns={v}
                          />
                        </div>
                      )}
                    </td>
                    {letters?.map((l) => {
                      const isSelected = normalise(v) === normalise(l);
                      const isCorrectOption =
                        normalise(correctAnswer) === normalise(l);

                      let circleClass = "border-gray-300";
                      if (isReviewMode) {
                        if (isCorrectOption)
                          circleClass = "border-green-600 bg-green-400";
                        else if (isSelected && !isCorrectOption)
                          circleClass = "border-red-600 bg-red-400";
                      } else if (isSelected) {
                        circleClass = "border-blue-700 bg-blue-400";
                      }

                      return (
                        <td
                          key={l}
                          className="border border-gray-500 text-center align-middle cursor-pointer"
                          onClick={() => !submitted && onChange(n, l)}>
                          <span
                            className={`inline-block w-4 h-4 rounded-full border-[1.5px] ${circleClass}`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function SummaryCompleteDragBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
  isReviewMode,
  ANSWER_KEY,
}) {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [touchDrag, setTouchDrag] = useState(null);

  const options = block.wordList?.options ?? [];
  const blankNs = block.items
    .filter((seg) => seg.n !== undefined)
    .map((seg) => seg.n);
  const placedIds = blankNs
    .map((n) => vals[n])
    .filter(Boolean)
    .map((v) => v.toUpperCase());

  const getOption = (id) => options.find((o) => o.id === id?.toUpperCase());

  const clearFromOtherBlanks = (id) => {
    blankNs.forEach((otherN) => {
      if ((vals[otherN] || "").toUpperCase() === id.toUpperCase()) {
        onChange(otherN, "");
      }
    });
  };

  const onDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };
  const onDragEnd = () => {
    setDraggedId(null);
    setDragOverSlot(null);
  };
  const onDropSlot = (e, n) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    clearFromOtherBlanks(id);
    onChange(n, id.toUpperCase());
    setDragOverSlot(null);
    setDraggedId(null);
  };
  const onDragStartFromSlot = (e, n, id) => {
    onChange(n, "");
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };
  const onTouchStartChip = (e, id) => {
    const t = e.touches[0];
    setTouchDrag({ id, x: t.clientX, y: t.clientY });
  };
  const onTouchStartSlotChip = (e, n, id) => {
    onChange(n, "");
    const t = e.touches[0];
    setTouchDrag({ id, x: t.clientX, y: t.clientY });
  };

  useEffect(() => {
    if (!touchDrag) return;
    const move = (e) => {
      const t = e.touches[0];
      setTouchDrag((p) => (p ? { ...p, x: t.clientX, y: t.clientY } : null));
      e.preventDefault();
    };
    const end = () => {
      if (!touchDrag) return;
      const el = document.elementFromPoint(touchDrag.x, touchDrag.y);
      const slot = el?.closest("[data-scslot]");
      if (slot) {
        const n = Number(slot.dataset.scslot);
        clearFromOtherBlanks(touchDrag.id);
        onChange(n, touchDrag.id.toUpperCase());
      }
      setTouchDrag(null);
    };
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
    return () => {
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };
  }, [touchDrag]);

  return (
    <div className="mb-5 p-3 sm:p-4">
      <div className="mb-3">
        <SectionLabel
          part={block.part}
          qRange={block.heading}
          instruction={block.title}
          sub={block.sub}
          highlights={highlights}
          onSelect={onSelect}
        />
      </div>

      {block.questionTitle && (
        <h2 className="text-base font-bold tracking-[0.08em] text-[#000000] my-3">
          {block.questionTitle}
        </h2>
      )}

      {/* Word bank (Hidden in Review Mode) */}
      {!isReviewMode && (
        <div
          className="bg-blue-50 border border-blue-200 rounded p-2.5 sm:p-3 mb-4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setDraggedId(null);
          }}>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#000000] mb-2">
            {block.wordList?.heading || "Word list"}
          </p>
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => {
              const placed = placedIds.includes(opt.id);
              const dragging = draggedId === opt.id;
              return (
                <div
                  key={opt.id}
                  draggable={!placed && !submitted}
                  onDragStart={
                    !placed && !submitted
                      ? (e) => onDragStart(e, opt.id)
                      : undefined
                  }
                  onDragEnd={onDragEnd}
                  onTouchStart={
                    !placed && !submitted
                      ? (e) => onTouchStartChip(e, opt.id)
                      : undefined
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-sm transition-all select-none border-blue-200 bg-white
                    ${placed ? "opacity-25 cursor-not-allowed" : dragging ? "opacity-40 cursor-grab" : "cursor-grab hover:bg-blue-100"}`}>
                  <span className="font-bold text-[#000000]">{opt.id} –</span>
                  <span className="text-[#000000]">{opt.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Summary paragraph */}
      <p className="text-base sm:text-lg text-[#000000] leading-[2.1]">
        {block.items.map((seg, i) => {
          if (seg.text !== undefined) {
            return (
              <span key={i} style={{ whiteSpace: "pre-line" }}>
                <HighlightableText
                  id={`summarydrag-seg-${i}`}
                  text={seg.text}
                  highlights={highlights}
                  onSelect={onSelect}
                />
              </span>
            );
          }

          const n = seg.n;
          const placedId = vals[n] ? vals[n].toUpperCase() : null;
          const option = placedId ? getOption(placedId) : null;
          const over = dragOverSlot === n;

          const { isCorrect, correctAnswer } = getReviewState(
            n,
            vals[n] || "",
            ANSWER_KEY,
          );
          const showCorrection = isReviewMode && !isCorrect;

          return (
            <span
              key={i}
              id={`q-${n}`}
              data-scslot={n}
              className={`inline-flex items-center gap-1 align-middle mx-1 px-1 py-0.5 border rounded transition-all
                ${
                  isReviewMode
                    ? isCorrect
                      ? "border-green-600 bg-green-50"
                      : "border-red-600 bg-red-50"
                    : over
                      ? "border-blue-700 bg-blue-50 border-solid"
                      : option
                        ? "border-blue-600 border-solid bg-blue-50"
                        : "border-dashed border-gray-400 bg-gray-50"
                }`}
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                minWidth: 90,
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverSlot(n);
              }}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={(e) => onDropSlot(e, n)}>
              
              {/* ✅ SHOW CORRECT ANSWER TO THE LEFT IF WRONG */}
              {showCorrection && (
                <span className="text-green-600 font-bold text-xs bg-green-100 px-1.5 py-0.5 rounded mr-1 whitespace-nowrap">
                  Correct: {Array.isArray(correctAnswer) ? correctAnswer.join(" OR ") : correctAnswer}
                </span>
              )}

              {/* ✅ SHOW NUMBER BADGE */}
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 ${isReviewMode ? (isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white') : 'bg-gray-200 text-gray-600'}`}>
                {n}
              </span>

              {/* THE DRAG CHIP / EMPTY STATE */}
              {option ? (
                <span
                  className={`flex items-center gap-1 ${isReviewMode ? (isCorrect ? "text-green-700 font-bold" : "text-red-600 line-through") : "cursor-grab"}`}
                  draggable={!submitted && !isReviewMode}
                  onDragStart={
                    !submitted && !isReviewMode
                      ? (e) => onDragStartFromSlot(e, n, placedId)
                      : undefined
                  }
                  onDragEnd={onDragEnd}
                  onTouchStart={
                    !submitted && !isReviewMode
                      ? (e) => onTouchStartSlotChip(e, n, placedId)
                      : undefined
                  }>
                  <span className="font-bold">{option.id}</span>
                  <span>{option.text}</span>
                  {!submitted && !isReviewMode && (
                    <button
                      type="button"
                      className="text-gray-400 hover:text-red-500 text-xs ml-1"
                      onClick={() => onChange(n, "")}>
                      ✕
                    </button>
                  )}
                </span>
              ) : (
                <span className="text-gray-400 italic text-sm">
                  {isReviewMode ? "Blank" : over ? "Release" : "Drop here"}
                </span>
              )}

              {/* EXPLAIN BUTTON */}
              {isReviewMode && (
                <ExplainButton
                  qNum={n}
                  ANSWER_KEY={ANSWER_KEY}
                  studentAns={vals[n]}
                />
              )}
            </span>
          );
        })}
      </p>

      {touchDrag && (
        <div
          className="fixed z-[9999] pointer-events-none flex items-center gap-1.5 bg-blue-800 rounded px-3 py-1.5 text-white text-xs shadow-xl"
          style={{ left: touchDrag.x - 60, top: touchDrag.y - 18 }}>
          <span className="font-bold">{touchDrag.id}</span>
          <span>{getOption(touchDrag.id)?.text}</span>
        </div>
      )}
    </div>
  );
}

export function QuestionBlock({
  block,
  passage,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
  isReviewMode,
  ANSWER_KEY,
}) {
  const props = {
    block,
    passage,
    vals,
    onChange,
    submitted,
    highlights,
    onSelect,
    isReviewMode,
    ANSWER_KEY,
  };

  if (block?.type === "diagram") return <DiagramBlock {...props} />;
  if (block?.type === "sentence_ending")
    return <SentenceEndingBlock {...props} />;
  if (block?.type === "summary_complete_drag")
    return <SummaryCompleteDragBlock {...props} />;
  if (block?.type === "summary_complete")
    return <SummaryCompleteBlock {...props} />;
  if (block?.type === "para_match_drag")
    return <ParaMatchDragBlock {...props} />;
  if (block?.type === "tfng") return <TFNGBlock {...props} />;
  if (block?.type === "short") return <ShortBlock {...props} />;
  if (block?.type === "table") return <TableBlock {...props} />;
  if (block?.type === "headings") return <HeadingsBlock {...props} />;
  if (block?.type === "mcq") return <MCQBlock {...props} />;
  if (block?.type === "complete_drag")
    return <SummaryCompleteDragBlock {...props} />;
  if (block?.type === "multiChoiceMCQ")
    return <MultiSelectMCQBlock {...props} />;
  if (block?.type === "matchAnswer") return <ParaMatchDragBlock {...props} />;
  if (block?.type === "matrix_match") return <MatrixMatchBlock {...props} />;
  return null;
}
