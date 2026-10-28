import axios from "axios";
import { useAuthStore } from "@/features/Useauthstore"; // adjust path

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// ── Request: attach token ──────────────────────────────────────
API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// ── Response: handle auth errors ───────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default API;
