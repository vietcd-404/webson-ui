import api from "./api";

// export const getAllTaiQuay = async (tenSanPham) => {
//   return await api.get(`/guest/san-pham/get-all?tenSanPham=${tenSanPham}`);
// };

export const taoHoaDonTaiQuay = async (hoaDon) => {
  return await api.post("/staff/order-tai-quay", hoaDon);
};

export const hienHoaDonTaiQuay = async () => {
  return await api.get("/staff/get-all/tai-quay");
};

export const getAllTaiQuay = async () => {
  return await api.get(`/staff/san-pham/get-all`);
};

export const findSanPham = async (maHoaDon) => {
  return await api.get(`/staff/order-tai-quay/get-hoadon?maHoaDon=${maHoaDon}`);
};

export const xoaTatCaGioHangTaiQuay = async () => {
  return await api.delete("/staff/gio-hang-chi-tiet/delete-all");
};

export const themSanPhamTaiQuay = async (maSPCT, soLuong, maHoaDon) => {
  return await api.post(
    `/staff/order-tai-quay/them-san-pham-vao-hoa-don?maSPCT=${maSPCT}&soLuong=${soLuong}&maHoaDon=${maHoaDon}`
  );
};

export const xoaSanPhamTaiQuay = async (maHoaDonCT) => {
  return await api.delete(
    `/staff/order-tai-quay/delete?maHoaDonCT=${maHoaDonCT}`
  );
};

export const updateSoLuongTaiQuay = async (maHoaDonCT, soLuong, maHoaDon) => {
  return await api.post(
    `/staff/order-tai-quay/update-so-luong?maHoaDon=${maHoaDon}&soLuong=${soLuong}&maHoaDonCT=${maHoaDonCT}`
  );
};

export const getAllKhachHang = async () => {
  return await api.get("/staff/nguoi-dung/khach-hang");
};

export const thanhToanHoaDon = async (maHoaDon, hoaDon) => {
  return await api.put(
    `/staff/order-tai-quay/update?maHoaDon=${maHoaDon}`,
    hoaDon
  );
};
