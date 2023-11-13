import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const HoaDon = ({ props }) => {
  const location = useLocation();

  return (
    <div>
      <ul className="flex flex-wrap items-center justify-center p-1 border-b">
        {[
          { to: "/invoices", label: "Tất cả" },
          { to: "/invoices/wait-for-confirmation", label: "Chờ xác nhận" },
          { to: "/invoices/confirmation", label: "Xác nhận" },
          { to: "/invoices/in-progress", label: "Đang giao" },
          { to: "/invoices/delivered", label: "Đã giao" },
          { to: "/invoices/complete", label: "Hoàn thành" },
          { to: "/invoices/abort", label: "Đã hủy" },
        ].map((item) => (
          <li key={item.to} className="mb-2 md:mb-0">
            <NavLink
              to={item.to}
              className={`block py-2 px-4 rounded md:mr-2 transition duration-300 ${
                location.pathname === item.to
                  ? " bg-gray-200 border-b border-black"
                  : "hover:bg-gray-200"
              }`}
              exact
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-5">{props}</div>
    </div>
  );
};

export default HoaDon;
