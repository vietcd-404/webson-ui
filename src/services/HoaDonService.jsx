import { Stomp } from "@stomp/stompjs";
import api from "./api";
import SockJS from "sockjs-client";
import EventEmitter from "eventemitter3";

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

export const getAllOrderByAdmin = async (trangThai) => {
  return await api.get(`/admin/order/getAll?trangThai=${trangThai}`);
};

export const getAllOrder = async () => {
  return await api.get(`/admin/order/all`);
};
const stompClient = SockJS("http://localhost:8000/api/anh/ws");
export const huytHoaDonByAdmin = async (maHoaDon) => {
  const response = await api.put(`/admin/order/huy-hoa-don?maHD=${maHoaDon}`);

  stompClient.send(
    "/app/updateHuy",
    {},
    JSON.stringify({
      maHoaDon: response.data.maHoaDon,
      trangThai: response.data.trangThai,
    })
  );
  return response;
};

export const capNhapTrangThaiHoaDonByAdmin = async (trangThai, maHoaDon) => {
  const response = await api.put(
    `/admin/order/thaydoiTrangThai?maHD=${maHoaDon}&trangThai=${trangThai}`
  );
  stompClient.send(
    "/app/updateOrderStatus",
    {},
    JSON.stringify({
      maHoaDon: response.data.maHoaDon,
      trangThai: response.data.trangThai,
    })
  );
  return response;
};

export const capNhapThanhToanHoaDonByAdmin = async (thanhToan, maHoaDon) => {
  return await api.put(
    `/admin/order/thanhToan?maHD=${maHoaDon}&thanhToan=${thanhToan}`
  );
};

export const productInforHoaDon = async (maHoaDon2) => {
  return await api.get(`/admin/order/get-hoadon/${maHoaDon2}`);
};

export const inforUserHoaDon = async (maHoaDon1) => {
  return await api.get(`/admin/order/get-hoadon/detail/${maHoaDon1}`);
};
