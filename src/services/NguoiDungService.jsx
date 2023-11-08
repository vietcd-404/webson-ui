import api from "./api";
export const findAllThuongHieu = async () => {
  return await api.get("/admin/nguoi-dung");
};
