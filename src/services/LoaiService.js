import api from "./api";

export const findAllLoai = async () => {
  return await api.get("/staff/loai");
};

export const createLoai = async (loai) => {
  return await api.post("/staff/loai/add", loai);
};

export const updateLoai = async (loai, maLoai) => {
  return await api.put(`/staff/loai/update/${maLoai}`, loai);
};

export const deleteById = async (id) => {
  return await api.delete(`/staff/loai/delete/${id}`);
};

export const findLoaiById = async (id) => {
  return await api.get(`/staff/loai/${id}`);
};

export const updateStatusLoai = async (loai, maLoai) => {
  return await api.put(`/staff/loai/sua/${maLoai}`, loai);
};

export const loadAllLoai = async () => {
  return await api.get("/staff/loai/load-loai");
};
