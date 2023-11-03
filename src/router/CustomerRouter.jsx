import {
  createRoutesFromChildren,
  Route,
  RouterProvider,
  Outlet,
  ScrollRestoration,
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

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <HeaderBottom />
      <SpecialCase />
      <ScrollRestoration />
      {children}
      <Footer />
      <FooterBottom />
    </div>
  );
};

const routes = (
  <Route
    path="/"
    element={
      <Layout>
        <Outlet />
      </Layout>
    }
  >
    <Route index element={<Home />} />
    <Route path="shop" element={<Shop />} />
    <Route path="about" element={<About />} />
    <Route path="contact" element={<Contact />} />
    <Route path="new" element={<Journal />} />
    <Route path="offer" element={<Offer />} />
    <Route path="product/:_id" element={<ProductDetails />} />
    <Route path="cart" element={<Cart />} />
    <Route path="paymentgateway" element={<Payment />} />
    <Route path="signup" element={<SignUp />} />
    <Route path="signin" element={<SignIn />} />
  </Route>
);

const router = createRoutesFromChildren(routes);

function CustomerRouter() {
  return (
    <div className="font-bodyFont">
      <RouterProvider router={router}>
        <Outlet />
      </RouterProvider>
    </div>
  );
}

export default CustomerRouter;
