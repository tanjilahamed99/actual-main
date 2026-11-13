"use client";

import { useState } from "react";
import Link from "next/link";
import API from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setIsSuccess(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        
        {/* Back Link */}
        <Link href="/login" className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper-raised transition-colors group-hover:border-ink/20">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Login
        </Link>

        <div className="overflow-hidden rounded-3xl border border-line bg-paper-raised shadow-sm">
          <div className="p-8 sm:p-10">
            
            {isSuccess ? (
              // ✅ Success State
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-200">
                  <Mail className="h-8 w-8" />
                </div>
                <h1 className="font-display text-2xl text-ink">Check your email</h1>
                <p className="mt-3 font-sans text-sm leading-relaxed text-muted">
                  We've sent a password reset link to <strong className="text-ink">{email}</strong>.
                  Please check your inbox and spam folder.
                </p>
                <div className="mt-8">
                  <Link href="/login" className="inline-flex w-full items-center justify-center rounded-full bg-indigo-deep py-3 font-sans text-sm font-semibold text-paper transition hover:bg-ink">
                    Return to Login
                  </Link>
                </div>
              </div>
            ) : (
              // ✅ Default State
              <>
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-deep/5 text-indigo-deep">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h1 className="font-display text-2xl text-ink sm:text-3xl">Forgot Password?</h1>
                  <p className="mt-2 font-sans text-sm text-muted">
                    No worries, we'll send you reset instructions.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <label className="block">
                    <span className="mb-1.5 block font-sans text-xs font-semibold text-ink-soft">
                      Email Address
                    </span>
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-line bg-paper px-4 py-3 font-sans text-sm text-ink outline-none transition focus:border-indigo-deep focus:ring-2 focus:ring-indigo-deep/20"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3.5 font-sans text-sm font-bold text-indigo-deep transition-all hover:bg-gold-soft hover:shadow-md active:scale-[0.98] disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}