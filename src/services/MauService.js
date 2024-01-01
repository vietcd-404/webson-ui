import api from "./api";

export const findAllMau = async () => {
  return await api.get("/staff/mau-sac");
};

export const createMau = async (mau) => {
  return await api.post("/staff/mau-sac/add", mau);
};

export const updateMau = async (mau, maMau) => {
  return await api.put(`/staff/mau-sac/update/${maMau}`, mau);
};

export const deleteMau = async (id) => {
  return await api.delete(`/staff/mau-sac/delete/${id}`);
};

export const findMauById = async (id) => {
  return await api.get(`/staff/mau-sac/${id}`);
};

export const updateStatusMau = async (mau, maMau) => {
  return await api.put(`/staff/mau-sac/sua/${maMau}`, mau);
};

export const loadAllMau = async () => {
  return await api.get("/staff/mau-sac/load-mau");
};
