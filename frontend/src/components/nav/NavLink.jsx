"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { checkAccess, Lock } from "@/lib/access";

export default function NavLink({ route, user, onClick }) {
  const router = useRouter();
  const lock = checkAccess(route, user);

  const handleLocked = (e) => {
    e.preventDefault();
    toast.error(lock.message);

    // Guests get pushed to login with a "next" so they return here.
    if (lock.status === "guest") {
      const next = encodeURIComponent(route.href);
      onClick?.();
      router.push(`/login?next=${next}`);
    }
  };

  if (lock) {
    return (
      <button
        type="button"
        onClick={handleLocked}
        aria-label={`${route.label} (locked)`}
        title={lock.message}
        className="group inline-flex items-center gap-1.5 text-ink-soft/50 cursor-not-allowed transition-colors duration-200 hover:text-ink-soft/70">
        {route.label}
        <Lock
          className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100"
          strokeWidth={2}
        />
      </button>
    );
  }

  return (
    <Link href={route.href} onClick={onClick}>
      {route.label}
    </Link>
  );
}