// features/useModuleTestStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ─── Module registry ──────────────────────────────────────────
// Add a new module here + build its page component the same way
// as Reading. Nothing else in this store needs to change.
export const MODULE_REGISTRY = {
  reading: { durationMin: 60, label: "Reading" },
  // listening: { durationMin: 40, label: "Listening" },
  // writing:   { durationMin: 60, label: "Writing" },
};

function makeModuleSession(moduleType, testId, testTitle) {
  const cfg = MODULE_REGISTRY[moduleType];
  return {
    testId,
    testTitle,
    moduleType,
    status: "not-started", // not-started | in-progress | time-up | completed
    startedAt: null,
    secondsLeft: cfg.durationMin * 60,
    answers: {},
    submittedAt: null,
  };
}

const keyOf = (moduleType, testId) => `${moduleType}:${testId}`;

export const useModuleTestStore = create(
  persist(
    (set, get) => ({
      sessions: {}, // { "reading:test-3": {...} }

      getSession(moduleType, testId) {
        return get().sessions[keyOf(moduleType, testId)] ?? null;
      },

      initModule(moduleType, testId, testTitle) {
        const key = keyOf(moduleType, testId);
        const existing = get().sessions[key];
        if (existing) {
          get().rehydrateTimer(moduleType, testId);
          return;
        }
        set((state) => ({
          sessions: {
            ...state.sessions,
            [key]: makeModuleSession(moduleType, testId, testTitle),
          },
        }));
      },

      startModule(moduleType, testId) {
        const key = keyOf(moduleType, testId);
        set((state) => ({
          sessions: {
            ...state.sessions,
            [key]: {
              ...state.sessions[key],
              status: "in-progress",
              startedAt: Date.now(),
            },
          },
        }));
      },

      saveAllAnswers(moduleType, testId, answers) {
        const key = keyOf(moduleType, testId);
        set((state) => ({
          sessions: {
            ...state.sessions,
            [key]: { ...state.sessions[key], answers },
          },
        }));
      },

      // ── Manual submit ONLY. Nothing in this file calls this
      // automatically — the timer never triggers it. ──
      submitModule(moduleType, testId) {
        const key = keyOf(moduleType, testId);
        set((state) => ({
          sessions: {
            ...state.sessions,
            [key]: {
              ...state.sessions[key],
              status: "completed",
              submittedAt: Date.now(),
            },
          },
        }));
      },

      // ── Timer: counts down, flags time-up, never submits ──
      tickTimer(moduleType, testId) {
        const key = keyOf(moduleType, testId);
        const session = get().sessions[key];
        if (!session || session.status !== "in-progress") return;

        if (session.secondsLeft <= 1) {
          set((state) => ({
            sessions: {
              ...state.sessions,
              [key]: {
                ...state.sessions[key],
                secondsLeft: 0,
                status: "time-up",
              },
            },
          }));
          return; // <- no submit call here, on purpose
        }

        set((state) => ({
          sessions: {
            ...state.sessions,
            [key]: {
              ...state.sessions[key],
              secondsLeft: state.sessions[key].secondsLeft - 1,
            },
          },
        }));
      },

      rehydrateTimer(moduleType, testId) {
        const key = keyOf(moduleType, testId);
        const session = get().sessions[key];
        if (!session || session.status !== "in-progress" || !session.startedAt)
          return;

        const cfg = MODULE_REGISTRY[moduleType];
        const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
        const remaining = Math.max(cfg.durationMin * 60 - elapsed, 0);

        set((state) => ({
          sessions: {
            ...state.sessions,
            [key]: {
              ...state.sessions[key],
              secondsLeft: remaining,
              status: remaining === 0 ? "time-up" : "in-progress",
            },
          },
        }));
      },

      resetModule(moduleType, testId) {
        const key = keyOf(moduleType, testId);
        set((state) => ({
          sessions: {
            ...state.sessions,
            [key]: makeModuleSession(
              moduleType,
              testId,
              state.sessions[key]?.testTitle ?? "",
            ),
          },
        }));
      },
    }),
    {
      name: "Actual-IELTS-Questions-module-test-sessions",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
