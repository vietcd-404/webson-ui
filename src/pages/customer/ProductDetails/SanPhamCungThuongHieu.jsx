import React from "react";
import Product from "../../../components/customer/home/Products/Product";
import { Link } from "react-router-dom";

const SanPhamCungThuongHieu = ({ item }) => {
  return (
    <div className="px-2">
      <Product
        maSanPhamCT={item.maSanPhamCT}
        img={item.img[0]}
        tenSanPham={item.tenSanPham}
        giaBan={item.giaBan}
        phanTramGiam={item.phanTramGiam}
        tenMau={item.tenMau}
        tenThuongHieu={item.tenThuongHieu}
        tenLoai={item.tenLoai}
      />
    </div>
  );
};

export default SanPhamCungThuongHieu;
