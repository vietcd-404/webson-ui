import api from "./api";

export const listSanPhamShopping = async () => {
  return await api.get("/shop");
};

export const findAllthuongHieu = async (tenThuongHieu) => {
  return await api.get(
    `/guest/san-pham/get-thuong-hieu?tenThuongHieu=${tenThuongHieu}`
  );
};

export const findAllSPCT = async () => {
  return await api.get("/staff/san-pham-chi-tiet/all");
};

export const creatSPCT = async (sanPham) => {
  return await api.post("/staff/san-pham-chi-tiet/add", sanPham);
};

export const creatListSPCT = async (sanPham) => {
  return await api.post("/staff/san-pham-chi-tiet/add-all", sanPham);
};

export const updateSPCT = async (sanPham, ma) => {
  return await api.put(`/staff/san-pham-chi-tiet/update/${sanPham}`, ma);
};

export const deleteSPCT = async (id) => {
  return await api.delete(`/staff/san-pham-chi-tiet/delete/${id}`);
};

export const addImage = async (productId, imageIds) => {
  return await api.post(
    `/staff/san-pham-chi-tiet/${productId}/images`,
    imageIds
  );
};

export const listImageSanPham = async (productId) => {
  return await api.get(`/staff/san-pham-chi-tiet/${productId}/images`);
};

export const updateSPCTStatus = async (sanPham, ma) => {
  return await api.put(`/staff/san-pham-chi-tiet/sua/${ma}`, sanPham);
};

export const top5SPNoiNhat = async () => {
  return await api.get(`/auth/san-pham-chi-tiet/top-5-moi-nhat`);
};
export const top4SPBanChay = async () => {
  return await api.get(`/auth/san-pham-chi-tiet/top-4-ban-chay`);
};
