import axios from "axios";

const configApi = {
  headers: {
    token: "508b262b-8072-11ee-96dc-de6f804954c9",
    "Content-Type": "application/json",
    ShopId: 4691099,
  },
};

export const hienTinh = async () => {
  return await axios.get(
    "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
    configApi
  );
};

// Check if there is at least one province in the response
