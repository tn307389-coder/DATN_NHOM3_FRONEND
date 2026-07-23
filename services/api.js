import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn JWT token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý khi token hết hạn / không hợp lệ
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const { default: router } = await import("../router");
      router.push("/trang-chu");
    }
    return Promise.reject(error);
  }
);

export default api;
