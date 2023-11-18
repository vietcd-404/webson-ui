import api from "./api";

export const findAllVoucher = async () => {
  return await api.get("/admin/voucher");
};

export const createVoucher = async (voucher) => {
  return await api.post("/admin/voucher/add", voucher);
};

export const updateVoucher = async (voucher, maVoucher) => {
  return await api.put(`/admin/voucher/update/${maVoucher}`, voucher);
};

export const deleteVoucher = async (id) => {
  return await api.delete(`/admin/voucher/delete/${id}`);
};

export const findVoucherById = async (id) => {
  return await api.get(`/admin/voucher/${id}`);
};

export const findVoucher = async () => {
  return await api.get(`/user/voucher`);
};
