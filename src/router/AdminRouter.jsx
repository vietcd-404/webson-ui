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
import NotFound from "../pages/customer/Account/NotFound";
import BanHangTaiQuay from "../pages/admin/BanHangTaiQuay/BanHangTaiQuay";
import { ProtectedRoute } from "../pages/customer/Account/ProtectedRoute";
import QuanLyHDTaiQuay from "../pages/admin/BanHangTaiQuay/QuanLyHDTaiQuay";
import XuatHoaDon from "../components/admin/XuatHoaDon";
import LayOutHDTaiQuay from "../components/admin/BanHangTaiQuay/LayOutHDTaiQuay";
import HuyHD from "../components/admin/BanHangTaiQuay/HuyHD";
import QuanLyHD from "../components/admin/BanHangTaiQuay/QuanLyHD";
const AdminRouter = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/tong-quan"
          element={
            <ProtectedRoute userRole={["ROLE_ADMIN"]}>
              <LayoutAdmin>
                <ThongKe />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />

        <Route
          path="/san-pham-chi-tiet"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <SanPhamChiTietLayout>
                  <AddSPCT></AddSPCT>
                </SanPhamChiTietLayout>
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/san-pham-chi-tiet/danh-sach"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <SanPhamChiTietLayout>
                  <ListSPCT></ListSPCT>
                </SanPhamChiTietLayout>
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/san-pham"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <SanPham />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/loai"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <Loai />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/mau-sac"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <Mau />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/thuong-hieu"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <ThuongHieu />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hoa-don/cho-xac-nhan"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <LayOutHoaDon>
                  <ChoXacNhan></ChoXacNhan>
                </LayOutHoaDon>
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hoa-don/cho-giao"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <LayOutHoaDon>
                  <ChoGiao></ChoGiao>
                </LayOutHoaDon>
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hoa-don/dang-giao"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <LayOutHoaDon>
                  <DangGiao></DangGiao>
                </LayOutHoaDon>
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hoa-don/hoan-thanh"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <LayOutHoaDon>
                  <HoanThanh></HoanThanh>
                </LayOutHoaDon>
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hoa-don/huy"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <LayOutHoaDon>
                  <Huy></Huy>
                </LayOutHoaDon>
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ban-hang"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <BanHangTaiQuay />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hoa-don-tai-quay"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <LayOutHDTaiQuay>
                  <QuanLyHD />
                </LayOutHDTaiQuay>
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hoa-don-tai-quay/huy"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <LayOutHDTaiQuay>
                  <HuyHD />
                </LayOutHDTaiQuay>
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />

        <Route
          path="/nguoi-dung"
          element={
            <ProtectedRoute userRole={["ROLE_ADMIN"]}>
              <LayoutAdmin>
                <NguoiDung />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/phuong-thuc-thanh-toan"
          element={
            <LayoutAdmin>
              <ThanhToan />
            </LayoutAdmin>
          }
        /> */}
        <Route
          path="/quan-li-kho-anh"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <KhoAnh />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/voucher"
          element={
            <ProtectedRoute userRole={["ROLE_ADMIN"]}>
              <LayoutAdmin>
                <Voucher />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/xuathd"
          element={
            <ProtectedRoute userRole={["ROLE_ADMIN"]}>
              <LayoutAdmin>
                <XuatHoaDon />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default AdminRouter;
