import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let waitingQueue = [];

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return null;
  try {
    const res = await axios.post(
      `${api.defaults.baseURL}/refresh`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } }
    );
    if (res.data?.success) {
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("refreshToken", res.data.data.refreshToken);
      return res.data.data.token;
    }
    return null;
  } catch (e) {
    return null;
  }
};

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

// Xử lý khi token hết hạn: tự động refresh rồi thử lại request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (!response || response.status !== 401) {
      return Promise.reject(error);
    }
    if (config && config._retry) {
      logout();
      return Promise.reject(error);
    }
    // Không refresh cho chính request /refresh
    if (config && config.url && config.url.includes("/refresh")) {
      return Promise.reject(error);
    }
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waitingQueue.push({ resolve, reject });
      }).then((token) => {
        config.headers.Authorization = `Bearer ${token}`;
        return api(config);
      });
    }

    isRefreshing = true;
    config._retry = true;
    try {
      const newToken = await refreshToken();
      if (!newToken) throw new Error("refresh fail");
      waitingQueue.forEach((w) => w.resolve(newToken));
      waitingQueue = [];
      config.headers.Authorization = `Bearer ${newToken}`;
      return api(config);
    } catch (e) {
      waitingQueue.forEach((w) => w.reject(e));
      waitingQueue = [];
      logout();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  import("../router").then(({ default: router }) => router.push("/trang-chu"));
};

export default api;
