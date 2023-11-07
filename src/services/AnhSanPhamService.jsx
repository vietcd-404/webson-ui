import api from "./api";

export const findAllAnhSanPham = async () => {
  return await api.get("/anh");
};
export const findAllAnh = async (page, size) => {
  return await api.get(`/anh/tat-ca?page=${page}&size=${size}`);
};

export const createAnh = async (imageData) => {
  return await api.post("/anh/upload", imageData);
};

export const xoaAnhSanPham = async (ma) => {
  return await api.delete(`/anh/delete-anh/${ma}`);
};

export const xoaAnh = async (ma) => {
  return await api.delete(`/anh/delete/${ma}`);
};
