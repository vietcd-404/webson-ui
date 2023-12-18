import React from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";
import { useState } from "react";
import { top5SPNoiNhat } from "../../../../services/SanPhamUser";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  findGioHang,
  themGioHang,
  themGioHangSession,
} from "../../../../services/GioHangService";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../../pages/customer/Account/AuthProvider";
import Badge from "../Products/Badge";
import { MdOutlineLabelImportant } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { BsSuitHeartFill } from "react-icons/bs";
import { addToCart } from "../../../../redux/orebiSlice";
import { getDetailById } from "../../../../services/SanPhamUser";
import { Link } from "react-router-dom";

const NewArrivals = () => {
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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadTable();
  }, []);

  const loadTable = async () => {
    try {
      const response = await top5SPNoiNhat();
      setProducts(response.data.map((item) => ({ ...item, badge: true })));
      console.log("Dữ liệu từ API:", response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const [data, setData] = useState([]);
  const [SPCT, setSPCT] = useState([]);

  const dispatch = useDispatch();
  const loadGioHang = async () => {
    try {
      const response = await findGioHang();
      setData(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  useEffect(() => {
    loadGioHang();
  }, []);

  const findDetailById = async (maSP) => {
    try {
      const response = await getDetailById(maSP);
      setSPCT(response.data);
      console.log(1, response.data);
      return response.data; // Return the data you want to include in the state
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
      throw error; // Rethrow the error to be handled later if necessary
    }
  };

  const navigate = useNavigate();

  const handleProductDetails = async (maSP) => {
    try {
      const item = await findDetailById(maSP);
      console.log(2, item.maSanPhamCT);
      navigate(`/product/${maSP}`, {
        state: {
          item: item,
          maSanPhamCT: item.maSanPhamCT,
        },
      });
    } catch (error) {
      console.error("Lỗi khi gọi API hoặc xử lý dữ liệu: ", error);
    }
  };
  const handleAddToCart = async (maSanPhamCT) => {
    try {
      await themGioHang(maSanPhamCT, 1);
      Swal.fire({
        title: "Thành công!",
        text: "Thêm vào giỏ hàng thành công",
        icon: "success",
      });
    } catch (error) {
      console.log("Lỗi ", error);
      toast.error(error.response?.data?.message || "Error adding to cart");
    }
  };

  const handleAddToCartSession = async () => {
    try {
      await themGioHangSession(products.maSanPhamCT, 1);
      Swal.fire({
        title: "Thành công!",
        text: "Thêm vào giỏ hàng thành công",
        icon: "success",
      });
    } catch (error) {
      console.log("Lỗi ", error);
      toast.error(error.response?.data?.message || "Error adding to cart");
    }
  };
  const { user } = useAuth();
  return (
    <div className="w-full pb-16">
      <Heading heading="Sản Phẩm Mới" />
      <Slider {...settings}>
        {products.map((product) => (
          <div className="px-2" key={product.maSanPhamCT}>
            <div className="w-full relative group">
              <ToastContainer />
              <div className="max-w-80 max-h-80 relative overflow-y-hidden ">
                <div>
                  <Link to={`/product/${product.maSanPhamCT}`}>
                    <img
                      className="w-full h-[250px] cursor-pointer"
                      alt={product.tenSanPham}
                      src={`data:image/png;base64,${product.danhSachAnh[0]}`}
                    />
                  </Link>
                </div>
                <div className="absolute top-0 left-0">
                  {product.badge && <Badge text="New" />}
                </div>
                <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
                  <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
                    <Link to={`/product/${product.maSanPhamCT}`}>
                      <li className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full hover:text-pink-500">
                        Xem chi tiết
                        <span className="text-lg">
                          <MdOutlineLabelImportant />
                        </span>
                      </li>
                    </Link>
                    {user ? (
                      <li
                        onClick={() => handleAddToCart(product.maSanPhamCT, 1)}
                        className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full hover:text-pink-500"
                      >
                        Thêm vào giỏ hàng
                        <span>
                          <FaShoppingCart />
                        </span>
                      </li>
                    ) : (
                      <li
                        onClick={() =>
                          dispatch(
                            addToCart({
                              maSanPhamCT: product.maSanPhamCT,
                              tenSanPham: product.tenSanPham,
                              soLuong: 1,
                              anh: product.img,
                              giaBan:
                                product.giaBan *
                                ((100 - product.phanTramGiam) / 100),
                              phanTramGiam: product.phanTramGiam,
                              tenThuongHieu: product.tenThuongHieu,
                              soLuongTon: product.soLuongTon,
                            })
                          )
                        }
                        className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full hover:text-pink-500"
                      >
                        Thêm vào giỏ hàng
                        <span>
                          <FaShoppingCart />
                        </span>
                      </li>
                    )}

                    <li className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full hover:text-pink-500">
                      Thêm vào sản phẩm yêu thích
                      <span>
                        <BsSuitHeartFill />
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="max-w-80 py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4">
                <div className="flex items-center justify-between font-titleFont">
                  <h2 className="text-lg text-primeColor font-bold cursor-pointer">
                    <p
                      className="hover:text-pink-500 translate-x-0 overflow-hidden whitespace-nowrap"
                      style={{ textOverflow: "ellipsis", maxWidth: "200px" }}
                      onClick={() => handleProductDetails(product.maSanPhamCT)}
                    >
                      {product.tenSanPham}
                    </p>
                  </h2>
                  {/* <p className="text-[#767676] text-[14px]">
                    {product.giaBan} đ
                  </p> */}
                  {product.phanTramGiam === 0 ? (
                    <></>
                  ) : (
                    <>
                      <del className="text-[#767676] text-[14px]">
                        {product.giaBan} đ
                      </del>
                    </>
                  )}
                </div>
                <div>
                  <div className="flex justify-between">
                    {/* <p className="text-[#767676] text-[14px]">{item.tenMau}</p> */}
                    <p className="text-red-600 text-[20px] ">
                      {product.giaBan * ((100 - product.phanTramGiam) / 100)} đ
                    </p>
                  </div>
                  <p className="text-[#767676] text-[14px]">
                    {product.tenLoai}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
    // <div className="w-full pb-16">
    //   <Heading heading="Sản Phẩm Mới" />
    //   <Slider {...settings}>
    //     {products.map((product) => (

    //       <div className="px-2" key={product.maSanPhamCT}>
    //         <div className="product-item">
    //           <img
    //             src={`data:image/png;base64,${product.danhSachAnh}`}
    //             alt={product.tenSanPham}
    //           />
    //           <h3>{product.tenSanPham}</h3>
    //           <p>Price: {product.giaBan}</p>
    //           <p>Color: {product.tenMau}</p>
    //           {product.badge && <span className="badge">New</span>}
    //           {/* Thêm các trường thông tin khác cần hiển thị */}
    //         </div>
    //       </div>
    //     ))}
    //   </Slider>
    // </div>
  );
};

export default NewArrivals;
