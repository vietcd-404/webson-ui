import api from "./api";

export const getAll = async (page, size) => {
  return await api.get(`/user/san-pham/get-all?page=${page}&size=${size}`);
};
