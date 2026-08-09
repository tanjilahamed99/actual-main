"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { resetPassword, setResendCode, validateCode } from "@/actions/auth";

const STEPS = ["email", "code", "password", "done"];

// ─── OTP input ────────────────────────────────────────────────────────────────

function OtpInput({ length = 6, value, onChange }) {
  const refs = useRef([]);

  const digits = value
    .split("")
    .concat(Array(length).fill(""))
    .slice(0, length);

  function handleKey(i, e) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = digits.map((d, idx) => (idx === i ? "" : d)).join("");
      onChange(next);
      if (i > 0) refs.current[i - 1]?.focus();
      return;
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  }

  function handleChange(i, e) {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const next = digits.map((d, idx) => (idx === i ? char : d)).join("");
    onChange(next);
    if (char && i < length - 1) refs.current[i + 1]?.focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    onChange(pasted.padEnd(length, "").slice(0, length));
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          style={{
            width: 48,
            height: 56,
            textAlign: "center",
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "Outfit, sans-serif",
            color: "#08101e",
            background: d ? "rgba(200,150,62,0.06)" : "white",
            border: `2px solid ${d ? "#c8963e" : "#e5e7eb"}`,
            borderRadius: 14,
            outline: "none",
            transition: "border-color 0.2s, background 0.2s",
            caretColor: "#c8963e",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#c8963e")}
          onBlur={(e) =>
            (e.target.style.borderColor = d ? "#c8963e" : "#e5e7eb")
          }
        />
      ))}
    </div>
  );
}

// ─── Countdown timer ──────────────────────────────────────────────────────────

function Countdown({ seconds, onDone }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
    const t = setInterval(
      () =>
        setLeft((n) => {
          if (n <= 1) {
            clearInterval(t);
            onDone();
            return 0;
          }
          return n - 1;
        }),
      1000,
    );
    return () => clearInterval(t);
  }, [seconds]);
  const m = String(Math.floor(left / 60)).padStart(2, "0");
  const s = String(left % 60).padStart(2, "0");
  return (
    <span
      style={{
        color: "#c8963e",
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
      }}>
      {m}:{s}
    </span>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepBar({ step }) {
  const labels = ["Email", "Verify", "New password"];
  const current = STEPS.indexOf(step);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        marginBottom: 36,
      }}>
      {labels.map((label, i) => {
        const done = current > i + 1 || current === 3;
        const active = current === i + 1;
        return (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              flex: i < labels.length - 1 ? 1 : "none",
            }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background:
                    done || active
                      ? "linear-gradient(135deg,#c8963e,#e8b96a)"
                      : "white",
                  border: `2px solid ${done || active ? "#c8963e" : "#e5e7eb"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  color: done || active ? "#08101e" : "#9ca3af",
                  transition: "all 0.3s",
                }}>
                {done ? "✓" : i + 1}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: active ? "#c8963e" : done ? "#6b7280" : "#d1d5db",
                  whiteSpace: "nowrap",
                }}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  margin: "0 8px",
                  marginBottom: 20,
                  background: done
                    ? "linear-gradient(90deg,#c8963e,#e8b96a)"
                    : "#e5e7eb",
                  transition: "background 0.4s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared input ─────────────────────────────────────────────────────────────

function TextInput({ label, id, icon, hint, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#08101e",
            marginBottom: 8,
          }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: focused ? "#c8963e" : "#9ca3af",
              transition: "color 0.2s",
              pointerEvents: "none",
            }}>
            {icon}
          </span>
        )}
        <input
          id={id}
          {...props}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          style={{
            width: "100%",
            padding: icon ? "13px 16px 13px 44px" : "13px 16px",
            borderRadius: 14,
            border: `1.5px solid ${focused ? "#c8963e" : "#e5e7eb"}`,
            background: focused ? "rgba(200,150,62,0.02)" : "white",
            color: "#08101e",
            fontSize: 14,
            fontFamily: "Outfit, sans-serif",
            outline: "none",
            boxShadow: focused ? "0 0 0 3px rgba(200,150,62,0.08)" : "none",
            transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
            ...props.style,
          }}
        />
      </div>
      {hint && (
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>{hint}</p>
      )}
    </div>
  );
}

// ─── Password strength ────────────────────────────────────────────────────────

function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["#ef4444", "#f97316", "#22c55e"];
  const labels = ["Weak", "Fair", "Strong"];

  if (!password) return null;

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i < score ? colors[score - 1] : "#e5e7eb",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <div style={{ display: "flex", gap: 12 }}>
          {checks.map(({ label, ok }) => (
            <span
              key={label}
              style={{
                fontSize: 11,
                color: ok ? "#22c55e" : "#d1d5db",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}>
              {ok ? "✓" : "○"} {label}
            </span>
          ))}
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: score > 0 ? colors[score - 1] : "#d1d5db",
          }}>
          {score > 0 ? labels[score - 1] : ""}
        </span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState("email");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [resendKey, setResendKey] = useState(0);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);

  // ── Step 1: send email ──────────────────────────────────────────────────────

  async function handleSendCode(e) {
    e?.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await setResendCode(email.trim().toLowerCase());
      toast.success("Code sent! Check your inbox.");
      setCode("");
      setCanResend(false);
      setResendKey((k) => k + 1);
      setStep("code");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: verify code ─────────────────────────────────────────────────────

  async function handleVerifyCode(e) {
    e?.preventDefault();
    if (code.length < 6) {
      toast.error("Enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const data = { email, code };
      await validateCode(data);
      setStep("password");
    } catch (err) {
      toast.error(err.message);
      setCode("");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 3: reset password ──────────────────────────────────────────────────

  async function handleResetPassword(e) {
    e?.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const newData = { email, code, password: newPassword };
      const { data } = await resetPassword(newData);
      setStep("done");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Auto-submit when all 6 digits entered ───────────────────────────────────
  useEffect(() => {
    if (step === "code" && code.length === 6) handleVerifyCode();
  }, [code]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--color-cream)" }}>
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[46%] relative overflow-hidden grain"
        style={{ background: "#08101e" }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "33%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(200,150,62,0.18) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 10, padding: 48 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span
              className="font-display gold-text"
              style={{ fontSize: 22, letterSpacing: "-0.01em" }}>
              Macron Worldwide
            </span>
          </Link>
          <p
            style={{
              marginTop: 6,
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
            }}>
            Narsingdi
          </p>
        </div>

        {/* Quote */}
        <div style={{ position: "relative", zIndex: 10, padding: "0 48px" }}>
          <div className="divider-gold" />
          <blockquote
            className="font-display"
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.92)",
            }}>
            &quot;Locked out today, back on track tomorrow.&quot;
          </blockquote>
          <p
            style={{
              marginTop: 20,
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
            }}>
            Secure password recovery in under 2 minutes.
          </p>
        </div>

        {/* Steps hint */}
        <div style={{ position: "relative", zIndex: 10, padding: 48 }}>
          {[
            "Enter your email",
            "Verify the code we send",
            "Set a new password",
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: i < 2 ? 16 : 0,
              }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: "rgba(200,150,62,0.15)",
                  border: "1px solid rgba(200,150,62,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#c8963e",
                }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 lg:px-16">
        <div style={{ width: "100%", maxWidth: 440 }}>
          {/* Mobile logo */}
          <div
            className="lg:hidden"
            style={{ marginBottom: 40, textAlign: "center" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span className="font-display gold-text" style={{ fontSize: 22 }}>
                Macron Worldwide
              </span>
            </Link>
          </div>

          {step !== "done" && <StepBar step={step} />}

          {/* ── STEP 1: Email ── */}
          {step === "email" && (
            <div className="anim-up">
              <span className="label-tag">Password Recovery</span>
              <h1
                className="font-display"
                style={{
                  fontSize: 34,
                  color: "#08101e",
                  margin: "8px 0 0",
                  lineHeight: 1.2,
                }}>
                Forgot your password?
              </h1>
              <p
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  color: "#6b7280",
                  lineHeight: 1.6,
                }}>
                No worries — enter your registered email and we'll send a
                verification code right away.
              </p>
              <form
                onSubmit={handleSendCode}
                style={{
                  marginTop: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}>
                <TextInput
                  label="Email address"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={
                    <svg
                      width="17"
                      height="17"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  }
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full justify-center"
                  style={{ opacity: loading ? 0.75 : 1 }}>
                  {loading ? (
                    <>
                      <Spinner /> Sending code…
                    </>
                  ) : (
                    <>
                      Send verification code <Arrow />
                    </>
                  )}
                </button>
              </form>
              <div style={{ marginTop: 28, textAlign: "center" }}>
                <Link
                  href="/login"
                  style={{
                    fontSize: 13,
                    color: "#6b7280",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}>
                  ← Back to sign in
                </Link>
              </div>
            </div>
          )}

          {/* ── STEP 2: Code ── */}
          {step === "code" && (
            <div className="anim-up">
              <span className="label-tag">Verification</span>
              <h1
                className="font-display"
                style={{
                  fontSize: 34,
                  color: "#08101e",
                  margin: "8px 0 0",
                  lineHeight: 1.2,
                }}>
                Enter the code
              </h1>
              <p
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  color: "#6b7280",
                  lineHeight: 1.6,
                }}>
                We sent a 6-digit code to{" "}
                <strong style={{ color: "#08101e" }}>{email}</strong>. Check
                your inbox (and spam folder).
              </p>
              <form
                onSubmit={handleVerifyCode}
                style={{
                  marginTop: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                }}>
                <OtpInput length={6} value={code} onChange={setCode} />

                {/* Timer / resend */}
                <div
                  style={{
                    textAlign: "center",
                    fontSize: 13,
                    color: "#6b7280",
                  }}>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCanResend(false);
                        handleSendCode();
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#c8963e",
                        fontWeight: 700,
                        fontSize: 13,
                        fontFamily: "Outfit, sans-serif",
                        textDecoration: "underline",
                      }}>
                      Resend code
                    </button>
                  ) : (
                    <>
                      Resend in{" "}
                      <Countdown
                        key={resendKey}
                        seconds={120}
                        onDone={() => setCanResend(true)}
                      />
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || code.length < 6}
                  className="btn-gold w-full justify-center"
                  style={{ opacity: loading || code.length < 6 ? 0.65 : 1 }}>
                  {loading ? (
                    <>
                      <Spinner /> Verifying…
                    </>
                  ) : (
                    <>
                      Verify code <Arrow />
                    </>
                  )}
                </button>
              </form>

              <div style={{ marginTop: 20, textAlign: "center" }}>
                <button
                  onClick={() => {
                    setStep("email");
                    setCode("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "#6b7280",
                    fontFamily: "Outfit, sans-serif",
                  }}>
                  ← Use a different email
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: New password ── */}
          {step === "password" && (
            <div className="anim-up">
              <span className="label-tag">Almost there</span>
              <h1
                className="font-display"
                style={{
                  fontSize: 34,
                  color: "#08101e",
                  margin: "8px 0 0",
                  lineHeight: 1.2,
                }}>
                Set new password
              </h1>
              <p
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  color: "#6b7280",
                  lineHeight: 1.6,
                }}>
                Choose a strong password you haven't used before.
              </p>
              <form
                onSubmit={handleResetPassword}
                style={{
                  marginTop: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}>
                <div>
                  <TextInput
                    label="New password"
                    id="newpw"
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    icon={<LockIcon />}
                  />
                  <PasswordStrength password={newPassword} />
                </div>
                <TextInput
                  label="Confirm password"
                  id="confirmpw"
                  type={showPw ? "text" : "password"}
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<LockIcon />}
                  hint={
                    confirmPassword && confirmPassword !== newPassword
                      ? "⚠ Passwords don't match"
                      : ""
                  }
                  style={
                    confirmPassword && confirmPassword !== newPassword
                      ? { borderColor: "#ef4444" }
                      : {}
                  }
                />
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    userSelect: "none",
                    width: "fit-content",
                  }}>
                  <input
                    type="checkbox"
                    checked={showPw}
                    onChange={(e) => setShowPw(e.target.checked)}
                    style={{ accentColor: "#c8963e", width: 15, height: 15 }}
                  />
                  <span style={{ fontSize: 13, color: "#6b7280" }}>
                    Show passwords
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    newPassword.length < 8 ||
                    newPassword !== confirmPassword
                  }
                  className="btn-gold w-full justify-center"
                  style={{
                    opacity:
                      loading ||
                      newPassword.length < 8 ||
                      newPassword !== confirmPassword
                        ? 0.65
                        : 1,
                    marginTop: 4,
                  }}>
                  {loading ? (
                    <>
                      <Spinner /> Resetting…
                    </>
                  ) : (
                    <>
                      Reset password <Arrow />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ── STEP 4: Done ── */}
          {step === "done" && (
            <div className="anim-up" style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  margin: "0 auto 28px",
                  background: "linear-gradient(135deg,#c8963e,#e8b96a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  boxShadow: "0 16px 48px rgba(200,150,62,0.35)",
                  animation: "pulse-glow 2s ease infinite",
                }}>
                ✓
              </div>
              <h1
                className="font-display"
                style={{ fontSize: 34, color: "#08101e", marginBottom: 12 }}>
                Password reset!
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  lineHeight: 1.7,
                  maxWidth: 320,
                  margin: "0 auto 36px",
                }}>
                Your password has been updated successfully. You can now sign in
                with your new password.
              </p>
              <Link
                href="/login"
                className="btn-gold"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "linear-gradient(135deg,#c8963e,#e8b96a)",
                  color: "#08101e",
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "14px 32px",
                  borderRadius: 100,
                  textDecoration: "none",
                }}>
                Go to sign in <Arrow />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Micro icons ──────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="17"
      height="17"
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
  );
}

function Arrow() {
  return (
    <svg
      width="17"
      height="17"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.2}>
      <path
        d="M5 12h14M12 5l7 7-7 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
