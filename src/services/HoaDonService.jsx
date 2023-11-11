import api from "./api";

export const taoHoaDon = async (maGioHang, hoaDon) => {
  return await api.post(`/user/order/place/${maGioHang}`, hoaDon);
};
