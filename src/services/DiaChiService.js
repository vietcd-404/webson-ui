import api from "./api";

export const findAllDiaChi = async () => {
  return await api.get("/user/dia-chi/get-all");
};

export const createDiaChi = async (diaChi) => {
  return await api.post("/user/dia-chi/add", diaChi);
};

export const updateDiaChi = async (diaChi, maDiaChi) => {
  return await api.put(`/user/dia-chi/update/${maDiaChi}`, diaChi);
};

export const deleteDiaChi = async (id) => {
  return await api.delete(`/user/dia-chi/delete/${id}`);
};

export const getByDiaChi = async (ma) => {
  return await api.get(`/user/dia-chi/${ma}`);
};
