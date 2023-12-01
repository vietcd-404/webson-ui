import React from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const ItemsFavorite = ({ item, xoa }) => {
  return (
    <>
      <tr>
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
          <div className="public-price">{item.donGia}đ</div>
        </td>
        <td className="min-w-[100px]">
          <Button onClick={xoa}>
            <DeleteOutlined />
          </Button>
        </td>
      </tr>
    </>
  );
};

export default ItemsFavorite;
