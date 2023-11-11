import api from "./api";
export const findAllNguoiDung = async () => {
  return await api.get("/admin/nguoi-dung");
};

export const createNguoiDung = async (nguoiDung) => {
  return await api.post("/admin/nguoi-dung/add", nguoiDung);
};

export const updateNguoiDung = async (nguoiDung, ma) => {
  return await api.put(`/admin/nguoi-dung/update/${ma}`, nguoiDung);
};

export const deleteNguoiDung = async (ma) => {
  return await api.delete(`/admin/nguoi-dung/delete/${ma}`);
};

export const updateStatus = async (trangThai, ma) => {
  return await api.put(`/admin/nguoi-dung/sua/${ma}`, trangThai);
};
