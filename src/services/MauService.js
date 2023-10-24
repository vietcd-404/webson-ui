import api from "./api";

export const findAllMau = async () => {
  return await api.get("/admin/mau-sac");
};

export const createMau = async (mau) => {
  return await api.post("/admin/mau-sac/add", mau);
};

export const updateMau = async (mau, maMau) => {
  return await api.put(`/admin/mau-sac/update/${maMau}`, mau);
};

export const deleteMau = async (id) => {
  return await api.delete(`/admin/mau-sac/delete/${id}`);
};

export const findMauById = async (id) => {
  return await api.get(`/admin/mau-sac/${id}`);
};
