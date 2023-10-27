import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/customer/pageProps/Breadcrumbs";

const About = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    setPrevLocation(location.state.data);
  }, [location]);
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Giới Thiệu" prevLocation={prevLocation} />
      <div className="pb-10">
        <h1 className="max-w-[600px] text-base text-lightText mb-2">
          <span className="text-primeColor font-semibold text-xl">
            Shop HEVA
          </span>{" "}
          có trụ sở chính tại Hà Nội. Nhận Ship hàng tại TPHCM, Hà Nội và các
          tỉnh thành tại Việt Nam.
          <br />{" "}
          <span className="text-primeColor font-semibold text-lg">
            Địa Chỉ Cửa Hàng:
          </span>{" "}
          12 Ng. 86 P. Chùa Hà, Quan Hoa, Cầu Giấy, Hà Nội Hoặc bạn gọi số
          0938.999.706 để được giao hàng miễn phí nội thành Hà Nội.
        </h1>
        <Link to="/shop">
          <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
            Continue Shopping
          </button>
        </Link>
        <div className="max-w-container mx-auto px-4 center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7447.795863340942!2d105.78815833379369!3d21.036769630829486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9add35b0cb%3A0x36c874d475859aac!2zS1lPIEF1dGhlbnRpYyAtIFNob3AgbeG7uSBwaOG6qW0sIHNvbiBtw7RpLCBuxrDhu5tjIGhvYSBjaMOtbmggaMOjbmc!5e0!3m2!1svi!2s!4v1698235730896!5m2!1svi!2s"
            title="Google Map of Shop HEVA's Location"
            width="900"
            height="550"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default About;
