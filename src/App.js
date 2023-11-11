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
import CaNhan from "./pages/customer/ThongTin/CaNhan";
import SanPhamYeuThich from "./pages/customer/ThongTin/SanPhamYeuThich";

const App = () => {
  const { user } = useAuth();
  return (
    <div>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute userRole="ROLE_ADMIN">
              <AdminRouter />
            </ProtectedRoute>
          }
        />
        <Route path="/forbidden" element={<Forbidden />} />

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
          path="/product/:_id"
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
          path="/bill"
          element={
            <ProtectedRoute userRole={["ROLE_USER", "ROLE_ADMIN"]}>
              <Main>
                <ThongTin children={<HoaDon />} />
              </Main>
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            user ? (
              <Main>
                {" "}
                <ThongTin />
              </Main>
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        ></Route>
        <Route
          path="/my-favorites"
          element={
            <ProtectedRoute userRole={["ROLE_USER", "ROLE_ADMIN"]}>
              <Main>
                <ThongTin children={<SanPhamYeuThich />} />
              </Main>
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
