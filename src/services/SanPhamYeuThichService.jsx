import api from "./api";

export const findAllYThich = async () => {
  return await api.get("/user/yeu-thich/getAll");
};

export const themYthich = async (sanPham) => {
  return await api.post(`/user/yeu-thich/add?SPCTId=${sanPham}`);
};

export const xoaYT = async (id) => {
  return await api.delete(`/user/yeu-thich/delete?SPCTId=${id}`);
};
