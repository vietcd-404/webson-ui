import React from "react";
import Image from "../../../components/customer/designLayouts/Image";
import { notfound } from "../../../assets/images";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Image className="w-[45%] flex justify-items-center" imgSrc={notfound} />
    </div>
  );
};

export default NotFound;
