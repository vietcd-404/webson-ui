import api from "./api";

export const thanhToanVnPay = async (tongTien) => {
  return await api.post(`/vnpay/pay?tongTien=${tongTien}`);
};
