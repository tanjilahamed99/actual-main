import { Lock } from "lucide-react";

/**
 * Route access rules.
 * - public: anyone
 * - auth:   any logged-in user
 * - approved: logged-in + status === "approved"
 * - admin:  logged-in + role === "admin"
 */
export const ROUTES = [
  { href: "/", label: "Home", access: "public" },
  { href: "/demo", label: "Demo Test", access: "public" },
  { href: "/reading", label: "Reading", access: "approved" },
  { href: "/listening", label: "Listening", access: "approved" }, // future
  { href: "/writing", label: "Writing", access: "approved" }, // future
  { href: "/dashboard", label: "Dashboard", access: "auth" },
  { href: "/admin", label: "Admin Panel", access: "admin" },
];

export const LOCK_MESSAGES = {
  pending:
    "Your account is pending approval. You'll get access once an admin approves it.",
  rejected:
    "Your account request was rejected. Contact support if you think this is a mistake.",
  suspended: "Your account has been suspended. Contact support for details.",
  guest: "Please log in to continue.",
  adminOnly: "This area is for admins only.",
  notFound: "Page not found.",
};

/**
 * Returns null if access is granted, or an object describing why it's locked.
 */
export function checkAccess(route, user) {
  const level = route.access ?? "public";

  if (level === "public") return null;

  // Guest (no user loaded yet or not logged in)
  if (!user) {
    return {
      status: "guest",
      message: LOCK_MESSAGES.guest,
    };
  }

  if (level === "auth") return null;

  if (level === "admin") {
    if (user.role !== "admin") {
      return { status: "adminOnly", message: LOCK_MESSAGES.adminOnly };
    }
    return null;
  }

  if (level === "approved") {
    if (user.role === "admin") return null; // admins implicitly pass
    if (user.status !== "approved") {
      const status = user.status ?? "unknown";
      return {
        status,
        message: LOCK_MESSAGES[status] ?? "You don't have access to this yet.",
      };
    }
    return null;
  }

  return null;
}

export { Lock };
