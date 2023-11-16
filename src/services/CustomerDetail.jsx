import api from "./api";

export const updateUser = async (nguoiDung, ma) => {
  return await api.put(`/guest/cap-nhap/${ma}`, nguoiDung);
};

export const deleteCustomer = async (nguoiDung, ma) => {
  return await api.put(`/guest/sua/${ma}`, nguoiDung);
};

export const updatePassUser = async (nguoiDung, ma) => {
  return await api.put(`/guest/cap-nhap-pass/${ma}`, nguoiDung);
};
