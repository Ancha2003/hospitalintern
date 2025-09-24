import axios from "axios";

// Use your deployed backend URL
const api = axios.create({
  baseURL: "https://hospitalintern.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// JWT token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
