import React from "react";
import { Button, Tabs } from "antd";
import { Link } from "react-router-dom";

const LayOutHoaDon = ({ children }) => {
  const onChange = (key) => {};
  const items = [
    {
      key: "1",
      label: (
        <Button>
          <Link className="p-2" to="/admin/hoa-don/cho-xac-nhan">
            Chờ Xác Nhận
          </Link>
        </Button>
      ),
    },
    {
      key: "2",
      label: (
        <Button>
          <Link to="/admin/hoa-don/cho-giao">Chờ Giao</Link>
        </Button>
      ),
    },
    {
      key: "3",
      label: (
        <Button>
          <Link to="/admin/hoa-don/dang-giao">Đang Giao</Link>
        </Button>
      ),
    },
    {
      key: "4",
      label: (
        <Button>
          <Link to="/admin/hoa-don/hoan-thanh">Hoàn Thành</Link>
        </Button>
      ),
    },
    {
      key: "5",
      label: (
        <Button>
          <Link to="/admin/hoa-don/huy">Hủy</Link>
        </Button>
      ),
    },
    // {
    //   key: "6",
    //   label: (
    //     <Button>
    //       <Link to="/admin/hoa-don/cho-thanh-toan">Chờ Thanh Toán</Link>
    //     </Button>
    //   ),
    // },
  ];
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      <div>{children}</div>
    </div>
  );
};

export default LayOutHoaDon;
