"use client";

import { useEffect, useRef, useState } from "react";

export default function SearchBar({ value, onChange, placeholder = "Search…" }) {
  const [local, setLocal] = useState(value ?? "");
  const lastEmitted = useRef(value ?? "");

  // keep external value in sync only when it changed outside of us
  useEffect(() => {
    if (value !== lastEmitted.current) {
      setLocal(value ?? "");
      lastEmitted.current = value ?? "";
    }
  }, [value]);

  // debounce local → parent
  useEffect(() => {
    const t = setTimeout(() => {
      if (local !== lastEmitted.current) {
        lastEmitted.current = local;
        onChange(local);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [local, onChange]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
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
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}