import React from "react";
import Image from "../../../components/customer/designLayouts/Image";
import { forbidden } from "../../../assets/images";

const Forbidden = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Image className="w-[45%] flex justify-items-center" imgSrc={forbidden} />
    </div>
  );
};

export default Forbidden;
