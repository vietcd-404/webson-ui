import { useCallback, useEffect } from "react";
import { useState } from "react";
import { getAll } from "../services/SanPhamUser";
import { da } from "date-fns/locale";

const PRODUCTS_COUNT = 4;

const getRandomIndex = (max, min = 0) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getRandomProducts = (randomIndex, data) => {
  let i = randomIndex;
  const products = [];

  for (let index = 0; index < PRODUCTS_COUNT; index++) {
    products.push(data[i]);
    i++;
  }

  return products;
};

const useGetRecommendedProducts = (product) => {
  const [products, setProducts] = useState([]);

  const getRecommendedProducts = useCallback(async () => {
    setProducts([]);
    const key = product.maSanPhamCT ? "maSanPhamCT" : "tenThuongHieu";
    const value = product.maSanPhamCT
      ? product.maSanPhamCT
      : product.tenThuongHieu;

    try {
      const response = await getAll({
        params: {
          page: 1, // Set the desired page number
          size: PRODUCTS_COUNT, // Set the desired number of products per page
          [key]: value,
        },
      });

      const { data } = response;

      if (data.length > PRODUCTS_COUNT) {
        const index = getRandomIndex(data.length - PRODUCTS_COUNT);
        const randomProducts = getRandomProducts(index, data);

        setProducts(randomProducts);
        return;
      }

      setProducts(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching recommended products:", error);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    getRecommendedProducts();
  }, [product, getRecommendedProducts]);

  return products;
};

export default useGetRecommendedProducts;
