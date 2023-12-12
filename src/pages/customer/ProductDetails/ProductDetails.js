import React, { useEffect, useState, useLayoutEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
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
import { useSelector } from "react-redux";
import { Image } from "antd";

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",
        borderRadius: "11px",
      }}
      onClick={onClick}
    />
  );
};

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",
        borderRadius: "11px",
      }}
      onClick={onClick}
    />
  );
};
const ProductDetails = (props) => {
  const [prevLocation, setPrevLocation] = useState("");
  const location = useLocation();
  const { state } = location;
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  // const { state } = location;
  // const { item, maSanPhamCT } = state;
  const [data, setData] = useState([]);
  const { maSanPhamCT } = useParams();

  const [dataImg, setDataImg] = useState([]);
  const [anh, danhSachAnh] = useState([]);
  const products = useSelector((state) => state.orebiReducer.products);
  const loadSanPhamDetail = async () => {
    try {
      const response = await getDetailById(maSanPhamCT);
      setData(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  useEffect(() => {
    loadSanPhamDetail();
    loadSanPham();
    loadAnh();
    setPrevLocation(location.pathname);
  }, [maSanPhamCT]);

  const loadAnhSanPhamThuongHieu = async () => {
    const selectedDistrictData = data.map((district) => district.tenThuongHieu);
    const response = await findAllthuongHieu(selectedDistrictData);
    setDataImg(response.data);
    console.log("Thương hiệu", response);
  };

  const loadAnh = async () => {
    try {
      const response = await getDetailById(maSanPhamCT);
      danhSachAnh(response.data[0].danhSachAnh);
      console.log("APINNNNNNsdfsdfd: ", response.data[0].danhSachAnh);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  const loadSanPham = async () => {
    try {
      const response = await getDetailById(maSanPhamCT);
      setDataImg(response.data[0].thuongHieuList);
      console.log("APINNNNNNsdfsdfd: ", response.data[0].thuongHieuList);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(4, dataImg.length),
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
  const settingsThumbnail = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,

    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };
  return (
    <div className="container mx-auto border-b-[1px] border-b-gray-300">
      <ToastContainer />
      <div className="max-w-container mx-auto px-4">
        <div className="xl:-mt-10 -mt-7">
          <Breadcrumbs title="" prevLocation={prevLocation} />
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 h-full -mt-5 xl:-mt-8 pb-10  p-4">
          <div className="h-full xl:col-span-2">
            {data.map((sp) => (
              <img
                key={sp.maSanPhamCT}
                className="w-full h-[500px] object-cover rounded-lg shadow-md"
                src={`data:image/png;base64,${sp.img[0]}`}
                alt={sp.tenSanPham}
              />
            ))}
            <div className="mt-4 flex flex-row">
              {/* <Slider {...settingsThumbnail}> */}
              {anh.map((item) => (
                <div key={item.maSanPhamCT} className="mr-2">
                  <Image
                    // className="w-full h-[100px] object-cover rounded-lg shadow-md cursor-pointer"
                    width="100%"
                    height="100px"
                    src={`data:image/png;base64,${item.anh}`}
                    alt=""
                  />
                </div>
              ))}
              {/* </Slider> */}
            </div>
          </div>

          <div className="h-full w-full md:col-span-2 xl:col-span-3 xl:p-8 flex flex-col gap-6 justify-center">
            {data.map((sp) => (
              <ProductInfo item={sp} />
            ))}
          </div>
        </div>
        <div className="mt-5">
          <div className="w-full pb-16">
            <Heading heading="Sản Phẩm Tương Tự" />
            <Slider {...settings}>
              {dataImg.map((item) => (
                <div key={item.maSanPhamCT}>
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
