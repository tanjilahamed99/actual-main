"use client";

import { useAuthStore } from "@/features/Useauthstore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { X, Menu } from "lucide-react";
import { ROUTES } from "@/lib/access";
import NavLink from "@/components/nav/NavLink";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully.");
    router.push("/login");
  };

  // Filter routes the current user is *allowed* to see at all (admins never see
  // "Dashboard" unless we want them to; users never see "Admin Panel").
  const visibleRoutes = ROUTES.filter((r) => {
    if (r.access === "admin") return user?.role === "admin";
    if (r.href === "/dashboard") return user?.role === "user";
    return true;
  });

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

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 font-sans text-[15px] text-ink-soft md:flex">
            {visibleRoutes.map((route) => (
              <NavLink key={route.href} route={route} user={user} />
            ))}
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

        {/* Mobile menu */}
        {menuOpen && (
          <div className="border-t border-line bg-paper px-4 py-4 sm:px-6 md:hidden">
            <nav className="flex flex-col gap-4 font-sans text-[15px] text-ink-soft">
              {visibleRoutes.map((route) => (
                <NavLink
                  key={route.href}
                  route={route}
                  user={user}
                  onClick={() => setMenuOpen(false)}
                />
              ))}

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