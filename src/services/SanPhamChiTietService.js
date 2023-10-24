import api from "./api";

export const findAllSPCT = async () => {
  return await api.get("/admin/san-pham-chi-tiet/all");
};

export const creatSPCT = async (sanPham) => {
  return await api.post("/admin/san-pham-chi-tiet/add", sanPham);
};

export const updateSPCT = async (sanPham, ma) => {
  return await api.put(`/admin/san-pham-chi-tiet/update/${sanPham}`, ma);
};

export const deleteSPCT = async (id) => {
  return await api.delete(`/admin/san-pham-chi-tiet/delete/${id}`);
};

export const addImage = async (productId, imageIds) => {
  return await api.post(
    `/admin/san-pham-chi-tiet/${productId}/images`,
    imageIds
  );
};

export const listImageSanPham = async (productId) => {
  return await api.get(`/admin/san-pham-chi-tiet/${productId}/images`);
};
