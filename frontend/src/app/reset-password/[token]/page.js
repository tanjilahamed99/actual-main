"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/lib/axios";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);
    try {
      await API.put(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successfully! You can now log in.");
      router.push("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-12 sm:px-6">
      <div className="w-full max-w-md">
        
        <div className="overflow-hidden rounded-3xl border border-line bg-paper-raised shadow-sm">
          <div className="p-8 sm:p-10">
            
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sage-soft text-sage">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h1 className="font-display text-2xl text-ink sm:text-3xl">Set New Password</h1>
              <p className="mt-2 font-sans text-sm text-muted">
                Your new password must be different from previous used passwords.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* New Password */}
              <label className="block">
                <span className="mb-1.5 block font-sans text-xs font-semibold text-ink-soft">
                  New Password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-line bg-paper px-4 py-3 pr-10 font-sans text-sm text-ink outline-none transition focus:border-indigo-deep focus:ring-2 focus:ring-indigo-deep/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {/* Confirm Password */}
              <label className="block">
                <span className="mb-1.5 block font-sans text-xs font-semibold text-ink-soft">
                  Confirm New Password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-line bg-paper px-4 py-3 pr-10 font-sans text-sm text-ink outline-none transition focus:border-indigo-deep focus:ring-2 focus:ring-indigo-deep/20"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-indigo-deep py-3.5 font-sans text-sm font-bold text-paper transition-all hover:bg-ink hover:shadow-md active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}