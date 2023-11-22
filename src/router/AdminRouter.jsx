import React from "react";
import { Route, Routes } from "react-router-dom";
import LayoutAdmin from "../layout/AdminLayout";
import ThongKe from "../pages/admin/ThongKe/ThongKe";
import SanPham from "../pages/admin/ThuocTinh/SanPham";
import SanPhamChiTiet from "../pages/admin/SanPhamChiTiet/SanPhamChiTiet";
import Loai from "../pages/admin/ThuocTinh/Loai";
import Mau from "../pages/admin/ThuocTinh/Mau";
import ThuongHieu from "../pages/admin/ThuocTinh/ThuongHieu";
import NguoiDung from "../pages/admin/NguoiDung/NguoiDung";
import ThanhToan from "../pages/admin/PhuongThucThanhToan/ThanhToan";
import AddSPCT from "../components/admin/AddSPCT";
import ListSPCT from "../components/admin/ListSPCT";
import SanPhamChiTietLayout from "../components/admin/LayoutSanPhamChiTiet";
import KhoAnh from "../pages/admin/KhoAnh/KhoAnh";
import Voucher from "../pages/admin/Voucher/Voucher";
import LayOutHoaDon from "../components/admin/HoaDon/LayOutHoaDon";
import ChoXacNhan from "../components/admin/HoaDon/ChoXacNhan";
import ChoGiao from "../components/admin/HoaDon/ChoGiao";
import DangGiao from "../components/admin/HoaDon/DangGiao";
import HoanThanh from "../components/admin/HoaDon/HoanThanh";
import Huy from "../components/admin/HoaDon/Huy";
const AdminRouter = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/tong-quan"
          element={
            <LayoutAdmin>
              <ThongKe />
            </LayoutAdmin>
          }
        />
        <Route
          path="/san-pham-chi-tiet"
          element={
            <LayoutAdmin>
              <SanPhamChiTietLayout>
                <AddSPCT></AddSPCT>
              </SanPhamChiTietLayout>
            </LayoutAdmin>
          }
        />
        <Route
          path="/san-pham-chi-tiet/danh-sach"
          element={
            <LayoutAdmin>
              <SanPhamChiTietLayout>
                <ListSPCT></ListSPCT>
              </SanPhamChiTietLayout>
            </LayoutAdmin>
          }
        />
        <Route
          path="/san-pham"
          element={
            <LayoutAdmin>
              <SanPham />
            </LayoutAdmin>
          }
        />
        <Route
          path="/loai"
          element={
            <LayoutAdmin>
              <Loai />
            </LayoutAdmin>
          }
        />
        <Route
          path="/mau-sac"
          element={
            <LayoutAdmin>
              <Mau />
            </LayoutAdmin>
          }
        />
        <Route
          path="/thuong-hieu"
          element={
            <LayoutAdmin>
              <ThuongHieu />
            </LayoutAdmin>
          }
        />
        {/* <Route
          path="/hoa-don"
          element={
            <LayoutAdmin>
              <LayoutHoaDonChiTiet />
            </LayoutAdmin>
          }
        /> */}
        <Route
          path="/hoa-don/cho-xac-nhan"
          element={
            <LayoutAdmin>
              <LayOutHoaDon>
                <ChoXacNhan></ChoXacNhan>
              </LayOutHoaDon>
            </LayoutAdmin>
          }
        />
        <Route
          path="/hoa-don/cho-giao"
          element={
            <LayoutAdmin>
              <LayOutHoaDon>
                <ChoGiao></ChoGiao>
              </LayOutHoaDon>
            </LayoutAdmin>
          }
        />
        <Route
          path="/hoa-don/dang-giao"
          element={
            <LayoutAdmin>
              <LayOutHoaDon>
                <DangGiao></DangGiao>
              </LayOutHoaDon>
            </LayoutAdmin>
          }
        />
        <Route
          path="/hoa-don/hoan-thanh"
          element={
            <LayoutAdmin>
              <LayOutHoaDon>
                <HoanThanh></HoanThanh>
              </LayOutHoaDon>
            </LayoutAdmin>
          }
        />
        <Route
          path="/hoa-don/huy"
          element={
            <LayoutAdmin>
              <LayOutHoaDon>
                <Huy></Huy>
              </LayOutHoaDon>
            </LayoutAdmin>
          }
        />
        <Route
          path="/nguoi-dung"
          element={
            <LayoutAdmin>
              <NguoiDung />
            </LayoutAdmin>
          }
        />
        <Route
          path="/phuong-thuc-thanh-toan"
          element={
            <LayoutAdmin>
              <ThanhToan />
            </LayoutAdmin>
          }
        />
        <Route
          path="/quan-li-kho-anh"
          element={
            <LayoutAdmin>
              <KhoAnh />
            </LayoutAdmin>
          }
        />
        <Route
          path="/voucher"
          element={
            <LayoutAdmin>
              <Voucher />
            </LayoutAdmin>
          }
        />
      </Routes>
    </div>
  );
};

export default AdminRouter;
