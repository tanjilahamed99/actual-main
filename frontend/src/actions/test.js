import API from "../lib/axios";

// -------- ADMIN --------
export const getAllReadingTest = (params = {}) =>
  API.get("/reading", { params });

export const getSingleReadingTest = (id) =>
  API.get(`/reading/${id}`);

export const createReadingTest = (payload) =>
  API.post("/admin/reading", payload);

export const updateReadingTest = (id, payload) =>
  API.put(`/admin/reading/${id}`, payload);

export const deleteReadingTest = (id) =>
  API.delete(`/admin/reading/${id}`);

// -------- PUBLIC --------
export const getPublicReadingTest = (testNumber) =>
  API.get(`/reading/${testNumber}`);

export const listPublicReadingTests = () =>
  API.get("/reading");