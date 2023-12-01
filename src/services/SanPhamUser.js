import api from "./api";

export const getAll = async (
  page,
  size,
  giaGiamDan,
  giaTangDan,
  maLoai,
  maMau,
  maThuongHieu,
  giaCao,
  giaThap
) => {
  return await api.get(`/guest/san-pham/get-all?page=${page}&size=${size}
  &giaGiamDan=${giaGiamDan}&giaTangDan=${giaTangDan}
  &maLoai=${maLoai}&maMau=${maMau}&maThuongHieu=${maThuongHieu}
  &giaThap=${giaThap}&giaCao=${giaCao}`);
};

export const getDetailById = async (productId) => {
  return await api.get(`/guest/san-pham/detail?maSanPhamCT=${productId}`);
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
export const findLoai = async () => {
  return await api.get("/guest/filter");
};

export const findMauSac = async () => {
  return await api.get("/guest/filter/mau-sac");
};

export const findThuongHieu = async () => {
  return await api.get("/guest/filter/thuong-hieu");
};
