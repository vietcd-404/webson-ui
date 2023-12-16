import React, { useState, useEffect } from "react";
import { Button, Tabs } from "antd";
import { Link } from "react-router-dom";
import { getAllOrderByAdmin } from "../../../services/HoaDonService";
import WebSocketService from "../../../services/WebSocketService";
import { toast } from "react-toastify";
const LayOutHoaDon = ({ children }) => {
  const [countByStatus, setCountByStatus] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });

  const loadCount = async (status) => {
    try {
      let count = 0;
      const getHoaDon = await getAllOrderByAdmin(status);
      count = getHoaDon.data.totalElements;
      setCountByStatus((prevState) => ({
        ...prevState,
        [status]: count,
      }));
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const fetchCounts = async () => {
    await Promise.all([
      loadCount(0),
      loadCount(1),
      loadCount(2),
      loadCount(3),
      loadCount(4),
    ]);
  };
  const [messageValue, setMessageValue] = useState(null);

  useEffect(() => {
    fetchCounts();
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <Link className="p-2" to="/admin/hoa-don/cho-xac-nhan">
          <div className="relative ml-2 mr-2">
            <Button onClick={fetchCounts}>Chờ Xác Nhận</Button>
            <span className="absolute  -top-4 -right-2 text-xs flex items-center justify-center bg-[#FF0000]  text-white  w-3.5">
              {countByStatus["0"]}
            </span>
          </div>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link className="p-2" to="/admin/hoa-don/cho-giao">
          <div className="relative ml-2 mr-2">
            <Button onClick={fetchCounts}>Chờ Giao</Button>
            <span className="absolute  -top-4 -right-2 text-xs flex items-center justify-center bg-[#FF0000]  text-white  w-3.5">
              {countByStatus["1"]}
            </span>
          </div>
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <Link className="p-2" to="/admin/hoa-don/dang-giao">
          <div className="relative ml-2 mr-2">
            <Button onClick={fetchCounts}>Đang Giao</Button>
            <span className="absolute  -top-4 -right-2 text-xs flex items-center justify-center bg-[#FF0000]  text-white  w-3.5">
              {countByStatus["2"]}
            </span>
          </div>
        </Link>
      ),
    },
    {
      key: "4",
      label: (
        <Link className="p-2" to="/admin/hoa-don/hoan-thanh">
          <div className="relative ml-2 mr-2">
            <Button onClick={fetchCounts}>Hoàn Thành</Button>
            <span className="absolute  -top-4 -right-2 text-xs flex items-center justify-center bg-[#FF0000]  text-white  w-3.5">
              {countByStatus["3"]}
            </span>
          </div>
        </Link>
      ),
    },
    {
      key: "5",
      label: (
        <Link className="p-2" to="/admin/hoa-don/huy">
          <div className="relative ml-2 mr-2">
            <Button onClick={fetchCounts}>Hủy</Button>
            <span className="absolute  -top-4 -right-2 text-xs flex items-center justify-center bg-[#FF0000]  text-white  w-3.5">
              {countByStatus["4"]}
            </span>
          </div>
        </Link>
      ),
    },
  ];
  return (
    <div>
      <WebSocketService setValue={setMessageValue} connetTo="orderStatus" />

      <Tabs defaultActiveKey="1" items={items} />
      <div>{children}</div>
    </div>
  );
};

export default LayOutHoaDon;
