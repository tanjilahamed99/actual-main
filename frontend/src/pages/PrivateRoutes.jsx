"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMyData } from "@/actions/auth";

function StatusScreen({ tone, title, message, icon }) {
  const tones = {
    gold: {
      badge: "bg-gold-soft/40 text-gold",
      ring: "border-gold/30",
    },
    clay: {
      badge: "bg-clay/10 text-clay",
      ring: "border-clay/30",
    },
  };
  const t = tones[tone];

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="animate-fade-in-up w-full max-w-sm text-center">
        <span
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full border ${t.ring} ${t.badge}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-6 w-6">
            {icon}
          </svg>
        </span>

        <h1 className="mt-5 font-display text-2xl text-ink sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 font-sans text-sm leading-relaxed text-muted sm:text-[15px]">
          {message}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-full bg-indigo-deep px-6 py-3 text-center font-sans text-sm font-medium text-paper transition-all duration-200 hover:bg-ink active:scale-[0.98]">
            Go to homepage
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-ink/20 px-6 py-3 text-center font-sans text-sm font-medium text-ink-soft transition-colors duration-200 hover:border-ink/40 hover:text-ink">
            Sign in as someone else
          </Link>
        </div>
      </div>
    </div>
  );
}

const PendingPage = () => (
  <StatusScreen
    tone="gold"
    title="Your account is pending"
    message="We've got your details — an admin just needs to approve your account before you can access this area. This usually doesn't take long."
    icon={
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 7v5l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    }
  />
);

const RejectedPage = () => (
  <StatusScreen
    tone="clay"
    title="Account request rejected"
    message="Your account request wasn't approved. If you think this is a mistake, reach out to our support team and we'll take another look."
    icon={
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
      />
    }
  />
);

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="animate-fade-in flex flex-col items-center gap-4">
        <div className="relative h-11 w-11">
          <div className="absolute inset-0 rounded-full border-2 border-line" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-gold" />
        </div>
        <p className="font-mono text-xs uppercase tracking-wider text-muted">
          Checking your account…
        </p>
      </div>
    </div>
  );
}

const PrivateRoute = ({ children, allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const fetchUser = async () => {
      const { data } = await getMyData();
      if (cancelled) return;
      setUser(data);
      setIsLoading(false);
    };
    fetchUser();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Wait for the session check to finish.
    if (isLoading) return;

    // No signed-in user.
    if (!user) {
      router.push("/login");
      return;
    }

    const userStatus = user?.status;

    // Pending / rejected accounts get their own screen (handled below),
    // so there's nothing further to authorize here.
    if (userStatus === "pending" || userStatus === "rejected") {
      return;
    }

    const userRole = user?.role || "user";

    if (!allowedRoles.includes(userRole)) {
      router.push(userRole === "admin" ? "/admin" : "/");
      return;
    }

    setIsAuthorized(true);
  }, [user, allowedRoles, router, isLoading]);

  if (isLoading) return <LoadingScreen />;
  if (user?.status === "pending") return <PendingPage />;
  if (user?.status === "rejected") return <RejectedPage />;
  if (!isAuthorized) return null;

  return <>{children}</>;
};

export const AdminRoute = ({ children }) => (
  <PrivateRoute allowedRoles={["admin"]}>{children}</PrivateRoute>
);

export const UserRoute = ({ children }) => (
  <PrivateRoute allowedRoles={["user", "admin"]}>{children}</PrivateRoute>
);

export default PrivateRoute;
