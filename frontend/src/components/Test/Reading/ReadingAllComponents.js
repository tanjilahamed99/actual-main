import { useState, useEffect, useRef, useCallback } from "react";

const supportsCSSHighlight =
  typeof window !== "undefined" &&
  "Highlight" in window &&
  !!window.CSS?.highlights;

// ── SCORING ────────────────────────────────────
// Handles both single-value answers ("TRUE") and multi-value ones
// (arrays, e.g. multi-select MCQ where either order is acceptable).
export function scoreReadingAnswers(vals, answerKey) {
  const results = []; // [{ n, userAnswer, correctAnswer, isCorrect }]
  let correct = 0;

  Object.entries(answerKey).forEach(([n, correctAnswer]) => {
    const userAnswer = vals[n] ?? "";
    let isCorrect = false;

    if (Array.isArray(correctAnswer)) {
      // accept any one of multiple valid answers for that slot
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
export function getTextOffset(container, targetNode, targetOffset) {
  let total = 0;
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null,
  );
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node === targetNode) return total + targetOffset;
    total += node.textContent.length;
  }
  return total;
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

// ── HIGHLIGHT ROOT (Reading-owned) ────────────
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

// ── NOTE MODAL (Reading-owned, was missing) ───
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
    const n = {
      id: Date.now().toString(),
      zoneId: selection.zoneId,
      start: selection.start,
      end: selection.end,
    };
    setHighlights((p) => [
      ...p.filter(
        (h) => !(h.zoneId === n.zoneId && h.end > n.start && h.start < n.end),
      ),
      n,
    ]);
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  }, [selection]);

  const handleClear = useCallback(() => {
    if (!selection) return;
    setHighlights((p) =>
      p.filter(
        (h) =>
          !(
            h.zoneId === selection.zoneId &&
            h.start < selection.end &&
            h.end > selection.start
          ),
      ),
    );
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

// ── Helper: splits text into segments, marking ALL-CAPS instruction
// phrases (e.g. "ONE WORD ONLY", "TWO WORDS AND/OR A NUMBER") as bold ──
function splitBoldCapsSegments(text) {
  if (!text) return [{ text: "", bold: false }];

  // Matches runs of uppercase words (allowing AND/OR style slashes),
  // e.g. "ONE WORD ONLY", "NO MORE THAN TWO WORDS", "A NUMBER"
  const regex = /\b[A-Z]+(?:\/[A-Z]+)?(?:\s+[A-Z]+(?:\/[A-Z]+)?)*\b/g;

  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matched = match[0];
    const words = matched.split(/\s+/);
    // Require at least one word of length >= 3 so we don't bold
    // stray single letters like a lone "A" or "I" mid-sentence
    const hasSubstantialWord = words.some(
      (w) => w.replace("/", "").length >= 3,
    );
    if (!hasSubstantialWord) continue;

    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), bold: false });
    }
    segments.push({ text: matched, bold: true });
    lastIndex = match.index + matched.length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), bold: false });
  }

  return segments.length ? segments : [{ text, bold: false }];
}

// ── Renders a string as bold/normal segments, wrapping each in
// HighlightableText so selection/highlighting still works per-segment ──
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
  const H = (id, text) => (
    <HighlightableText
      id={id}
      text={text}
      highlights={highlights}
      onSelect={onSelect}
    />
  );

  return (
    <div className="mb-6">
      {qRange && (
        <p className="text-xl font-semibold tracking-widest text-[#1e293b] mb-3">
          {H("section-label-question-title" + qRange + part, qRange)}
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

export function MatchingBlock({
  items,
  matchOptions,
  vals,
  onChange,
  highlights,
  onSelect,
}) {
  const letters = Object.keys(matchOptions);
  const [draggedLetter, setDraggedLetter] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  const usedMap = {};
  items.forEach((item) => {
    const v = vals[item.num];
    if (v) usedMap[v] = item.num;
  });

  const startFromPool = (letter) => {
    setDraggedLetter(letter);
    setDragSource("pool");
  };
  const startFromSlot = (letter, num) => {
    setDraggedLetter(letter);
    setDragSource(num);
  };
  const dropOnSlot = (targetNum) => {
    if (!draggedLetter) return;
    const existing = vals[targetNum];
    if (existing && existing !== draggedLetter) onChange(targetNum, "");
    if (typeof dragSource === "number") onChange(dragSource, "");
    onChange(targetNum, draggedLetter);
    reset();
  };
  const dropOnPool = () => {
    if (draggedLetter && typeof dragSource === "number")
      onChange(dragSource, "");
    reset();
  };
  const reset = () => {
    setDraggedLetter(null);
    setDragSource(null);
    setDragOverSlot(null);
  };
  const clearSlot = (num) => onChange(num, "");

  return (
    <div className="flex flex-col lg:flex-row gap-20 items-start mb-6">
      <div className="space-y-3">
        {items.map((item) => {
          const assigned = vals[item.num] || "";
          const isOver = dragOverSlot === item.num;
          return (
            <div
              key={item.num}
              id={`q-${item.num}`}
              className="flex items-center gap-3 flex-wrap">
              <span className="text-base text-[#000000] min-w-0">
                <HighlightableText
                  id={`match-q${item.num}`}
                  text={`• ${item.q}`}
                  highlights={highlights}
                  onSelect={onSelect}
                />
              </span>
              <div className="flex items-center shrink-0">
                <span
                  className="inline-flex items-center justify-center border border-gray-400 bg-white text-[#000000] text-[11px] font-bold shrink-0"
                  style={{
                    width: 26,
                    height: 32,
                    borderRadius: "2px 0 0 2px",
                    userSelect: "none",
                  }}>
                  {item.num}
                </span>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlot(item.num);
                  }}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={() => dropOnSlot(item.num)}
                  style={{
                    width: 160,
                    height: 32,
                    borderRadius: "0 2px 2px 0",
                    border: assigned
                      ? "1.5px solid #1e293b"
                      : isOver
                        ? "1.5px dashed #3b82f6"
                        : "1.5px dashed #9ca3af",
                    background: assigned
                      ? "#1e293b"
                      : isOver
                        ? "rgba(59,130,246,0.06)"
                        : "white",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "0 8px",
                    transition: "all 0.15s",
                    cursor: assigned ? "default" : "copy",
                  }}>
                  {assigned ? (
                    <>
                      <div
                        draggable
                        onDragStart={() => startFromSlot(assigned, item.num)}
                        className="flex items-center gap-1.5 flex-1 cursor-grab"
                        style={{ overflow: "hidden" }}>
                        <span
                          className="text-[11px] font-bold text-white shrink-0"
                          style={{ minWidth: 14 }}>
                          {assigned}.
                        </span>
                        <span
                          className="text-white text-[12px] truncate"
                          style={{ flex: 1 }}>
                          {matchOptions[assigned]}
                        </span>
                      </div>
                      <button
                        onClick={() => clearSlot(item.num)}
                        className="text-gray-400 hover:text-white text-[13px] shrink-0 leading-none"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}>
                        ✕
                      </button>
                    </>
                  ) : (
                    <span
                      style={{
                        fontSize: 11,
                        color: isOver ? "#3b82f6" : "#9ca3af",
                        userSelect: "none",
                      }}>
                      Drop answer here
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="shrink-0 w-full lg:w-64 rounded-xl border border-gray-200 overflow-hidden"
        onDragOver={(e) => e.preventDefault()}
        onDrop={dropOnPool}>
        <div
          className="px-3 py-2 border-b border-gray-200"
          style={{ background: "#fafafa" }}>
          <p className="text-[11px] italic" style={{ color: "#c8963e" }}>
            Drag and drop an option to fill in each blank.
          </p>
        </div>
        <div className="p-2 space-y-1.5">
          {letters.map((letter) => {
            const inPool = !usedMap[letter];
            return (
              <div
                key={letter}
                draggable={inPool}
                onDragStart={() => inPool && startFromPool(letter)}
                onDragEnd={reset}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm transition-all"
                style={{
                  border: inPool ? "1px solid #e5e7eb" : "1px solid #f3f4f6",
                  background: inPool ? "white" : "#f9fafb",
                  opacity: inPool ? 1 : 0.35,
                  cursor: inPool ? "grab" : "not-allowed",
                  userSelect: "none",
                  boxShadow:
                    inPool && draggedLetter === letter
                      ? "0 4px 12px rgba(0,0,0,0.15)"
                      : "none",
                }}>
                <span
                  className="font-bold shrink-0"
                  style={{ color: "#6b7280", minWidth: 18 }}>
                  {letter}.
                </span>
                <span style={{ color: "#111827", fontSize: 13 }}>
                  {matchOptions[letter]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function normalise(s) {
  return (s || "").toLowerCase().trim().replace(/\s+/g, " ");
}

// ── HIGHLIGHT ─────────────────────────────────
export function buildSpans(text, zoneHighlights) {
  if (!zoneHighlights.length) return [{ text, hl: false }];
  let pts = new Set([0, text.length]);
  zoneHighlights.forEach((h) => {
    pts.add(h.start);
    pts.add(h.end);
  });
  const arr = [...pts].sort((a, b) => a - b);
  return arr.slice(0, -1).map((start, i) => {
    const end = arr[i + 1];
    const hl = zoneHighlights.some((h) => h.start <= start && h.end >= end);
    return { text: text.slice(start, end), hl };
  });
}

export function useHighlights() {
  const [highlights, setHighlights] = useState([]);
  const [selection, setSelection] = useState(null);
  const isHighlighted = selection
    ? highlights.some(
        (h) =>
          h.zoneId === selection.zoneId &&
          h.start <= selection.start &&
          h.end >= selection.end,
      )
    : false;
  const handleSelect = useCallback((sel) => setSelection(sel), []);
  const addHighlight = useCallback(() => {
    if (!selection) return;
    setHighlights((prev) => {
      const rest = prev.filter(
        (h) =>
          !(
            h.zoneId === selection.zoneId &&
            h.end > selection.start &&
            h.start < selection.end
          ),
      );
      return [...rest, { id: Date.now(), ...selection }];
    });
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  }, [selection]);
  const clearHighlight = useCallback(() => {
    if (!selection) return;
    setHighlights((prev) =>
      prev.filter(
        (h) =>
          !(
            h.zoneId === selection.zoneId &&
            h.start < selection.end &&
            h.end > selection.start
          ),
      ),
    );
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  }, [selection]);
  const dismiss = useCallback(() => {
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }, []);
  return {
    highlights,
    selection,
    isHighlighted,
    handleSelect,
    addHighlight,
    clearHighlight,
    dismiss,
  };
}

// ── NOTES ─────────────────────────────────────
export function useNotes() {
  const [notes, setNotes] = useState({ 1: "", 2: "", 3: "" });
  const updateNote = useCallback((passageId, text) => {
    setNotes((prev) => ({ ...prev, [passageId]: text }));
  }, []);
  return { notes, updateNote };
}

// ── DIVIDER ───────────────────────────────────
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

// ── BAND SCORE ────────────────────────────────
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

// ── Q NUM ─────────────────────────────────────
export function QNum({ n }) {
  return (
    <span className="inline-flex items-center justify-center min-w-7 h-7 px-1 border rounded text-base font-bold shrink-0 border-gray-300 text-black">
      {n}
    </span>
  );
}

// ── TFNG ──────────────────────────────────────
export function TFNGBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
}) {
  const H = (id, text) => (
    <HighlightableText
      id={id}
      text={text}
      highlights={highlights}
      onSelect={onSelect}
    />
  );
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
                  {H("reading-true-false" + opt, opt)}
                </span>
                <span className="text-[#000000]">
                  {H(
                    "reading-true-false" + block.optionLabels[opt],
                    block.optionLabels[opt],
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {block.items.map(({ n, text }) => (
          <div
            key={n}
            id={`q-${n}`}
            className="border-b border-gray-100 py-4 last:border-b-0 last:pb-0">
            {/* Question row: boxed number + text */}
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-7 h-7 border border-gray-800 flex items-center justify-center
                  text-[13px] sm:text-base font-medium text-[#000000] shrink-0 rounded-xs">
                {n}
              </div>
              <p
                className="text-[13px] sm:text-lg text-[#000000] leading-relaxed flex-1 pt-0.5"
                style={{
                  WebkitUserSelect: "text",
                }}>
                <HighlightableText
                  id={`tfng-${n}`}
                  text={text}
                  highlights={highlights}
                  onSelect={onSelect}
                />
              </p>
            </div>

            {/* Options: letter badge + separate radio circle + label */}
            <div className="flex flex-col gap-3 pl-10">
              {block.options.map((opt, i) => {
                const letter = optLetters[i];
                const isSelected = vals[n] === opt;
                const radioClass = isSelected
                  ? "border-blue-700"
                  : "border-gray-400";
                return (
                  <label
                    key={opt}
                    className="flex items-center gap-2.5 select-none cursor-pointer"
                    onClick={() => !submitted && onChange(n, opt)}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-lg font-medium shrink-0 bg-gray-200 text-[#000000]">
                      {letter}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${radioClass}`}>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-blue-700" />
                      )}
                    </span>
                    <span
                      style={{
                        WebkitUserSelect: "text",
                        userSelect: "text",
                        cursor: "text",
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="text-[13px] sm:text-lg whitespace-nowrap text-[#000000]">
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SHORT ─────────────────────────────────────
export function ShortBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
}) {
  const H = (id, text) => (
    <HighlightableText
      id={id}
      text={text}
      highlights={highlights}
      onSelect={onSelect}
    />
  );

  const renderItem = ({ n, text, afterText }) => {
    return (
      <li
        key={n === "example" ? n + text + n : n}
        id={`q-${n}`}
        className="py-1.5 text-lg text-[#000000] leading-relaxed">
        {n === "example" ? (
          <>
            {" "}
            <HighlightableText
              id={`short-${n}` + text + "example"}
              text={text}
              highlights={highlights}
              onSelect={onSelect}
            />{" "}
          </>
        ) : (
          <>
            {" "}
            <HighlightableText
              id={`short-${n}`}
              text={text}
              highlights={highlights}
              onSelect={onSelect}
            />{" "}
            <span
              className="inline-flex items-center gap-0 mx-0.5 align-middle"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}>
              <span
                className="inline-flex items-center justify-center border border-gray-400 bg-white text-[#000000] font-bold shrink-0"
                style={{
                  width: 25,
                  height: 30,
                  fontSize: 14,
                  borderRadius: "2px 0 0 2px",
                  userSelect: "none",
                }}>
                {n}
              </span>
              <input
                type="text"
                value={vals[n] ?? ""}
                onChange={(e) => !submitted && onChange(n, e.target.value)}
                style={{
                  width: 150,
                  height: 30,
                  borderRadius: "0 2px 2px 0",
                  borderLeft: "none",
                }}
                className={`border bg-white outline-none text-lg text-[#000000] px-2 transition-colors
              ${"border-gray-400 focus:border-gray-700"}`}
                readOnly={submitted}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
              />
            </span>
          </>
        )}

        {afterText && (
          <>
            {" "}
            <HighlightableText
              id={`short-${n}afterText-1`}
              text={afterText}
              highlights={highlights}
              onSelect={onSelect}
            />
          </>
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
        <h2 className="text-base font-bold tracking-[0.08em] text-[#000000]">
          {H("reading" + block.questionTitle, block.questionTitle)}
        </h2>
      )}
      {block.themeTitle && (
        <h2 className="text-base font-semibold tracking-[0.08em] text-[#000000] mt-5">
          {H("reading" + block.themeTitle, block.themeTitle)}
        </h2>
      )}

      {block.bulletPoint ? (
        <ul className="list-disc pl-10 mt-2">{block.items.map(renderItem)}</ul>
      ) : (
        <div>
          {block.items.map(({ n, text, afterText }, idx) => {
            return (
              <div
                key={idx}
                id={`q-${n}`}
                className="py-2.5 border-b border-gray-100 last:border-b-0">
                <p className="text-lg text-[#000000] leading-relaxed flex-wrap inline">
                  {n === "example" ? (
                    <>
                      <HighlightableText
                        id={`short-${n}`}
                        text={text}
                        highlights={highlights}
                        onSelect={onSelect}
                      />{" "}
                    </>
                  ) : (
                    <>
                      <HighlightableText
                        id={`short-${n}`}
                        text={text}
                        highlights={highlights}
                        onSelect={onSelect}
                      />{" "}
                      <span
                        className="inline-flex items-center gap-0 mx-0.5 align-middle"
                        style={{ userSelect: "none", WebkitUserSelect: "none" }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onMouseUp={(e) => e.stopPropagation()}>
                        <span
                          className="inline-flex items-center justify-center border border-gray-400 bg-white text-[#000000]
                       font-bold shrink-0"
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
                          value={vals[n] ?? ""}
                          onChange={(e) =>
                            !submitted && onChange(n, e.target.value)
                          }
                          style={{
                            width: 150,
                            height: 28,
                            borderRadius: "0 2px 2px 0",
                            borderLeft: "none",
                          }}
                          className={`border bg-white outline-none text-lg text-[#000000] px-2 transition-colors
                        border-gray-400 focus:border-gray-700`}
                          readOnly={submitted}
                          onMouseDown={(e) => e.stopPropagation()}
                          onMouseUp={(e) => e.stopPropagation()}
                        />
                      </span>
                    </>
                  )}
                  {afterText && (
                    <>
                      <HighlightableText
                        id={`short-${n}afterText-1`}
                        text={afterText}
                        highlights={highlights}
                        onSelect={onSelect}
                      />
                    </>
                  )}
                </p>
              </div>
            );
          })}
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

        return (
          <span
            key={i}
            className="inline-flex items-center gap-1 flex-wrap my-0.5">
            <span className="inline-flex items-center justify-center min-w-4.5 h-5 border border-gray-300 rounded text-[10px] font-bold text-gray-500">
              {n}
            </span>
            <input
              type="text"
              value={vals[n] ?? ""}
              onChange={(e) => !submitted && onChange(n, e.target.value)}
              className={`border rounded px-1.5 py-0.5 text-xs outline-none w-20 sm:w-28 
                 "border-dashed border-gray-400 bg-gray-50 focus:border-blue-700 focus:border-solid`}
              placeholder="Answer"
              readOnly={submitted}
            />
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
                // Find the first question number in this row for scroll targeting
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
                className={`flex items-start gap-2 bg-white border rounded px-2.5 py-1.5 text-base  transition-all 
                  select-none
                  ${placed ? "opacity-30 cursor-not-allowed" : "cursor-grab hover:border-blue-700 hover:shadow-sm"}`}
                draggable={!placed && !submitted}
                onDragStart={
                  !placed && !submitted
                    ? (e) => {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("heading-id", h.id);
                      }
                    : undefined
                }>
                <span className="font-bold text-[#000000]  font-mono min-w-5">
                  {h.id}
                </span>
                <span className="text-[#000000]">{h.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Per-question anchor divs so bottom nav chip clicks can scroll here */}
      <div className="flex flex-col gap-2">
        {block.items.map(({ n, label }) => {
          const placedId = vals[n] ? normalise(vals[n]) : null;
          const heading = placedId
            ? passage.headingsList?.find((h) => h.id === placedId)
            : null;
          return (
            <div
              key={n}
              id={`q-${n}`}
              className={`flex items-center gap-2 border rounded px-2.5 py-1.5 text-base transition-all
                ${
                  heading
                    ? "border-blue-400 bg-blue-50"
                    : "border-dashed border-gray-300 bg-gray-50"
                }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("heading-id");
                if (id && !submitted) onChange(n, id);
              }}>
              <span className="text-sm font-bold text-[#000000]  px-1.5 py-0.5 rounded font-mono shrink-0">
                {label}
              </span>
              {heading ? (
                <>
                  <span className="font-bold text-[#000000] font-mono text-[13px]">
                    {heading.id}
                  </span>
                  <span className="text-[16px] text-[#000000] flex-1 leading-snug">
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
          );
        })}
      </div>
    </div>
  );
}

// ── MCQ ───────────────────────────────────────
export function MCQBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
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
        {block.items.map(({ n, text, options }) => (
          <div
            key={n}
            id={`q-${n}`}
            className="border-b border-gray-100 py-4 last:border-b-0 last:pb-0">
            {/* Question row: boxed number + text */}
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-7 h-7 border border-gray-800 flex items-center justify-center
                  text-[13px] sm:text-base font-medium text-[#000000] shrink-0 rounded-xs">
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

            {/* Options: letter badge + radio circle + text */}
            <div className="flex flex-col gap-3 pl-10">
              {options.map((opt) => {
                const isSelected = vals[n] === opt.id;
                const radioClass = isSelected
                  ? "border-blue-700"
                  : "border-gray-400";
                return (
                  <label
                    key={opt.id}
                    className="flex items-start gap-2.5 cursor-pointer select-none"
                    onClick={() => !submitted && onChange(n, opt.id)}>
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-lg font-medium shrink-0 mt-0.5 bg-gray-200 text-[#000000]">
                      {opt.id}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1.5 ${radioClass}`}>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-blue-700" />
                      )}
                    </span>
                    <span
                      className="text-lg leading-snug text-[#000000]"
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
          </div>
        ))}
      </div>
    </div>
  );
}
// ── COMPLETE DRAG ─────────────────────────────
export function CompleteDragBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
}) {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [touchDrag, setTouchDrag] = useState(null);
  const placedIds = block.items
    .map((item) => vals[item.n])
    .filter(Boolean)
    .map((v) => v.toUpperCase());
  const getEnding = (id) =>
    block.endings.find((e) => e.id === id?.toUpperCase());
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
    block.items.forEach((item) => {
      if ((vals[item.n] || "").toUpperCase() === id.toUpperCase())
        onChange(item.n, "");
    });
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
      const slot = el?.closest("[data-cslot]");
      if (slot)
        onChange(Number(slot.dataset.cslot), touchDrag.id.toUpperCase());
      setTouchDrag(null);
    };
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
    return () => {
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };
  }, [touchDrag, onChange]);
  return (
    <div className="mb-5 bg-white border border-gray-200 rounded p-3 sm:p-4">
      <div className="mb-3">
        <div className="text-lg font-bold uppercase tracking-wide text-blue-900 mb-1">
          {block.heading}
        </div>
        <p className="text-base font-semibold text-[#000000] leading-snug mb-1">
          {block.title}
        </p>
        {block.sub && <p className="text-sm text-[#000000]">{block.sub}</p>}
      </div>
      <div className="flex flex-col gap-2.5 mb-4">
        {block.items.map(({ n, stem }) => {
          const placedId = vals[n] ? vals[n].toUpperCase() : null;
          const ending = placedId ? getEnding(placedId) : null;
          const over = dragOverSlot === n;
          return (
            <div key={n} id={`q-${n}`}>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:flex-wrap sm:gap-2">
                <div className="flex items-start gap-2">
                  <QNum n={n} submitted={submitted} vals={vals} />
                  <span className="text-[12.5px] sm:text-[13px] text-gray-800 leading-relaxed pt-0.5">
                    <HighlightableText
                      id={`drag-stem-${n}`}
                      text={stem}
                      highlights={highlights}
                      onSelect={onSelect}
                    />
                  </span>
                </div>
                <div
                  className={`min-h-8 border rounded flex items-center px-2 py-1 transition-all w-full sm:flex-1 sm:min-w-40 sm:ml-1 ${over ? "border-blue-700 bg-blue-50 border-solid" : ending ? "border-blue-700 border-solid bg-white" : ok ? "border-green-500 bg-green-50" : bad ? "border-red-500 bg-red-50" : "border-dashed border-gray-300 bg-gray-50"}`}
                  data-cslot={n}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlot(n);
                  }}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={(e) => onDropSlot(e, n)}>
                  {ending ? (
                    <span
                      className="text-[12.5px] text-[#000000] cursor-grab flex items-center gap-1 w-full"
                      draggable={!submitted}
                      onDragStart={
                        !submitted
                          ? (e) => onDragStartFromSlot(e, n, placedId)
                          : undefined
                      }
                      onDragEnd={onDragEnd}
                      onTouchStart={
                        !submitted
                          ? (e) => onTouchStartSlotChip(e, n, placedId)
                          : undefined
                      }>
                      <strong>{ending.id}.</strong> {ending.text}
                      {!submitted && (
                        <span
                          className="ml-auto text-gray-400 hover:text-red-600 pl-2 text-xs cursor-pointer"
                          onClick={() => onChange(n, "")}>
                          ✕
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-[11px] sm:text-[11.5px] text-gray-400 italic">
                      {over ? "Release" : "Drop answer here"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="bg-blue-50 border border-blue-200 rounded p-2.5 sm:p-3"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDraggedId(null);
        }}>
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#000000] mb-2">
          Drag and drop an option to fill in each blank
        </p>
        <div className="flex flex-col">
          {block.endings.map((end) => {
            const placed = placedIds.includes(end.id);
            const dragging = draggedId === end.id;
            return (
              <div
                key={end.id}
                className={`flex items-start gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 border-b border-gray-200 last:border-b-0 text-[12.5px] sm:text-[13px] cursor-grab transition-all select-none ${placed ? "opacity-25 cursor-not-allowed" : dragging ? "opacity-40" : ""} hover:bg-blue-100`}
                draggable={!placed && !submitted}
                onDragStart={
                  !placed && !submitted
                    ? (e) => onDragStart(e, end.id)
                    : undefined
                }
                onDragEnd={onDragEnd}
                onTouchStart={
                  !placed && !submitted
                    ? (e) => onTouchStartChip(e, end.id)
                    : undefined
                }>
                <span className="font-bold text-[#000000] min-w-[18px]">
                  {end.id}.
                </span>
                <span className="text-gray-800">
                  <HighlightableText
                    id={`drag-end-${end.id}`}
                    text={end.text}
                    highlights={highlights}
                    onSelect={onSelect}
                  />
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {touchDrag && (
        <div
          className="fixed z-[9999] pointer-events-none flex items-start gap-1.5 bg-blue-800 rounded px-3 py-1.5 text-white text-xs shadow-xl"
          style={{ left: touchDrag.x - 60, top: touchDrag.y - 18 }}>
          <span className="font-bold">{touchDrag.id}.</span>
          <span>{getEnding(touchDrag.id)?.text}</span>
        </div>
      )}
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
}) {
  const labels = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <div className="mb-5 p-3">
      <SectionLabel
        part={block.part}
        qRange={block.heading}
        highlights={highlights}
        onSelect={onSelect}
      />

      {block.items.map((item) => {
        const nums = item.n;
        const maxSelect = nums.length;
        const validLabels = item.opts.map((_, i) => labels[i]);
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
            {/* Question range: boxed number + "choose N" pill */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="min-w-7 h-7 px-1.5 border border-gray-800 flex items-center justify-center
                  text-[13px] sm:text-base font-medium text-[#000000] shrink-0 rounded-[2px]">
                {nums[0]}–{nums[nums.length - 1]}
              </div>
              <span
                className="text-[11px] sm:text-xs bg-blue-50 text-[#000000] border border-blue-200 px-2 py-0.5 rounded
               font-semibold">
                Choose {maxSelect} letters
              </span>
            </div>

            {/* Question text */}
            <p className="text-lg text-[#000000] leading-relaxed mb-3 pl-10">
              <HighlightableText
                id={`multichoice-q${nums[0]}`}
                text={item.q}
                highlights={highlights}
                onSelect={onSelect}
              />
            </p>

            {/* Options */}
            <div className="flex flex-col gap-3 pl-10">
              {item.opts.map((opt, i) => {
                const label = labels[i];
                const isSelected = selected.includes(label);
                const isDisabled = !isSelected && selected.length >= maxSelect;

                const badgeClass = isSelected
                  ? ""
                  : isDisabled
                    ? "bg-gray-100 text-gray-400"
                    : "bg-gray-200 text-[#000000]";

                const checkboxClass = isSelected
                  ? "border-blue-700 bg-blue-700"
                  : isDisabled
                    ? "border-gray-200"
                    : "border-gray-400";

                const labelClass = isSelected
                  ? ""
                  : isDisabled
                    ? "text-gray-400"
                    : "text-[#000000]";

                return (
                  <label
                    key={label}
                    className={`flex items-start gap-2.5 select-none
                       ${!submitted && !isDisabled ? "cursor-pointer" : isDisabled ? "cursor-not-allowed" : ""}`}
                    onClick={() => handleToggle(label)}>
                    {/* Letter badge */}
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center
                        text-md font-medium shrink-0 mt-0.5 transition-colors ${badgeClass}`}>
                      {label}
                    </span>

                    {/* Checkbox square (multi-select, so square not circle) */}
                    <span
                      className={`w-5 h-5 rounded-[3px] border-2 flex items-center justify-center shrink-0 mt-1.5 transition-colors ${checkboxClass}`}>
                      {isSelected && (
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

                    {/* Option text */}
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
          </div>
        );
      })}
    </div>
  );
}

export function ParaMatchDragBlock({
  block,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
}) {
  const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

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
          instruction={block.sub}
          sub={block.title}
          highlights={highlights}
          onSelect={onSelect}
          note={block.note}
        />
      </div>

      {/* Legend: List of People / Places / etc. */}

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

              <select
                value={v}
                disabled={submitted}
                onChange={(e) => onChange(n, e.target.value)}
                className={`shrink-0 border rounded px-1.5 py-1 text-sm font-bold
                  outline-none cursor-pointer transition-colors bg-white
                  ${"border-gray-400 text-[#000000] focus:border-blue-700"}`}>
                <option value="">–</option>
                {LETTERS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
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
    <div className="mb-5  p-3 sm:p-4">
      <div className="mb-3">
        <SectionLabel
          part={block.part}
          qRange={block.heading}
          highlights={highlights}
          onSelect={onSelect}
          note={block.sub}
          instruction={block.title}
          // sub={block.sub}
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

      {/* Paragraph with inline inputs */}
      <p className="text-base sm:text-lg text-[#000000] leading-[2.1]">
        {block.items.map((seg, i) => {
          if (seg.text !== undefined) {
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
          }

          // It's an input segment
          const n = seg.n;
          const v = vals[n] ?? "";

          return (
            <span
              key={i}
              className="inline-flex items-center gap-0 align-middle mx-0.5"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}>
              {/* Number badge */}
              <span
                className="inline-flex items-center justify-center border
                  border-gray-400 bg-white text-[#000000] font-bold shrink-0"
                style={{
                  width: 22,
                  height: 28,
                  fontSize: 11,
                  borderRadius: "2px 0 0 2px",
                  userSelect: "none",
                }}>
                {n}
              </span>
              {/* Input */}
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
                className={`border bg-white outline-none text-base
                  text-[#000000] px-2 transition-colors
                  `}
                readOnly={submitted}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
              />
            </span>
          );
        })}
      </p>
    </div>
  );
}

// ── INLINE HEADING DROP ZONE ──────────────────
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
    <div className="mb-4">
      <div
        className="mb-1.5 flex items-center gap-2 transition-all"
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
          className={`flex-1 min-h-8 border rounded px-2 py-1 flex items-center gap-2 transition-all
          ${
            dragOver
              ? "border-blue-700 bg-blue-50 border-solid shadow-sm"
              : heading
                ? "border-blue-600 bg-blue-50 border-solid"
                : "border-dashed border-gray-300 bg-gray-50/60"
          }`}>
          {heading ? (
            <>
              <span className="font-bold text-[#000000] font-mono text-[11px]">
                {heading.id}
              </span>
              <span className="text-base text-[#000000] flex-1 leading-snug">
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

      {/* ── Fully highlightable paragraph text ── */}
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

// ── PASSAGE RENDERER ─────────────────────────
export function PassageContent({
  passage,
  highlights,
  handleSelect,
  vals,
  onChange,
  submitted,
}) {
  const paragraphs = passage.text.split(/\n\n+/);
  const paraLabelRe = /^\[Paragraph ([A-I])\]\s*/;

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
        if (match && passage.paragraphQuestions) {
          const paraLetter = match[1];
          const qN = passage.paragraphQuestions[paraLetter];
          const cleanText = para.replace(paraLabelRe, "");

          if (qN) {
            return (
              <ParagraphWithHeadingDrop
                key={i}
                paraText={cleanText}
                paraLabel={`Para ${paraLetter}`}
                questionN={qN}
                vals={vals}
                onChange={onChange}
                submitted={submitted}
                headingsList={passage.headingsList}
                highlights={highlights}
                handleSelect={handleSelect}
              />
            );
          }
        }

        return (
          <p
            key={i}
            className="text-base sm:text-lg leading-[1.85] text-[#000000] mb-4 select-text"
            style={{
              WebkitUserSelect: "text",
              fontFamily: `
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen-Sans,
      Ubuntu,
      Cantarell,
      "Helvetica Neue",
      sans-serif
    `,
            }}>
            <HighlightableText
              id={`passage-${passage.id}-para-${i}`}
              text={para}
              highlights={highlights}
              onSelect={handleSelect}
            />
          </p>
        );
      })}
    </div>
  );
}

export function ResultModal({ vals, ANSWER_KEY, onClose, onRestart }) {
  const { correct, wrong, total, band, desc, results } = scoreReadingAnswers(
    vals,
    ANSWER_KEY,
  );

  return (
    <div
      className="fixed inset-0 z-800 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-5 h-5 text-gray-900"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            Reading Complete
          </p>
          <h2 className="text-xl font-bold text-gray-900">Your Results</h2>
        </div>

        {/* ── SCORE CARDS ── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-center">
            <p className="text-2xl font-bold text-green-700">{correct}</p>
            <p className="text-[11px] font-semibold text-green-600 mt-0.5">
              Correct
            </p>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center">
            <p className="text-2xl font-bold text-red-700">{wrong}</p>
            <p className="text-[11px] font-semibold text-red-600 mt-0.5">
              Wrong
            </p>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-center">
            <p className="text-2xl font-bold text-blue-700">{band}</p>
            <p className="text-[11px] font-semibold text-blue-600 mt-0.5">
              Band
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mb-6">
          {correct}/{total} correct —{" "}
          <span className="font-medium text-gray-700">{desc}</span>
        </p>

        <div className="flex gap-2.5">
          <button
            onClick={onRestart}
            className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            Retake
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-blue-900 text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-blue-800">
            Take Another
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
}) {
  const letters = block?.optionsList?.options?.map((o) => o.id);

  // console.log(block.optionsList)

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

      {/* Grid table */}
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
                    </td>
                    {letters?.map((l) => {
                      const isSelected = normalise(v) === normalise(l);
                      let circleClass = "border-gray-300";
                      if (isSelected) {
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

export function QuestionBlock({
  block,
  passage,
  vals,
  onChange,
  submitted,
  highlights,
  onSelect,
}) {
  if (block?.type === "summary_complete")
    return (
      <SummaryCompleteBlock
        block={block}
        vals={vals}
        onChange={onChange}
        submitted={submitted}
        highlights={highlights}
        onSelect={onSelect}
      />
    );
  if (block?.type === "para_match_drag")
    return (
      <ParaMatchDragBlock
        block={block}
        vals={vals}
        onChange={onChange}
        submitted={submitted}
        highlights={highlights}
        onSelect={onSelect}
      />
    );
  if (block?.type === "tfng")
    return (
      <TFNGBlock
        block={block}
        vals={vals}
        onChange={onChange}
        submitted={submitted}
        highlights={highlights}
        onSelect={onSelect}
      />
    );
  if (block?.type === "short")
    return (
      <ShortBlock
        block={block}
        vals={vals}
        onChange={onChange}
        submitted={submitted}
        highlights={highlights}
        onSelect={onSelect}
      />
    );
  if (block?.type === "table")
    return (
      <TableBlock
        block={block}
        vals={vals}
        onChange={onChange}
        submitted={submitted}
        highlights={highlights}
        onSelect={onSelect}
      />
    );
  if (block?.type === "headings")
    return (
      <HeadingsBlock
        block={block}
        passage={passage}
        vals={vals}
        onChange={onChange}
        submitted={submitted}
        highlights={highlights}
        onSelect={onSelect}
      />
    );
  if (block?.type === "mcq")
    return (
      <MCQBlock
        block={block}
        vals={vals}
        onChange={onChange}
        submitted={submitted}
        highlights={highlights}
        onSelect={onSelect}
      />
    );
  if (block?.type === "complete_drag")
    return (
      <CompleteDragBlock
        block={block}
        vals={vals}
        onChange={onChange}
        submitted={submitted}
        highlights={highlights}
        onSelect={onSelect}
      />
    );
  if (block?.type === "multiChoiceMCQ")
    return (
      <MultiSelectMCQBlock
        block={block}
        vals={vals}
        onChange={onChange}
        submitted={submitted}
        highlights={highlights}
        onSelect={onSelect}
      />
    );
  if (block?.type === "matchAnswer")
    return (
      <div className="">
        <SectionLabel
          qRange={block.heading}
          sub={block.sub}
          highlights={highlights}
          onSelect={onSelect}
        />

        {block.questionTitle && (
          <h2 className="text-base font-bold tracking-[0.08em] text-[#000000] mb-1">
            <HighlightableText
              id={"Model - questionTitle" + block.questionTitle}
              text={block.questionTitle}
              highlights={highlights}
              onSelect={onSelect}
            />
          </h2>
        )}
        {block.themeTitle && (
          <h3 className="text-base font-bold tracking-[0.08em] text-[#000000] mb-3">
            <HighlightableText
              id={"Model-theme-" + block.themeTitle}
              text={block.themeTitle}
              highlights={highlights}
              onSelect={onSelect}
            />
          </h3>
        )}

        <MatchingBlock
          nums={block.items.map((i) => i.num)}
          question={block.question}
          matchOptions={block.options}
          items={block.items}
          vals={vals}
          onChange={onChange}
          highlights={highlights}
          onSelect={onSelect}
        />
      </div>
    );
  if (block?.type === "matrix_match")
    return (
      <MatrixMatchBlock
        block={block}
        vals={vals}
        onChange={onChange}
        submitted={submitted}
        highlights={highlights}
        onSelect={onSelect}
      />
    );
  return null;
}
