import axios from "axios";
import { APP_BASE_URL } from "../configs/constans";

const instance = axios.create({
  baseURL: APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers["Authorization"] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const user = JSON.parse(localStorage.getItem("user"));

    if (originalRequest.url !== "/auth/signin" && error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Sử dụng refreshToken hiện có để cố gắng refresh token
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${user.refreshToken}`;
          const refreshTokenResponse = await instance(originalRequest);

          // Lưu thông tin user mới vào localStorage
          const newUser = refreshTokenResponse.data;
          localStorage.setItem("user", JSON.stringify(newUser));

          return refreshTokenResponse;
        } catch (refreshError) {
          // Xử lý lỗi khi refresh token thất bại
          localStorage.removeItem("user");
          window.location = "/signin";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);
export default instance;
