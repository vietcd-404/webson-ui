import api from "./api";

export const findAllAnhSanPham = async () => {
  return await api.get("/admin/anh");
};
export const findAllAnh = async () => {
  return await api.get("/admin/anh/tat-ca");
};

export const createAnh = async (anh) => {
  return await api.post("/admin/anh/upload", anh);
};

export const xoaAnhSanPham = async (ma) => {
  return await api.delete(`/admin/anh/delete-anh/${ma}`);
};

export const xoaAnh = async (ma) => {
  return await api.delete(`/admin/anh/delete/${ma}`);
};
