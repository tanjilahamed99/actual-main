"use client";

import { useState, useEffect } from "react";
import {
  adminDeleteUser,
  adminGetAllUserData,
  adminUpdateUserStatus,
} from "@/actions/admin";

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const STATUS_CONFIG = {
  pending: {
    badge: "bg-gold-soft/40 text-gold",
    dot: "bg-gold",
    label: "Pending",
  },
  approved: {
    badge: "bg-sage-soft text-sage",
    dot: "bg-sage",
    label: "Approved",
  },
  rejected: {
    badge: "bg-clay/10 text-clay",
    dot: "bg-clay",
    label: "Rejected",
  },
};

const AVATAR_STYLES = [
  "bg-indigo-deep text-paper",
  "bg-sage text-paper",
  "bg-gold text-indigo-deep",
  "bg-clay text-paper",
  "bg-ink-soft text-paper",
];

function avatarStyle(id) {
  return AVATAR_STYLES[id.charCodeAt(id.length - 1) % AVATAR_STYLES.length];
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  tone = "clay",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const tones = {
    clay: { badge: "bg-clay/10 text-clay", btn: "bg-clay hover:bg-clay/90" },
    sage: { badge: "bg-sage-soft text-sage", btn: "bg-sage hover:bg-sage/90" },
  };
  const t = tones[tone];

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
      onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in-up w-full max-w-sm rounded-2xl border border-line bg-paper-raised p-6 shadow-2xl">
        <div
          className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${t.badge}`}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-6 w-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
            />
          </svg>
        </div>
        <h3 className="text-center font-display text-lg text-ink">{title}</h3>
        <p className="mt-1.5 text-center font-sans text-sm text-muted">
          {message}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-line py-2.5 font-sans text-sm font-medium text-ink-soft transition-colors duration-200 hover:bg-paper">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 rounded-full py-2.5 font-sans text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] ${t.btn}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── User Row ────────────────────────────────────────────────────────────────
function UserRow({ user, index, onApprove, onReject, onDelete }) {
  const sc = STATUS_CONFIG[user.status] || STATUS_CONFIG.pending;

  return (
    <tr
      className="animate-fade-in-up group border-b border-line/70 text-sm transition-colors duration-150 last:border-0 hover:bg-paper"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}>
      {/* User */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-xs font-medium shadow-sm ${avatarStyle(user._id)}`}>
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-sans text-sm font-medium text-ink">
              {user.name}
            </p>
            <p className="truncate font-mono text-[11px] text-muted">
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] ${sc.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
          {sc.label}
        </span>
      </td>

      {/* Joined */}
      <td className="hidden px-5 py-4 font-mono text-xs text-muted sm:table-cell">
        {formatDate(user.createdAt)}
      </td>

      {/* Tests */}
      <td className="hidden px-5 py-4 font-mono text-xs text-ink-soft md:table-cell">
        {user.testsAttempted}
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          {user.status === "pending" && (
            <>
              <button
                type="button"
                onClick={() => onApprove(user._id)}
                className="rounded-full bg-sage-soft px-3 py-1.5 font-sans text-xs font-semibold text-sage transition-transform duration-150 hover:scale-105">
                Approve
              </button>
              <button
                type="button"
                onClick={() => onReject(user._id)}
                className="rounded-full bg-clay/10 px-3 py-1.5 font-sans text-xs font-semibold text-clay transition-transform duration-150 hover:scale-105">
                Reject
              </button>
            </>
          )}
          {user.status === "rejected" && (
            <button
              type="button"
              onClick={() => onApprove(user._id)}
              className="rounded-full bg-sage-soft px-3 py-1.5 font-sans text-xs font-semibold text-sage transition-transform duration-150 hover:scale-105">
              Approve
            </button>
          )}
          {user.status === "approved" && (
            <button
              type="button"
              onClick={() => onReject(user._id)}
              className="rounded-full bg-paper px-3 py-1.5 font-sans text-xs font-semibold text-muted transition-colors duration-150 hover:text-ink">
              Revoke
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(user._id)}
            title="Delete user"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted opacity-0 transition-all duration-150 hover:bg-clay/10 hover:text-clay group-hover:opacity-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-4 w-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data } = await adminGetAllUserData();
      if (data.success) {
        setUsers(data.users);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const stats = {
    total: users.length,
    pending: users.filter((u) => u.status === "pending").length,
    approved: users.filter((u) => u.status === "approved").length,
    rejected: users.filter((u) => u.status === "rejected").length,
  };

  const visible = users.filter((u) => {
    const matchFilter = filter === "all" || u.status === filter;
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleApprove = (userId) => setConfirm({ type: "approve", userId });
  const handleReject = (userId) => setConfirm({ type: "reject", userId });
  const handleDelete = (userId) => setConfirm({ type: "delete", userId });

  const executeConfirm = async () => {
    if (!confirm) return;
    const { type, userId } = confirm;

    if (type === "delete") {
      try {
        const { data } = await adminDeleteUser(userId);
        if (data.success) {
          setUsers((prev) => prev.filter((u) => u._id !== userId));
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const newStatus = type === "approve" ? "approved" : "rejected";
      try {
        const { data } = await adminUpdateUserStatus(userId, newStatus);
        if (data.success) {
          setUsers((prev) =>
            prev.map((u) =>
              u._id === userId ? { ...u, status: newStatus } : u,
            ),
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    setConfirm(null);
  };

  const FILTERS = [
    { key: "all", label: "All users", count: stats.total },
    { key: "pending", label: "Pending", count: stats.pending, tint: "gold" },
    { key: "approved", label: "Approved", count: stats.approved, tint: "sage" },
    { key: "rejected", label: "Rejected", count: stats.reject, tint: "clay" },
  ];

  const confirmConfig = {
    approve: {
      title: "Approve this user?",
      message: "They will gain full access to the archive.",
      confirmLabel: "Yes, approve",
      tone: "sage",
    },
    reject: {
      title: "Reject this user?",
      message: "Their access will be revoked or denied.",
      confirmLabel: "Yes, reject",
      tone: "clay",
    },
    delete: {
      title: "Delete this user?",
      message: "This action is permanent and cannot be undone.",
      confirmLabel: "Delete",
      tone: "clay",
    },
  };

  return (
    <div className="space-y-6">
      {confirm && (
        <ConfirmDialog
          open={true}
          {...confirmConfig[confirm.type]}
          onConfirm={executeConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Stat chips */}
      <div className="flex flex-wrap gap-3">
        {[
          {
            label: "Total",
            value: stats.total,
            tint: "bg-indigo-deep/[0.06] text-indigo-deep",
          },
          {
            label: "Pending",
            value: stats.pending,
            tint: "bg-gold-soft/40 text-gold",
          },
          {
            label: "Approved",
            value: stats.approved,
            tint: "bg-sage-soft text-sage",
          },
          {
            label: "Rejected",
            value: stats.reject,
            tint: "bg-clay/10 text-clay",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 ${s.tint}`}>
            <span className="font-mono text-xs font-semibold">{s.value}</span>
            <span className="font-sans text-xs">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-line bg-paper-raised">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-1 overflow-x-auto rounded-full bg-paper p-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 font-sans text-xs font-medium transition-colors duration-200 ${
                  filter === f.key
                    ? "bg-indigo-deep text-paper"
                    : "text-muted hover:text-ink"
                }`}>
                {f.label}
                {f.count > 0 && (
                  <span className="ml-1.5 opacity-70">{f.count}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2 sm:max-w-xs">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4 shrink-0 text-muted">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent font-sans text-sm text-ink placeholder:text-muted focus:outline-none"
            />
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="space-y-3 p-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-paper" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-display text-2xl text-ink/20">No users</p>
            <p className="mt-2 font-sans text-sm text-muted">
              Try adjusting your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line font-mono text-[11px] uppercase tracking-wider text-muted">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">
                    Joined
                  </th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((user, i) => (
                  <UserRow
                    key={user._id}
                    user={user}
                    index={i}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && visible.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-line p-4 font-sans text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <p>
              Showing <span className="text-ink">{visible.length}</span> of{" "}
              <span className="text-ink">{users.length}</span> users
            </p>
            {stats.pending > 0 && (
              <span className="rounded-full bg-gold-soft/40 px-3 py-1 font-mono text-xs text-gold">
                {stats.pending} awaiting approval
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
