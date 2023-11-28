import React, { useState } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Badge from "./Badge";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../redux/orebiSlice";
import Swal from "sweetalert2";
import {
  findGioHang,
  themGioHang,
  themGioHangSession,
} from "../../../../services/GioHangService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

import { themYthich } from "../../../../services/SanPhamYeuThichService";

import { useAuth } from "../../../../pages/customer/Account/AuthProvider";

const Product = (item) => {
  console.log("item: ", item);

  const [maSanPhamID, setmaSanPhamID] = useState();
  const [soLuong, setSoLuong] = useState();
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const maSanPhamCT = item.maSanPhamCT;
  const idString = (maSanPhamCT) => {
    return String(maSanPhamCT).toLowerCase().split(" ").join("");
  };

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

  const rootId = idString(maSanPhamCT);

  const navigate = useNavigate();
  const productItem = item;
  const handleProductDetails = () => {
    navigate(`/product/${rootId}`, {
      state: {
        item: productItem,
        maSanPhamCT: maSanPhamCT,
      },
    });
  };

  const handleAddToCart = async () => {
    try {
      await themGioHang(item.maSanPhamCT, 1);

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

  const handleAddToFavorite = async () => {
    try {
      await themYthich(item.maSanPhamCT);
      Swal.fire({
        title: "Thành công!",
        text: "Thêm vào danh sách yêu thích thành công",
      });
    } catch (error) {
      console.log("Lỗi ", error);
      toast.error(
        error.response?.data?.message ||
          "Lỗi thêm sản phẩm vào danh sách yêu thích"
      );
    }
  };

  const handleAddToCartSession = async () => {
    try {
      await themGioHangSession(item.maSanPhamCT, 1);
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
    <div className="w-full relative group">
      <ToastContainer />

      <div className="max-w-80 max-h-80 relative overflow-y-hidden ">
        <div>
          <img
            className="w-full h-[90%] cursor-pointer"
            alt={item.tenSanPham}
            src={`data:image/png;base64,${item.img}`}
            onClick={handleProductDetails}
          />
        </div>
        <div className="absolute top-6 left-8">
          {item.badge && <Badge text="New" />}
        </div>
        <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
          <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
            <li
              onClick={handleProductDetails}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full hover:text-pink-500"
            >
              Xem chi tiết
              <span className="text-lg">
                <MdOutlineLabelImportant />
              </span>
            </li>
            {user ? (
              <li
                onClick={() => handleAddToCart(item.maSanPhamCT, 1)}
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
                      maSanPhamCT: item.maSanPhamCT,
                      tenSanPham: item.tenSanPham,
                      soLuong: 1,
                      anh: item.img,
                      giaBan: item.giaBan * ((100 - item.phanTramGiam) / 100),
                      phanTramGiam: item.phanTramGiam,
                      tenThuongHieu: item.tenThuongHieu,
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

            <li
              onClick={() => handleAddToFavorite(item.maSanPhamCT)}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full hover:text-pink-500"
            >
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
              onClick={handleProductDetails}
            >
              {item.tenSanPham} - {item.tenMau}
            </p>
          </h2>
          <del className="text-[#767676] text-[14px]">{item.giaBan} đ</del>
        </div>
        <div>
          <div className="flex justify-between">
            <p className="text-[#767676] text-[14px]">{item.tenMau}</p>
            <p className="text-[#767676] text-[16px]">
              {item.giaBan * ((100 - item.phanTramGiam) / 100)} đ
            </p>
          </div>
          <p className="text-[#767676] text-[14px]">{item.tenLoai}</p>
        </div>
      </div>
    </div>
  );
};

export default Product;
