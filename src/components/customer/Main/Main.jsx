import React from "react";
import Header from "../Header/Header";
import HeaderBottom from "../Header/HeaderBottom";

const Main = ({ children }) => {
  return (
    <div>
      <Header />
      <HeaderBottom />
      {children}
    </div>
  );
};

export default Main;
