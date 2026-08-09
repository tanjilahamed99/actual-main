import API from "../lib/axios";

export const getAllReadingTest = () => {
  return API.get(`/admin/allReadingTest`);
};

export const getSingleReadingTest = (id) => {
  return API.get(`/admin/reading/${id}`);
};
