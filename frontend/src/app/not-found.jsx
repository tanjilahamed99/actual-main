// app/not-found.jsx
import Link from "next/link";
import Footer from "@/components/Footer";
import { Home, Search, BookOpen, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Page not found — Actual IELTS Questions",
  description: "The page you're looking for doesn't exist or has moved.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:px-8">
        {/* Hero card */}
        <div className="overflow-hidden rounded-3xl border border-line bg-paper-raised">
          <div className="relative px-8 py-16 text-center sm:px-12 sm:py-24">
            {/* Soft glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{
                background:
                  "radial-gradient(600px 200px at 50% 0%, rgba(212, 175, 55, 0.18), transparent 70%)",
              }}
            />

            <div className="relative">
              {/* Big 404 */}
              <p className="font-display text-7xl leading-none text-indigo-deep/90 sm:text-9xl">
                404
              </p>

              {/* Heading */}
              <h1 className="mt-6 font-display text-2xl text-ink sm:text-4xl">
                Page not found
              </h1>

              <p className="mx-auto mt-4 max-w-md font-sans text-base text-muted sm:text-lg">
                The page you&apos;re looking for doesn&apos;t exist, has been
                moved, or is temporarily unavailable.
              </p>

              {/* Actions */}
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-indigo-deep px-6 py-3 font-sans text-sm font-medium text-paper transition-all duration-200 hover:bg-ink sm:w-auto"
                >
                  <Home className="h-4 w-4" strokeWidth={2} />
                  Back to home
                </Link>

                <Link
                  href="/reading"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-6 py-3 font-sans text-sm font-medium text-ink transition-all duration-200 hover:border-indigo-deep/40 hover:text-indigo-deep sm:w-auto"
                >
                  <BookOpen className="h-4 w-4" strokeWidth={2} />
                  Browse Reading tests
                </Link>
              </div>

              {/* Hint row */}
              <p className="mt-8 font-sans text-xs text-muted">
                Or{" "}
                <Link
                  href="/"
                  className="font-medium text-indigo-deep hover:underline"
                >
                  return to the homepage
                </Link>{" "}
                and start from there.
              </p>
            </div>
          </div>
        </div>

        {/* Quick links grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            {
              href: "/demo",
              icon: Search,
              title: "Try the demo",
              body: "See what a real IELTS test looks like.",
            },
            {
              href: "/reading",
              icon: BookOpen,
              title: "Reading tests",
              body: "Practice with real past-paper content.",
            },
            {
              href: "/dashboard",
              icon: ArrowLeft,
              title: "Your dashboard",
              body: "Track your scores and progress.",
            },
          ].map(({ href, icon: Icon, title, body }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-line bg-paper-raised p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-deep/30 hover:shadow-[0_20px_40px_-30px_rgba(22,29,52,0.4)]"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-deep/10 text-indigo-deep">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <h3 className="mt-4 font-display text-lg text-ink transition-colors duration-200 group-hover:text-indigo-deep">
                {title}
              </h3>
              <p className="mt-1.5 font-sans text-sm leading-relaxed text-muted">
                {body}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}