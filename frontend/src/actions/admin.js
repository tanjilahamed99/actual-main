import API from "../lib/axios";

// ─────────────────────────────────────────────────────────────
// ADMIN — READING
// ─────────────────────────────────────────────────────────────

/**
 * List reading tests (admin).
 * Accepts: { q, status, priority, page, limit, sort, order }
 */
export const getAllReadingTest = (params = {}) =>
  API.get("/admin/reading", { params });

/** Get one reading test by Mongo _id (full doc, admin only). */
export const getSingleReadingTest = (id) =>
  API.get(`/admin/reading/${id}`);

/** Create a new reading test. */
export const createReadingTest = (data) =>
  API.post("/admin/reading", data);

/** Update a reading test by _id. */
export const updateReadingTest = (id, payload) =>
  API.put(`/admin/reading/${id}`, payload);

/** Delete a reading test by _id. */
export const deleteReadingTest = (id) =>
  API.delete(`/admin/reading/${id}`);

// ─────────────────────────────────────────────────────────────
// PUBLIC — READING
// ─────────────────────────────────────────────────────────────

/** List of published reading tests (lightweight). */
export const listPublicReadingTests = () =>
  API.get("/reading");

/** One published reading test by testNumber (no answer key). */
export const getPublicReadingTest = (testNumber) =>
  API.get(`/reading/${testNumber}`);

// ─────────────────────────────────────────────────────────────
// ADMIN — USERS
// ─────────────────────────────────────────────────────────────

/** List all users (admin). */
export const adminGetAllUserData = () =>
  API.get("/admin/users");

/**
 * Update a user's status.
 * status: "pending" | "approved" | "rejected" | "suspended"
 */
export const adminUpdateUserStatus = (id, status) =>
  API.put(`/admin/users/${id}/${status}`);

/** Delete a user by _id (admin). */
export const adminDeleteUser = (id) =>
  API.delete(`/admin/users/${id}`);