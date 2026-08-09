"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login, persistAuth } from "@/actions/auth";
import { useAuthStore } from "@/features/Useauthstore";
import Toast from "@/components/Toast";

const stats = [
  { num: "10.3k", label: "Verified questions" },
  { num: "54", label: "Countries reporting" },
  { num: "weekly", label: "New additions" },
];

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setToast({ type: "error", message: "Please fill in all fields." });
      return;
    }
    setLoading(true);
    try {
      const { data } = await login(form.email, form.password);
      setAuth({ token: data.token, user: data.user });
      setToast({ type: "success", message: "Welcome back!" });
      setTimeout(() => router.push("/"), 500);
    } catch (err) {
      setToast({
        type: "error",
        message: err?.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-paper">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Left panel */}
      <div className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-indigo-deep lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201,154,59,0.18) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 p-12">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-paper/15 bg-gold font-display text-sm text-indigo-deep">
              A
            </span>
            <span className="font-display text-xl text-paper">
              Actual IELTS Questions
            </span>
          </Link>
          <p className="mt-2 font-sans text-sm text-paper/45">
            The archive of real IELTS questions
          </p>
        </div>

        <div className="relative z-10 px-12">
          <div className="mb-6 h-px w-14 bg-gradient-to-r from-gold to-gold-soft" />
          <blockquote className="font-display text-3xl leading-snug text-paper/90">
            &ldquo;Every question here was seen by someone before you.&rdquo;
          </blockquote>
          <p className="mt-6 font-sans text-sm text-paper/45">
            Reported by real test takers in 54 countries
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-6 p-12">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-mono text-xl text-gold">{s.num}</p>
              <p className="mt-1 font-sans text-xs text-paper/45">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-14 sm:py-16 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 bg-indigo-deep font-display text-sm text-paper">
                A
              </span>
              <span className="font-display text-xl text-ink">
                Actual IELTS Questions
              </span>
            </Link>
          </div>

          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper-raised px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider text-muted">
              Student portal
            </span>
            <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Welcome back
            </h1>
            <p className="mt-3 font-sans text-sm text-muted">
              Sign in to browse verified questions and manage your reports.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="animate-fade-in-up mt-8 space-y-5 [animation-delay:80ms]">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 font-sans text-sm text-ink outline-none transition-colors duration-200 placeholder:text-muted focus:border-gold"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block font-mono text-[11px] uppercase tracking-widest text-ink">
                  Password
                </label>
                <Link
                  href="#"
                  className="font-sans text-xs font-medium text-gold transition-colors hover:text-indigo-deep">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-line bg-paper-raised px-4 py-3 pr-12 font-sans text-sm text-ink outline-none transition-colors duration-200 placeholder:text-muted focus:border-gold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink">
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                      />
                      <line
                        x1="1"
                        y1="1"
                        x2="23"
                        y2="23"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 font-sans text-[15px] font-semibold text-indigo-deep transition-all duration-200 hover:bg-gold-soft hover:shadow-lg active:scale-[0.98] disabled:opacity-70">
              {loading ? (
                <>
                  <svg
                    className="h-[18px] w-[18px] animate-spin"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeOpacity="0.3"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="animate-fade-in-up mt-4 rounded-lg border border-line bg-paper-raised px-4 py-2.5 text-center font-mono text-[11px] text-muted [animation-delay:120ms]">
            Demo — admin@actualielts.com / ielts2026
          </p>

          <div className="animate-fade-in-up mt-8 flex items-center gap-3 [animation-delay:160ms]">
            <div className="h-px flex-1 bg-line" />
            <span className="font-sans text-xs text-muted">New here?</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <div className="animate-fade-in-up mt-6 text-center [animation-delay:200ms]">
            <Link
              href="/register"
              className="inline-flex rounded-full border border-ink/20 px-6 py-3 font-sans text-sm font-medium text-ink-soft transition-colors duration-200 hover:border-ink/40 hover:text-ink">
              Create an account
            </Link>
          </div>

          <p className="animate-fade-in-up mt-10 text-center font-sans text-xs text-muted [animation-delay:240ms]">
            By signing in you agree to our{" "}
            <Link href="#" className="text-gold hover:text-indigo-deep">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-gold hover:text-indigo-deep">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
