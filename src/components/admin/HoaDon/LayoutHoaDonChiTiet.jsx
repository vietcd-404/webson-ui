import React from "react";
import { useEffect, useState } from "react";
import { Button, Tabs } from "antd";
import { Link } from "react-router-dom";
import {
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
} from "antd";
import { ToastContainer } from "react-toastify";

const LayoutHoaDonChiTiet = () => {
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "stt",
    },
    {
      title: "Ngày Đặt",
      dataIndex: "ngayTao",
      key: "ngayTao",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "ho",
      key: "d",
    },
    {
      title: "Trạng Thái",
      dataIndex: "tenDem",
      key: "d",
    },
    {
      title: "Hành Động",
      key: "action",
    },
  ];

  return (
    <div>
      <ToastContainer />
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          pageSize: 7,
          total: totalPage,
        }}
      />
    </div>
  );
};

export default LayoutHoaDonChiTiet;
