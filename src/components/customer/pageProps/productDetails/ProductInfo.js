import React, { useState, useEffect, useParams } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../redux/orebiSlice";
import { Tag } from "antd";

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.tenSanPham}</h2>
      <p className="text-xl font-semibold">Giá Bán:${productInfo.giaBan}</p>
      <p className="font-medium text-lg">
        <span className="font-normal">Thương hiệu:</span>{" "}
        {productInfo.tenThuongHieu}
      </p>
      <p className="font-medium text-lg">
        <span className="font-normal">Màu son:</span> {productInfo.tenMau}
      </p>
      <p className="font-medium text-lg">
        <span className="font-normal">Loại son:</span> {productInfo.tenLoai}
      </p>
      <p className="font-medium text-lg">
        <span className="font-normal mr-2">Dạng son:</span>
        {productInfo.doLi === 0 ? (
          <Tag color="red">Không Lì</Tag>
        ) : (
          <Tag color="green">Son Lì</Tag>
        )}
        ,
        {productInfo.doBong === 0 ? (
          <Tag color="red">Không Bóng</Tag>
        ) : (
          <Tag color="green">Son Bóng</Tag>
        )}
      </p>
      <p className="font-medium text-lg">
        <span className="font-normal">Số lượng:</span> {productInfo.soLuongTon}
      </p>
      <button
        onClick={() =>
          dispatch(
            addToCart({
              _id: productInfo.id,
              name: productInfo.productName,
              quantity: 1,
              image: productInfo.img,
              badge: productInfo.badge,
              price: productInfo.price,
              colors: productInfo.color,
            })
          )
        }
        className="w-full py-4 bg-[#ff0000] text-[#ffff] hover:bg-[#ffff] hover:text-[#003300] duration-300 text-lg font-titleFont"
      >
        Thêm vào giỏ hàng
      </button>
    </div>
  );
};

export default ProductInfo;
