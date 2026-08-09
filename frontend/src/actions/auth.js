import API from "../lib/axios";

export const login = (email, password) => {
  return API.post(`/auth/login`, { email, password });
};

export const register = (data) => {
  return API.post(`/auth/register`, data);
};

export const getMyData = () => {
  return API.get(`/auth/profile`);
};

export const updateMyData = ({ id, data }) => {
  return API.put(`/auth/profile/update/${id}`, data);
};

export const changePassword = ({ id, data }) => {
  return API.put(`/auth/change-password/${id}`, data);
};

export const setResendCode = (email) => {
  return API.post(`/auth/forgot-password`, { email });
};

export const validateCode = (data) => {
  return API.post(`/auth/validate-otp`, data);
};

export const resetPassword = (data) => {
  return API.post(`/auth/reset-password`, data);
};
