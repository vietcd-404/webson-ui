import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  chiTietHoaDon,
  hoaDonChiTiet,
} from "../../../../services/HoaDonService";
import { useState } from "react";
import { useEffect } from "react";
import ItemCard from "../../Cart/ItemCard";
import { updateSoLuong } from "../../../../services/GioHangService";
import FormHoaDon from "./FormHoaDon";

function ThongTinDonHang() {
  const { maHoaDon } = useParams();

  console.log(maHoaDon);
  const [donHang, setDonHang] = useState([]);

  const [data, setData] = useState([]);

  const loadSanPham = async () => {
    try {
      const response = await hoaDonChiTiet(maHoaDon);
      setData(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const loadHoaDonChitiet = async () => {
    try {
      const response = await chiTietHoaDon(maHoaDon);
      setDonHang(response.data);

      console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  useEffect(() => {
    loadSanPham();
    loadHoaDonChitiet();
  }, [maHoaDon]);

  const handleQuantityChange = async (event, sanPham) => {
    const newQuantity = event.target.value;
    setData((prevData) =>
      prevData.map((item) =>
        item.maSanPhamCT === sanPham ? { ...item, soLuong: newQuantity } : item
      )
    );
    try {
      await updateSoLuong(sanPham, newQuantity);
      loadHoaDonChitiet();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  //   const handleXoa = async (ma) => {
  //     try {
  //       const response = await xoaGioHang(ma);
  //       if (response.status === 200) {
  //         toast.success("Xóa thành công!");
  //         loadGioHang();
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi xóa loại: ", error);
  //       toast.error("Xóa thất bại.");
  //     }
  //   };
  return (
    <div>
      <h5>Thông tin đơn hàng</h5>
      <div>
        <div>
          {donHang.map((hoaDon) => (
            <FormHoaDon hoaDon={hoaDon} />
          ))}
        </div>

        <div className="table-container overflow-x-auto">
          <p className="font-bold">Danh sách sản phẩm</p>
          <table className="page-table table table-hover mb-4">
            <thead>
              <tr className="font-bold">
                <th></th>
                <th>Sản phẩm</th>
                <th>Giá sản phẩm</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <ItemCard
                  item={item}
                  // xoa={() => handleXoa(item.maGioHang)}
                  // updateSoLuong={(e) =>
                  //   handleQuantityChange(e, item.maSanPhamCT)
                  // }
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ThongTinDonHang;
