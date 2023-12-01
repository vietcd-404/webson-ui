import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const FormSanPham = ({ item, xoa, updateSoLuong, trangThai }) => {
  return (
    <>
      <tr key={item.maGioHang}>
        <td className="min-w-[80px]">
          <Link to={`/product/${item.maSanPhamCT}`}>
            <img
              width="30%"
              src={`data:image/png;base64,${item.anh}`}
              alt={item.tenSanPham}
              className="img-fluid rounded"
            />
          </Link>
        </td>
        <td className="font-bold">
          <Link to={`/product/${item.maSanPhamCT}`}>{item.tenSanPham}</Link>
        </td>
        <td className="min-w-[100px]">
          <div className="public-price">
            {item.giaBan * ((100 - item.phanTramGiam) / 100)}đ
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
            disabled={trangThai}
            style={{
              width: "100px",
            }}
          />
        </td>
        <td className="min-w-[100px]" id={`product-price-${item.maGioHang}`}>
          {item.giaBan * ((100 - item.phanTramGiam) / 100) * item.soLuong}
        </td>
        <td className="min-w-[100px]">
          <button
            className="text-lg font-bold"
            disabled={item.trangThai !== 0 || item.dieuKien}
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
