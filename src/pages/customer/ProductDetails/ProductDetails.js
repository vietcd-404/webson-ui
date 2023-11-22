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
import SanPhamCungThuongHieu from "./SanPhamCungThuongHieu";
import { findAllthuongHieu } from "../../../services/SanPhamChiTietService";
import SampleNextArrow from "../../../components/customer/home/NewArrivals/SampleNextArrow";
import SamplePrevArrow from "../../../components/customer/home/NewArrivals/SamplePrevArrow";
import Heading from "../../../components/customer/home/Products/Heading";
import Slider from "react-slick";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ProductDetails = (props) => {
  const [prevLocation, setPrevLocation] = useState("");
  const location = useLocation();
  const { state } = location;
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  // const { state } = location;
  const { item, maSanPhamCT } = state;

  const [dataImg, setDataImg] = useState([]);

  useEffect(() => {
    loadAnhSanPhamThuongHieu();
    setPrevLocation(location.pathname);
  }, []);

  const loadAnhSanPhamThuongHieu = async () => {
    const response = await findAllthuongHieu(item.tenThuongHieu);
    setDataImg(response.data);
  };

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };
  return (
    <div className="container mx-auto border-b-[1px] border-b-gray-300">
      <ToastContainer />
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10 bg-gray-100 p-4">
          <div className="h-full xl:col-span-2">
            <img
              className="w-full h-[500px] object-cover rounded-lg shadow-md"
              src={`data:image/png;base64,${item.img}`}
              alt={item.tenSanPham}
            />
          </div>
          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-8 flex flex-col gap-6 justify-center">
            <ProductInfo item={item} />
          </div>
        </div>
        <div className="mt-5">
          <div className="w-full pb-16">
            <Heading heading="Sản Phẩm Tương Tự" />
            <Slider {...settings}>
              {dataImg.map((item) => (
                <div>
                  <SanPhamCungThuongHieu item={item} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
