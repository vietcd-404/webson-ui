import React from "react";
import Product from "../../../components/customer/home/Products/Product";

const SanPhamCungThuongHieu = ({ item }) => {
  return (
    <div className="px-2">
      <Product
        maSanPhamCT={item.maSanPhamCT}
        img={item.img[0]}
        tenSanPham={item.tenSanPham}
        giaBan={item.giaBan}
        tenMau={item.tenMau}
        tenThuongHieu={item.tenThuongHieu}
        tenLoai={item.tenLoai}
      />
    </div>
  );
};

export default SanPhamCungThuongHieu;
