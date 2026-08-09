"use client";
import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useExitGuard({
  active,
  onConfirmExit,
  message = "Are you sure you want to leave? Your progress will be submitted.",
}) {
  const router = useRouter();
  const isHandlingExit = useRef(false);

  // ── 1. Tab close / refresh (beforeunload) ──────────────────────────────────
  useEffect(() => {
    if (!active) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      // Modern browsers show their own dialog; the returnValue triggers it
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [active, message]);

  // ── 2. Browser back button (popstate) ─────────────────────────────────────
  useEffect(() => {
    if (!active) return;

    // Push a dummy history entry so the back button triggers popstate
    // instead of actually navigating away
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      if (!active || isHandlingExit.current) return;

      // Re-push so the back button keeps getting intercepted
      window.history.pushState(null, "", window.location.href);

      showExitToast();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [active]);

  // ── 3. Sonner toast ───────────────────────────────────────────────────────
  const showExitToast = useCallback(() => {
    toast.warning("Leave the test?", {
      description: message,
      duration: Infinity, // stays until user acts
      position: "top-center",
      classNames: {
        toast: "!max-w-[420px]",
      },
      action: {
        label: "Submit & Exit",
        onClick: async () => {
          isHandlingExit.current = true;
          try {
            await onConfirmExit();
          } finally {
            isHandlingExit.current = false;
          }
        },
      },
      cancel: {
        label: "Stay",
        onClick: () => {
          // Re-arm the popstate guard
          window.history.pushState(null, "", window.location.href);
        },
      },
    });
  }, [message, onConfirmExit]);

  // ── 4. Wrapped router.push — intercepts in-app navigation ─────────────────
  const guardedPush = useCallback(
    (href) => {
      if (!active) {
        router.push(href);
        return;
      }

      toast.warning("Leave the test?", {
        description: message,
        duration: Infinity,
        position: "top-center",
        action: {
          label: "Submit & Exit",
          onClick: async () => {
            isHandlingExit.current = true;
            try {
              await onConfirmExit();
              router.push(href);
            } finally {
              isHandlingExit.current = false;
            }
          },
        },
        cancel: {
          label: "Stay",
          onClick: () => {},
        },
      });
    },
    [active, message, onConfirmExit, router],
  );

  return { guardedPush };
}
