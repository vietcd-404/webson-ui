import React, { useState } from "react";
import SpecialOffers from "../../../components/customer/home/SpecialOffers/SpecialOffers";
import Breadcrumbs from "../../../components/customer/pageProps/Breadcrumbs";

const Offer = () => {
  const [prevLocation] = useState("");

  return (
    <div className="max-w-container mx-auto">
      <Breadcrumbs title="Offer" prevLocation={prevLocation} />
      <div className="pb-10">
        <SpecialOffers />
      </div>
    </div>
  );
};

export default Offer;
