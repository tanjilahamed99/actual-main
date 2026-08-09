// hooks/useSessionInit.js
// ─────────────────────────────────────────────────────────────
// Drop-in replacement for calling initSession() directly.
// Handles:
//   • Guest  → Zustand only (existing behaviour, unchanged)
//   • Logged in, has server session → merge server data into Zustand
//   • Logged in, no server session  → create fresh & push to server
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useTestStore } from "@/features/Useteststore";
import { useAuthStore } from "@/features/Useauthstore";
import { loadSessionFromServer, syncSessionToServer } from "@/features/Synctestsession";

/**
 * @param {string|number} testId
 * @param {string}        testTitle
 * @returns {{ ready: boolean }}  — `ready` is false until init is complete
 */
export function useSessionInit(testId, testTitle) {
  const [ready, setReady] = useState(false);

  const { initSession, mergeServerSession, sessions } = useTestStore();
  const isAuthenticated = useAuthStore((s) => !!s.token);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!isAuthenticated) {
        // ── Guest path (unchanged behaviour) ──────────────────
        initSession(testId, testTitle);
        if (!cancelled) setReady(true);
        return;
      }

      // ── Logged-in path ────────────────────────────────────
      const serverSession = await loadSessionFromServer(testId);

      if (cancelled) return;

      if (serverSession) {
        // Server has a session → use it (server wins over localStorage)
        mergeServerSession(testId, serverSession);
      } else {
        // No server session yet — create locally then push to server
        initSession(testId, testTitle);

        // Push the freshly created session up
        const freshSession = useTestStore.getState().sessions[testId];
        if (freshSession) {
          syncSessionToServer(testId, freshSession);
        }
      }

      if (!cancelled) setReady(true);
    }

    init();
    return () => { cancelled = true; };
  }, [testId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { ready };
}