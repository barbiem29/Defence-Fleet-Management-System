import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// -----------------------------
// Auth token helpers
// -----------------------------
const getStoredToken = () => {
  // 1. Direct token key
  let token = localStorage.getItem("token");
  if (token && token !== "undefined" && token !== "null") {
    return token;
  }

  // 2. Common alternative key names
  token = localStorage.getItem("authToken");
  if (token && token !== "undefined" && token !== "null") {
    return token;
  }

  token = localStorage.getItem("accessToken");
  if (token && token !== "undefined" && token !== "null") {
    return token;
  }

  // 3. Token inside stored user object
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.token) return user.token;
    if (user?.accessToken) return user.accessToken;
    if (user?.data?.token) return user.data.token;
  } catch (_) {
    // ignore invalid JSON
  }

  // 4. Token inside auth object (common pattern)
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    if (auth?.token) return auth.token;
    if (auth?.accessToken) return auth.accessToken;
    if (auth?.user?.token) return auth.user.token;
  } catch (_) {
    // ignore invalid JSON
  }

  return null;
};

const clearStoredAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("auth");
};

// -----------------------------
// Request interceptor
// -----------------------------
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// Response interceptor
// -----------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredAuth();
    }
    return Promise.reject(error);
  }
);

// -----------------------------
// Auth APIs
// -----------------------------
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// -----------------------------
// Vehicle APIs
// -----------------------------
export const vehicleAPI = {
  getAll: () => api.get("/vehicles"),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post("/vehicles", data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
};

// -----------------------------
// Maintenance APIs
// -----------------------------
export const maintenanceAPI = {
  create: (data) => api.post("/maintenance", data),
  getAll: () => api.get("/maintenance"),
  getById: (id) => api.get(`/maintenance/${id}`),
  getMyRequests: () => api.get("/maintenance/my-requests"),

  getCounts: () => api.get("/maintenance/dashboard/counts"),

  getPendingForJrExec: () => api.get("/maintenance/jr-executive/pending"),
  approveByJrExec: (id, comment) =>
    api.put(`/maintenance/${id}/jr-executive/approve`, { comment }),
  rejectByJrExec: (id, comment) =>
    api.put(`/maintenance/${id}/jr-executive/reject`, { comment }),

  getPendingForOIC: () => api.get("/maintenance/oic/pending"),
  approveByOIC: (id, comment) =>
    api.put(`/maintenance/${id}/oic/approve`, { comment }),
  rejectByOIC: (id, comment) =>
    api.put(`/maintenance/${id}/oic/reject`, { comment }),

  getApprovedForSupplier: () => api.get("/maintenance/supplier/approved"),
  updateSupplyStatus: (id, status, comment) =>
    api.put(`/maintenance/${id}/supplier/update`, { status, comment }),
};

// -----------------------------
// User APIs
// -----------------------------
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
};

// -----------------------------
// Error handler
// -----------------------------
export const handleAPIError = (error) => {
  if (error.response) {
    return (
      error.response.data?.error ||
      error.response.data?.message ||
      "An error occurred"
    );
  } else if (error.request) {
    return "No response from server";
  } else {
    return error.message || "An error occurred";
  }
};

export default api;