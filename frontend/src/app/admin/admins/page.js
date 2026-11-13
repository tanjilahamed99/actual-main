"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  adminDeleteUser,
  adminUpdateUser,
  adminGetAllAdmins,
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

// ─── Update Admin Modal ──────────────────────────────────────────────────────
function UpdateAdminModal({ user, onClose, onSuccess }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name, email };
      if (password.trim() !== "") payload.password = password;

      const { data } = await adminUpdateUser(user._id, payload);
      if (data.success) {
        toast.success("Admin updated successfully!");
        onSuccess({ ...user, name, email });
        onClose();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update admin");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="animate-fade-in-up w-full max-w-md rounded-2xl border border-line bg-paper-raised p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg text-ink">Update Admin</h3>
            <p className="font-sans text-xs text-muted">Edit details or reset password.</p>
          </div>
          <button type="button" onClick={onClose} className="text-muted hover:text-ink">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block font-sans text-xs font-semibold text-ink-soft">Full Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 font-sans text-sm text-ink outline-none transition focus:border-indigo-deep focus:ring-2 focus:ring-indigo-deep/20"
            />
          </label>

          <label className="block">
            <span className="mb-1 block font-sans text-xs font-semibold text-ink-soft">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 font-sans text-sm text-ink outline-none transition focus:border-indigo-deep focus:ring-2 focus:ring-indigo-deep/20"
            />
          </label>

          <label className="block">
            <span className="mb-1 flex items-center justify-between font-sans text-xs font-semibold text-ink-soft">
              <span>New Password</span>
              <span className="text-[10px] font-normal text-muted">(Leave blank to keep current)</span>
            </span>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 font-sans text-sm text-ink outline-none transition focus:border-indigo-deep focus:ring-2 focus:ring-indigo-deep/20"
            />
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-line py-2.5 font-sans text-sm font-medium text-ink-soft transition-colors hover:bg-paper"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-indigo-deep py-2.5 font-sans text-sm font-semibold text-paper transition-all hover:bg-ink active:scale-[0.98] disabled:opacity-70"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in-up w-full max-w-sm rounded-2xl border border-line bg-paper-raised p-6 shadow-2xl"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-clay/10 text-clay">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z" />
          </svg>
        </div>
        <h3 className="text-center font-display text-lg text-ink">{title}</h3>
        <p className="mt-1.5 text-center font-sans text-sm text-muted">{message}</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 rounded-full border border-line py-2.5 font-sans text-sm font-medium text-ink-soft transition-colors hover:bg-paper">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="flex-1 rounded-full bg-clay py-2.5 font-sans text-sm font-semibold text-white transition-all active:scale-[0.98]">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Row ────────────────────────────────────────────────────────────────
function AdminRow({ admin, index, onDelete, onEdit }) {
  return (
    <tr
      className="animate-fade-in-up group border-b border-line/70 text-sm transition-colors duration-150 last:border-0 hover:bg-paper"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-xs font-medium shadow-sm ${avatarStyle(admin._id)}`}>
            {getInitials(admin.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-sans text-sm font-medium text-ink">{admin.name}</p>
            <p className="truncate font-mono text-[11px] text-muted">{admin.email}</p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-deep/10 px-2.5 py-1 font-mono text-[11px] text-indigo-deep">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-deep" />
          Admin
        </span>
      </td>

      <td className="hidden px-5 py-4 font-mono text-xs text-muted sm:table-cell">
        {formatDate(admin.createdAt)}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEdit(admin)}
            title="Edit admin"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted opacity-0 transition-all duration-150 hover:bg-indigo-deep/10 hover:text-indigo-deep group-hover:opacity-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onDelete(admin._id)}
            title="Delete admin"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted opacity-0 transition-all duration-150 hover:bg-clay/10 hover:text-clay group-hover:opacity-100"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const { data } = await adminGetAllAdmins();
        if (data.success) {
          setAdmins(data.admins || []);
        }
      } catch (err) {
        toast.error("Failed to load admins");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);

  const visible = admins.filter((a) => {
    return (
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleDelete = (userId) => setConfirm({ userId });

  const executeConfirm = async () => {
    if (!confirm) return;
    try {
      const { data } = await adminDeleteUser(confirm.userId);
      if (data.success) {
        setAdmins((prev) => prev.filter((a) => a._id !== confirm.userId));
      }
    } catch (error) {
      toast.error("Failed to delete admin");
    }
    setConfirm(null);
  };

  return (
    <div className="space-y-6">
      {confirm && (
        <ConfirmDialog
          open={true}
          title="Delete this admin?"
          message="This action is permanent and cannot be undone."
          confirmLabel="Delete"
          onConfirm={executeConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {editingAdmin && (
        <UpdateAdminModal
          user={editingAdmin}
          onClose={() => setEditingAdmin(null)}
          onSuccess={(updatedAdmin) => {
            setAdmins((prev) =>
              prev.map((a) => (a._id === updatedAdmin._id ? updatedAdmin : a))
            );
          }}
        />
      )}

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 bg-indigo-deep/[0.06] text-indigo-deep">
          <span className="font-mono text-xs font-semibold">{admins.length}</span>
          <span className="font-sans text-xs">Total Admins</span>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-paper-raised">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <h2 className="font-display text-lg text-ink">Admin Accounts</h2>
          <div className="flex items-center gap-2 rounded-full border border-line px-3.5 py-2 sm:max-w-xs">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0 text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
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

        {loading ? (
          <div className="space-y-3 p-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-paper" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-display text-2xl text-ink/20">No admins</p>
            <p className="mt-2 font-sans text-sm text-muted">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line font-mono text-[11px] uppercase tracking-wider text-muted">
                  <th className="px-5 py-3 font-medium">Admin</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="hidden px-5 py-3 font-medium sm:table-cell">Joined</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((admin, i) => (
                  <AdminRow
                    key={admin._id}
                    admin={admin}
                    index={i}
                    onDelete={handleDelete}
                    onEdit={() => setEditingAdmin(admin)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && visible.length > 0 && (
          <div className="flex items-center gap-3 border-t border-line p-4 font-sans text-sm text-muted sm:p-5">
            <p>
              Showing <span className="text-ink">{visible.length}</span> of{" "}
              <span className="text-ink">{admins.length}</span> admins
            </p>
          </div>
        )}
      </div>
    </div>
  );
}