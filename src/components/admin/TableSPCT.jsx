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
import { findAllMau, loadAllMau } from "../../services/MauService";
import { findAllSanPham, loadAllSanPham } from "../../services/SanPhamService";
import { findAllLoai, loadAllLoai } from "../../services/LoaiService";
import {
  findAllThuongHieu,
  loadAllThuongHieu,
} from "../../services/ThuongHieuService";

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
      const response = await loadAllMau();
      setDataMau(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const loadSanPham = async () => {
    try {
      const response = await loadAllSanPham();
      setDataSanPham(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const loadLoai = async () => {
    try {
      const response = await loadAllLoai();
      setDataLoai(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const loadThuongHieu = async () => {
    try {
      const response = await loadAllThuongHieu();
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
        trangThai: 1,
        xoa: 0,
      };
      const values1 = await form.validateFields();

      const response = await creatSPCT(newProduct, values1);

      if (response.status === 200) {
        message.success("Thêm sản phẩm thành công!");
        form.resetFields();
      } else {
        message.error("Thêm sản phẩm thất bại!");
      }
    } catch (error) {
      console.error("Có lỗi khi thêm sản phẩm", error);
      message.error("Có lỗi khi thêm sản phẩm");
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
        <Form form={form} onFinish={handleAddProduct}>
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
        </Form>
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
                rules={[
                  { required: true, message: "Giá bán không để trống" },
                  {
                    validator: (rule, value) => {
                      if (value && value <= 0) {
                        return Promise.reject("Giá bán phải lớn hơn 0");
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
              >
                <Input placeholder="Price" type="number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Số lượng"
                name="soLuongTon"
                rules={[
                  { required: true, message: "Số lượng không để trống" },
                  {
                    validator: (rule, value) => {
                      if (value && value <= 0) {
                        return Promise.reject("Số lượng phải lớn hơn 0");
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
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
                      if (value && (value < 0 || value > 99)) {
                        return Promise.reject(
                          "Phần trăm giảm không được nhỏ hơn 0 hoặc lớn hơn 99"
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
