import api from "./api";

// export const getAllTaiQuay = async (tenSanPham) => {
//   return await api.get(`/guest/san-pham/get-all?tenSanPham=${tenSanPham}`);
// };

export const getAllTaiQuay = async () => {
  return await api.get(`/guest/san-pham/get-all`);
};
