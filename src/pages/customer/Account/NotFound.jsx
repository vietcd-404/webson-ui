import React from "react";
import Image from "../../../components/customer/designLayouts/Image";
import { notfound } from "../../../assets/images";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Image className="w-[45%] flex justify-items-center" imgSrc={notfound} />
      <p className="text-xl mt-4 mb-8">Page Not Found</p>

      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
