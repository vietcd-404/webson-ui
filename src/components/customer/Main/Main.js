import React from "react";
import Footer from "../home/Footer/Footer";
import FooterBottom from "../home/Footer/FooterBottom";
import Header from "../home/Header/Header";
import HeaderBottom from "../home/Header/HeaderBottom";
import SpecialCase from "../SpecialCase/SpecialCase";
const Main = ({ children }) => {
  return (
    <div>
      <Header />
      <HeaderBottom />
      <SpecialCase />
      {children}
      <Footer />
      <FooterBottom />
    </div>
  );
};

export default Main;
