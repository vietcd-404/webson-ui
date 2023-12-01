import React, { useState, useEffect, useParams } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../redux/orebiSlice";
import { Tag, message } from "antd";
import Swal from "sweetalert2";
import { themGioHang } from "../../../../services/GioHangService";
import { toast } from "react-toastify";
import { useAuth } from "../../../../pages/customer/Account/AuthProvider";

const ProductInfo = ({ item }) => {
  const dispatch = useDispatch();
  const handleConfirm = () => {
    Swal.fire({
      title: "Thành công!",
      text: "Thêm vào giỏ hàng thành công",
      icon: "success",
    });
  };
  const [quantity, setQuantity] = useState(1);
  const decreaseQuantity = () => {
    const newQuantity = Math.max(quantity - 1, 1);
    setQuantity(newQuantity);
  };

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    try {
      await themGioHang(item.maSanPhamCT, quantity);

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
    <div className="flex flex-col space-y-4">
      <p className="font-medium text-lg text-[#C73030]">
        {/* <span className="font-normal">Thương hiệu:</span>{" "} */}
        {item.tenThuongHieu}
      </p>
      <h2 className="text-4xl font-semibold text-gray-800">
        {item.tenSanPham} - {item.tenMau}
      </h2>
      <p className="text-xl font-semibold text-[#C73030]">
        {/* Giá Bán: $ */}
        {item.giaBan * ((100 - item.phanTramGiam) / 100)}đ
      </p>
      <div className="flex flex-col space-y-2">
        <p className="font-medium text-lg text-gray-700">
          {/* <span className="font-normal">Màu son:</span>  */}
          {item.tenMau}
        </p>
        <p className="font-medium text-lg text-gray-700">
          {/* <span className="font-normal">Loại son:</span>  */}
          {item.tenLoai}
        </p>
      </div>
      <div className="flex flex-col space-y-2">
        <p className="font-medium text-sm text-gray-700">
          {/* <span className="font-normal mr-2">Dạng son:</span> */}
          {item.doLi === 0 ? (
            <span className="text-red-500">Không Lì</span>
          ) : (
            <span className="text-green-500">Son Lì</span>
          )}
          ,
          {item.doBong === 0 ? (
            <span className="text-red-500">Không Bóng</span>
          ) : (
            <span className="text-green-500"> Son Bóng</span>
          )}
        </p>
        <p className="font-medium text-sm text-gray-600">
          <span className="font-normal">Số lượng:</span> {item.soLuongTon}
        </p>
        <div className="w-1/3 flex items-center gap-2 text-lg ">
          <button
            onClick={decreaseQuantity}
            className="w-8 h-[45px] bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border border-gray-300 hover:border-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 12H4"
              />
            </svg>
          </button>
          <input
            // type="number"
            value={quantity}
            // min="1"
            disabled
            onChange={(e) =>
              setQuantity(Math.max(parseInt(e.target.value) || 1, 1))
            }
            className="border border-gray-300 py-2 px-4 w-16 text-center"
          />{" "}
          <button
            onClick={increaseQuantity}
            className="w-8 h-[45px] bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border border-gray-300 hover:border-gray-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>
      {user ? (
        <button
          onClick={() => handleAddToCart(item.maSanPhamCT, quantity)}
          // onChange={han}
          className="w-full py-4 bg-black text-[#ffff]  hover:opacity-80 duration-300 text-lg font-titleFont "
        >
          Thêm vào giỏ hàng
        </button>
      ) : (
        <button
          onClick={() => {
            if (quantity > 0 && quantity < item.soLuongTon) {
              dispatch(
                addToCart({
                  maSanPhamCT: item.maSanPhamCT,
                  tenSanPham: item.tenSanPham,
                  soLuong: quantity,
                  anh: item.img,
                  soLuongTon: item.soLuongTon,
                  giaBan: item.giaBan * ((100 - item.phanTramGiam) / 100),
                  tenThuongHieu: item.tenThuongHieu,
                })
              );
            } else {
              toast.error("Số lượng không hợp lệ");
            }
          }}
          // onChange={han}
          className="w-full py-4 bg-black text-[#ffff]  hover:opacity-80 duration-300 text-lg font-titleFont "
        >
          Thêm vào giỏ hàng
        </button>
      )}
    </div>
  );
};

export default ProductInfo;
