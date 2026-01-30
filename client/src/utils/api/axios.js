import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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

    // Unauthorized
    if (
        error.response?.status === 401 &&
        error.config.url.includes("/auth")
        ) {
            localStorage.clear();
            window.location.href = "/login";
          }

    return Promise.reject(error);
  }
);

export default axiosInstance;
