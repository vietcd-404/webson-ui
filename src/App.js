import { Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/admin/*" element={<AdminRouter />} />

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
          element={
            <Main>
              <SignUp />
            </Main>
          }
        ></Route>
        <Route
          path="/signin"
          element={
            <Main>
              <SignIn />
            </Main>
          }
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
