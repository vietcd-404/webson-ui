import api from "./api";

export const findGioHang = async () => {
  return await api.get("/user/gio-hang-chi-tiet/all");
};

export const xoaTatCaGioHang = async () => {
  return await api.delete("/user/gio-hang-chi-tiet/delete-all");
};

export const themGioHang = async (sanPham, soLuong) => {
  return await api.post(
    `/user/gio-hang-chi-tiet/add?SPCTId=${sanPham}&soLuong=${soLuong}`
  );
};

export const xoaGioHang = async (id) => {
  return await api.delete(
    `/user/gio-hang-chi-tiet/delete-gio-hang?maGioHangCT=${id}`
  );
};

export const updateSoLuong = async (sanPham, soLuong) => {
  return await api.put(
    `/user/gio-hang-chi-tiet/update-product-quantity?SPCTId=${sanPham}&soLuong=${soLuong}`
  );
};
