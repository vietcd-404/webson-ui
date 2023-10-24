import { Card, Form, Select, Space, Table, Button } from "antd";
import React, { useEffect, useState } from "react";
import { findAllMau } from "../../services/MauService";
import { findAllSanPham } from "../../services/SanPhamService";
import { findAllLoai } from "../../services/LoaiService";
import { findAllThuongHieu } from "../../services/ThuongHieuService";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const QLNguoiDung = () => {
  const [dataMau, setDataMau] = useState([]);
  const [dataThuongHieu, setDataThuongHieu] = useState([]);
  const [dataLoai, setDataLoai] = useState([]);
  const [dataSanPham, setDataSanPham] = useState([]);
  const [tableData, setTableData] = useState([]); // Table data

  const [selectedSanPham, setSelectedSanPham] = useState(null);
  const [selectedLoai, setSelectedLoai] = useState("");
  const [selectedMau, setSelectedMau] = useState([]);
  const [selectedThuongHieu, setSelectedThuongHieu] = useState("");
  const [listCT, setListCT] = useState([]);

  useEffect(() => {
    loadSanPham();
    loadMau();
    loadLoai();
    loadThuongHieu();
  }, []);

  useEffect(() => {
    updateTableData();
  }, [selectedSanPham, selectedLoai, selectedMau, selectedThuongHieu]);

  const updateTableData = () => {
    // Implement your logic to fetch or filter data based on selected values
    // Replace this logic with your data fetching or filtering code
    const filteredData = dataSanPham.map((item) => {
      return (
        (selectedSanPham === null || item.tenSanPham === selectedSanPham) &&
        (selectedLoai === "" || item.tenLoai === selectedLoai) &&
        (selectedThuongHieu === "" ||
          item.tenThuongHieu === selectedThuongHieu) &&
        (selectedMau.length === 0 || selectedMau.includes(item.tenMau))
      );
    });
    setTableData(filteredData);
  };

  const loadMau = async () => {
    try {
      const response = await findAllMau();
      setDataMau(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const loadSanPham = async () => {
    try {
      const response = await findAllSanPham();
      setDataSanPham(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const loadLoai = async () => {
    try {
      const response = await findAllLoai();
      setDataLoai(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const loadThuongHieu = async () => {
    try {
      const response = await findAllThuongHieu();
      setDataThuongHieu(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
    },
    {
      title: "Tên loại",
      dataIndex: "tenLoai",
      key: "tenLoai",
    },
    {
      title: "Tên thương hiệu",
      dataIndex: "tenThuongHieu",
      key: "tenThuongHieu",
    },
    {
      title: "Tên màu",
      dataIndex: "tenMau",
      key: "tenMau",
    },
    {
      title: "Giá bán",
      dataIndex: "giaBan",
      key: "giaBan",
    },
    {
      title: "Số lượng tồn",
      dataIndex: "soLuongTon",
      key: "soLuongTon",
    },
    {
      title: "Phần trăm giảm",
      dataIndex: "phanTramGiam",
      key: "phanTramGiam",
    },
    {
      title: "Danh sách ảnh",
      dataIndex: "phanTramGiam",
      key: "phanTramGiam",
    },
    {
      title: "Chức năng",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button>
            <EditOutlined />
          </Button>
          <Button>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
    // Add more columns for other attributes here
  ];

  return (
    <div>
      <Card title="Tên sản phẩm" bordered={false} style={{ width: "100%" }}>
        <Select
          placeholder="Chọn sản phẩm"
          size="large"
          style={{
            width: "100%",
          }}
          onChange={(value) => setSelectedSanPham(value)}
          value={selectedSanPham}
        >
          {dataSanPham.map((product) => (
            <Select.Option key={product.maSanPham} value={product.tenSanPham}>
              {product.tenSanPham}
            </Select.Option>
          ))}
        </Select>
      </Card>

      <Card
        title="Thuộc tính"
        bordered={false}
        style={{
          width: "100%",
        }}
      >
        <Form.Item name="loai" label="Loại">
          <Select
            size="large"
            placeholder="Chọn loại"
            onChange={(value) => setSelectedLoai(value)}
            value={selectedLoai}
            style={{
              width: "100%",
            }}
          >
            {dataLoai.map((loai) => (
              <Select.Option key={loai.maLoai} value={loai.tenLoai}>
                {loai.tenLoai}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="thuongHieu" label="Thương hiệu">
          <Select
            placeholder="Chọn thương hiệu"
            size="large"
            value={selectedThuongHieu}
            onChange={(value) => setSelectedThuongHieu(value)}
            style={{ width: "100%" }}
          >
            {dataThuongHieu.map((thuongHieu) => (
              <Select.Option
                key={thuongHieu.maThuongHieu}
                value={thuongHieu.tenThuongHieu}
              >
                {thuongHieu.tenThuongHieu}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="mau" label="Màu">
          <Select
            mode="multiple"
            size="large"
            placeholder="Chọn màu"
            onChange={(value) => setSelectedMau(value)}
            value={selectedMau}
            style={{
              width: "100%",
            }}
          >
            {dataMau.map((mau) => (
              <Select.Option key={mau.maMau} value={mau.tenMau}>
                {mau.tenMau}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Card>
      <Card
        title="Danh sách sản phẩm"
        bordered={false}
        style={{ width: "100%" }}
      >
        <Table dataSource={tableData} columns={columns} rowKey="maSanPham" />
      </Card>
    </div>
  );
};

export default QLNguoiDung;
