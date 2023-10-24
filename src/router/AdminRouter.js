import React from "react";
import { Route, Routes } from "react-router-dom";
import LayoutAdmin from "../components/admin/LayoutAdmin";
import ThongKe from "../pages/admin/ThongKe/ThongKe";
import SanPham from "../pages/admin/ThuocTinh/SanPham";
import SanPhamChiTiet from "../pages/admin/SanPhamChiTiet/SanPhamChiTiet";
import Loai from "../pages/admin/ThuocTinh/Loai";
import Mau from "../pages/admin/ThuocTinh/Mau";
import ThuongHieu from "../pages/admin/ThuocTinh/ThuongHieu";
import NguoiDung from "../pages/admin/NguoiDung/NguoiDung";
import ThanhToan from "../pages/admin/PhuongThucThanhToan/ThanhToan";
import TableSPCT from "../components/admin/TableSPCT";
import ListSPCT from "../components/admin/ListSPCT";
import SanPhamChiTietLayout from "../components/admin/LayoutSanPhamChiTiet";
import KhoAnh from "../pages/admin/KhoAnh/KhoAnh";

const AdminRouter = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/admin/thong-ke"
          element={
            <LayoutAdmin>
              <ThongKe />
            </LayoutAdmin>
          }
        />
        <Route
          path="/admin/san-pham-chi-tiet"
          element={
            <LayoutAdmin>
              <SanPhamChiTiet />
            </LayoutAdmin>
          }
        />
        <Route
          path="/admin/san-pham-chi-tiet/quan-ly-san-pham"
          element={
            <LayoutAdmin>
              <SanPhamChiTietLayout>
                <TableSPCT></TableSPCT>
              </SanPhamChiTietLayout>
            </LayoutAdmin>
          }
        />
        <Route
          path="/admin/san-pham-chi-tiet/danh-sach"
          element={
            <LayoutAdmin>
              <SanPhamChiTietLayout>
                <ListSPCT></ListSPCT>
              </SanPhamChiTietLayout>
            </LayoutAdmin>
          }
        />
        <Route
          path="/admin/san-pham"
          element={
            <LayoutAdmin>
              <SanPham />
            </LayoutAdmin>
          }
        />
        <Route
          path="/admin/loai"
          element={
            <LayoutAdmin>
              <Loai />
            </LayoutAdmin>
          }
        />
        <Route
          path="/admin/mau-sac"
          element={
            <LayoutAdmin>
              <Mau />
            </LayoutAdmin>
          }
        />
        <Route
          path="/admin/thuong-hieu"
          element={
            <LayoutAdmin>
              <ThuongHieu />
            </LayoutAdmin>
          }
        />
        <Route
          path="/admin/nguoi-dung"
          element={
            <LayoutAdmin>
              <NguoiDung />
            </LayoutAdmin>
          }
        />
        <Route
          path="/admin/phuong-thuc-thanh-toan"
          element={
            <LayoutAdmin>
              <ThanhToan />
            </LayoutAdmin>
          }
        />
        <Route
          path="/admin/quan-li-kho-anh"
          element={
            <LayoutAdmin>
              <KhoAnh />
            </LayoutAdmin>
          }
        />
      </Routes>
    </div>
  );
};

export default AdminRouter;
