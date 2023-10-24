import {
  Card,
  Form,
  Select,
  Button,
  Input,
  message,
  Row,
  Col,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import { findAllMau } from "../../services/MauService";
import { findAllSanPham } from "../../services/SanPhamService";
import { findAllLoai } from "../../services/LoaiService";
import { findAllThuongHieu } from "../../services/ThuongHieuService";

import { creatSPCT, findAllSPCT } from "../../services/SanPhamChiTietService";
import { toast } from "react-toastify";

const { Option } = Select;

function TableSPCT() {
  const [dataSanPham, setDataSanPham] = useState([]);
  const [dataLoai, setDataLoai] = useState([]);
  const [dataThuongHieu, setDataThuongHieu] = useState([]);
  const [dataMau, setDataMau] = useState([]);
  const [data, setData] = useState([]);
  const [selectedSanPham, setSelectedSanPham] = useState(null);
  const [selectedLoai, setSelectedLoai] = useState(null);
  const [selectedThuongHieu, setSelectedThuongHieu] = useState(null);
  const [selectedMau, setSelectedMau] = useState(null);
  const [form] = Form.useForm();

  const loadTable = async () => {
    try {
      const response = await findAllSPCT();
      setData(response.data);
      console.log(response);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  useEffect(() => {
    loadTable();
  }, []);
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

  useEffect(() => {
    loadLoai();
    loadSanPham();
    loadThuongHieu();
    loadMau();
  }, []);

  const handleAddProduct = async (values) => {
    try {
      const newProduct = {
        tenSanPham: selectedSanPham,
        tenLoai: selectedLoai,
        tenThuongHieu: selectedThuongHieu,
        tenMau: selectedMau,
        // giaBan: values.giaBan * ((100 - values.phanTramGiam) / 100),
        giaBan: values.giaBan,
        soLuongTon: values.soLuongTon,
        phanTramGiam: values.phanTramGiam,
        trangThai: 0,
        xoa: 0,
      };
      const values1 = await form.validateFields();

      const response = await creatSPCT(newProduct, values1);

      if (response.status === 200) {
        message.success("Product added successfully");
        form.resetFields();
      } else {
        message.error("Failed to add the product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      message.error("Failed to add the product");
    }
  };

  const handleSanPhamChange = (value) => {
    setSelectedSanPham(value);
  };

  const handleLoaiChange = (value) => {
    setSelectedLoai(value);
  };

  const handleThuongHieuChange = (value) => {
    setSelectedThuongHieu(value);
  };

  const handleMauChange = (value) => {
    setSelectedMau(value);
  };

  return (
    <div className="table-spct-container">
      <Card title="Sản phẩm" bordered={false} className="card">
        <Form.Item name="tenSanPham">
          <Select
            placeholder="Select a product"
            size="large"
            style={{ width: "100%" }}
            form={form}
            onChange={handleSanPhamChange}
          >
            {dataSanPham.map((sanPham) => (
              <Option key={sanPham.maSanPham} value={sanPham.tenSanPham}>
                {sanPham.tenSanPham}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Card>

      <Card title="Thuộc tính" bordered={false} className="card">
        <Form form={form} onFinish={handleAddProduct}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="tenLoai" label="Loại">
                <Select
                  size="large"
                  placeholder="Select a type"
                  onChange={handleLoaiChange}
                  style={{ width: "100%" }}
                >
                  {dataLoai.map((loai) => (
                    <Option key={loai.maLoai} value={loai.tenLoai}>
                      {loai.tenLoai}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="tenThuongHieu" label="Thương hiệu">
                <Select
                  placeholder="Select a brand"
                  size="large"
                  onChange={handleThuongHieuChange}
                  style={{ width: "100%" }}
                >
                  {dataThuongHieu.map((thuongHieu) => (
                    <Option
                      key={thuongHieu.maThuongHieu}
                      value={thuongHieu.tenThuongHieu}
                    >
                      {thuongHieu.tenThuongHieu}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="tenMau" label="Màu">
                <Select
                  size="large"
                  placeholder="Select a color"
                  onChange={handleMauChange}
                  style={{ width: "100%" }}
                >
                  {dataMau.map((mau) => (
                    <Option key={mau.maMau} value={mau.tenMau}>
                      {mau.tenMau}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Giá bán"
                name="giaBan"
                rules={[{ required: true, message: "Giá bán không để trống" }]}
              >
                <Input placeholder="Price" type="number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Số lượng"
                name="soLuongTon"
                rules={[{ required: true, message: "Số lượng không để trống" }]}
              >
                <Input placeholder="Quantity" type="number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Phần trăm giảm"
                name="phanTramGiam"
                rules={[
                  {
                    required: true,
                    message: "Phần trăm giảm không để trống",
                  },
                  {
                    validator: (rule, value) => {
                      if (value && (value < 1 || value > 99)) {
                        return Promise.reject(
                          "Phần trăm giảm phải nằm trong khoảng từ 1 đến 99"
                        );
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
              >
                <Input placeholder="Discount Percentage" type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Thêm sản phẩm
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}

export default TableSPCT;
