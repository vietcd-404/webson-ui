import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const ItemCard = ({ item, xoa, updateSoLuong }) => {
  const giaBan = item.giaBan * ((100 - item.phanTramGiam) / 100);

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
                className="img-fluid rounded"
              />
            </Link>
          </div>
        </td>
        <td className="font-bold">
          <Link to={`/product/${item.maSanPhamCT}`}>
            {"[" + item.tenMau + "] " + item.tenSanPham}
          </Link>
        </td>
        <td className="min-w-[100px]">
          <div className="public-price">
            {giaBan.toLocaleString("en-US")} VNĐ
          </div>
        </td>
        <td className="min-w-[100px]">
          <input
            type="number"
            id={item.maSanPhamCT}
            className="form-control number-input"
            value={item.soLuong}
            name="soLuong"
            min="1"
            // onChange={(e) => handleQuantityChange(e, item.maSanPhamCT)}
            onChange={updateSoLuong}
            style={{
              width: "100px",
            }}
          />
        </td>
        <td className="min-w-[100px]" id={`product-price-${item.maGioHang}`}>
          {(giaBan * item.soLuong).toLocaleString("en-US")} VNĐ
        </td>
        <td className="min-w-[100px]">
          <button
            className="btn-delete"
            // onClick={() => handleXoa(item.maGioHang)}
            onClick={xoa}
          >
            Xóa
          </button>
        </td>
      </tr>
    </>
  );
};

export default ItemCard;
