import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Form,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  message,
} from "antd";
import Input from "antd/es/input/Input";
import { getAllTaiQuay } from "../../../services/BanHangTaiQuay";
import { DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "../../../pages/customer/Account/AuthProvider";
const HoaDon2 = () => {
  const [activeKey, setActiveKey] = useState("1");
  const [items, setItems] = useState([]);
  const [dataSanPham, setDataSanPham] = useState([]);
  const [selectedSanPham, setSelectedSanPham] = useState(null);

  const [formData, setFormData] = useState({
    tenNguoiNhan: "",
  });

  const newTabIndex = useRef(1);
  const handleSelectSanPham = (values) => {
    setSelectedSanPham(values);
  };
  const loadSanPham = async () => {
    try {
      const response = await getAllTaiQuay();
      setDataSanPham(response.data.content);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  useEffect(() => {
    loadSanPham();
  }, []);
  const onChange = (key) => {
    setActiveKey(key);
  };
  const { user } = useAuth();

  useEffect(() => {
    // Assuming user.email is the property containing the user's email
    if (user) {
      setFormData({
        ...formData,

        tenNguoiNhan: user.ho + " " + user.tenDem + " " + user.ten,
        // You can set other user-related data here if needed
      });
    }
  }, [user]);
  const add = () => {
    if (items.length < 5) {
      const newActiveKey = `newTab${newTabIndex.current}`;
      setItems([
        ...items,
        {
          label: `Hóa đơn ${newTabIndex.current++}`,
          key: newActiveKey,
        },
      ]);
      setActiveKey(newActiveKey);
    } else {
      // Hiển thị thông báo hoặc thực hiện các xử lý khác khi đã đạt đến giới hạn
      message.error("Đã đạt đến giới hạn số lượng hóa đơn.");
    }
    // newTabIndex.current++;
  };
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "tenLoai",
      key: "tenLoai",
    },
    {
      title: "Số lượng",
      dataIndex: "tenLoai",
      key: "tenLoai",
    },
    {
      title: "Đơn giá",
      dataIndex: "tenLoai",
      key: "tenLoai",
    },
    {
      title: "Thành tiền",
      dataIndex: "tenLoai",
      key: "tenLoai",
    },
    {
      title: "Chức năng",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* <Button onClick={() => showEditModal(record)}>
            <EditOutlined />
          </Button> */}
          <Button>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];
  const remove = (targetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);

    if (newPanes.length && targetKey === activeKey) {
      const { key } =
        newPanes[
          targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
        ];
      setActiveKey(key);
    }

    setItems(newPanes);
    if (newPanes.length === 0) {
      newTabIndex.current = 1;
    }
  };

  const onEdit = (targetKey, action) => {
    if (action === "add") {
      add();
    } else if (action === "remove") {
      remove(targetKey);
    }
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <Button onClick={add}>Tạo hóa đơn</Button>
      </div>
      <Tabs
        hideAdd
        onChange={onChange}
        activeKey={activeKey}
        type="editable-card"
        onEdit={onEdit}
      >
        {items.map((pane) => (
          <Tabs.TabPane
            tab={pane.label}
            key={pane.key}
            closable={items.length >= 1}
            style={{ flexDirection: "row" }}
          >
            <Row gutter={16}>
              <Col
                span={9}
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "10px",
                  marginRight: "10px",
                }}
              >
                {/* Left side content */}
                <Form.Item
                  label="Người bán"
                  style={{ width: "80%", marginLeft: "40px" }}
                  rules={[
                    {
                      required: true,
                      message: "Tên loại không được để trống!",
                    },
                  ]}
                >
                  <Input value={formData.tenNguoiNhan} placeholder="Tên" />
                </Form.Item>
              </Col>

              <Col
                span={14}
                style={{
                  border: "1px solid gray",
                  padding: "12px",
                  borderRadius: "10px",
                }}
              >
                <div className="text-center mb-2 text-lg ">Giỏ hàng</div>
                <Form.Item name="tenLoai" label="Tìm kiếm sản phẩm">
                  <Select
                    showSearch
                    size="large"
                    placeholder="Tìm kiếm sản phẩm"
                    value={selectedSanPham}
                    onChange={handleSelectSanPham}
                    style={{ width: "90%" }}
                  >
                    {dataSanPham.map((item) => (
                      <Select.Option key={item.maSanPhamCT}>
                        <div className="flex justify-between">
                          <div className="font-bold text-sm">
                            {item.tenSanPham}-[{item.tenMau}]
                          </div>
                          <div className="flex space-x-2">
                            <del>{item.giaBan} đ</del>
                          </div>
                          <div className="flex space-x-2">
                            <div>
                              {item.giaBan * ((100 - item.phanTramGiam) / 100)}{" "}
                              đ
                            </div>
                          </div>
                        </div>
                        <div>{item.tenThuongHieu}</div>
                        <div>
                          <i className="text-gray-500">Số lượng: </i>
                          {item.soLuongTon}
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <div className="border rounded-md">
                  <Table
                    columns={columns}
                    // dataSource={da}
                  />
                </div>
              </Col>
            </Row>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default HoaDon2;
