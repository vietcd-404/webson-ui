import api from "./api";

export const findAllLoai = async () => {
  return await api.get("/admin/loai");
};

export const createLoai = async (loai) => {
  return await api.post("/admin/loai/add", loai);
};

export const updateLoai = async (loai, maLoai) => {
  return await api.put(`/admin/loai/update/${maLoai}`, loai);
};

export const deleteById = async (id) => {
  return await api.delete(`/admin/loai/delete/${id}`);
};

export const findLoaiById = async (id) => {
  return await api.get(`/admin/loai/${id}`);
};
