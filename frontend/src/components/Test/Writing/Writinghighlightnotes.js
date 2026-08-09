import { useState, useEffect, useRef, useCallback } from "react";

// ── OFFSET HELPERS (writing-owned, independent copy) ──
function getTextOffset(container, targetNode, targetOffset) {
  let total = 0;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node === targetNode) return total + targetOffset;
    total += node.textContent.length;
  }
  return total;
}

function getNodeAtCharOffset(container, targetOffset) {
  let total = 0;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
  let node = walker.nextNode();
  let last = null;
  while (node) {
    const len = node.textContent.length;
    if (total + len >= targetOffset) return { node, offset: targetOffset - total };
    total += len;
    last = node;
    node = walker.nextNode();
  }
  return last ? { node: last, offset: last.textContent.length } : null;
}

// ── HIGHLIGHT ROOT (rect-based — works in every browser) ──
export function WritingHighlightRoot({ zoneId, highlights, onSelect, children }) {
  const ref = useRef(null);
  const [rects, setRects] = useState([]);

  const handlePointerUp = useCallback(
    (e) => {
      if (["INPUT", "BUTTON", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
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

      const a = getTextOffset(container, range.startContainer, range.startOffset);
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
        rect: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right },
      });
    },
    [zoneId, onSelect],
  );

  const recompute = useCallback(() => {
    const container = ref.current;
    if (!container) return;
    const mine = highlights.filter((h) => h.zoneId === zoneId);
    const containerRect = container.getBoundingClientRect();
    const allRects = [];

    mine.forEach((h) => {
      const s = getNodeAtCharOffset(container, h.start);
      const en = getNodeAtCharOffset(container, h.end);
      if (!s || !en) return;
      try {
        const r = document.createRange();
        r.setStart(s.node, s.offset);
        r.setEnd(en.node, en.offset);
        const clientRects = r.getClientRects();
        for (const cr of clientRects) {
          if (cr.width === 0 && cr.height === 0) continue;
          allRects.push({
            top: cr.top - containerRect.top,
            left: cr.left - containerRect.left,
            width: cr.width,
            height: cr.height,
          });
        }
      } catch {
        // stale range — skip
      }
    });
    setRects(allRects);
  }, [highlights, zoneId]);

  useEffect(() => {
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [recompute]);

  return (
    <div
      ref={ref}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
      style={{ position: "relative", cursor: "text" }}>
      {rects.map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: r.top,
            left: r.left,
            width: r.width,
            height: r.height,
            background: "#fef08a",
            opacity: 0.65,
            pointerEvents: "none",
            zIndex: 0,
            borderRadius: 2,
          }}
        />
      ))}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ── SELECTION POPUP (writing-owned) ──
export function WritingSelectionPopup({
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
            border: "none", borderRadius: 6, padding: "7px 12px", fontSize: 12,
            fontWeight: 700, cursor: "pointer", background: "#fef08a", color: "#713f12",
            display: "flex", alignItems: "center", gap: 5,
          }}
          onClick={onHighlight}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Highlight
        </button>
      ) : (
        <button
          style={{
            border: "none", borderRadius: 6, padding: "7px 12px", fontSize: 12,
            fontWeight: 700, cursor: "pointer", background: "#fee2e2", color: "#991b1b",
            display: "flex", alignItems: "center", gap: 5,
          }}
          onClick={onClear}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Clear
        </button>
      )}
      {onNote && (
        <button
          style={{
            border: "none", borderRadius: 6, padding: "7px 12px", fontSize: 12,
            fontWeight: 700, cursor: "pointer", background: "#dbeafe", color: "#1e40af",
            display: "flex", alignItems: "center", gap: 5,
          }}
          onClick={onNote}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Note
        </button>
      )}
    </div>
  );
}

// ── NOTE MODAL (writing-owned) ──
export function WritingNoteModal({ selection, existingNote, onSave, onClose }) {
  const [text, setText] = useState(existingNote || "");
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 700, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", borderRadius: 12, padding: 24, maxWidth: 480, width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>Add Note</h3>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#6b7280", fontSize: 18 }}>✕</button>
        </div>
        {selection?.selectedText && (
          <div style={{
            background: "#fef9c3", border: "1px solid #fde68a", borderRadius: 6,
            padding: "8px 12px", fontSize: 13, color: "#713f12", marginBottom: 12, lineHeight: 1.5,
          }}>
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
              display: "block", marginBottom: 4, color: "#92400e",
            }}>Selected text</span>
            "{selection.selectedText}"
          </div>
        )}
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your note here…"
          style={{
            width: "100%", minHeight: 100, border: "1.5px solid #d1d5db", borderRadius: 8,
            padding: "10px 12px", fontSize: 14, color: "#111827", outline: "none",
            resize: "vertical", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box",
          }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 12, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            border: "1.5px solid #d1d5db", borderRadius: 7, padding: "8px 18px", fontSize: 13,
            fontWeight: 600, cursor: "pointer", background: "#fff", color: "#374151",
          }}>Cancel</button>
          <button
            onClick={() => { onSave(text.trim()); onClose(); }}
            style={{
              border: "none", borderRadius: 7, padding: "8px 18px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", background: "#1e293b", color: "#fff",
            }}>Save Note</button>
        </div>
      </div>
    </div>
  );
}

// ── NOTES PANEL (writing-owned) ──
export function WritingNotesPanel({ notes, onDelete, onClose }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 650, background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "flex-start", justifyContent: "flex-end",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: "#fff", width: "min(380px, 100vw)", height: "100vh", overflowY: "auto",
        boxShadow: "-8px 0 32px rgba(0,0,0,.15)", display: "flex", flexDirection: "column",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderBottom: "1px solid #e5e7eb", flexShrink: 0,
        }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>My Notes</h3>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
              {notes.length} note{notes.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: "#6b7280", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {notes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
              <p style={{ fontSize: 14 }}>No notes yet. Select text and click "Note" to add one.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} style={{
                background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "12px 14px",
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                  color: "#92400e", marginBottom: 6,
                }}>Selected text</div>
                <p style={{ fontSize: 13, color: "#713f12", marginBottom: 8, lineHeight: 1.5 }}>
                  "{note.selectedText}"
                </p>
                {note.text && (
                  <>
                    <div style={{ height: 1, background: "#fde68a", marginBottom: 8 }} />
                    <p style={{ fontSize: 13.5, color: "#1f2937", lineHeight: 1.6, margin: 0 }}>
                      {note.text}
                    </p>
                  </>
                )}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <button
                    onClick={() => onDelete(note.id)}
                    style={{ border: "none", background: "none", cursor: "pointer", color: "#ef4444", fontSize: 12, fontWeight: 600 }}>
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

// ── COMBINED HOOK (writing-owned) ──
export function useWritingHighlightsAndNotes() {
  const [highlights, setHighlights] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selection, setSelection] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [pendingNoteSelection, setPendingNoteSelection] = useState(null);

  const isHighlighted = selection
    ? highlights.some(
        (h) => h.zoneId === selection.zoneId && h.start <= selection.start && h.end >= selection.end,
      )
    : false;

  const handleSelect = useCallback((sel) => setSelection(sel), []);

  const handleHighlight = useCallback(() => {
    if (!selection) return;
    const n = { id: Date.now().toString(), zoneId: selection.zoneId, start: selection.start, end: selection.end };
    setHighlights((p) => [
      ...p.filter((h) => !(h.zoneId === n.zoneId && h.end > n.start && h.start < n.end)),
      n,
    ]);
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  }, [selection]);

  const handleClear = useCallback(() => {
    if (!selection) return;
    setHighlights((p) =>
      p.filter((h) => !(h.zoneId === selection.zoneId && h.start < selection.end && h.end > selection.start)),
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
        { id: Date.now().toString(), zoneId: pendingNoteSelection.zoneId, selectedText: pendingNoteSelection.selectedText, text },
      ]);
      setPendingNoteSelection(null);
    },
    [pendingNoteSelection],
  );

  const handleNoteDelete = useCallback((id) => setNotes((p) => p.filter((n) => n.id !== id)), []);

  const dismiss = useCallback(() => {
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  return {
    highlights, notes, selection, isHighlighted,
    showNoteModal, showNotesPanel, pendingNoteSelection,
    setShowNoteModal, setShowNotesPanel,
    handleSelect, handleHighlight, handleClear,
    handleNoteOpen, handleNoteSave, handleNoteDelete, dismiss,
  };
}