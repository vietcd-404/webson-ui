import axios from "axios";

const configApi = {
  headers: {
    token: "508b262b-8072-11ee-96dc-de6f804954c9",
    "Content-Type": "application/json",
    ShopId: 4691092,
  },
};

export const hienTinh = async () => {
  return await axios.post(
    "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
    {},
    configApi
  );
};

export const hienXa = async (district_id) => {
  return await axios.get(
    `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${district_id}`,
    configApi
  );
};

export const hienHuyen = async (provinceId) => {
  return await axios.get(
    `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
    configApi
  );
};

// Check if there is at least one province in the response
