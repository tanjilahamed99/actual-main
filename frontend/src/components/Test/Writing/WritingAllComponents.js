import { useCallback, useRef, useState } from "react";

const PART1_MIN = 150;
const PART2_MIN = 250;

function countWords(text) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export function PieChart({ title, segments }) {
  const cx = 90,
    cy = 90,
    r = 72;
  let cumulative = 0;
  const slices = segments?.map((seg) => {
    const startAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
    cumulative += seg.value;
    const endAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = seg.value > 50 ? 1 : 0;
    const midAngle = startAngle + (endAngle - startAngle) / 2;
    const lx = cx + r * 0.62 * Math.cos(midAngle);
    const ly = cy + r * 0.62 * Math.sin(midAngle);
    return { ...seg, x1, y1, x2, y2, largeArc, lx, ly };
  });

  const patternId = (type, key) => `${type}-${key}`;

  return (
    <div className="mb-6">
      <p
        className="font-bold text-[13px] text-center text-gray-900 mb-2.5"
        style={{ fontFamily: "Arial, sans-serif" }}>
        {title}
      </p>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
        <svg
          viewBox="0 0 180 180"
          className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
          <defs>
            <pattern
              id={patternId("hatch", title.slice(0, 3))}
              patternUnits="userSpaceOnUse"
              width="5"
              height="5">
              <path
                d="M-1,1 l2,-2 M0,5 l5,-5 M4,6 l2,-2"
                stroke="#666"
                strokeWidth="0.9"
              />
            </pattern>
            <pattern
              id={patternId("dots", title.slice(0, 3))}
              patternUnits="userSpaceOnUse"
              width="4"
              height="4">
              <circle cx="2" cy="2" r="0.9" fill="#777" />
            </pattern>
            <pattern
              id={patternId("cross", title.slice(0, 3))}
              patternUnits="userSpaceOnUse"
              width="6"
              height="6">
              <path d="M0,3 h6 M3,0 v6" stroke="#888" strokeWidth="0.7" />
            </pattern>
          </defs>
          {slices?.map((s, i) => {
            const patId =
              s.pattern === "hatched"
                ? patternId("hatch", title.slice(0, 3))
                : s.pattern === "dotted"
                  ? patternId("dots", title.slice(0, 3))
                  : s.pattern === "cross"
                    ? patternId("cross", title.slice(0, 3))
                    : "";
            const fill = patId ? `url(#${patId})` : s.color;
            return (
              <path
                key={i}
                d={`M${cx},${cy} L${s.x1},${s.y1} A${r},${r} 0 ${s.largeArc},1 ${s.x2},${s.y2} Z`}
                fill={fill}
                stroke="#fff"
                strokeWidth={1.5}
              />
            );
          })}
          {slices?.map(
            (s, i) =>
              s.value >= 5 && (
                <text
                  key={i}
                  x={s.lx}
                  y={s.ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={s.value >= 15 ? 9 : 8}
                  fontWeight="700"
                  fill="#000"
                  fontFamily="Arial,sans-serif">
                  {s.value}%
                </text>
              ),
          )}
        </svg>
        <div className="grid grid-cols-2 sm:flex sm:flex-col gap-x-3 gap-y-1.5 pt-0 sm:pt-1">
          {segments?.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-[11px] sm:text-[11.5px] text-gray-800"
              style={{ fontFamily: "Arial, sans-serif" }}>
              <span
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 border border-gray-400 rounded-[1px]"
                style={{
                  background:
                    s.pattern === "hatched"
                      ? "repeating-linear-gradient(45deg,#999,#999 1.5px,#fff 1.5px,#fff 4px)"
                      : s.pattern === "dotted"
                        ? "radial-gradient(circle,#777 35%,transparent 35%) 0 0/4px 4px #fff"
                        : s.pattern === "cross"
                          ? "repeating-linear-gradient(0deg,transparent,transparent 2px,#aaa 2px,#aaa 3px),repeating-linear-gradient(90deg,transparent,transparent 2px,#aaa 2px,#aaa 3px)"
                          : s.color,
                }}
              />
              <span className="truncate">
                {s.label} {s.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DIVIDER HOOK (desktop only) ───────────────
export function useDivider(initial = 48) {
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
        75,
        Math.max(25, ((clientX - rect.left) / rect.width) * 100),
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
  return { split, containerRef, onMouseDown };
}

// ── BOTTOM NAV ────────────────────────────────
export function BottomNav({
  active,
  setActive,
  answers,
  onSubmit,
  submitted,
  PARTS,
}) {
  const MINS = [PART1_MIN, PART2_MIN];
  return (
    <div className="shrink-0 bg-white border-t border-gray-200 w-full">
      <div className="flex items-center w-full h-12 px-1.5 sm:px-3 gap-1 sm:gap-2">
        {/* ← Prev */}
        <button
          onClick={() => setActive((a) => Math.max(0, a - 1))}
          disabled={active === 0}
          className="w-6 sm:w-7 h-8 shrink-0 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </button>

        {/* Part tabs */}
        <div className="flex flex-1 gap-1 sm:gap-1.5 min-w-0">
          {PARTS.map((p, i) => {
            const wc = countWords(answers[i]);
            const min = MINS[i];
            const isActive = active === i;
            const isMet = wc >= min;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex-1 min-w-0 flex items-center justify-center border rounded h-9 transition-all
                  ${
                    isActive
                      ? "bg-gray-900 border-gray-900 text-white px-1.5 sm:px-2 gap-1 sm:gap-1.5"
                      : "bg-white border-gray-300 text-gray-700 hover:border-gray-500 hover:bg-gray-50 px-1 sm:px-2 gap-1"
                  }`}>
                <span
                  className={`font-bold whitespace-nowrap flex-shrink-0 text-[11px] sm:text-[12px] ${isActive ? "text-white" : "text-gray-800"}`}>
                  <span className="sm:hidden">P{i + 1}:</span>
                  <span className="hidden sm:inline">{p.label}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* → Next */}
        <button
          onClick={() => setActive((a) => Math.min(PARTS.length - 1, a + 1))}
          disabled={active === PARTS.length - 1}
          className="w-6 sm:w-7 h-8 flex-shrink-0 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5">
            <polyline points="9,18 15,12 9,6" />
          </svg>
        </button>

        <div className="w-px h-7 bg-gray-200 flex-shrink-0" />

        {/* Submit */}
        <button
          onClick={onSubmit}
          disabled={submitted}
          className="flex items-center justify-center gap-1.5 h-8 flex-shrink-0 bg-[#1a3b6e] hover:bg-[#0f2a52] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded transition-colors w-8 sm:w-auto sm:px-3">
          <span className="hidden sm:inline text-[12.5px]">Submit</span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── RESULT MODAL ──────────────────────────────
export function ResultModal({ answers, PARTS }) {
  const counts = answers.map(countWords);
  const mins = [PART1_MIN, PART2_MIN];
  return (
    <div className="fixed inset-0 z-[300] bg-black/45 flex items-center justify-center p-4">
      <div className="bg-white rounded-[5px] p-5 sm:p-7 max-w-[500px] w-full shadow-[0_18px_56px_rgba(0,0,0,.22)] max-h-[90vh] overflow-y-auto">
        <p className="text-[10px] font-bold tracking-[.1em] uppercase text-gray-400 mb-1">
          Results
        </p>
        <h2 className="text-[18px] sm:text-[21px] font-bold text-gray-900 mb-1">
          Test Submitted
        </h2>
        <p className="text-[12px] sm:text-[12.5px] text-gray-500 mb-4">
          Cambridge IELTS 10 · Academic Writing Test 1
        </p>
        <div className="flex gap-3 mb-4">
          {PARTS.map((p, i) => {
            const ok = counts[i] >= mins[i];
            return (
              <div
                key={i}
                className={`flex-1 text-center py-3 px-2 rounded border-[1.5px] ${ok ? "border-green-700/40 bg-green-50" : "border-red-800/30 bg-red-50"}`}>
                <div className="text-[10px] font-bold uppercase tracking-[.06em] text-gray-400 mb-1">
                  {p.label}
                </div>
                <div className="text-[28px] sm:text-[34px] font-bold text-[#1a3b6e] leading-none">
                  {counts[i]}
                </div>
                <div className="text-[11px] sm:text-[12px] text-gray-500 mt-1">
                  words {ok ? "✓" : `(need ${mins[i]})`}
                </div>
              </div>
            );
          })}
        </div>
        {counts.some((c, i) => c < mins[i]) && (
          <div className="bg-amber-50 border border-amber-200 rounded p-2.5 text-[12px] sm:text-[13px] text-amber-900 leading-relaxed">
            ⚠ One or more parts did not meet the minimum word count.
          </div>
        )}
      </div>
    </div>
  );
}

// ── SUBMIT CONFIRM ────────────────────────────
export function ConfirmModal({ answers, onConfirm, onCancel, PARTS }) {
  const counts = answers.map(countWords);
  const mins = [PART1_MIN, PART2_MIN];
  const allOk = counts.every((c, i) => c >= mins[i]);
  return (
    <div className="fixed inset-0 z-[300] bg-black/45 flex items-center justify-center p-4">
      <div className="bg-white rounded-[5px] p-5 sm:p-7 max-w-[420px] w-full shadow-[0_18px_56px_rgba(0,0,0,.22)]">
        <p className="text-[10px] font-bold tracking-[.1em] uppercase text-gray-400 mb-1">
          Confirm Submission
        </p>
        <h2 className="text-[18px] sm:text-[20px] font-bold text-gray-900 mb-3">
          Submit your test?
        </h2>
        <div className="mb-3">
          {PARTS.map((p, i) => {
            const ok = counts[i] >= mins[i];
            return (
              <div
                key={i}
                className={`flex items-start gap-2 px-3 py-2 rounded text-[12.5px] mb-1.5 ${ok ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-900"}`}>
                <span className="flex-shrink-0 mt-px">{ok ? "✓" : "⚠"}</span>
                <span>
                  {p.label}: <strong>{counts[i]}</strong> words{" "}
                  {ok
                    ? `(min. ${mins[i]} ✓)`
                    : `— need ${mins[i] - counts[i]} more`}
                </span>
              </div>
            );
          })}
        </div>
        {!allOk && (
          <p className="text-[12px] text-amber-900 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-3 leading-relaxed">
            Submitting below the minimum word count may affect your band score.
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-3 rounded border border-gray-200 bg-gray-100 hover:bg-gray-200 text-gray-900 text-[13px] font-bold cursor-pointer transition-colors">
            Continue writing
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-3 rounded border-none bg-[#1a3b6e] hover:bg-[#0f2a52] text-white text-[13px] font-bold cursor-pointer transition-colors">
            Submit now
          </button>
        </div>
      </div>
    </div>
  );
}

// ── COMPLETION MODAL ──────────────────────────
export function CompletionModal({ onViewResults }) {
  return (
    <div className="fixed inset-0 z-[300] bg-black/45 flex items-center justify-center p-4">
      <div className="bg-white rounded-[5px] p-5 sm:p-7 max-w-[420px] w-full shadow-[0_18px_56px_rgba(0,0,0,.22)] text-center">
        <div className="w-14 h-14 sm:w-[60px] sm:h-[60px] bg-[#2e7d52] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-[10px] font-bold tracking-[.1em] uppercase text-gray-400 mb-1">
          Test Complete!
        </p>
        <h2 className="text-[20px] sm:text-[24px] font-bold text-gray-900 mb-1">
          Congratulations!
        </h2>
        <p className="text-[12px] sm:text-[12.5px] text-gray-500 mb-6">
          You have successfully completed the full mock test.
        </p>
        <button
          onClick={onViewResults}
          className="w-full py-3 rounded border-none bg-[#1a3b6e] hover:bg-[#0f2a52] text-white text-[14px] font-bold cursor-pointer transition-colors">
          View Results →
        </button>
      </div>
    </div>
  );
}

export function TableChart({ title, columns, rows }) {
  return (
    <div className="mb-6">
      <p
        className="font-bold text-[13px] text-center text-gray-900 mb-2.5"
        style={{ fontFamily: "Arial, sans-serif" }}>
        {title}
      </p>
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse text-[11.5px] sm:text-[12px]"
          style={{ fontFamily: "Arial, sans-serif" }}>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`border border-gray-400 px-2 py-1.5 text-gray-900 ${
                    i === 0
                      ? "text-left bg-gray-50"
                      : "text-center bg-gray-100 font-bold"
                  }`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`border border-gray-300 px-2 py-1.5 text-gray-800 ${
                      ci === 0 ? "text-left font-medium" : "text-center"
                    }`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── LINE CHART (multi-series) ─────────────────
export function LineChart({
  title,
  xLabels,
  yMax,
  yStep,
  yUnit,
  xUnit,
  series,
}) {
  const W = 640,
    H = 340;
  const padL = 55,
    padR = 170,
    padT = 45,
    padB = 50;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const yTicks = [];
  for (let v = 0; v <= yMax; v += yStep) yTicks.push(v);

  const xForIndex = (i) => padL + (i / (xLabels.length - 1)) * plotW;
  const yForValue = (v) => padT + plotH - (v / yMax) * plotH;

  const markerFor = (shape, cx, cy, filled) => {
    const s = 4.5;
    switch (shape) {
      case "circle":
        return (
          <circle
            cx={cx}
            cy={cy}
            r={s}
            fill={filled ? "#333" : "#fff"}
            stroke="#333"
            strokeWidth="1.3"
          />
        );
      case "triangle":
        return (
          <path
            d={`M${cx},${cy - s} L${cx + s},${cy + s} L${cx - s},${cy + s} Z`}
            fill={filled ? "#333" : "#fff"}
            stroke="#333"
            strokeWidth="1.3"
          />
        );
      case "square":
        return (
          <rect
            x={cx - s}
            y={cy - s}
            width={s * 2}
            height={s * 2}
            fill="#333"
            stroke="#333"
            strokeWidth="1.3"
          />
        );
      case "diamond":
        return (
          <path
            d={`M${cx},${cy - s} L${cx + s},${cy} L${cx},${cy + s} L${cx - s},${cy} Z`}
            fill={filled ? "#333" : "#fff"}
            stroke="#333"
            strokeWidth="1.3"
          />
        );
      default:
        return null;
    }
  };

  const dashFor = (style) => {
    switch (style) {
      case "solid":
        return "none";
      case "dashed":
        return "6,4";
      case "dashdot":
        return "7,3,1.5,3";
      case "dotted":
        return "1.8,3";
      default:
        return "none";
    }
  };

  return (
    <div className="mb-6">
      <p
        className="font-bold text-[13px] text-center text-gray-900 mb-3"
        style={{ fontFamily: "Arial, sans-serif" }}>
        {title}
      </p>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full max-w-[640px] mx-auto"
          style={{ fontFamily: "Arial, sans-serif" }}>
          {/* Gridlines + Y ticks */}
          {yTicks.map((v, i) => {
            const y = yForValue(v);
            return (
              <g key={i}>
                <line
                  x1={padL}
                  y1={y}
                  x2={padL + plotW}
                  y2={y}
                  stroke="#e5e5e5"
                  strokeWidth="1"
                />
                <text
                  x={padL - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#444">
                  {v}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={padL}
            y1={padT}
            x2={padL}
            y2={padT + plotH}
            stroke="#333"
            strokeWidth="1.2"
          />
          <line
            x1={padL}
            y1={padT + plotH}
            x2={padL + plotW}
            y2={padT + plotH}
            stroke="#333"
            strokeWidth="1.2"
          />

          {/* X labels */}
          {xLabels.map((lb, i) => (
            <text
              key={i}
              x={xForIndex(i)}
              y={padT + plotH + 18}
              textAnchor="middle"
              fontSize="10.5"
              fill="#333">
              {lb}
            </text>
          ))}

          {/* Y axis label */}
          <text
            x={14}
            y={padT + plotH / 2}
            textAnchor="middle"
            fontSize="10.5"
            fill="#333"
            transform={`rotate(-90 14 ${padT + plotH / 2})`}>
            {yUnit}
          </text>

          {/* X axis label */}
          <text
            x={padL + plotW / 2}
            y={H - 8}
            textAnchor="middle"
            fontSize="10.5"
            fill="#333">
            {xUnit}
          </text>

          {/* Series lines + markers */}
          {series.map((s, si) => {
            const pts = s.values
              .map((v, i) => `${xForIndex(i)},${yForValue(v)}`)
              .join(" ");
            return (
              <g key={si}>
                <polyline
                  points={pts}
                  fill="none"
                  stroke="#333"
                  strokeWidth="1.4"
                  strokeDasharray={dashFor(s.style)}
                />
                {s.values.map((v, i) => (
                  <g key={i}>
                    {markerFor(s.marker, xForIndex(i), yForValue(v), s.filled)}
                  </g>
                ))}
              </g>
            );
          })}

          {/* Legend box */}
          <g>
            <rect
              x={padL + plotW + 14}
              y={padT + 10}
              width={150}
              height={series.length * 22 + 12}
              fill="#fff"
              stroke="#999"
              strokeWidth="1"
            />
            {series.map((s, i) => {
              const ly = padT + 10 + 18 + i * 22;
              return (
                <g key={i}>
                  <line
                    x1={padL + plotW + 22}
                    y1={ly}
                    x2={padL + plotW + 52}
                    y2={ly}
                    stroke="#333"
                    strokeWidth="1.4"
                    strokeDasharray={dashFor(s.style)}
                  />
                  {markerFor(s.marker, padL + plotW + 37, ly, s.filled)}
                  <text
                    x={padL + plotW + 60}
                    y={ly + 3.5}
                    fontSize="10.5"
                    fill="#222">
                    {s.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

// ── GROUPED BAR CHART ─────────────────────────
export function BarChart({
  title,
  xLabels,
  yMax,
  yStep,
  yUnit,
  xUnit,
  series,
}) {
  const W = 620,
    H = 380;
  const padL = 50,
    padR = 20,
    padT = 60,
    padB = 90;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const yTicks = [];
  for (let v = 0; v <= yMax; v += yStep) yTicks.push(v);

  const groupW = plotW / xLabels.length;
  const barGap = 3;
  const groupPad = 12;
  const barW =
    (groupW - groupPad * 2 - barGap * (series.length - 1)) / series.length;

  const yForValue = (v) => padT + plotH - (v / yMax) * plotH;

  const fillFor = (pattern) => {
    switch (pattern) {
      case "hatched":
        return "url(#bar-hatch)";
      case "dotted":
        return "url(#bar-dots)";
      case "cross":
        return "url(#bar-cross)";
      case "dark":
        return "#3a3a3a";
      default:
        return "#c8c8c8";
    }
  };

  return (
    <div className="mb-6">
      <p
        className="font-bold text-[13px] text-center text-gray-900 mb-1 leading-tight"
        style={{ fontFamily: "Arial, sans-serif" }}>
        {title}
      </p>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full max-w-[600px] mx-auto"
          style={{ fontFamily: "Arial, sans-serif" }}>
          <defs>
            <pattern
              id="bar-hatch"
              patternUnits="userSpaceOnUse"
              width="5"
              height="5">
              <path
                d="M-1,1 l2,-2 M0,5 l5,-5 M4,6 l2,-2"
                stroke="#555"
                strokeWidth="0.9"
              />
            </pattern>
            <pattern
              id="bar-dots"
              patternUnits="userSpaceOnUse"
              width="4"
              height="4">
              <circle cx="2" cy="2" r="0.9" fill="#666" />
            </pattern>
            <pattern
              id="bar-cross"
              patternUnits="userSpaceOnUse"
              width="6"
              height="6">
              <path d="M0,3 h6 M3,0 v6" stroke="#777" strokeWidth="0.7" />
            </pattern>
          </defs>

          {/* Gridlines + Y ticks */}
          {yTicks.map((v, i) => {
            const y = yForValue(v);
            return (
              <g key={i}>
                <line
                  x1={padL}
                  y1={y}
                  x2={padL + plotW}
                  y2={y}
                  stroke="#e5e5e5"
                  strokeWidth="1"
                />
                <text
                  x={padL - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#444">
                  {v}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={padL}
            y1={padT}
            x2={padL}
            y2={padT + plotH}
            stroke="#333"
            strokeWidth="1.2"
          />
          <line
            x1={padL}
            y1={padT + plotH}
            x2={padL + plotW}
            y2={padT + plotH}
            stroke="#333"
            strokeWidth="1.2"
          />

          {/* Bars + value labels */}
          {xLabels.map((lb, gi) => {
            const groupX = padL + gi * groupW + groupPad;
            return (
              <g key={gi}>
                {series.map((s, si) => {
                  const v = s.values[gi];
                  const bx = groupX + si * (barW + barGap);
                  const by = yForValue(v);
                  const bh = padT + plotH - by;
                  return (
                    <g key={si}>
                      <rect
                        x={bx}
                        y={by}
                        width={barW}
                        height={bh}
                        fill={fillFor(s.pattern)}
                        stroke="#333"
                        strokeWidth="1"
                      />
                      <text
                        x={bx + barW / 2}
                        y={by - 4}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight="700"
                        fill="#222">
                        {v}
                      </text>
                    </g>
                  );
                })}
                {/* X label */}
                <text
                  x={groupX + (groupW - groupPad * 2) / 2}
                  y={padT + plotH + 18}
                  textAnchor="middle"
                  fontSize="10.5"
                  fill="#333">
                  {lb}
                </text>
              </g>
            );
          })}

          {/* Y axis label */}
          <text
            x={14}
            y={padT + plotH / 2}
            textAnchor="middle"
            fontSize="10.5"
            fill="#333"
            transform={`rotate(-90 14 ${padT + plotH / 2})`}>
            {yUnit}
          </text>

          {/* X axis label */}
          <text
            x={padL + plotW / 2}
            y={padT + plotH + 40}
            textAnchor="middle"
            fontSize="10.5"
            fill="#333">
            {xUnit}
          </text>

          {/* Legend */}
          <g>
            {series.map((s, i) => {
              const lx = padL + plotW / 2 - (series.length * 90) / 2 + i * 90;
              const ly = H - 22;
              return (
                <g key={i}>
                  <rect
                    x={lx}
                    y={ly - 9}
                    width={14}
                    height={14}
                    fill={fillFor(s.pattern)}
                    stroke="#333"
                    strokeWidth="1"
                  />
                  <text x={lx + 20} y={ly + 2} fontSize="10.5" fill="#222">
                    {s.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}

// ── TOWN MAP PAIR (before / after) ────────────
function Compass({ x, y }) {
  return (
    <g
      transform={`translate(${x},${y})`}
      fontSize="9"
      fill="#222"
      fontWeight="700">
      <line x1="0" y1="-14" x2="0" y2="14" stroke="#333" strokeWidth="1" />
      <line x1="-14" y1="0" x2="14" y2="0" stroke="#333" strokeWidth="1" />
      <text x="0" y="-17" textAnchor="middle">
        N
      </text>
      <text x="0" y="24" textAnchor="middle">
        S
      </text>
      <text x="-20" y="3" textAnchor="middle">
        W
      </text>
      <text x="20" y="3" textAnchor="middle">
        E
      </text>
    </g>
  );
}

function LabelBox({ x, y, w, h, label, fontSize = 10.5 }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke="#333"
        strokeWidth="1"
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 4}
        textAnchor="middle"
        fontSize={fontSize}
        fill="#222">
        {label}
      </text>
    </g>
  );
}

export function MapPair({ titleBefore, titleAfter }) {
  return (
    <div className="mb-6" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* ── BEFORE ── */}
      <p className="font-bold text-[14px] text-center text-gray-900 mb-2">
        {titleBefore}
      </p>
      <svg viewBox="0 0 500 300" className="w-full max-w-[500px] mx-auto mb-8">
        <rect
          x="10"
          y="10"
          width="480"
          height="280"
          fill="none"
          stroke="#333"
          strokeWidth="1.4"
        />
        {/* countryside strip */}
        <text x="250" y="30" textAnchor="middle" fontSize="11" fontWeight="700">
          Farmland
        </text>
        <line x1="10" y1="42" x2="490" y2="42" stroke="#333" strokeWidth="1" />
        {/* shop row 1 */}
        <text
          x="250"
          y="58"
          textAnchor="middle"
          fontSize="10.5"
          fontWeight="700">
          Shops
        </text>
        {[60, 110, 160, 240, 320, 400].map((x, i) => (
          <rect
            key={i}
            x={x}
            y={64}
            width={40}
            height={20}
            fill="none"
            stroke="#555"
            strokeWidth="0.8"
          />
        ))}
        <line
          x1="10"
          y1="90"
          x2="490"
          y2="90"
          stroke="#333"
          strokeWidth="1.4"
        />
        <text
          x="250"
          y="104"
          textAnchor="middle"
          fontSize="10.5"
          fontWeight="700">
          High Street
        </text>
        <line
          x1="10"
          y1="112"
          x2="490"
          y2="112"
          stroke="#333"
          strokeWidth="1.4"
        />
        {/* shop row 2 */}
        <text
          x="250"
          y="128"
          textAnchor="middle"
          fontSize="10.5"
          fontWeight="700">
          Shops
        </text>
        {[60, 110, 160, 240, 320, 400].map((x, i) => (
          <rect
            key={i}
            x={x}
            y={134}
            width={40}
            height={20}
            fill="none"
            stroke="#555"
            strokeWidth="0.8"
          />
        ))}
        <line
          x1="10"
          y1="160"
          x2="490"
          y2="160"
          stroke="#333"
          strokeWidth="1"
        />

        <Compass x={55} y={185} />
        <text
          x="250"
          y="200"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700">
          Residential area
        </text>
        <LabelBox x={340} y="175" w="110" h="55" label="Playing field" />
        <path
          d="M55,220 Q30,250 55,270 L120,270 L120,250 L80,250 L80,220 Z"
          fill="none"
          stroke="#333"
          strokeWidth="1"
        />
        <LabelBox x={55} y={272} w="80" h="22" label="Academy" fontSize="9.5" />
        <text
          x="250"
          y="270"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700">
          Residential area
        </text>
      </svg>

      {/* ── AFTER ── */}
      <p className="font-bold text-[14px] text-center text-gray-900 mb-2">
        {titleAfter}
      </p>
      <svg viewBox="0 0 500 320" className="w-full max-w-[500px] mx-auto">
        <rect
          x="10"
          y="10"
          width="480"
          height="300"
          fill="none"
          stroke="#333"
          strokeWidth="1.4"
        />
        <Compass x={55} y={45} />

        {/* ring road (double line) */}
        <path
          d="M 190 55 H 300 A 55 55 0 0 1 355 110 V 170 A 55 55 0 0 1 300 225 H 190 A 55 55 0 0 1 135 170 V 110 A 55 55 0 0 1 190 55 Z"
          fill="none"
          stroke="#333"
          strokeWidth="1.6"
        />
        <path
          d="M 190 68 H 300 A 42 42 0 0 1 342 110 V 170 A 42 42 0 0 1 300 212 H 190 A 42 42 0 0 1 148 170 V 110 A 42 42 0 0 1 190 68 Z"
          fill="none"
          stroke="#333"
          strokeWidth="1.2"
          strokeDasharray="4,3"
        />

        <text x="250" y="90" textAnchor="middle" fontSize="10" fontWeight="700">
          Coach depot
        </text>
        <text x="250" y="108" textAnchor="middle" fontSize="9.5">
          Retail centre
        </text>
        <text x="345" y="95" textAnchor="middle" fontSize="9.5">
          Car park
        </text>
        <text x="345" y="130" textAnchor="middle" fontSize="9.5">
          New
        </text>
        <text x="345" y="142" textAnchor="middle" fontSize="9.5">
          apartments
        </text>

        <text
          x="250"
          y="185"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700">
          Walkway zone
        </text>
        {[190, 225, 260, 295].map((x, i) => (
          <rect
            key={i}
            x={x}
            y={192}
            width={30}
            height={16}
            fill="none"
            stroke="#555"
            strokeWidth="0.8"
          />
        ))}
        <text x="250" y="215" textAnchor="middle" fontSize="9.5">
          Shops
        </text>

        <text
          x="185"
          y="235"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700">
          Residential
        </text>
        <text
          x="245"
          y="235"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700">
          New homes
        </text>
        <LabelBox x={300} y="222" w="45" h="24" label="Park" fontSize="9.5" />

        <text
          x="70"
          y="235"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="700">
          Ring
        </text>
        <text
          x="70"
          y="247"
          textAnchor="middle"
          fontSize="9.5"
          fontWeight="700">
          road
        </text>

        <path
          d="M55,270 Q30,290 55,305 L110,305 L110,290 L80,290 L80,270 Z"
          fill="none"
          stroke="#333"
          strokeWidth="1"
        />
        <LabelBox x={55} y={307} w="70" h="20" label="Academy" fontSize="9" />
        <text
          x="280"
          y="300"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700">
          Residential
        </text>
      </svg>
    </div>
  );
}

// ── PERCENTAGE CHANGE TABLE (with up/down arrows) ──
export function ChangeTable({ title, rows }) {
  return (
    <div className="mb-6">
      <div className="overflow-x-auto">
        <table
          className="w-full max-w-[420px] mx-auto border-collapse text-[12px]"
          style={{ fontFamily: "Arial, sans-serif" }}>
          <thead>
            <tr>
              <th
                colSpan={2}
                className="border border-gray-400 px-3 py-1.5 text-center bg-gray-100 font-bold text-gray-900">
                {title}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="border border-gray-300 px-3 py-1.5 text-gray-800">
                  {r.label}
                </td>
                <td className="border border-gray-300 px-3 py-1.5 text-center text-gray-900 font-medium">
                  <span
                    className={`inline-flex items-center gap-1.5 ${
                      r.direction === "up" ? "text-gray-800" : "text-gray-800"
                    }`}>
                    {r.direction === "up" ? (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="currentColor">
                        <path d="M12 4l8 10H4z" />
                      </svg>
                    ) : (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="currentColor">
                        <path d="M12 20L4 10h16z" />
                      </svg>
                    )}
                    {r.value}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── PROCESS DIAGRAM (snake layout, numbered steps) ──
function ProcessIcon({ type }) {
  const s = { width: 46, height: 46, viewBox: "0 0 46 46" };
  switch (type) {
    case "tree":
      return (
        <svg {...s}>
          <path
            d="M23 6 L32 22 L27 22 L34 34 L12 34 L19 22 L14 22 Z"
            fill="#666"
          />
          <rect x="20" y="34" width="6" height="8" fill="#8a6a4a" />
        </svg>
      );
    case "logs":
      return (
        <svg {...s}>
          <ellipse cx="14" cy="16" rx="9" ry="7" fill="#8a6a4a" />
          <ellipse cx="14" cy="16" rx="4" ry="3" fill="#c9a878" />
          <ellipse cx="30" cy="28" rx="9" ry="7" fill="#8a6a4a" />
          <ellipse cx="30" cy="28" rx="4" ry="3" fill="#c9a878" />
        </svg>
      );
    case "chipper":
      return (
        <svg {...s}>
          <rect x="6" y="18" width="20" height="14" fill="#777" />
          <circle
            cx="32"
            cy="25"
            r="9"
            fill="none"
            stroke="#333"
            strokeWidth="2"
          />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
            <line
              key={i}
              x1="32"
              y1="25"
              x2={32 + 9 * Math.cos((a * Math.PI) / 180)}
              y2={25 + 9 * Math.sin((a * Math.PI) / 180)}
              stroke="#333"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      );
    case "cook":
      return (
        <svg {...s}>
          <path d="M10 20 h26 v14 a13 13 0 0 1-26 0 Z" fill="#888" />
          <rect x="8" y="17" width="30" height="4" fill="#555" />
          <path
            d="M18 8 q3 6 0 10 M28 8 q3 6 0 10"
            stroke="#aaa"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      );
    case "press":
      return (
        <svg {...s}>
          <rect x="10" y="8" width="26" height="6" fill="#555" />
          <rect x="10" y="32" width="26" height="6" fill="#555" />
          <rect
            x="14"
            y="16"
            width="18"
            height="14"
            fill="#bbb"
            stroke="#333"
            strokeWidth="1.5"
          />
          <line x1="23" y1="8" x2="23" y2="0" stroke="#333" strokeWidth="2" />
          <path d="M20 0 h6 l-3 5 Z" fill="#333" />
        </svg>
      );
    case "bleach":
      return (
        <svg {...s}>
          <path
            d="M23 6 C23 6 14 20 14 28 a9 9 0 0 0 18 0 C32 20 23 6 23 6 Z"
            fill="#ddd"
            stroke="#666"
            strokeWidth="1.5"
          />
          <circle cx="19" cy="27" r="1.6" fill="#666" />
          <circle cx="26" cy="30" r="1.4" fill="#666" />
        </svg>
      );
    case "dry":
      return (
        <svg {...s}>
          <rect
            x="8"
            y="10"
            width="30"
            height="26"
            fill="none"
            stroke="#555"
            strokeWidth="1.5"
          />
          <line x1="8" y1="18" x2="38" y2="18" stroke="#999" strokeWidth="1" />
          <line x1="8" y1="26" x2="38" y2="26" stroke="#999" strokeWidth="1" />
          <path
            d="M14 6 q2 -4 4 0 M22 6 q2 -4 4 0 M30 6 q2 -4 4 0"
            stroke="#aaa"
            strokeWidth="1.3"
            fill="none"
          />
        </svg>
      );
    case "roll":
      return (
        <svg {...s}>
          <circle
            cx="16"
            cy="23"
            r="9"
            fill="#e6dfc8"
            stroke="#555"
            strokeWidth="1.5"
          />
          <circle cx="16" cy="23" r="3" fill="#777" />
          <rect
            x="24"
            y="20"
            width="16"
            height="6"
            fill="#e6dfc8"
            stroke="#555"
            strokeWidth="1"
          />
        </svg>
      );
    case "cut":
      return (
        <svg {...s}>
          <rect
            x="8"
            y="10"
            width="30"
            height="12"
            fill="#f2f2f2"
            stroke="#555"
            strokeWidth="1.3"
          />
          <rect
            x="8"
            y="24"
            width="30"
            height="12"
            fill="#f2f2f2"
            stroke="#555"
            strokeWidth="1.3"
          />
          <line
            x1="6"
            y1="22"
            x2="40"
            y2="22"
            stroke="#333"
            strokeWidth="1.5"
            strokeDasharray="3,2"
          />
        </svg>
      );
    default:
      return (
        <svg {...s}>
          <circle cx="23" cy="23" r="16" fill="#ddd" />
        </svg>
      );
  }
}

function ProcessStep({ n, icon, label, sub }) {
  return (
    <div className="flex flex-col items-center text-center w-[110px]">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="w-5 h-5 rounded-full border border-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-800 shrink-0">
          {n}
        </span>
        <span className="text-[11px] font-bold text-gray-900 leading-tight text-left">
          {label}
        </span>
      </div>
      {sub && (
        <p className="text-[10px] text-gray-500 italic mb-1.5 leading-tight">
          {sub}
        </p>
      )}
      <ProcessIcon type={icon} />
    </div>
  );
}

function HArrow() {
  return (
    <svg width="34" height="14" viewBox="0 0 34 14" className="shrink-0 mt-6">
      <line x1="0" y1="7" x2="26" y2="7" stroke="#222" strokeWidth="2.2" />
      <path d="M26 2 L34 7 L26 12 Z" fill="#222" />
    </svg>
  );
}
function VArrow() {
  return (
    <svg width="14" height="30" viewBox="0 0 14 30" className="shrink-0">
      <line x1="7" y1="0" x2="7" y2="22" stroke="#222" strokeWidth="2.2" />
      <path d="M2 22 L7 30 L12 22 Z" fill="#222" />
    </svg>
  );
}

export function ProcessDiagram({ title, rows }) {
  // rows: array of arrays of step objects; alternating direction (row 0 → L-R, row 1 → R-L, ...)
  return (
    <div className="mb-6">
      <p
        className="font-bold text-[14px] text-center text-gray-900 mb-4"
        style={{ fontFamily: "Arial, sans-serif" }}>
        {title}
      </p>
      <div
        className="flex flex-col items-center gap-2"
        style={{ fontFamily: "Arial, sans-serif" }}>
        {rows.map((row, ri) => {
          const displayRow = ri % 2 === 0 ? row : [...row].reverse();
          return (
            <div key={ri} className="flex flex-col items-center">
              <div className="flex items-start gap-1">
                {displayRow.map((step, si) => (
                  <div key={step.n} className="flex items-start">
                    <ProcessStep {...step} />
                    {si < displayRow.length - 1 && <HArrow />}
                  </div>
                ))}
              </div>
              {ri < rows.length - 1 && (
                <div
                  className={`flex ${ri % 2 === 0 ? "justify-end w-full pr-6" : "justify-start w-full pl-6"}`}>
                  <VArrow />
                </div>
              )}
            </div>
          ); 
        })}
      </div>
    </div>
  );
}
