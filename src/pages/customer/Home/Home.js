import React from "react";
import Banner from "../../../components/customer/Banner/Banner";
import BannerBottom from "../../../components/customer/Banner/BannerBottom";
import BestSellers from "../../../components/customer/home/BestSellers/BestSellers";
import NewArrivals from "../../../components/customer/home/NewArrivals/NewArrivals";
import Sale from "../../../components/customer/home/Sale/Sale";
import SpecialOffers from "../../../components/customer/home/SpecialOffers/SpecialOffers";
import YearProduct from "../../../components/customer/home/YearProduct/YearProduct";

const Home = () => {
  return (
    <div className="container mx-auto">
      <Banner />
      <BannerBottom />
      <div className="max-w-container mx-auto px-4">
        <Sale />
        <NewArrivals />
        <BestSellers />
        <YearProduct />
        <SpecialOffers />
      </div>
    </div>
  );
};

export default Home;
