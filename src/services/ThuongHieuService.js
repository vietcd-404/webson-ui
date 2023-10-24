import api from "./api";

export const findAllThuongHieu = async () => {
  return await api.get("/admin/thuong-hieu");
};

export const createThuongHieu = async (thuongHieu) => {
  return await api.post("/admin/thuong-hieu/add", thuongHieu);
};

export const updateThuongHieu = async (thuongHieu, maThuongHieu) => {
  return await api.put(`/admin/thuong-hieu/update/${maThuongHieu}`, thuongHieu);
};

export const deleteThuongHieu = async (id) => {
  return await api.delete(`/admin/thuong-hieu/delete/${id}`);
};

export const findThuongHieuById = async (id) => {
  return await api.get(`/admin/thuong-hieu${id}`);
};
