import api from "./api";

export const getOrders = () => {
  return fetch("https://dummyjson.com/carts/1").then((res) => res.json());
};

export const getRevenue = () => {
  return fetch("https://dummyjson.com/carts").then((res) => res.json());
};

export const getInventory = () => {
  return fetch("https://dummyjson.com/products").then((res) => res.json());
};

export const getCustomers = () => {
  return fetch("https://dummyjson.com/users").then((res) => res.json());
};
export const getComments = () => {
  return fetch("https://dummyjson.com/comments").then((res) => res.json());
};

export const getTop4Product = async () => {
  return await api.get(`/admin/top-4-product`);
};

export const sumTotalBill = async () => {
  return await api.get(`/admin/total-all-bill`);
};

export const getTop4Customer = async () => {
  return await api.get(`/admin/top-4-customer`);
};

export const getDoanhThuTheoNam = async (startYear, endYear) => {
  return await api.get(
    `/admin/doanh-thu-theo-nam?startYear=${startYear}&endYear=${endYear}`
  );
};
