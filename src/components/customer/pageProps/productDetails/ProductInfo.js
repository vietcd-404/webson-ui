import React, { useState, useEffect, useParams } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../redux/orebiSlice";
import { Tag, message } from "antd";
import Swal from "sweetalert2";
import { themGioHang } from "../../../../services/GioHangService";
import { toast } from "react-toastify";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  const handleConfirm = () => {
    Swal.fire({
      title: "Thành công!",
      text: "Thêm vào giỏ hàng thành công",
      icon: "success",
    });
  };

  const handleAddToCart = async () => {
    try {
      await themGioHang(productInfo.maSanPhamCT, 1);

      Swal.fire({
        title: "Thành công!",
        text: "Thêm vào giỏ hàng thành công",
        icon: "success",
      });
    } catch (error) {
      console.log("Lỗi ", error);
      message.error(error.response?.data?.message || "Error adding to cart");
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <p className="font-medium text-lg text-[#C73030]">
        {/* <span className="font-normal">Thương hiệu:</span>{" "} */}
        {productInfo.tenThuongHieu}
      </p>
      <h2 className="text-4xl font-semibold text-gray-800">
        {productInfo.tenSanPham}
      </h2>
      <p className="text-xl font-semibold text-[#C73030]">
        {/* Giá Bán: $ */}
        {productInfo.giaBan}đ
      </p>

      <div className="flex flex-col space-y-2">
        <p className="font-medium text-lg text-gray-700">
          {/* <span className="font-normal">Màu son:</span>  */}
          {productInfo.tenMau}
        </p>
        <p className="font-medium text-lg text-gray-700">
          {/* <span className="font-normal">Loại son:</span>  */}
          {productInfo.tenLoai}
        </p>
      </div>

      <div className="flex flex-col space-y-2">
        <p className="font-medium text-sm text-gray-700">
          {/* <span className="font-normal mr-2">Dạng son:</span> */}
          {productInfo.doLi === 0 ? (
            <span className="text-red-500">Không Lì</span>
          ) : (
            <span className="text-green-500">Son Lì</span>
          )}
          ,
          {productInfo.doBong === 0 ? (
            <span className="text-red-500">Không Bóng</span>
          ) : (
            <span className="text-green-500"> Son Bóng</span>
          )}
        </p>
        <p className="font-medium text-sm text-gray-600">
          <span className="font-normal">Số lượng:</span>{" "}
          {productInfo.soLuongTon}
        </p>
      </div>
      <button
        onClick={() => handleAddToCart(productInfo.maSanPhamCT, 1)}
        // onChange={han}
        className="w-full py-4 bg-black text-[#ffff]  hover:opacity-80 duration-300 text-lg font-titleFont "
      >
        Thêm vào giỏ hàng
      </button>
    </div>
  );
};

export default ProductInfo;
