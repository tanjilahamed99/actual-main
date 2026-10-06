import API from "../lib/axios";

export const getAllReadingTest = (params = {}) => {
  return API.get("/admin/allReadingTest", { params });
};

export const getSingleReadingTest = (id) => API.get(`/admin/reading/${id}`);
