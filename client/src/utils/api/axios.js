import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ UPDATED TO sessionStorage
// Matches the persistence strategy used in Login.jsx
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token"); // Changed from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (no response from server)
    if (!error.response) {
      return Promise.reject(error);
    }

    // ✅ UPDATED TO sessionStorage
    // Handles unauthorized errors by clearing the correct storage
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/auth/login") // Don't redirect if the login itself fails
    ) {
      sessionStorage.clear(); // Changed from localStorage
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
