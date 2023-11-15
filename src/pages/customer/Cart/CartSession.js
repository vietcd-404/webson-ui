import React from "react";
import { useDispatch } from "react-redux";
import {
  deleteItem,
  drecreaseQuantity,
  increaseQuantity,
  updateQuantity,
} from "../../../redux/orebiSlice";

const CartSession = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <>
      <tr>
        <td className="min-w-[80px]">
          <img
            width="30%"
            src={`data:image/png;base64,${item.anh}`}
            alt={item.tenSanPham}
            className="img-fluid rounded"
          />
        </td>
        <td className="font-bold">{item.tenSanPham}</td>
        <td className="min-w-[100px]">
          <div className="public-price">{item.giaBan}đ</div>
        </td>
        <td className="min-w-[100px]">
          {/* <input
            type="number"
            className="form-control number-input"
            value={item.soLuong}
            name="soLuong"
            min="1"
            // onChange={(e) => handleQuantityChange(e, item.maSanPhamCT)}
            // onClick={() =>
            //   dispatch(updateQuantity({ maSanPhamCT: item.maSanPhamCT }))
            // }
            style={{
              width: "100px",
            }}
          /> */}
          <div className="w-1/3 flex items-center gap-6 text-lg">
            <span
              onClick={() =>
                dispatch(drecreaseQuantity({ maSanPhamCT: item.maSanPhamCT }))
              }
              className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
            >
              -
            </span>
            <p>{item.soLuong}</p>
            <span
              onClick={() =>
                dispatch(increaseQuantity({ maSanPhamCT: item.maSanPhamCT }))
              }
              className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
            >
              +
            </span>
          </div>
        </td>
        <td className="min-w-[100px]">{item.giaBan * item.soLuong}</td>
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
