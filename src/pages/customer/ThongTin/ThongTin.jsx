import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  iconAccount,
  iconAddress,
  iconBill,
  iconHeart,
} from "../../../assets/images";
import Image from "../../../components/customer/designLayouts/Image";

const ThongTin = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen container mx-auto m-10">
      <div className="min-h-screen w-64 ">
        <div className="p-4">
          <h1 className="text-3xl font-bold text-black">Thông tin</h1>
        </div>

        <ul className="space-y-2 p-4">
          <li
            className={`border-b border-gray-200 py-2 ${
              location.pathname === "/invoices" ? " text-blue-700" : ""
            }`}
          >
            <Link to="/invoices" className="hover:text-blue-500">
              <div className="flex row-auto">
                <Image className="w-[10%] mr-5" imgSrc={iconBill} /> Hóa đơn
              </div>
            </Link>
          </li>
          <li
            className={`border-b border-gray-200 py-2 ${
              location.pathname === "/profile" ? " text-blue-700" : ""
            }`}
          >
            <Link to="/profile" className="hover:text-blue-500">
              <div className="flex row-auto">
                <Image className="w-[10%] mr-5" imgSrc={iconAccount} /> Thông
                tin cá nhân
              </div>
            </Link>
          </li>
          <li
            className={`border-b border-gray-200 py-2 ${
              location.pathname === "/my-favorites" ? " text-blue-700" : ""
            }`}
          >
            <Link to="/my-favorites" className="hover:text-blue-500">
              <div className="flex row-auto">
                <Image className="w-[10%] mr-5" imgSrc={iconHeart} /> Sản phẩm
                yêu thích
              </div>
            </Link>
          </li>
          <li
            className={`border-b border-gray-200 py-2 ${
              location.pathname === "/address" ? " text-blue-700" : ""
            }`}
          >
            <Link to="/address" className="hover:text-blue-500">
              <div className="flex row-auto">
                <Image className="w-[10%] mr-5" imgSrc={iconAddress} /> Sổ địa
                chỉ
              </div>
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-1 border-gray-600 min-h-screen">{children}</div>
    </div>
  );
};

export default ThongTin;
