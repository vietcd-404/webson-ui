import api from "./api";

// export const getAllTaiQuay = async (tenSanPham) => {
//   return await api.get(`/guest/san-pham/get-all?tenSanPham=${tenSanPham}`);
// };

export const taoHoaDonTaiQuay = async (hoaDon) => {
  return await api.post("/staff/order", hoaDon);
};

export const hienHoaDonTaiQuay = async () => {
  return await api.get("/staff/get-all");
};

export const getAllTaiQuay = async () => {
  return await api.get(`/guest/san-pham/get-all`);
};

export const findSanPham = async (maHoaDon) => {
  return await api.get(`/staff/order/get-hoadon?maHoaDon=${maHoaDon}`);
};

export const xoaTatCaGioHangTaiQuay = async () => {
  return await api.delete("/staff/gio-hang-chi-tiet/delete-all");
};

export const themSanPhamTaiQuay = async (maSPCT, soLuong, maHoaDon) => {
  return await api.post(
    `/staff/order/them-san-pham-vao-hoa-don?maSPCT=${maSPCT}&soLuong=${soLuong}&maHoaDon=${maHoaDon}`
  );
};

export const xoaSanPhamTaiQuay = async (maHoaDonCT) => {
  return await api.delete(`/staff/order/delete?maHoaDonCT=${maHoaDonCT}`);
};

export const updateSoLuongTaiQuay = async (maHoaDonCT, soLuong, maHoaDon) => {
  return await api.post(
    `/staff/order/update-so-luong?maHoaDon=${maHoaDon}&soLuong=${soLuong}&maHoaDonCT=${maHoaDonCT}`
  );
};

export const getAllKhachHang = async () => {
  return await api.get("/staff/nguoi-dung/khach-hang");
};

export const thanhToanHoaDon = async (maHoaDon, hoaDon) => {
  return await api.put(`/staff/order/update?maHoaDon=${maHoaDon}`, hoaDon);
};
