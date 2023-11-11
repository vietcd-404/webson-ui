import React, { useEffect, useState, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/customer/pageProps/Breadcrumbs";
import ProductInfo from "../../../components/customer/pageProps/productDetails/ProductInfo";
import ProductsOnSale from "../../../components/customer/pageProps/productDetails/ProductsOnSale";
import {
  listImageSanPhamGuest,
  getDetailById,
} from "../../../services/SanPhamUser";
import Swal from "sweetalert2";
const ProductDetails = (props) => {
  const [prevLocation, setPrevLocation] = useState("");
  const location = useLocation();
  const { state } = location;
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  // const { state } = location;
  const { productInfo, maSanPhamCT } = state;
  const [dataImg, setDataImg] = useState("");

  useEffect(() => {
    setDataImg();
    setPrevLocation(location.pathname);
  }, []);

  const loadAnhSanPham = async (maSanPhamCT) => {
    const response = await listImageSanPhamGuest(maSanPhamCT);
    setDataImg(response);
  };
  return (
    <div className="container mx-auto border-b-[1px] border-b-gray-300">
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          <div className="h-full xl:col-span-2">
            <img
              className="w-full h-[500px] object-cover rounded-lg shadow-md"
              src={`data:image/png;base64,${productInfo.img}`}
              alt={productInfo.img}
            />
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-8 flex flex-col gap-6 justify-center">
            <ProductInfo productInfo={productInfo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
