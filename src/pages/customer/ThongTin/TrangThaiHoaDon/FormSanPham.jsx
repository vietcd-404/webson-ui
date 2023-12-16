import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const FormSanPham = ({ item, xoa, updateSoLuong, trangThai, cong, tru }) => {
  return (
    <>
      <tr key={item.maGioHang}>
        <td className="min-w-[80px]">
          <div className="w-[125px]">
            <Link to={`/product/${item.maSanPhamCT}`}>
              <img
                width="100%"
                src={`data:image/png;base64,${item.anh[0]}`}
                alt={item.tenSanPham}
                className="img-fluid rounded h-[10%]"
              />
            </Link>
          </div>
        </td>
        <td className="font-bold min-w-[100px]">
          <Link to={`/product/${item.maSanPhamCT}`}>{item.tenSanPham}</Link>
        </td>
        <td className="min-w-[100px]">
          <div className="public-price">
            {/* {item.giaBan * ((100 - item.phanTramGiam) / 100)}đ */}
            {item.donGia}đ
          </div>
        </td>
        <td className="min-w-[100px]">
          {/* <input
            type="number"
            id={item.maSanPhamCT}
            className="form-control number-input"
            value={item.soLuong}
            name="soLuong"
            min="1"
            // onChange={(e) => handleQuantityChange(e, item.maSanPhamCT)}
            onChange={updateSoLuong}
            disabled={trangThai}
            style={{
              width: "100px",
            }}
          /> */}
          <div className="w-1/3 flex items-center gap-2 text-lg ">
            {item.trangThai === 0 && (
              <button
                onClick={cong}
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
            )}
            <p className="border border-gray-300 py-2 px-4">{item.soLuong}</p>
            {item.trangThai === 0 && (
              <button
                onClick={tru}
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
            )}
          </div>
        </td>
        <td className="min-w-[100px]">{item.donGia * item.soLuong}</td>
        <td className="min-w-[100px]">
          <button
            className="text-lg font-bold"
            disabled={item.trangThai !== 0}
            // onClick={() => handleXoa(item.maGioHang)}
            onClick={xoa}
          >
            <DeleteOutlined />
          </button>
        </td>
      </tr>
    </>
  );
};

export default FormSanPham;
