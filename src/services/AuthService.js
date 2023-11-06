import api from "./api";

export const dangKy = async (dangKy) => {
  return await api.post("/auth/signup", dangKy);
};

export const dangNhap = async (username, password) => {
  return await api.post("/auth/signin", username, password);
};

export const kichHoat = async () => {
  return await api.post("/auth/active");
};

export const guiOtp = async () => {
  return await api.get("/auth/resend-otp");
};
