import React from "react";
import Heading from "../Products/Heading";
import { useState } from "react";
import { useEffect } from "react";
import { top4SPBanChay } from "../../../../services/SanPhamUser";
import { useDispatch } from "react-redux";
import {
  findGioHang,
  themGioHang,
  themGioHangSession,
} from "../../../../services/GioHangService";
import { getDetailById } from "../../../../services/SanPhamUser";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../../pages/customer/Account/AuthProvider";
import { MdOutlineLabelImportant } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { addToCart } from "../../../../redux/orebiSlice";
import { BsSuitHeartFill } from "react-icons/bs";

const BestSellers = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadTable();
  }, []);

  const loadTable = async () => {
    try {
      const response = await top4SPBanChay();
      // Dựa vào dữ liệu trả về từ API để cập nhật đúng các trường thông tin cần thiết
      setProducts(response.data.map((item) => ({ ...item, badge: true })));
      console.log("Dữ liệu từ API top 4 bán chạy:", response.data);
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
  const handleAddToCart = async () => {
    try {
      await themGioHang(products.maSanPhamCT, 1);
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
    <div className="w-full pb-20">
      <Heading heading="Sản Phẩm Bán Chạy" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lgl:grid-cols-3 xl:grid-cols-4 gap-10">
        {products.map((product) => (
          <div className="px-2" key={product.maSanPhamCT}>
            <div className="w-full relative group">
              <ToastContainer />
              <div className="max-w-80 max-h-80 relative overflow-y-hidden ">
                <div>
                  <img
                    className="w-full h-[90%] cursor-pointer"
                    alt={product.tenSanPham}
                    src={`data:image/png;base64,${product.img}`}
                    onClick={() => handleProductDetails(product.maSanPhamCT)}
                  />
                </div>
                <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
                  <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
                    <li
                      onClick={() => handleProductDetails(product.maSanPhamCT)}
                      className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full hover:text-pink-500"
                    >
                      Xem chi tiết
                      <span className="text-lg">
                        <MdOutlineLabelImportant />
                      </span>
                    </li>
                    {user ? (
                      <li
                        onClick={() => handleAddToCart(product.maSanPhamCT)}
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
                              anh: product.danhSachAnh,
                              giaBan: product.giaBan,
                              tenThuongHieu: product.tenThuongHieu,
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
                  <p className="text-[#767676] text-[14px]">
                    {product.giaBan} đ
                  </p>
                </div>
                <div>
                  <p className="text-[#767676] text-[14px]">{product.tenMau}</p>
                  <p className="text-[#767676] text-[14px]">
                    {product.tenLoai}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
