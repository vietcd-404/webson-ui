import React from "react";
import { useDispatch } from "react-redux";
import {
  deleteItem,
  drecreaseQuantity,
  increaseQuantity,
  updateQuantity,
} from "../../../redux/orebiSlice";
import { Link } from "react-router-dom";

const CartSession = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <>
      <tr>
        <td className="min-w-[80px]">
          <div className="w-[125px]">
            <Link to={`/product/${item.maSanPhamCT}`}>
              <img
                width="100%"
                src={`data:image/png;base64,${item.anh}`}
                alt={item.tenSanPham}
                className="img-fluid rounded"
              />
            </Link>
          </div>
        </td>

        <td className="font-bold">
          <Link to={`/product/${item.maSanPhamCT}`}>
            [{item.tenMau}] - {item.tenSanPham}
          </Link>
        </td>
        <td className="min-w-[100px]">
          <div className="public-price">
            {item.giaBan.toLocaleString("en-US")} VNĐ
          </div>
        </td>
        <td className="min-w-[100px]">
          <div className="w-1/3 flex items-center gap-2 text-lg ">
            <button
              onClick={() =>
                dispatch(drecreaseQuantity({ maSanPhamCT: item.maSanPhamCT }))
              }
              className="w-8 h-[45px] bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border border-gray-300 hover:border-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 12H4"
                />
              </svg>
            </button>
            <p className="border border-gray-300 py-2 px-4">{item.soLuong}</p>
            <button
              onClick={() =>
                dispatch(increaseQuantity({ maSanPhamCT: item.maSanPhamCT }))
              }
              className="w-8 h-[45px] bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border border-gray-300 hover:border-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </td>
        <td className="min-w-[100px]">
          {(item.giaBan * item.soLuong).toLocaleString("en-US")} VNĐ
        </td>
        <td className="min-w-[100px]">
          <button
            className="btn-delete"
            onClick={() => dispatch(deleteItem(item.maSanPhamCT))}
          >
            Xóa
          </button>
        </td>
      </tr>
    </>
  );
};

export default CartSession;
