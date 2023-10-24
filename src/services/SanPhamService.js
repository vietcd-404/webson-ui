import api from "./api";

export const findAllSanPham = async () => {
  return await api.get("/admin/san-pham");
};

export const createSanPham = async (loai) => {
  return await api.post("/admin/san-pham/add", loai);
};

export const updateSanPham = async (loai, maLoai) => {
  return await api.put(`/admin/san-pham/update/${maLoai}`, loai);
};

export const deleteBySanPham = async (id) => {
  return await api.delete(`/admin/san-pham/delete/${id}`);
};

export const findLoaiBySanPham = async (id) => {
  return await api.get(`/admin/san-pham/${id}`);
};
