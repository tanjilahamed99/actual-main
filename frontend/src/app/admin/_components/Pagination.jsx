"use client";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const push = (p) => pages.push(p);
  push(1);
  for (let p = page - 1; p <= page + 1; p++) {
    if (p > 1 && p < totalPages) push(p);
  }
  push(totalPages);
  const unique = [...new Set(pages)].sort((a, b) => a - b);

  const go = (p) => {
    onChange(p);
    requestAnimationFrame(() =>
      document
        .querySelector("[data-table-anchor]")
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-2 font-sans text-sm">
      <button
        disabled={page === 1}
        onClick={() => go(page - 1)}
        className="rounded-lg border border-line px-3 py-1.5 text-muted transition
                   hover:border-gold hover:text-ink disabled:opacity-40 disabled:hover:border-line"
      >
        Prev
      </button>

      {unique.map((p, i) => {
        const gap = i > 0 && p - unique[i - 1] > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {gap && <span className="px-1 text-muted">…</span>}
            <button
              onClick={() => go(p)}
              className={`min-w-[34px] rounded-lg border px-3 py-1.5 transition ${
                p === page
                  ? "border-gold bg-gold font-semibold text-indigo-deep"
                  : "border-line text-ink hover:border-gold"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        disabled={page === totalPages}
        onClick={() => go(page + 1)}
        className="rounded-lg border border-line px-3 py-1.5 text-muted transition
                   hover:border-gold hover:text-ink disabled:opacity-40 disabled:hover:border-line"
      >
        Next
      </button>
    </nav>
  );
}