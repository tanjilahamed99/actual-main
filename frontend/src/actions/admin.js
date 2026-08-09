import API from "../lib/axios";

export const createReadingTest = (data) => {
  return API.post(`/admin/reading-tests`, data);
};

export const deleteReadingTest = (id) => {
  return API.delete(`/admin/reading-tests/${id}`);
};

export const updateReadingTest = (id, payload) => {
  return API.put(`/admin/reading-tests/${id}`, payload);
};

export const adminGetAllUserData = () => {
  return API.get(`/admin/users`);
};
export const adminUpdateUserStatus = (id, status) => {
  return API.put(`/admin/users/${id}/${status}`);
};
export const adminDeleteUser = (id) => {
  return API.delete(`/admin/user/${id}`);
};
