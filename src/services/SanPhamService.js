import api from "./api";

export const findAllSanPham = async () => {
  return await api.get("/staff/san-pham");
};

export const createSanPham = async (sanPham) => {
  return await api.post("/staff/san-pham/add", sanPham);
};

export const updateSanPham = async (sanPham, maSanPham) => {
  return await api.put(`/staff/san-pham/update/${maSanPham}`, sanPham);
};

export const deleteBySanPham = async (id) => {
  return await api.delete(`/staff/san-pham/delete/${id}`);
};

export const findLoaiBySanPham = async (id) => {
  return await api.get(`/staff/san-pham/${id}`);
};

export const updateStatusSp = async (sanPham, maSanPham) => {
  return await api.put(`/staff/san-pham/sua/${maSanPham}`, sanPham);
};

export const loadAllSanPham = async () => {
  return await api.get("/staff/san-pham/load-sp");
};

export const getAllLocByAdmin = async () => {
  return await api.get(`/staff/san-pham/get-all/loc`);
};
