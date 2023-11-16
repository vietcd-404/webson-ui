import React from "react";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const ItemsFavorite = ({ item, xoa }) => {
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
