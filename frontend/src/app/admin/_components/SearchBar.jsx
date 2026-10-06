"use client";
import { useEffect, useState } from "react";

export default function SearchBar({ value, onChange, placeholder = "Search…" }) {
  const [local, setLocal] = useState(value);

  // debounce 350ms
  useEffect(() => {
    const t = setTimeout(() => onChange(local), 350);
    return () => clearTimeout(t);
  }, [local, onChange]);

  // keep in sync if parent resets
  useEffect(() => setLocal(value), [value]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-line bg-paper-raised py-2.5 pl-9 pr-4
                   font-sans text-sm text-ink placeholder:text-muted
                   outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
      {local && (
        <button
          onClick={() => setLocal("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
          aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  );
}