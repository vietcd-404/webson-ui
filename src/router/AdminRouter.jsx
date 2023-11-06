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
import TableSPCT from "../components/admin/TableSPCT";
import ListSPCT from "../components/admin/ListSPCT";
import SanPhamChiTietLayout from "../components/admin/LayoutSanPhamChiTiet";
import KhoAnh from "../pages/admin/KhoAnh/KhoAnh";
import Logout from "../pages/customer/Account/Logout";
// import { useAuth } from "../pages/customer/Account/AuthProvider";
// import { Modal } from "antd";

const AdminRouter = () => {
  // const { signout } = useAuth();
  // const handleLogout = () => {
  //   Modal.confirm({
  //     title: "Xác nhận đăng xuất",
  //     content: "Bạn có chắc muốn đăng xuất?",
  //     onOk: () => {
  //       signout();
  //     },
  //   });
  // };
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
        {/* <Route
          path="/san-pham-chi-tiet"
          element={
            <LayoutAdmin>
              <SanPhamChiTiet />
            </LayoutAdmin>
          }
        /> */}
        <Route
          path="/san-pham-chi-tiet"
          element={
            <LayoutAdmin>
              <SanPhamChiTietLayout>
                <TableSPCT></TableSPCT>
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
        <Route path="/dang-xuat" element={<Logout />} />
      </Routes>
    </div>
  );
};

export default AdminRouter;
