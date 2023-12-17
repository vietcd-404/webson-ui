import api from "./api";

export const getTop4Product = async () => {
  return await api.get(`/admin/top-4-product`);
};

export const sumTotalBill = async () => {
  return await api.get(`/admin/total-all-bill`);
};

export const getTop4Customer = async () => {
  return await api.get(`/admin/top-4-customer`);
};

export const getTop4Favorite = async () => {
  return await api.get(`/admin/top-4-favorite`);
};

export const getDoanhThuTheoNam = async () => {
  return await api.get(`/admin/doanh-thu-theo-nam`);
};

export const getThongKeStatus = async (status) => {
  return await api.get(`/admin/status-bill?status=${status}`);
};

export const getDoanhThuTheoThang = async (month, year, trangThai) => {
  return await api.get(
    `/admin/doanh-thu-theo-thang?month=${month}&year=${year}&trangThai=${trangThai}`
  );
};

export const getDoanhThuTheoNgay = async (day, trangThai) => {
  return await api.get(
    `/admin/doanh-thu-theo-ngay?day=${day}&trangThai=${trangThai}`
  );
};

export const getDoanhThuTheoKhoangNgay = async (ngayBD, ngayKT, trangThai) => {
  return await api.get(
    `/admin/total-round-time?ngayBD=${ngayBD}&ngayKT=${ngayKT}&trangThai=${trangThai}`
  );
};
