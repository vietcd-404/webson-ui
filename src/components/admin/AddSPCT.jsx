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
  Table,
} from "antd";
import React, { useEffect, useState, useRef } from "react";
import { findAllMau, loadAllMau } from "../../services/MauService";
import { findAllSanPham, loadAllSanPham } from "../../services/SanPhamService";
import { findAllLoai, loadAllLoai } from "../../services/LoaiService";
import {
  findAllThuongHieu,
  loadAllThuongHieu,
} from "../../services/ThuongHieuService";

import {
  creatListSPCT,
  creatSPCT,
  findAllSPCT,
} from "../../services/SanPhamChiTietService";
import { ToastContainer, toast } from "react-toastify";
import { set } from "date-fns";
import { Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
function AddSPCT() {
  const [dataSanPham, setDataSanPham] = useState([]);
  const [dataLoai, setDataLoai] = useState([]);
  const [dataThuongHieu, setDataThuongHieu] = useState([]);
  const [dataMau, setDataMau] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [selectedSanPham, setSelectedSanPham] = useState([false]);
  const [selectedLoai, setSelectedLoai] = useState([false]);
  const [selectedThuongHieu, setSelectedThuongHieu] = useState([false]);
  const [selectedMau, setSelectedMau] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loadingMau, setLoadingMau] = useState(false);
  const isEditing = (record) => record.id === editingKey;

  const [form] = Form.useForm();

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

  const handleSelectSanPham = (values) => {
    setSelectedSanPham(values);
    updateTableData(values, selectedLoai, selectedMau, selectedThuongHieu);
  };

  const handleSelectLoai = (values) => {
    setSelectedLoai(values);
    updateTableData(selectedSanPham, values, selectedMau, selectedThuongHieu);
  };
  const handleSelectMau = (values) => {
    setSelectedMau(values);
    console.log(values);
    updateTableData(selectedSanPham, selectedLoai, values, selectedThuongHieu);
  };
  const handleSelectThuongHieu = (values) => {
    setSelectedThuongHieu(values);
    updateTableData(selectedSanPham, selectedLoai, selectedMau, values);
  };

  const updateTableData = (
    valuesSanPhan,
    valuesLoai,
    valuesMau,
    valuesThuongHieu
  ) => {
    const newData = valuesMau.map((value, index) => ({
      id: new Date().getTime() + index,
      tenSanPham: valuesSanPhan,
      tenLoai: valuesLoai,
      tenMau: value,
      tenThuongHieu: valuesThuongHieu,
      soLuongTon: 0,
      giaBan: 0,
      phanTramGiam: 0,
      trangThai: 0,
      xoa: false,
    }));
    setTableData(newData);
  };

  const handleTableEdit = (value, dataIndex, record) => {
    const newTableData = [...tableData];
    const targetIndex = newTableData.findIndex((item) => record.id === item.id);

    if (targetIndex > -1) {
      newTableData[targetIndex][dataIndex] = value;
      setTableData(newTableData);
    }
  };

  const save = (key) => {
    setEditingKey("");
  };

  const handleAddProduct = async () => {
    Modal.confirm({
      title: "Xác nhận thêm sản phẩm chi tiết",
      content: "Bạn có chắc chắn muốn thêm sản phẩm chi tiết không?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        const invalidRecords = tableData.filter((record) => {
          if (record.soLuongTon == null) {
            toast.error("Số lượng không trống");
            return true;
          }
          if (record.soLuongTon <= 0) {
            toast.error("Số lượng không được nhỏ hơn 0");
            return true;
          }
          if (record.giaBan <= 0) {
            toast.error("Giá bán không được nhỏ hơn 0");
            return true;
          }
          if (record.phanTramGiam < 0) {
            toast.error("Phần trăm giảm không được nhỏ hơn 0");
            return true;
          }
          if (record.phanTramGiam >= 100) {
            toast.error(
              "Phần trăm giảm không được lớn  hơn hoặc bằng 100 phần trăm"
            );
            return true;
          }
          return false;
        });
        if (invalidRecords.length > 0) {
          return;
        }
        try {
          const response = await creatListSPCT(tableData);
          console.log(response.data.length);
          if (response.data.length === 0) {
            message.error("Form trống, thêm sản phẩm chi tiết thất bại!");
            return;
          }
          if (response.status === 200) {
            message.success("Thêm sản phẩm chi tiết thành công");
            form.resetFields();
            setTableData([]);
          }
        } catch (error) {
          message.error("Đã xảy ra lỗi khi thêm sản phẩm chi tiết");
          console.log(error.message);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleDelete = (id, record) => {
    const updatedSelectedMau = selectedMau.filter(
      (selected) => !record.tenMau.includes(selected)
    );
    setSelectedMau(updatedSelectedMau);
    form.setFieldValue("tenMau", updatedSelectedMau);
    const newData = tableData.filter((item) => item.id !== id);
    setTableData(newData);
  };

  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa bản ghi này không?",
      onOk() {
        handleDelete(record.id, record);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
    },
    {
      title: "Tên Loại",
      dataIndex: "tenLoai",
      key: "tenLoai",
    },
    {
      title: "Tên Màu",
      dataIndex: "tenMau",
      key: "tenMau",
    },
    {
      title: "Tên thương hiệu",
      dataIndex: "tenThuongHieu",
      key: "tenThuongHieu",
    },
    {
      title: "Số lượng",
      dataIndex: "soLuongTon",
      key: "soLuongTon",
      render: (text, record) => (
        <Input
          placeholder="Quantity"
          type="number"
          style={{ width: "100px" }}
          value={text}
          onChange={(e) =>
            handleTableEdit(e.target.value, "soLuongTon", record)
          }
          onBlur={() => save(record.id)}
        />
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "giaBan",
      key: "giaBan",
      render: (text, record) => (
        <Input
          placeholder="Price"
          type="number"
          style={{ width: "100px" }}
          value={text}
          onChange={(e) => handleTableEdit(e.target.value, "giaBan", record)}
          onBlur={() => save(record.id)}
        />
      ),
    },
    {
      title: "Phần trăm giảm",
      dataIndex: "phanTramGiam",
      key: "phanTramGiam",
      render: (text, record) => (
        <Input
          placeholder="Discount Percentage"
          type="number"
          style={{ width: "100px" }}
          value={text}
          onChange={(e) =>
            handleTableEdit(e.target.value, "phanTramGiam", record)
          }
          onBlur={() => {
            const isValid = save(record.id);
            if (isValid) {
              setEditingKey("");
            }
          }}
        />
      ),
    },
    {
      title: "",
      dataIndex: "operation",
      render: (_, record) =>
        tableData.length >= 1 ? (
          <Button onClick={() => showDeleteConfirm(record)}>
            <DeleteOutlined />
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="table-spct-container">
      <ToastContainer />
      <Card title="Sản phẩm" bordered={false} className="card">
        <Form form={form} onFinish={handleAddProduct}>
          <Form.Item name="tenSanPham">
            <Select
              placeholder="Select a product"
              size="large"
              value={selectedSanPham}
              onChange={handleSelectSanPham}
              style={{ width: "100%" }}
            >
              {dataSanPham.map((item) => (
                <Select.Option key={item.maSanPham} value={item.tenSanPham}>
                  {item.tenSanPham}
                </Select.Option>
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
                  value={selectedLoai}
                  onChange={handleSelectLoai}
                  style={{ width: "90%" }}
                >
                  {dataLoai.map((item) => (
                    <Select.Option key={item.maLoai} value={item.tenLoai}>
                      {item.tenLoai}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="tenThuongHieu" label="Thương hiệu">
                <Select
                  placeholder="Select a brand"
                  size="large"
                  value={selectedThuongHieu}
                  onChange={handleSelectThuongHieu}
                  style={{ width: "100%" }}
                >
                  {dataThuongHieu.map((item) => (
                    <Select.Option
                      key={item.maThuongHieu}
                      value={item.tenThuongHieu}
                    >
                      {item.tenThuongHieu}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="tenMau" label="Màu">
                <Select
                  size="large"
                  placeholder="Select a color"
                  value={selectedMau}
                  onChange={handleSelectMau}
                  style={{ width: "100%" }}
                  mode="multiple"
                >
                  {loadingMau ? (
                    <Select.Option disabled value="Loading">
                      Loading Loai...
                    </Select.Option>
                  ) : (
                    dataMau.map((item) => (
                      <Select.Option key={item.maMau} value={item.tenMau}>
                        {item.tenMau}
                      </Select.Option>
                    ))
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card title="Table" bordered={false} style={{ width: "100%" }}>
        <Table dataSource={tableData} columns={columns} rowKey="id" />
      </Card>
      <Button className="mt-2" onClick={handleAddProduct}>
        Tạo mới
      </Button>
    </div>
  );
}

export default AddSPCT;
