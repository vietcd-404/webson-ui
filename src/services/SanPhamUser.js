import api from "./api";

export const getAll = async (
  page,
  size,
  giaGiamDan,
  giaTangDan,
  maLoai,
  maMau
) => {
  return await api.get(`/guest/san-pham/get-all?page=${page}&size=${size}
  &giaGiamDan=${giaGiamDan}&giaTangDan=${giaTangDan}
  &maLoai=${maLoai}&maMau=${maMau}`);
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

export const findLoai = async () => {
  return await api.get("/guest/filter");
};

export const findMauSac = async () => {
  return await api.get("/guest/filter/mau-sac");
};
