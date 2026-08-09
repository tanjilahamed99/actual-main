"use client";

import { useEffect } from "react";

const styles = {
  success: "bg-sage-soft text-sage border-sage/30",
  error: "bg-clay/10 text-clay border-clay/30",
};

const icons = {
  success: (
    <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
  ),
  error: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z" />
  ),
};

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4 sm:justify-end sm:px-6">
      <div
        className={`animate-fade-in-up pointer-events-auto flex max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 shadow-lg backdrop-blur ${styles[toast.type]}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="mt-0.5 h-4 w-4 shrink-0"
        >
          {icons[toast.type]}
        </svg>
        <p className="font-sans text-sm leading-snug">{toast.message}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="ml-1 shrink-0 text-current/60 transition-opacity hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}