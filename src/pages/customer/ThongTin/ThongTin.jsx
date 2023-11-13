import React from "react";
import { Link } from "react-router-dom";

const ThongTin = ({ childre }) => {
  return (
    <div className="flex min-h-screen container mx-auto m-10">
      <div className="min-h-screen w-64 ">
        <div className="p-4">
          <h1 className="text-3xl font-bold text-black">Thông tin</h1>
        </div>

        <ul className="space-y-2 p-4">
          <li className="border-b border-gray-200 py-2">
            <Link to="/invoices" className=" hover:text-blue-500">
              Hóa đơn
            </Link>
          </li>
          <li className="border-b border-gray-200 py-2">
            <Link to="/profile" className=" hover:text-blue-500">
              Thông tin cá nhân
            </Link>
          </li>
          <li className="border-b border-gray-200 py-2 ">
            <Link to="/my-favorites" className=" hover:text-blue-500">
              Sản phẩm yêu thích
            </Link>
          </li>
          <li className="border-b border-gray-200 py-2 ">
            <Link to="/address" className=" hover:text-blue-500">
              Sổ địa chỉ
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-1 border-gray-600  min-h-screen">{childre}</div>
    </div>
  );
};

export default ThongTin;
