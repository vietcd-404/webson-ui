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
