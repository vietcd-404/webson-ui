import api from "./api";

export const getAll = async (page, size) => {
  return await api.get(`/guest/san-pham/get-all?page=${page}&size=${size}`);
};

export const getDetailById = async (productId) => {
  return await api.get(`/guest/san-pham/${productId}`);
};

export const listImageSanPhamGuest = async (productId) => {
  return await api.get(`/guest/san-pham-chi-tiet/${productId}/images`);
};

export const getAllLoc = async () => {
  return await api.get(`/guest/san-pham/get-all/loc`);
};
export const top5SPNoiNhat = async () => {
  return await api.get(`/auth/san-pham-chi-tiet/top-5-moi-nhat`);
};
export const top4SPBanChay = async () => {
  return await api.get(`/auth/san-pham-chi-tiet/top-4-ban-chay`);
};
