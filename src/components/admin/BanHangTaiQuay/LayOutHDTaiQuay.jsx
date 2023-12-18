import React, { useState, useEffect } from "react";
import { Button, Tabs } from "antd";
import { Link } from "react-router-dom";
import { getAllOrderByAdmin } from "../../../services/HoaDonService";
import WebSocketService from "../../../services/WebSocketService";
import { toast } from "react-toastify";
const LayOutHDTaiQuay = ({ children }) => {
  const [countByStatus, setCountByStatus] = useState({
    5: 0,
    7: 0,
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
    await Promise.all([loadCount(5), loadCount(7)]);
  };
  const [messageValue, setMessageValue] = useState(null);

  useEffect(() => {
    fetchCounts();
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <Link className="p-2" to="/admin/hoa-don-tai-quay">
          <div className="relative ml-2 mr-2">
            <Button onClick={fetchCounts}>Đơn hàng</Button>
            <span className="absolute  -top-4 -right-2 text-xs flex items-center justify-center bg-[#FF0000]  text-white  w-3.5">
              {countByStatus["5"]}
            </span>
          </div>
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link className="p-2" to="/admin/hoa-don-tai-quay/huy">
          <div className="relative ml-2 mr-2">
            <Button onClick={fetchCounts}>Đã hủy</Button>
            <span className="absolute  -top-4 -right-2 text-xs flex items-center justify-center bg-[#FF0000]  text-white  w-3.5">
              {countByStatus["7"]}
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

export default LayOutHDTaiQuay;
