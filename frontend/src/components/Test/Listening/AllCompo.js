// ── HIGHLIGHT & NOTES ENGINE ──────────────────

import { useCallback, useState, useRef, useEffect } from "react";

// ── GLOBAL "HIGHLIGHT ANYWHERE" ENGINE ──────────────────

// Reverse of getTextOffset: turn a flat character offset back into a
// real (textNode, localOffset) pair so we can build a Range from it.
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

const supportsCSSHighlight =
  typeof window !== "undefined" &&
  "Highlight" in window &&
  !!window.CSS?.highlights;

// Wrap ONE big region (e.g. a whole test part) in this instead of
// wrapping every fragment individually. Selection can now start and
// end anywhere inside it — different questions, different table
// cells, doesn't matter.
export function HighlightRoot({ id, highlights, onSelect, children }) {
  const ref = useRef(null);

  const handlePointerUp = useCallback(
    (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
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
        zoneId: id,
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
    [id, onSelect],
  );

  // Paint highlights via real Ranges — no <mark> wrapping needed,
  // so it works no matter how many components the range crosses.
  useEffect(() => {
    if (!supportsCSSHighlight) return;
    const container = ref.current;
    if (!container) return;

    const mine = highlights.filter((h) => h.zoneId === id);
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

    const key = `app-highlight-${id}`;
    if (ranges.length) window.CSS.highlights.set(key, new Highlight(...ranges));
    else window.CSS.highlights.delete(key);
    return () => window.CSS.highlights.delete(key);
  }, [highlights, id]);

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

export function buildSpans(text, highlights) {
  if (!highlights || !highlights.length)
    return [{ text, highlighted: false, highlightId: null }];
  const pts = new Set([0, text.length]);
  highlights.forEach((h) => {
    pts.add(Math.max(0, h.start));
    pts.add(Math.min(text.length, h.end));
  });
  const arr = Array.from(pts).sort((a, b) => a - b);
  return arr.slice(0, -1).map((start, i) => {
    const end = arr[i + 1];
    const match = highlights.find((h) => h.start <= start && h.end >= end);
    return {
      text: text.slice(start, end),
      highlighted: !!match,
      highlightId: match?.id ?? null,
    };
  });
}

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

export function HighlightableText({ text }) {
  return <span style={{ cursor: "text" }}>{text}</span>;
}

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
    </div>
  );
}

// ── NOTE MODAL ────────────────────────────────
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
          onFocus={(e) => {
            e.target.style.borderColor = "#1e293b";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db";
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

// ── NOTES PANEL ───────────────────────────────
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
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                style={{ margin: "0 auto 12px", display: "block" }}>
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
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
      const note = {
        id: Date.now().toString(),
        zoneId: pendingNoteSelection.zoneId,
        selectedText: pendingNoteSelection.selectedText,
        text,
      };
      setNotes((p) => [...p, note]);
      setPendingNoteSelection(null);
    },
    [pendingNoteSelection],
  );

  const handleNoteDelete = useCallback((id) => {
    setNotes((p) => p.filter((n) => n.id !== id));
  }, []);

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

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

// ── AUDIO BAR ─────────────────────────────────
export function PartAudioBar({ part, qRange, playing, onToggle, cur, dur }) {
  const pct = dur ? (cur / dur) * 100 : 0;
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6">
      <div className="flex-shrink-0">
        <p className="text-[13px] font-bold text-gray-800 leading-none">
          Part {part}
        </p>
        <p className="text-[12px] text-gray-400 mt-0.5">Q {qRange}</p>
      </div>
      <div className="w-px h-8 bg-gray-200 flex-shrink-0" />
      <button
        onClick={onToggle}
        className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-900 text-white hover:bg-gray-700 transition-colors">
        {playing ? (
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg
            className="w-3.5 h-3.5 ml-0.5"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path d="M8 5.14v14l11-7z" />
          </svg>
        )}
      </button>
      <div className="flex-1 flex flex-col gap-1.5">
        <div
          className="h-2 bg-gray-200 rounded-full cursor-not-allowed"
          title="Seeking disabled">
          <div
            className="h-full bg-gray-800 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[12px] font-mono text-gray-400">
          <span>{fmt(Math.floor(cur))}</span>
          <span>{fmt(Math.floor(dur || 0))}</span>
        </div>
      </div>
      <span className="text-[12px] text-gray-400 hidden sm:block flex-shrink-0">
        plays once
      </span>
    </div>
  );
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

export function GapInput({ num, vals, onChange, width = "160px" }) {
  return (
    <span
      className="inline-flex items-center gap-0 mx-0.5 align-middle"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}>
      <span
        className="inline-flex items-center justify-center border border-gray-400 bg-white text-gray-700 font-bold 
        shrink-0"
        style={{
          width: 30,
          height: 35,
          fontSize: 16,
          borderRadius: "2px 0 0 2px",
          userSelect: "none",
        }}>
        {num}
      </span>
      <input
        type="text"
        value={vals[num] ?? ""}
        onChange={(e) => onChange(num, e.target.value)}
        style={{
          width,
          height: 35,
          borderRadius: "0 2px 2px 0",
          borderLeft: "none",
        }}
        className="border border-gray-400 bg-white outline-none text-md text-gray-900 focus:border-gray-700 
        px-2 transition-colors text-lg"
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      />
    </span>
  );
}

export function MCQOption({
  label,
  text,
  selected,
  onClick,
  highlights,
  onSelect,
  zoneId,
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full text-left px-3 py-2 text-lg transition-all rounded-lg hover:bg-gray-50">
      {/* Letter circle - always gray */}
      <span className="w-7 h-7 flex items-center justify-center rounded-full text-black text-base font-bold shrink-0 bg-gray-200">
        {label}
      </span>

      {/* Radio button */}
      <span
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
          ${selected ? "border-blue-500" : "border-gray-300"}`}>
        {selected && (
          <span
            className="rounded-full bg-blue-500"
            style={{ width: 10, height: 10 }}
          />
        )}
      </span>

      {/* Option text */}
      <span
        className={`flex-1 leading-relaxed text-[#000000]`}
        style={{ userSelect: "text", WebkitUserSelect: "text", cursor: "text" }}
        onMouseDown={(e) => e.stopPropagation()}>
        <HighlightableText
          id={zoneId}
          text={text}
          highlights={highlights}
          onSelect={onSelect}
        />
      </span>
    </button>
  );
}

export function MCQBlock({
  num,
  question,
  options,
  vals,
  onChange,
  highlights,
  onSelect,
}) {
  const labels = ["A", "B", "C", "D"];
  return (
    <div className="mb-6" id={`q-${num}`}>
      <p className="text-lg text-[#000000] mb-3 leading-relaxed flex items-start gap-2">
        <span
          className="inline-flex items-center justify-center border border-gray-400 rounded
                     text-sm font-bold text-[#000000] shrink-0"
          style={{ width: 26, height: 24 }}>
          {num}
        </span>
        <span>
          <HighlightableText
            id={`q${num}`}
            text={question}
            highlights={highlights}
            onSelect={onSelect}
          />
        </span>
      </p>
      <div className="space-y-1 pl-2">
        {options.map((o, i) => (
          <MCQOption
            key={o}
            label={labels[i]}
            text={o}
            zoneId={`q${num}opt${i}`}
            selected={vals[num] === labels[i]}
            onClick={() =>
              onChange(num, vals[num] === labels[i] ? "" : labels[i])
            }
            highlights={highlights}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export function MultiSelectMCQBlock({
  nums,
  question,
  options,
  vals,
  onChange,
  highlights,
  onSelect,
}) {
  const labels = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const maxSelect = nums.length;
  const validLabels = options.map((_, i) => labels[i]);
  const selected = nums.map((n) => vals[n] ?? "").filter(Boolean);

  const handleToggle = (label) => {
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
    <div className="mb-6" id={`q-${nums[0]}`}>
      {/* Question text with boxed numbers like the screenshot */}
      <p className="text-lg text-[#000000] mb-3 leading-relaxed flex items-start gap-2 flex-wrap">
        <span className="flex items-center gap-1 shrink-0">
          {nums.map((n) => (
            <span
              key={n}
              className="inline-flex items-center justify-center border border-gray-400 rounded
                         text-sm font-bold text-[#000000]"
              style={{ width: 26, height: 24 }}>
              {n}
            </span>
          ))}
        </span>
        <span>
          <HighlightableText
            id={`q${nums[0]}`}
            text={question}
            highlights={highlights}
            onSelect={onSelect}
          />
        </span>
      </p>

      {/* Options with letter circle + square checkbox */}
      <div className="space-y-1 pl-2">
        {options.map((o, i) => {
          const label = labels[i];
          const isSelected = selected.includes(label);
          const isDisabled = !isSelected && selected.length >= maxSelect;

          return (
            <button
              key={o}
              onClick={() => handleToggle(label)}
              disabled={isDisabled}
              className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-lg
                ${
                  isDisabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}>
              {/* Letter circle */}
              <span className="w-7 h-7 flex items-center justify-center rounded-full text-black text-base bg-gray-200 font-bold shrink-0">
                {label}
              </span>

              {/* Square checkbox */}
              <span
                className={`w-5 h-5 border-2 rounded-[3px] flex items-center justify-center shrink-0
                  ${isSelected ? "bg-blue-500 border-blue-500" : "border-gray-400 bg-white"}`}>
                {isSelected && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    className="w-3.5 h-3.5">
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                )}
              </span>

              {/* Option text */}
              <span
                className="text-[#000000]"
                style={{
                  userSelect: "text",
                  WebkitUserSelect: "text",
                  cursor: "text",
                }}
                onMouseDown={(e) => e.stopPropagation()}>
                <HighlightableText
                  id={`q${nums[0]}opt${i}`}
                  text={o}
                  highlights={highlights}
                  onSelect={onSelect}
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
export function TFNBlock({ num, text, vals, onChange, highlights, onSelect }) {
  const current = vals[num] ?? "";
  const options = [
    { label: "A", value: "TRUE", display: "TRUE" },
    { label: "B", value: "FALSE", display: "FALSE" },
    { label: "C", value: "NOT GIVEN", display: "NOT GIVEN" },
  ];
  return (
    <div className="mb-7" id={`q-${num}`}>
      <div className="flex items-start gap-3 mb-3">
        <span
          className="flex-shrink-0 border border-gray-400 text-[#000000]  text-[12px] font-bold flex 
          items-center justify-center bg-white"
          style={{ width: 24, height: 26, borderRadius: 2, marginTop: 2 }}>
          {num}
        </span>
        <p className="text-base text-[#000000]  leading-relaxed flex-1">
          <HighlightableText
            id={`tfn${num}`}
            text={text}
            highlights={highlights}
            onSelect={onSelect}
          />
        </p>
      </div>
      <div className="space-y-1 pl-9">
        {options.map((opt) => {
          const selected = current === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() =>
                onChange(num, current === opt.value ? "" : opt.value)
              }
              className={`flex items-center gap-3 w-full text-left px-3 py-2 text-base transition-all rounded-lg ${
                selected
                  ? "bg-gray-100 text-[#000000]  font-semibold"
                  : "text-gray-700 hover:bg-gray-50 hover:text-[#000000] "
              }`}>
              <span
                className={`w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-[12px] 
                  font-bold transition-colors ${
                    selected
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-400 text-gray-500"
                  }`}>
                {opt.label}
              </span>
              <span>{opt.display}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DoneScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mx-auto mb-4">
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
        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1">
          Listening Complete
        </p>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Test submitted</h2>
        <p className="text-[14px] text-gray-500">Loading Reading section…</p>
      </div>
    </div>
  );
}

export function TableGapFillBlock({
  block,
  vals,
  onChange,
  highlights,
  onSelect,
}) {
  // Render inline parts (text | gap)
  const renderParts = (parts, rowIdx, colIdx, lineIdx) =>
    parts.map((part, pi) => {
      if (part.text !== undefined) {
        return (
          <span key={pi} className="text-md text-[#000000] ">
            <HighlightableText
              id={`tgf-r${rowIdx}-c${colIdx}-l${lineIdx}-p${pi}`}
              text={part.text}
              highlights={highlights}
              onSelect={onSelect}
            />
          </span>
        );
      }
      if (part.gap !== undefined) {
        return (
          <span key={pi} className="inline-flex items-center">
            <GapInput
              num={part.gap}
              vals={vals}
              onChange={onChange}
              width="130px"
            />
          </span>
        );
      }
      return null;
    });

  // Render a `lines` cell — every text node is highlightable
  const renderLinesCell = (cell, rowIdx, colIdx) => (
    <div className="flex flex-col gap-1">
      {cell.lines.map((line, li) => (
        <div key={li}>
          {/* Main bullet line */}
          <div className="flex items-start gap-1 flex-wrap">
            {line.bullet && (
              <span className="text-md text-[#000000] shrink-0 mt-px">
                <HighlightableText
                  id={`tgf-r${rowIdx}-c${colIdx}-l${li}-bullet`}
                  text={line.bullet}
                  highlights={highlights}
                  onSelect={onSelect}
                />
              </span>
            )}
            <span className="flex items-center flex-wrap gap-x-1 gap-y-1">
              {renderParts(line.parts, rowIdx, colIdx, li)}
            </span>
          </div>

          {/* Sub-lines (indented) */}
          {line.subLines && (
            <div className="flex flex-col gap-1 mt-1 ml-4">
              {line.subLines.map((sub, si) => (
                <div key={si} className="flex items-center gap-1 flex-wrap">
                  {sub.prefix && (
                    <span className="text-md text-[#000000]  flex-shrink-0">
                      <HighlightableText
                        id={`tgf-r${rowIdx}-c${colIdx}-l${li}-s${si}-prefix`}
                        text={sub.prefix}
                        highlights={highlights}
                        onSelect={onSelect}
                      />
                    </span>
                  )}
                  <span className="flex items-center flex-wrap gap-x-1 gap-y-1">
                    {renderParts(sub.parts, rowIdx, colIdx, `${li}-${si}`)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // Render any cell format
  const renderCell = (cell, rowIdx, colIdx) => {
    if (!cell) return null;

    // lines format
    if (cell.lines) return renderLinesCell(cell, rowIdx, colIdx);

    // plain text — fully highlightable
    if (cell.text !== undefined) {
      return (
        <span
          style={{ whiteSpace: "pre-line" }}
          className="text-md text-[#000000]  leading-relaxed">
          <HighlightableText
            id={`tgf-r${rowIdx}-c${colIdx}-text`}
            text={cell.text}
            highlights={highlights}
            onSelect={onSelect}
          />
        </span>
      );
    }

    // legacy flat parts
    if (cell.parts) {
      return (
        <span className="flex flex-wrap items-center gap-x-1 gap-y-1">
          {renderParts(cell.parts, rowIdx, colIdx, 0)}
        </span>
      );
    }

    return null;
  };

  // First gap number for scroll anchor
  const firstQ = (() => {
    for (const row of block.rows) {
      for (const cell of row.cells) {
        if (cell?.lines) {
          for (const line of cell.lines) {
            for (const p of line.parts ?? []) {
              if (p.gap !== undefined) return p.gap;
            }
            for (const sub of line.subLines ?? []) {
              for (const p of sub.parts ?? []) {
                if (p.gap !== undefined) return p.gap;
              }
            }
          }
        }
        if (cell?.parts) {
          for (const p of cell.parts) {
            if (p.gap !== undefined) return p.gap;
          }
        }
      }
    }
    return null;
  })();

  return (
    <div className="mb-8" id={firstQ ? `q-${firstQ}` : undefined}>
      <div className="rounded-xl overflow-hidden shadow-sm">
        {block.title && (
          <div className="pb-3">
            <span className="text-[13px] font-bold uppercase tracking-widest text-[#000000] ">
              <HighlightableText
                id={`tgf-r${block.title}-text`}
                text={block.title}
                highlights={highlights}
                onSelect={onSelect}
              />
            </span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table
            className={`w-full border-collapse ${block.headers?.length > 0 && "border border-gray-300"}`}>
            {block.headers?.length > 0 && (
              <thead>
                <tr>
                  {block.headers.map((h, hi) => (
                    <th
                      key={hi}
                      className="px-4 py-2.5 text-left text-[11px] font-bold
                       uppercase tracking-widest text-[#000000]  whitespace-nowrap border border-gray-300">
                      <HighlightableText
                        id={`tgf-headers${h}-text`}
                        text={h}
                        highlights={highlights}
                        onSelect={onSelect}
                      />
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            <tbody>
              {block.rows.map((row, ri) => {
                let rowFirstQ = null;
                outer: for (const cell of row.cells) {
                  if (cell?.lines) {
                    for (const line of cell.lines) {
                      for (const p of line.parts ?? []) {
                        if (p.gap !== undefined) {
                          rowFirstQ = p.gap;
                          break outer;
                        }
                      }
                      for (const sub of line.subLines ?? []) {
                        for (const p of sub.parts ?? []) {
                          if (p.gap !== undefined) {
                            rowFirstQ = p.gap;
                            break outer;
                          }
                        }
                      }
                    }
                  }
                  if (cell?.parts) {
                    for (const p of cell.parts) {
                      if (p.gap !== undefined) {
                        rowFirstQ = p.gap;
                        break outer;
                      }
                    }
                  }
                }

                return (
                  <tr
                    key={ri}
                    id={rowFirstQ ? `q-${rowFirstQ}` : undefined}
                    className="border-b border-gray-300 last:border-b-0">
                    {row.cells.map((cell, ci) => (
                      <td
                        key={ci}
                        className="border border-gray-300 px-4 py-3 align-top">
                        {renderCell(cell, ri, ci)}
                      </td>
                    ))}
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
function BuiltInMap({ config }) {
  const { width = 520, height = 320, rooms = [], entranceArrow } = config;
  const vbPad = 0; // viewBox padding

  return (
    <svg
      viewBox={`-${vbPad} -${vbPad} ${width + vbPad * 2} ${height + vbPad * 2}`}
      className="w-full h-auto max-h-72"
      style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Map background */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="#e8e0d0"
        stroke="#aaa"
        strokeWidth={1.5}
        rx={4}
      />

      {/* Rooms */}
      {rooms.map((room) => {
        const isFixed = room.fixed;
        const cx = room.x + room.w / 2;
        const cy = room.y + room.h / 2;

        return (
          <g key={room.id}>
            {room.shape === "oval" ? (
              <ellipse
                cx={cx}
                cy={cy}
                rx={room.w / 2}
                ry={room.h / 2}
                fill="white"
                stroke="#444"
                strokeWidth={1.5}
              />
            ) : (
              <rect
                x={room.x}
                y={room.y}
                width={room.w}
                height={room.h}
                fill="white"
                stroke="#444"
                strokeWidth={1.5}
                rx={2}
              />
            )}

            {/* Label */}
            <text
              x={cx}
              y={cy}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={isFixed ? 11 : 13}
              fontWeight={isFixed ? "400" : "700"}
              fill={isFixed ? "#555" : "#111"}>
              {room.label}
            </text>
          </g>
        );
      })}

      {/* Entrance arrow */}
      {entranceArrow && (
        <g>
          <line
            x1={entranceArrow.x}
            y1={entranceArrow.y + 30}
            x2={entranceArrow.x}
            y2={entranceArrow.y}
            stroke="#333"
            strokeWidth={2}
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="8"
              refX="4"
              refY="4"
              orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#333" />
            </marker>
          </defs>
          {/* person icon */}
          <circle
            cx={entranceArrow.x}
            cy={entranceArrow.y + 44}
            r={6}
            fill="#333"
          />
          <line
            x1={entranceArrow.x}
            y1={entranceArrow.y + 50}
            x2={entranceArrow.x}
            y2={entranceArrow.y + 68}
            stroke="#333"
            strokeWidth={2}
          />
          <line
            x1={entranceArrow.x - 8}
            y1={entranceArrow.y + 58}
            x2={entranceArrow.x + 8}
            y2={entranceArrow.y + 58}
            stroke="#333"
            strokeWidth={2}
          />
        </g>
      )}
    </svg>
  );
}

export function GapFill({ highlights, onSelect, block, vals, onChange }) {
  const G = (n, w) => (
    <GapInput num={n} vals={vals} onChange={onChange} width={w} />
  );
  const H = (id, text) => (
    <HighlightableText
      id={id}
      text={text}
      highlights={highlights}
      onSelect={onSelect}
    />
  );

  const renderItem = (q, idx) => {
    const cleanLabel = block.bulletPoint
      ? q.label.replace(/^[-•]\s*/, "")
      : q.label;

    return (
      <ul className="list-disc pl-10 mt-2 space-y-2">
        {block.items.map((q, idx) => {
          const cleanLabel = q.label.replace(/^[-•]\s*/, "");
          return (
            <li
              id={`q-` + q.num}
              key={idx}
              className="py-1.5 text-lg text-[#000000] leading-relaxed"
              style={{ display: "list-item" }}>
              <span className="inline-flex flex-wrap items-center gap-1">
                {H("s1-label-" + q.num, cleanLabel)}
                {q.num !== "example" && (
                  <>
                    {G(q.num, "180px")}
                    {q.afterText && <>{H("s1-after-" + q.num, q.afterText)}</>}
                  </>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="overflow-hidden">
      <SectionLabel
        qRange={block.heading}
        instruction={block.sub}
        sub={block.title}
        highlights={highlights}
        onSelect={onSelect}
        part={block.part}
      />

      {block.questionTitle && (
        <span className="text-base font-bold tracking-[0.08em] text-[#000000]">
          {H("section1" + block.questionTitle, block.questionTitle)}
        </span>
      )}

      {block.themeTitle && (
        <h2 className="text-base font-semibold tracking-[0.08em] text-[#000000] mt-5">
          {H("listening" + block.themeTitle, block.themeTitle)}
        </h2>
      )}

      {block.bulletPoint ? (
        <ul className="list-disc pl-10 mt-2 space-y-2">
          {block.items.map((q, idx) => {
            const cleanLabel = q.label.replace(/^[-•]\s*/, "");
            return (
              <li
                id={`q-` + q.num}
                key={idx}
                className="py-1.5 text-lg text-[#000000] leading-relaxed"
                style={{ display: "list-item" }}>
                <span className="inline-flex flex-wrap items-center gap-1">
                  {H("s1-label-" + q.num, cleanLabel)}
                  {q.num !== "example" && (
                    <>
                      {" "}
                      {G(q.num, "180px")}
                      {q.afterText && (
                        <>{H("s1-after-" + q.num, q.afterText)}</>
                      )}
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="space-y-1 mt-2">
          {block.items.map((q, idx) => (
            <div
              id={`q-` + q.num}
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2.5">
              <div className="text-lg text-[#000000] sm:shrink-0">
                {H("s1-label-" + q.num, q.label)}
              </div>
              <div className="flex items-center flex-wrap gap-1 text-lg text-[#000000]">
                {q.num !== "example" && (
                  <>
                    {q.beforeText && (
                      <>{H("s1-before-" + q.num, q.beforeText)} </>
                    )}
                    {G(q.num, "180px")}
                    {q.afterText && <>{H("s1-after-" + q.num, q.afterText)}</>}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAP LABEL BLOCK ───────────────────────────────────────────
export function MapLabelBlock({
  block, // { title, instruction, qRange, part, svgUrl, mapConfig, items, options }
  vals,
  onChange,
}) {
  const { items = [], options = [], title, svgUrl, mapConfig } = block;

  return (
    <div className="mb-8" id={`q-${items[0]?.n}`}>
      {/* Instruction banner */}
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 bg-red-100 text-red-700 font-bold text-[11px] px-2 py-1 rounded border border-red-300 whitespace-nowrap">
          Q.{block.qRange}
        </span>
        <p className="text-[13px] font-semibold text-gray-800 leading-snug bg-amber-50 border border-amber-200 rounded px-3 py-1.5 flex-1">
          {block.instruction}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* MAP PANEL */}
        <div className="flex-1 border border-gray-300 rounded-xl overflow-hidden bg-gray-50 min-w-0">
          {title && (
            <div className="text-center py-2 border-b border-gray-200 bg-white">
              <span className="text-[15px] font-bold text-gray-900">
                {title}
              </span>
            </div>
          )}
          <div className="p-3">
            {svgUrl ? (
              <img src={svgUrl} alt={title} className="w-full h-auto" />
            ) : mapConfig ? (
              <BuiltInMap config={mapConfig} />
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm italic p-4">
                No map — set <code>svgUrl</code> or <code>mapConfig</code> in
                question data.
              </div>
            )}
          </div>
        </div>

        {/* ANSWER PANEL */}
        <div className="shrink-0 w-full lg:w-60">
          {/* Valid letters strip */}
          <div className="flex flex-wrap gap-1.5 px-1 mb-3">
            {options.map((letter) => (
              <span
                key={letter}
                className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center text-[12px] font-bold text-gray-500 bg-white">
                {letter}
              </span>
            ))}
          </div>

          <div className="space-y-2">
            {items.map(({ n, label }) => (
              <div
                key={n}
                id={`q-${n}`}
                className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors">
                {/* Q number badge */}
                <span
                  className="flex-shrink-0 border border-gray-400 text-gray-700 text-[11px] font-bold flex items-center justify-center bg-white"
                  style={{ width: 22, height: 24, borderRadius: 2 }}>
                  {n}
                </span>

                {/* Room name */}
                <span className="flex-1 text-[13px] text-gray-700 leading-snug">
                  {label}
                </span>

                {/* Letter input */}
                <input
                  type="text"
                  maxLength={1}
                  value={vals[n] ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value.toUpperCase();
                    if (raw === "" || options.includes(raw)) {
                      onChange(n, raw);
                    }
                  }}
                  placeholder="–"
                  className="w-9 h-9 text-center border-b-2 border-gray-900 bg-transparent
                             font-bold text-blue-700 text-sm focus:outline-none focus:border-blue-500
                             uppercase caret-blue-500 flex-shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
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
    <div className="mb-5">
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
        <h2 className="text-base font-bold tracking-[0.08em] text-[#000000]">
          {H("reading" + block.questionTitle, block.questionTitle)}
        </h2>
      )}
      {block.themeTitle && (
        <h2 className="text-base font-semibold tracking-[0.08em] text-[#000000] mt-5">
          {H("reading" + block.themeTitle, block.themeTitle)}
        </h2>
      )}

      {/* Paragraph with inline inputs */}
      <p className="text-base sm:text-lg text-[#000000] leading-[2.5]">
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

// Replace the existing MatchingBlock in your shared components file

export function MatchingBlock({
  nums,
  question,
  matchOptions,
  items,
  vals,
  onChange,
  highlights,
  onSelect,
}) {
  const letters = Object.keys(matchOptions);
  const [draggedLetter, setDraggedLetter] = useState(null);
  const [dragSource, setDragSource] = useState(null); // "pool" | questionNum
  const [dragOverSlot, setDragOverSlot] = useState(null);

  // Which letters are currently placed in a slot
  const usedMap = {}; // letter → num
  items.forEach((item) => {
    const v = vals[item.num];
    if (v) usedMap[v] = item.num;
  });

  // ── Drag handlers ──────────────────────────────────────────

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

    // If the target slot is already filled, swap: send its letter back to pool
    // (just clear it — pool shows unused letters automatically)
    const existing = vals[targetNum];
    if (existing && existing !== draggedLetter) {
      onChange(targetNum, ""); // clear it first so pool reclaims it
    }

    // Clear source slot if dragging from another slot
    if (typeof dragSource === "number") {
      onChange(dragSource, "");
    }

    onChange(targetNum, draggedLetter);
    reset();
  };

  const dropOnPool = () => {
    // Dragging a placed letter back to the pool → clear its slot
    if (draggedLetter && typeof dragSource === "number") {
      onChange(dragSource, "");
    }
    reset();
  };

  const reset = () => {
    setDraggedLetter(null);
    setDragSource(null);
    setDragOverSlot(null);
  };

  const clearSlot = (num) => onChange(num, "");

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="flex flex-col lg:flex-row gap-20 items-start mb-6">
      {/* LEFT — items with drop zones */}
      <div className="space-y-3">
        {items.map((item) => {
          const assigned = vals[item.num] || "";
          const isOver = dragOverSlot === item.num;

          return (
            <div
              key={item.num}
              id={`q-${item.num}`}
              className="flex items-center gap-3 flex-wrap">
              <span className="text-lg text-[#000000] min-w-0">
                <HighlightableText
                  id={`match-q${item.num}`}
                  text={`• ${item.q}`}
                  highlights={highlights}
                  onSelect={onSelect}
                />
              </span>

              <div className="flex items-center shrink-0">
                <span
                  className="inline-flex items-center justify-center border border-gray-400
                             bg-white text-[#000000] text-md font-bold shrink-0"
                  style={{
                    width: 30,
                    height: 32,
                    borderRadius: "2px 0 0 2px",
                    userSelect: "none",
                  }}>
                  {item.num}
                </span>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlot(item.num);
                  }}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={() => dropOnSlot(item.num)}
                  style={{
                    width: 260,
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
                      {/* Draggable filled chip */}
                      <div
                        draggable
                        onDragStart={() => startFromSlot(assigned, item.num)}
                        className="flex items-center gap-1.5 flex-1 cursor-grab"
                        style={{ overflow: "hidden" }}>
                        <span
                          className="text-base font-bold text-white shrink-0"
                          style={{ minWidth: 14 }}>
                          {assigned}.
                        </span>
                        <span
                          className="text-white text-md truncate"
                          style={{ flex: 1 }}>
                          {matchOptions[assigned]}
                        </span>
                      </div>
                      {/* Clear × */}
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

      {/* RIGHT — draggable options pool */}
      <div
        className="shrink-0 w-full lg:w-96 rounded-xl border border-gray-200 overflow-hidden"
        onDragOver={(e) => e.preventDefault()}
        onDrop={dropOnPool}>
        {/* Pool header */}
        <div
          className="px-3 py-2 border-b border-gray-200"
          style={{ background: "#fafafa" }}>
          <p className="text-[11px] italic" style={{ color: "#c8963e" }}>
            Drag and drop an option to fill in each blank.
          </p>
        </div>

        {/* Option cards */}
        <div className="p-2 space-y-1.5">
          {letters.map((letter) => {
            const inPool = !usedMap[letter]; // not yet placed
            return (
              <div
                key={letter}
                draggable={inPool}
                onDragStart={() => inPool && startFromPool(letter)}
                onDragEnd={reset}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xl transition-all"
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
                <span style={{ color: "#111827", fontSize: 16 }}>
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

// ── FLOW CHART DRAG & DROP BLOCK ──────────────────────────────
export function FlowChartDragBlock({
  block, // { heading, title, sub, sectionTitle, stages, options }
  vals,
  onChange,
  highlights,
  onSelect,
}) {
  const { stages = [], options = {} } = block;
  const letters = Object.keys(options);

  const [draggedLetter, setDraggedLetter] = useState(null);
  const [dragSource, setDragSource] = useState(null); // "pool" | qNum
  const [dragOverSlot, setDragOverSlot] = useState(null);

  // which letters are currently placed, and where
  const usedMap = {};
  stages.forEach((stage) =>
    stage.lines.forEach((line) => {
      if (line.gap !== undefined) {
        const v = vals[line.gap];
        if (v) usedMap[v] = line.gap;
      }
    }),
  );

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
    if (draggedLetter && typeof dragSource === "number") {
      onChange(dragSource, "");
    }
    reset();
  };
  const reset = () => {
    setDraggedLetter(null);
    setDragSource(null);
    setDragOverSlot(null);
  };
  const clearSlot = (num) => onChange(num, "");

  const renderLine = (line, stageIdx, lineIdx) => {
    // Normalize: if line uses old shape (text/gap/afterText), convert to parts
    const parts =
      line.parts ??
      [
        line.text !== undefined && { text: line.text },
        line.gap !== undefined && { gap: line.gap },
        line.afterText !== undefined && { text: line.afterText },
      ].filter(Boolean);

    return (
      <div
        key={lineIdx}
        className="flex flex-wrap items-center gap-1.5 text-lg text-[#000000] leading-relaxed py-1">
        {parts.map((part, pi) => {
          if (part.text !== undefined) {
            return (
              <span key={pi}>
                <HighlightableText
                  id={`fc-${stageIdx}-${lineIdx}-${pi}-text`}
                  text={part.text}
                  highlights={highlights}
                  onSelect={onSelect}
                />
              </span>
            );
          }

          // It's a gap
          const num = part.gap;
          const assigned = vals[num] || "";
          const isOver = dragOverSlot === num;

          return (
            <span
              key={pi}
              id={`q-${num}`}
              className="inline-flex items-center shrink-0">
              <span
                className="inline-flex items-center justify-center border border-gray-500 bg-white
                text-[#000000] text-base font-bold shrink-0"
                style={{ width: 30, height: 30, borderRadius: "2px 0 0 2px" }}>
                {num}
              </span>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverSlot(num);
                }}
                onDragLeave={() => setDragOverSlot(null)}
                onDrop={() => dropOnSlot(num)}
                style={{
                  minWidth: 130,
                  height: 30,
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
                  gap: 5,
                  padding: "0 6px",
                  transition: "all 0.15s",
                  cursor: assigned ? "default" : "copy",
                }}>
                {assigned ? (
                  <>
                    <div
                      draggable
                      onDragStart={() => startFromSlot(assigned, num)}
                      className="flex items-center gap-1 flex-1 cursor-grab"
                      style={{ overflow: "hidden" }}>
                      <span
                        className="text-md font-bold text-white shrink-0"
                        style={{ minWidth: 12 }}>
                        {assigned}.
                      </span>
                      <span className="text-white text-md truncate">
                        {options[assigned]}
                      </span>
                    </div>
                    <button
                      onClick={() => clearSlot(num)}
                      className="text-gray-400 hover:text-white text-md shrink-0 leading-none"
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
                      fontSize: 10,
                      fontStyle: "italic",
                      color: isOver ? "#3b82f6" : "#9ca3af",
                      userSelect: "none",
                    }}>
                    Drop answer here
                  </span>
                )}
              </div>
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mb-6">
      {/* Header instructions */}
      <div className="mb-4">
        {block.heading && (
          <p className="text-xl font-semibold tracking-widest text-[#1e293b] mb-2">
            {block.heading}
          </p>
        )}
        {block.title && (
          <p className="text-[13px] sm:text-base text-[#000000] mb-1">
            {block.title}
          </p>
        )}
        {block.sub && (
          <p className="text-[13px] sm:text-base italic text-[#000000] mb-2">
            {renderInstructionText(
              "fc-sub" + block.sub,
              block.sub,
              highlights,
              onSelect,
            )}
          </p>
        )}
        {block.sectionTitle && (
          <p className="text-[13px] sm:text-base font-bold uppercase tracking-wide text-[#000000]">
            {block.sectionTitle}
          </p>
        )}
      </div>

      {/* Stage boxes with arrows between */}
      <div className="flex flex-col">
        {stages.map((stage, si) => (
          <div key={si}>
            <div className="border border-gray-200 rounded-md px-4 py-4 bg-white">
              <p className="text-[13px] sm:text-base font-bold uppercase tracking-wide text-[#000000] mb-3">
                {stage.title}
              </p>
              <div className="flex flex-col gap-2">
                {stage.lines.map((line, li) => renderLine(line, si, li))}
              </div>
            </div>
            {si < stages.length - 1 && (
              <div className="flex justify-center py-3 text-gray-400 text-lg">
                ↓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Options bank */}
      <div
        className="mt-5 border border-gray-200 rounded-md px-4 py-3 bg-gray-50"
        onDragOver={(e) => e.preventDefault()}
        onDrop={dropOnPool}>
        <p className="text-md italic text-gray-500 mb-2">
          Drag and drop an option to fill in each blank.
        </p>
        <div className="flex flex-wrap gap-2">
          {letters.map((letter) => {
            const inPool = !usedMap[letter];
            return (
              <div
                key={letter}
                draggable={inPool}
                onDragStart={() => inPool && startFromPool(letter)}
                onDragEnd={reset}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-lg transition-all"
                style={{
                  border: inPool ? "1px solid #d1d5db" : "1px solid #f3f4f6",
                  background: inPool ? "white" : "#f3f4f6",
                  opacity: inPool ? 1 : 0.4,
                  cursor: inPool ? "grab" : "not-allowed",
                  userSelect: "none",
                  boxShadow:
                    inPool && draggedLetter === letter
                      ? "0 4px 12px rgba(0,0,0,0.15)"
                      : "none",
                }}>
                <span className="font-bold text-black shrink-0">
                  {letter}.
                </span>
                <span className="text-[#000000]">{options[letter]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ListeningQuestionBlock({
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

  if (block?.type === "flowchart_dragdrop")
    return (
      <FlowChartDragBlock
        block={block}
        vals={vals}
        onChange={onChange}
        highlights={highlights}
        onSelect={onSelect}
      />
    );

  if (block.type === "gaps")
    return (
      <GapFill
        highlights={highlights}
        block={block}
        onChange={onChange}
        onSelect={onSelect}
        vals={vals}
      />
    );
  if (block.type === "multipleAnswer")
    return (
      <div>
        <SectionLabel
          qRange={block.heading}
          instruction={block.sub}
          sub={block.title}
          highlights={highlights}
          onSelect={onSelect}
        />
        {block.items.map((n, idx) => (
          <MultiSelectMCQBlock
            highlights={highlights}
            onChange={onChange}
            onSelect={onSelect}
            vals={vals}
            block={block}
            key={idx}
            nums={n.n}
            question={n.q}
            options={n.opts}
          />
        ))}
      </div>
    );
  if (block.type === "mcq")
    return (
      <div className="my-5">
        <SectionLabel
          qRange={block.heading}
          instruction={block.sub}
          sub={block.title}
          highlights={highlights}
          onSelect={onSelect}
        />

        {block.questionTitle && (
          <h2 className="text-base font-bold  tracking-[0.08em] text-[#000000] mb-3">
            {H("Model - " + block.questionTitle, block.questionTitle)}
          </h2>
        )}

        {block.items.map((q) => (
          <MCQBlock
            key={q.n}
            num={q.n}
            question={q.q}
            options={q.opts}
            vals={vals}
            onChange={onChange}
            highlights={highlights}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  if (block.type === "matchAnswer")
    return (
      <div className="">
        <SectionLabel
          qRange={block.heading}
          // instruction={block.sub}
          sub={block.sub}
          highlights={highlights}
          onSelect={onSelect}
        />

        {block.questionTitle && (
          <h2 className="text-base font-bold tracking-[0.08em] text-[#000000] my-5">
            {H(
              "Model - questionTitle" + block.questionTitle,
              block.questionTitle,
            )}
          </h2>
        )}
        {block.themeTitle && (
          <h3 className="text-base font-bold tracking-[0.08em] text-[#000000] mb-3">
            {H("Model-theme-" + block.themeTitle, block.themeTitle)}
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
  if (block.type === "tableGap")
    return (
      <div className="">
        <SectionLabel
          qRange={block.heading}
          instruction={block.sub}
          sub={block.title}
          highlights={highlights}
          onSelect={onSelect}
        />

        {block.questionTitle && (
          <h2 className="text-base font-bold  tracking-[0.08em] text-[#000000] mb-3">
            {H("Model - " + block.questionTitle, block.questionTitle)}
          </h2>
        )}

        <TableGapFillBlock
          block={block.tableGapFill}
          vals={vals}
          onChange={onChange}
          highlights={highlights}
          onSelect={onSelect}
        />
      </div>
    );
  if (block.type === "map")
    return (
      <MapLabelBlock block={block.mapLabel} vals={vals} onChange={onChange} />
    );
  if (block.type === "summary_complete")
    return (
      <div className="">
        <SummaryCompleteBlock
          block={block}
          highlights={highlights}
          onChange={onChange}
          onSelect={onSelect}
          submitted={submitted}
          vals={vals}
        />
      </div>
    );
  return null;
}
