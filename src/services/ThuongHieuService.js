import api from "./api";

export const findAllThuongHieu = async () => {
  return await api.get("/staff/thuong-hieu");
};

export const createThuongHieu = async (thuongHieu) => {
  return await api.post("/staff/thuong-hieu/add", thuongHieu);
};

export const updateThuongHieu = async (thuongHieu, maThuongHieu) => {
  return await api.put(`/staff/thuong-hieu/update/${maThuongHieu}`, thuongHieu);
};

export const deleteThuongHieu = async (id) => {
  return await api.delete(`/staff/thuong-hieu/delete/${id}`);
};

export const findThuongHieuById = async (id) => {
  return await api.get(`/staff/thuong-hieu${id}`);
};

export const updateStatusThuongHieu = async (thuongHieu, maThuongHieu) => {
  return await api.put(`/staff/thuong-hieu/sua/${maThuongHieu}`, thuongHieu);
};

export const loadAllThuongHieu = async () => {
  return await api.get("/staff/thuong-hieu/load-thuong-hieu");
};
