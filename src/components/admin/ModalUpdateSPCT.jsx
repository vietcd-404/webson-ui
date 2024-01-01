import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { findAllMau, loadAllMau } from "../../services/MauService";
import { findAllSanPham, loadAllSanPham } from "../../services/SanPhamService";
import { findAllLoai, loadAllLoai } from "../../services/LoaiService";
import {
  findAllThuongHieu,
  loadAllThuongHieu,
} from "../../services/ThuongHieuService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TextArea from "antd/es/input/TextArea";
const { Option } = Select;
const ModalUpdateSPCT = (props) => {
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
  const frm = useRef();

  useEffect(() => {
    if (props.dataEdit.maSanPhamCT) {
      frm.current?.setFieldsValue({
        ...props.dataEdit,
      });
    } else {
      frm.current?.resetFields();
    }
  }, [props.dataEdit]);

  const onUpdate = async () => {
    frm.current
      ?.validateFields()
      .then((value) => {
        if (value != null) {
          return props.save(value);
        }
      })
      .catch((error) => {
        console.error("Lỗi validation:", error);
        toast.error("Cập nhập thất bại!");
      });
  };

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

  useEffect(() => {
    loadLoai();
    loadSanPham();
    loadThuongHieu();
    loadMau();
  }, []);
  return (
    <div>
      <ToastContainer />
      <Modal
        open={props.visible}
        onCancel={props.hidden}
        onOk={onUpdate}
        title="Sửa sản phẩm chi tiết"
        width={1000}
      >
        <Form ref={frm}>
          <Card title="Sản phẩm" bordered={false} className="card">
            <Form.Item name="tenSanPham">
              <Select
                placeholder="Select a product"
                size="large"
                style={{ width: "100%" }}
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
                        return Promise.reject("Giá bán không được nhỏ hơn 0");
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
                        return Promise.reject("Số lượng không được nhỏ hơn 0");
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
                          "Phần trăm giảm phải nằm trong khoảng từ 0 đến 99"
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
          <Row className="mt-2">
            <Form.Item
              label="Mô tả"
              name="moTa"
              style={{ width: "360px", marginLeft: "40px" }}
              rules={[
                { required: true, message: "Mô tả không được để trống!" },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ModalUpdateSPCT;
