"use client";

import { useAuthStore } from "@/features/Useauthstore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { Lock, X, Menu } from "lucide-react";

const LOCK_MESSAGES = {
  pending:
    "Your account is pending approval. You'll get access to Reading once an admin approves it.",
  rejected:
    "Your account request was rejected. Contact support if you think this is a mistake.",
  suspended: "Your account has been suspended. Contact support for details.",
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  // Only gate access once we actually know a status; guests (no user) see a normal link.
  const isLocked = user && user.status && user.status !== "approved";

  const handleLockedClick = (e) => {
    e.preventDefault();
    toast.error(
      LOCK_MESSAGES[user.status] ??
        "You don't have access to Reading tests yet.",
    );
  };

  const ReadingLink = ({ onClick } = {}) =>
    isLocked ? (
      <button
        type="button"
        onClick={handleLockedClick}
        aria-label="Reading (locked)"
        className="inline-flex items-center gap-1.5 text-ink-soft/50 cursor-not-allowed"
        title={LOCK_MESSAGES[user.status] ?? "Locked"}>
        Reading
        <Lock className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    ) : (
      <Link href="/reading" onClick={onClick}>
        Reading
      </Link>
    );

  const ulLinks = ({ onLinkClick } = {}) => (
    <>
      <Link href="/demo" onClick={onLinkClick}>
        Demo Test
      </Link>
      <ReadingLink onClick={onLinkClick} />

      {user?.role === "user" && (
        <Link href="/dashboard" onClick={onLinkClick}>
          Dashboard
        </Link>
      )}
      {user?.role === "admin" && (
        <Link href="/admin" onClick={onLinkClick}>
          Admin Panel
        </Link>
      )}
    </>
  );

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully.");
    router.push("/login");
  };

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 md:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-indigo-deep font-display text-sm text-paper">
              A
            </span>
            <span className="truncate font-display text-[15px] leading-none text-ink sm:text-[17px]">
              Actual IELTS Questions
            </span>
          </a>

          <nav className="hidden items-center gap-8 font-sans text-[15px] text-ink-soft md:flex">
            {ulLinks()}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="hidden shrink-0 rounded-full bg-indigo-deep px-4 py-2.5 font-sans text-sm font-medium text-paper transition hover:bg-ink sm:inline-flex sm:px-5">
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden shrink-0 rounded-full bg-indigo-deep px-4 py-2.5 font-sans text-sm font-medium text-paper transition hover:bg-ink sm:inline-flex sm:px-5">
                Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink md:hidden">
              <span className="sr-only">Menu</span>
              {menuOpen ? (
                <X className="h-5 w-5" strokeWidth={1.8} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-line bg-paper px-4 py-4 sm:px-6 md:hidden">
            <nav className="flex flex-col gap-4 font-sans text-[15px] text-ink-soft">
              {ulLinks({ onLinkClick: () => setMenuOpen(false) })}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="shrink-0 rounded-full bg-indigo-deep px-4 py-2.5 font-sans text-sm font-medium text-paper transition hover:bg-ink sm:inline-flex sm:px-5">
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex w-fit rounded-full bg-indigo-deep px-5 py-2.5 font-sans text-sm font-medium text-paper">
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;
