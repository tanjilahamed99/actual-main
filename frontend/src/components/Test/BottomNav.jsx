export function BottomNav({
  active,
  setActive,
  vals,
  onSubmit,
  scrollToQuestion,
  PARTS,
  isReviewMode,     // ✅ Added
  onReviewSubmit,   // ✅ Added
  onRetake,         // ✅ Added
}) {
  const answered = (s, e) => {
    let c = 0;
    for (let i = s; i <= e; i++)
      if (vals[i] !== undefined && vals[i] !== "") c++;
    return c;
  };

  return (
    <div className="shrink-0 bg-white border-t border-gray-200 w-full">
      <div className="flex items-stretch w-full h-12">
        {PARTS.map((p, i) => {
          const isActive = active === i;
          const cnt = answered(p.s, p.e);
          const total = p.e - p.s + 1;
          const nums = Array.from({ length: total }, (_, k) => p.s + k);

          return (
            <div
              key={i}
              onClick={() => setActive(i)}
              className={`flex items-center h-full border-r border-gray-200 last:border-r-0 transition-colors px-3 gap-2 min-w-0
                ${
                  isActive
                    ? "bg-white text-gray-900 flex-2"
                    : "bg-white text-gray-500 hover:bg-gray-50 flex-1"
                }`}>
              {/* Part label */}
              <span className="font-bold text-[13px] whitespace-nowrap shrink-0">
                Part {i + 1}:
              </span>

              {isActive ? (
                /* Question chips inline */
                <div className="flex items-center gap-3 flex-wrap overflow-hidden">
                  {nums.map((n) => {
                    const filled = vals[n] !== undefined && vals[n] !== "";
                    return (
                      <button
                        key={n}
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollToQuestion(n);
                        }}
                        className={`w-6 h-6 rounded border flex items-center justify-center text-[11px] font-bold transition-colors shrink-0
                          ${
                            filled
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-600 border-gray-400 hover:border-gray-700"
                          }`}>
                        {n}
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Inactive: just count */
                <span className="text-[13px] italic text-gray-400 whitespace-nowrap">
                  {cnt > 0 ? `${cnt}/${total} answered` : `${total} questions`}
                </span>
              )}
            </div>
          );
        })}

        {/* ✅ SUBMIT / REVIEW ACTIONS */}
        <div className="shrink-0 flex items-center px-2 border-l border-gray-200 gap-2">
          {isReviewMode ? (
            <>
              <button
                onClick={onReviewSubmit}
                className="flex items-center gap-1.5 h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md transition-colors text-[13px]">
                <span className="hidden sm:inline">Results</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                onClick={onRetake}
                className="flex items-center gap-1.5 h-8 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-md transition-colors text-[13px]">
                <span className="hidden sm:inline">Retake</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={onSubmit}
              className="flex items-center gap-1.5 h-8 px-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition-colors text-[13px]">
              <span className="hidden sm:inline">Submit</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}