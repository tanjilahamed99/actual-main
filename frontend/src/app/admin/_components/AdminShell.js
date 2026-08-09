"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


const nav = [
  { href: "/admin", label: "Dashboard", icon: "grid", exact: true },
  { href: "/admin/reading", label: "Reading", icon: "book" },
  { href: "/admin/listening", label: "Listening", icon: "headphones" },
  { href: "/admin/writing", label: "Writing", icon: "pen" },
  { href: "/admin/users", label: "Users", icon: "user" },
  { href: "#", label: "Speaking", icon: "mic", soon: true },
];

const icons = {
  grid: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 5h6v6H4V5Zm10 0h6v6h-6V5ZM4 15h6v6H4v-6Zm10 0h6v6h-6v-6Z"
    />
  ),
  book: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13Z"
    />
  ),
  headphones: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 13v-1a8 8 0 1 1 16 0v1M4 13a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4Zm16 0a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h1Z"
    />
  ),
  pen: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m16.5 3.5 4 4L8 20H4v-4L16.5 3.5Z"
    />
  ),
  mic: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm-7-3a7 7 0 0 0 14 0M12 19v3"
    />
  ),
};

function isActive(pathname, item) {
  if (item.soon) return false;
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

function SidebarContent({ pathname, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <Link href={"/"} className="flex items-center gap-2.5 px-5 pb-6 pt-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-paper/15 bg-gold font-display text-sm text-indigo-deep">
          A
        </span>
        <div className="leading-tight">
          <p className="font-display text-[15px] text-paper">Actual IELTS</p>
          <p className="font-mono text-[10px] uppercase tracking-wider text-paper/50">
            Admin
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const active = isActive(pathname, item);
          if (item.soon) {
            return (
              <span
                key={item.label}
                className="flex cursor-not-allowed items-center justify-between rounded-xl px-3.5 py-2.5 text-[15px] text-paper/35">
                <span className="flex items-center gap-3">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-[18px] w-[18px]">
                    {icons[item.icon]}
                  </svg>
                  {item.label}
                </span>
                <span className="rounded-full bg-paper/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider">
                  Soon
                </span>
              </span>
            );
          }
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] transition-all duration-200 ${
                active
                  ? "bg-gold text-indigo-deep font-medium shadow-sm"
                  : "text-paper/70 hover:bg-paper/10 hover:text-paper"
              }`}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-[18px] w-[18px] shrink-0">
                {icons[item.icon]}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-paper/10 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] text-paper/60 transition-colors duration-200 hover:bg-paper/10 hover:text-paper">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-[18px] w-[18px]">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19v-5.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V19M5 10.5 12 5l7 5.5V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8.5Z"
            />
          </svg>
          View live site
        </Link>
      </div>
    </div>
  );
}

const titles = {
  "/admin": ["Dashboard", "An overview of everything coming into the archive."],
  "/admin/reading": [
    "Reading questions",
    "Review and manage reported Reading passages.",
  ],
  "/admin/listening": [
    "Listening questions",
    "Review and manage reported Listening sets.",
  ],
  "/admin/writing": [
    "Writing questions",
    "Review and manage reported Writing tasks.",
  ],
  "/admin/user": ["All User", "Review and Update user details."],
};

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [title, subtitle] = titles[pathname] || titles["/admin"];

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDrawerOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-indigo-deep md:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!drawerOpen}>
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-[80%] bg-indigo-deep shadow-2xl transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}>
          <SidebarContent
            pathname={pathname}
            onNavigate={() => setDrawerOpen(false)}
          />
        </div>
      </div>

      {/* Main column */}
      <div className="md:pl-64">
        <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6 sm:py-4">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-200 hover:bg-paper-raised md:hidden">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate font-display text-lg text-ink sm:text-xl">
                {title}
              </h1>
              <p className="hidden truncate font-sans text-sm text-muted sm:block">
                {subtitle}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                aria-label="Search"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-colors duration-200 hover:bg-paper-raised sm:hidden">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                  />
                </svg>
              </button>
              <div className="hidden items-center gap-2 rounded-full border border-line bg-paper-raised px-3.5 py-2 sm:flex">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4 text-muted">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search…"
                  className="w-32 bg-transparent font-sans text-sm text-ink placeholder:text-muted focus:outline-none lg:w-48"
                />
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-display text-sm text-indigo-deep">
                R
              </span>
            </div>
          </div>
        </header>

        <main className="animate-fade-in px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
