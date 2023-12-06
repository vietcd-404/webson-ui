import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
// import { ProtectedRoute } from "./components/ProtectedRoute";

import AdminRouter from "./router/AdminRouter";
import Main from "./components/customer/Main/Main";
import Home from "./pages/customer/Home/Home";
import Shop from "./pages/customer/Shop/Shop";
import About from "./pages/customer/About/About";
import SignIn from "./pages/customer/Account/SignIn";
import SignUp from "./pages/customer/Account/SignUp";
import Cart from "./pages/customer/Cart/Cart";
import Contact from "./pages/customer/Contact/Contact";
import Journal from "./pages/customer/Journal/Journal";
import Offer from "./pages/customer/Offer/Offer";
import Payment from "./pages/customer/payment/Payment";
import ProductDetails from "./pages/customer/ProductDetails/ProductDetails";
import { ProtectedRoute } from "./pages/customer/Account/ProtectedRoute";
import Forbidden from "./pages/customer/Account/Forbidden";
import { useAuth } from "./pages/customer/Account/AuthProvider";
import Otp from "./pages/customer/Account/Otp";
import ThongTin from "./pages/customer/ThongTin/ThongTin";
import HoaDon from "./pages/customer/ThongTin/HoaDon";
import SanPhamYeuThich from "./pages/customer/ThongTin/SanPhamYeuThich";
import ChoXacNhan from "./pages/customer/ThongTin/TrangThaiHoaDon/ChoXacNhan";
import TatCa from "./pages/customer/ThongTin/TrangThaiHoaDon/TatCa";
import DangGiao from "./pages/customer/ThongTin/TrangThaiHoaDon/DangGiao";
import HoanThanh from "./pages/customer/ThongTin/TrangThaiHoaDon/HoanThanh";
import Huy from "./pages/customer/ThongTin/TrangThaiHoaDon/Huy";
import ThongTinDonHang from "./pages/customer/ThongTin/TrangThaiHoaDon/ThongTinDonHang";
import XacNhan from "./pages/customer/ThongTin/TrangThaiHoaDon/XacNhan";
import CaNhan from "./pages/customer/ThongTin/CaNhan";
import ThongBaoXacNhan from "./pages/customer/payment/ThongBaoXacNhan";
import NotFound from "./pages/customer/Account/NotFound";
import DiaChi from "./pages/customer/ThongTin/DiaChi";
import LayoutAdmin from "./layout/AdminLayout";
import BanHangTaiQuay from "./pages/admin/BanHangTaiQuay/BanHangTaiQuay";
const App = () => {
  const { user } = useAuth();
  return (
    <div>
      <Routes>
        <Route
          path="/admin/*"
          element={
            // <ProtectedRoute userRole="ROLE_ADMIN">
            <AdminRouter />
            /* </ProtectedRoute> */
          }
        />
        <Route
          path="/admin/ban-hang"
          element={
            <ProtectedRoute userRole={["ROLE_STAFF", "ROLE_ADMIN"]}>
              <LayoutAdmin>
                <BanHangTaiQuay />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
        {/* Khách hàng  */}
        <Route
          path="/"
          element={
            <Main>
              <Home />
            </Main>
          }
        ></Route>
        <Route
          path="/shop"
          element={
            <Main>
              <Shop />
            </Main>
          }
        ></Route>
        <Route
          path="/done"
          element={
            <Main>
              <ThongBaoXacNhan />
            </Main>
          }
        ></Route>
        <Route
          path="/about"
          element={
            <Main>
              <About />
            </Main>
          }
        ></Route>
        <Route
          path="/contact"
          element={
            <Main>
              <Contact />
            </Main>
          }
        ></Route>
        <Route
          path="/new"
          element={
            <Main>
              <Journal />
            </Main>
          }
        ></Route>
        {/* ==================== Header Navlink End here ===================== */}
        <Route
          path="/offer"
          element={
            <Main>
              <Offer />
            </Main>
          }
        ></Route>
        <Route
          path="/product/:maSanPhamCT"
          element={
            <Main>
              <ProductDetails />
            </Main>
          }
        ></Route>
        <Route
          path="/cart"
          element={
            <Main>
              <Cart />
            </Main>
          }
        ></Route>
        <Route
          path="/paymentgateway"
          element={
            <Main>
              <Payment />
            </Main>
          }
        ></Route>
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Main children={<SignUp />} />}
        ></Route>
        <Route
          path="/signin"
          element={user ? <Navigate to="/" /> : <Main children={<SignIn />} />}
        ></Route>
        <Route path="/active" element={<Otp />}></Route>
        <Route
          path="/invoices"
          element={
            <ProtectedRoute
              userRole={["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"]}
            >
              <Main>
                <ThongTin children={<HoaDon props={<TatCa />} />} />
              </Main>
            </ProtectedRoute>
          }
        ></Route>
        {/* trạng thái giao hàng */}
        <Route
          path="/invoices"
          element={
            <ProtectedRoute
              userRole={["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"]}
            >
              <Main>
                <ThongTin children={<HoaDon props={<TatCa />} />} />
              </Main>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/information/:maHoaDon"
          element={
            <ProtectedRoute
              userRole={["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"]}
            >
              <Main>
                <ThongTin children={<ThongTinDonHang />} />
              </Main>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/invoices/confirmation"
          element={
            <ProtectedRoute
              userRole={["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"]}
            >
              <Main>
                <ThongTin children={<HoaDon props={<XacNhan />} />} />
              </Main>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/invoices/wait-for-confirmation"
          element={
            <ProtectedRoute
              userRole={["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"]}
            >
              <Main>
                <ThongTin children={<HoaDon props={<ChoXacNhan />} />} />
              </Main>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/invoices/in-progress"
          element={
            <ProtectedRoute
              userRole={["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"]}
            >
              <Main>
                <ThongTin children={<HoaDon props={<DangGiao />} />} />
              </Main>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/invoices/complete"
          element={
            <ProtectedRoute
              userRole={["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"]}
            >
              <Main>
                <ThongTin children={<HoaDon props={<HoanThanh />} />} />
              </Main>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/invoices/abort"
          element={
            <ProtectedRoute
              userRole={["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"]}
            >
              <Main>
                <ThongTin children={<HoaDon props={<Huy />} />} />
              </Main>
            </ProtectedRoute>
          }
        ></Route>

        {/* / */}

        <Route
          path="/profile"
          element={
            user ? (
              <Main>
                <ThongTin children={<CaNhan />} />
              </Main>
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        ></Route>
        <Route
          path="/address"
          element={
            user ? (
              <Main>
                <ThongTin children={<DiaChi />} />
              </Main>
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        ></Route>
        <Route
          path="/my-favorites"
          element={
            user ? (
              <ProtectedRoute
                userRole={["ROLE_USER", "ROLE_ADMIN", "ROLE_STAFF"]}
              >
                <Main>
                  <ThongTin children={<SanPhamYeuThich />} />
                </Main>
              </ProtectedRoute>
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
