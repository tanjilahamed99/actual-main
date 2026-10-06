"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Read + write a single query param, keeping the URL as the source of truth.
 * setValue(null | "" | undefined) removes the param.
 */
export function useUrlState(key, defaultValue = "") {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = searchParams.get(key) ?? defaultValue;

  const setValue = useCallback(
    (next, { replace = true } = {}) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next === null || next === undefined || next === "") {
        params.delete(key);
      } else {
        params.set(key, String(next));
      }

      const url = params.toString() ? `${pathname}?${params}` : pathname;
      router[replace ? "replace" : "push"](url, { scroll: false });
    },
    [key, pathname, router, searchParams],
  );

  return [value, setValue];
}

/** Update many params in one navigation (avoids race conditions). */
export function useUrlBatch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (patch, { replace = true } = {}) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === undefined || v === "") params.delete(k);
        else params.set(k, String(v));
      }
      const url = params.toString() ? `${pathname}?${params}` : pathname;
      router[replace ? "replace" : "push"](url, { scroll: false });
    },
    [pathname, router, searchParams],
  );
}