export function BottomNav({
  active,
  setActive,
  vals,
  onSubmit,
  scrollToQuestion,
  PARTS,
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

        {/* Submit */}
        <div className="shrink-0 flex items-center px-2 border-l border-gray-200">
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
        </div>
      </div>
    </div>
  );
}
