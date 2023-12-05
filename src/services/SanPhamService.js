import api from "./api";

export const findAllSanPham = async () => {
  return await api.get("/admin/san-pham");
};

export const createSanPham = async (sanPham) => {
  return await api.post("/admin/san-pham/add", sanPham);
};

export const updateSanPham = async (sanPham, maSanPham) => {
  return await api.put(`/admin/san-pham/update/${maSanPham}`, sanPham);
};

export const deleteBySanPham = async (id) => {
  return await api.delete(`/admin/san-pham/delete/${id}`);
};

export const findLoaiBySanPham = async (id) => {
  return await api.get(`/admin/san-pham/${id}`);
};

export const updateStatusSp = async (sanPham, maSanPham) => {
  return await api.put(`/admin/san-pham/sua/${maSanPham}`, sanPham);
};

export const loadAllSanPham = async () => {
  return await api.get("/admin/san-pham/load-sp");
};

export const getAllLocByAdmin = async () => {
  return await api.get(`/admin/san-pham/get-all/loc`);
};
