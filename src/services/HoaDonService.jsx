import api from "./api";

export const taoHoaDon = async (maGioHang, hoaDon) => {
  return await api.post(`/user/order/place/${maGioHang}`, hoaDon);
};

export const hienHoaDon = async (trangThai) => {
  return await api.get(`/user/order/get-hoadon?trangThai=${trangThai}`);
};

export const hienHoaDonTatCa = async () => {
  return await api.get("/user/order/get-hoadon/all");
};

export const hoaDonChiTiet = async (maHoaDon) => {
  return await api.get(`/user/order/get-hoadon/${maHoaDon}`);
};

export const chiTietHoaDon = async (maHoaDon1) => {
  return await api.get(`/user/order/get-hoadon/detail/${maHoaDon1}`);
};
