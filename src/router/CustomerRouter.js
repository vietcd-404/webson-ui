// CustomerRouter.js
import {
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Outlet,
  ScrollRestoration,
  Route,
} from "react-router-dom";

import About from "../pages/customer/About/About";
import SignIn from "../pages/customer/Account/SignIn";
import SignUp from "../pages/customer/Account/SignUp";
import Cart from "../pages/customer/Cart/Cart";
import Contact from "../pages/customer/Contact/Contact";
import Home from "../pages/customer/Home/Home";
import Journal from "../pages/customer/Journal/Journal";
import Offer from "../pages/customer/Offer/Offer";
import Payment from "../pages/customer/payment/Payment";
import ProductDetails from "../pages/customer/ProductDetails/ProductDetails";
import Shop from "../pages/customer/Shop/Shop";

import Footer from "../components/customer/home/Footer/Footer";
import FooterBottom from "../components/customer/home/Footer/FooterBottom";
import Header from "../components/customer/home/Header/Header";
import HeaderBottom from "../components/customer/home/Header/HeaderBottom";
import SpecialCase from "../components/customer/SpecialCase/SpecialCase";

const Layout = () => {
  return (
    <div>
      <Header />
      <HeaderBottom />
      <SpecialCase />
      <ScrollRestoration />
      <Outlet />
      <Footer />
      <FooterBottom />
    </div>
  );
};
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* ==================== Header Navlink Start here =================== */}
      <Route index element={<Home />}></Route>
      <Route path="/shop" element={<Shop />}></Route>
      <Route path="/about" element={<About />}></Route>
      <Route path="/contact" element={<Contact />}></Route>
      <Route path="/new" element={<Journal />}></Route>
      {/* ==================== Header Navlink End here ===================== */}
      <Route path="/offer" element={<Offer />}></Route>
      <Route path="/product/:_id" element={<ProductDetails />}></Route>
      <Route path="/cart" element={<Cart />}></Route>
      <Route path="/paymentgateway" element={<Payment />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
    </Route>
  )
);

function CustomerRouter() {
  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default CustomerRouter;
