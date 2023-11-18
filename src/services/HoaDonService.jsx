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

export const hoaDonChiTiet = async (maHoaDon2) => {
  return await api.get(`/user/order/get-hoadon/${maHoaDon2}`);
};

export const chiTietHoaDon = async (maHoaDon1) => {
  return await api.get(`/user/order/get-hoadon/detail/${maHoaDon1}`);
};

export const updatetHoaDon = async (maHoaDon, hoadon) => {
  return await api.put(`/user/order/update/${maHoaDon}`, hoadon);
};

export const huytHoaDon = async (maHoaDon) => {
  return await api.put(`/user/order/huy-hoa-don?maHD=${maHoaDon}`);
};

export const xoaSanPham = async (maHoaDon) => {
  return await api.delete(`/user/order/delete?maHoaDonCT=${maHoaDon}`);
};

export const updateSoLuongSanPham = async (maHoaDonCT, soLuong, maHoaDon) => {
  return await api.post(
    `/user/order/update-so-luong?soLuong=${soLuong}&maHoaDonCT=${maHoaDonCT}&maHoaDon=${maHoaDon}`
  );
};

export const taoHoaDonKhach = async (maSanPhamCT, hoaDon) => {
  return await api.post(`/guest/order/thanh-toan?ma=${maSanPhamCT}`, hoaDon);
};
