// src/actions/writing.js
import API from "../lib/axios";

// ── ADMIN ──
export const getAllWritingTest = (params = {}) =>
  API.get("/admin/writing", { params });
export const getSingleWritingTest = (id) =>
  API.get(`/admin/writing/${id}`);
export const createWritingTest = (data) =>
  API.post("/admin/writing", data);
export const updateWritingTest = (id, payload) =>
  API.put(`/admin/writing/${id}`, payload);
export const deleteWritingTest = (id) =>
  API.delete(`/admin/writing/${id}`);
export const getWritingStats = () => API.get("/admin/writing/stats");

// ── ADMIN: ATTEMPTS ──
export const getAllWritingAttempts = (params = {}) =>
  API.get("/admin/writing/attempts", { params });
export const getWritingAttemptById = (id) =>
  API.get(`/admin/writing/attempts/${id}`);
export const markWritingAttempt = (id, payload) =>
  API.put(`/admin/writing/attempts/${id}/mark`, payload);
export const deleteWritingAttempt = (id) =>
  API.delete(`/admin/writing/attempts/${id}`);
export const getWritingAttemptStats = () =>
  API.get("/admin/writing/attempts/stats");

// ── PUBLIC ──
export const listPublicWritingTests = () => API.get("/writing");
export const getPublicWritingTest = (testNumber) =>
  API.get(`/writing/${testNumber}`);
export const scoreWritingAnswer = (testNumber, body) =>
  API.post(`/writing/${testNumber}/score`, body);
export const submitWritingAttempt = (testNumber, body) =>
  API.post(`/writing/${testNumber}/submit`, body);
export const getMyWritingAttempts = () => API.get("/writing/my-attempts");
export const getMyWritingAttemptByTest = (testNumber) =>
  API.get(`/writing/my-attempts/${testNumber}`);