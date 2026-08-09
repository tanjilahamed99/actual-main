"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/actions/auth";
import { useAuthStore } from "@/features/Useauthstore";
import Toast from "@/components/Toast";

const features = [
  { icon: "📝", text: "Every skill's real questions, updated weekly" },
  { icon: "✅", text: "Each report cross-checked before it's published" },
  { icon: "🔎", text: "Search by test centre, month, or question type" },
  { icon: "📥", text: "Submit your own exam report after you sit the test" },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email) {
      setToast({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) {
      setToast({ type: "error", message: "Enter a valid email address." });
      return;
    }

    if (!form.password) {
      console.log("password naii");
      setToast({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    if (form.password.length < 8) {
      setToast({
        type: "error",
        message: "Password must be at least 8 characters.",
      });
      return;
    }
    setLoading(true);
    try {
      const { data } = await register(form);
      console.log(data);
      setAuth({ token: data.token, user: data.user });
      setToast({ type: "success", message: "Account created" });
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

  const inputClass =
    "w-full rounded-xl border border-line bg-paper-raised px-4 py-3 font-sans text-sm text-ink outline-none transition-colors duration-200 placeholder:text-muted focus:border-gold";
  const labelClass =
    "mb-2 block font-mono text-[11px] uppercase tracking-widest text-ink";

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

        <div className="relative z-10 space-y-8 px-12">
          <div className="h-px w-14 bg-gradient-to-r from-gold to-gold-soft" />
          <h2 className="font-display text-3xl leading-snug text-paper/90">
            Everything you need to know what&apos;s actually being asked
          </h2>
          <ul className="mt-2 space-y-5">
            {features.map((f) => (
              <li key={f.text} className="flex items-start gap-3">
                <span className="mt-0.5 text-base">{f.icon}</span>
                <p className="font-sans text-sm text-paper/65">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 p-12">
          <p className="font-sans text-xs text-paper/35">
            Join thousands of students preparing with real, reported questions.
          </p>
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
              Create account
            </span>
            <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Start your prep
            </h1>
            <p className="mt-3 font-sans text-sm text-muted">
              Set up your free account in under two minutes.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="animate-fade-in-up mt-8 space-y-5">
            <div>
              <label htmlFor="fullName" className={labelClass}>
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Ahmed Rahman"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email address
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
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  className={`${inputClass} pr-12`}
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
              {form.password.length > 0 && (
                <div className="mt-2 flex gap-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        form.password.length >= i * 3
                          ? i <= 1
                            ? "bg-clay"
                            : i <= 2
                              ? "bg-gold"
                              : "bg-sage"
                          : "bg-line"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex-1 rounded-full border border-ink/20 px-6 py-3 text-center font-sans text-sm font-medium text-ink-soft transition-colors duration-200 hover:border-ink/40 hover:text-ink">
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex flex-2 items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-sans text-sm font-semibold text-indigo-deep transition-all duration-200 hover:bg-gold-soft hover:shadow-lg active:scale-[0.98] disabled:opacity-70">
                {loading ? (
                  <>
                    <svg
                      className="h-4.5 w-4.5 animate-spin"
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
                    Creating…
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>

          <div className="animate-fade-in-up mt-8 flex items-center gap-3 [animation-delay:120ms]">
            <div className="h-px flex-1 bg-line" />
            <span className="font-sans text-xs text-muted">
              Already have an account?
            </span>
            <div className="h-px flex-1 bg-line" />
          </div>
          <div className="animate-fade-in-up mt-5 text-center [animation-delay:160ms]">
            <Link
              href="/login"
              className="inline-flex rounded-full border border-ink/20 px-6 py-3 font-sans text-sm font-medium text-ink-soft transition-colors duration-200 hover:border-ink/40 hover:text-ink">
              Sign in instead
            </Link>
          </div>

          <p className="animate-fade-in-up mt-8 text-center font-sans text-xs text-muted [animation-delay:200ms]">
            By registering you agree to our{" "}
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
