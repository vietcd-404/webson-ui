import React, { useEffect, useRef, useState } from "react";
import "./BanHang.css";
import {
  Button,
  Col,
  Form,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
  Tabs,
  message,
} from "antd";
import Input from "antd/es/input/Input";
import {
  findSanPham,
  getAllTaiQuay,
  hienHoaDonTaiQuay,
  taoHoaDonTaiQuay,
  themSanPhamTaiQuay,
  updateSoLuongTaiQuay,
} from "../../../services/BanHangTaiQuay";
import { DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "../../../pages/customer/Account/AuthProvider";
const HoaDon2 = () => {
  const [activeKey, setActiveKey] = useState("1");
  const [items, setItems] = useState(() => {
    const storedItems = localStorage.getItem("items");
    return storedItems ? JSON.parse(storedItems) : [];
  });
  const [dataSanPham, setDataSanPham] = useState([]);
  const [tongTien, setTongTien] = useState([]);

  const [dataDaThemSP, setDaThemSP] = useState([]);
  const [selectedSanPham, setSelectedSanPham] = useState(null);
  const [taoHoaDon, setTaoHoaDon] = useState({});
  const [formData, setFormData] = useState({
    tenNguoiNhan: "",
  });

  const newTabIndex = useRef(1);
  const handleSelectSanPham = (values) => {
    setSelectedSanPham("");
  };
  const loadSanPham = async () => {
    try {
      const response = await getAllTaiQuay();
      setDataSanPham(response.data.content);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  const loadDaThemSanPham = async (maHoaDon) => {
    try {
      const response = await findSanPham(maHoaDon); // Modify the API call to pass the invoice code
      setDaThemSP(response.data);
      console.log(response);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  const handleTabChange = (maHoaDon) => {
    loadDaThemSanPham(maHoaDon);
  };

  const handleAddToCart = async (maSanPhamCT, maHoaDon) => {
    try {
      await themSanPhamTaiQuay(maSanPhamCT, 1, maHoaDon);

      // Swal.fire({
      //   title: "Thành công!",
      //   text: "Thêm vào giỏ hàng thành công",
      //   icon: "success",
      // });
      loadDaThemSanPham(maHoaDon);
      message.success("Thêm thành công");
      return;
    } catch (error) {
      console.log("Lỗi ", error);
      message.error(error.response?.data?.message || "Error adding to cart");
    }
  };

  useEffect(() => {
    loadSanPham();
    const storedItems = localStorage.getItem("items");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);
  useEffect(() => {
    // Clear tabs from localStorage after 1 hour
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const onChangeSoLuong = (value, record) => {
    // Update the quantity for the specific record in your data
    record.soLuong = value;
    // You may also want to update the "Thành tiền" column based on the new quantity
    record.thanhTien = value * record.giaBan;

    // Log the changed value for demonstration purposes
    console.log("changed", value);
  };
  const onChange = (key) => {
    setActiveKey(key);
  };
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        tenNguoiNhan: user.ho + " " + user.tenDem + " " + user.ten,
      });
    }
  }, [user]);
  useEffect(() => {
    let tongTien = 0;
    dataDaThemSP.map((item) => {
      const giaBan = item.giaBan * ((100 - item.phanTramGiam) / 100);
      tongTien += giaBan * item.soLuong;
      return tongTien;
    });
    setTongTien(tongTien);
  }, [dataDaThemSP]);
  let invoiceCode;
  const add = async () => {
    if (items.length < 5) {
      try {
        const response = await taoHoaDonTaiQuay(taoHoaDon);
        // const newActiveKey = `newTab${newTabIndex.current}`;
        invoiceCode = response.data.maHoaDon;

        let newActiveKey, newLabel;

        do {
          newActiveKey = `newTab${newTabIndex.current}`;
          newLabel = `Hóa đơn ${newTabIndex.current}`;
          newTabIndex.current++;
        } while (
          items.some((item) => item.key === newActiveKey) ||
          items.some((item) => item.label === newLabel)
        );

        setItems([
          ...items,
          {
            label: newLabel,
            key: newActiveKey,
            maHoaDon: invoiceCode,
            trangThai: response.data.trangThai,
            tongTien: response.data.tongTien,
          },
        ]);
        setActiveKey(newActiveKey);
        console.log(response.data);
        message.success("Tạo hóa đơn thành công");
        loadDaThemSanPham(invoiceCode);

        // form.resetFields(); // Reset form fields when creating a new invoice
      } catch (error) {
        console.log("Lỗi ", error);
        message.error("Lỗi khi tạo hóa đơn");
      }
    } else {
      message.error("Đã đạt đến giới hạn số lượng hóa đơn.");
    }
    // newTabIndex.current++;
  };
  const handleQuantityChange = async (
    newQuantity,
    maHoaDonCT,
    maHoaDon,
    maxQuantity
  ) => {
    // const newQuantity = event.target.value;
    if (newQuantity > maxQuantity || newQuantity < 1) {
      // You can choose to show an error message or handle it in a way suitable for your application
      console.error("Quantity exceeds the maximum limit");
      message.error("Số lượng vượt giới hạn");
      return;
    }

    try {
      await updateSoLuongTaiQuay(maHoaDonCT, newQuantity, maHoaDon);

      loadDaThemSanPham(maHoaDon);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      message.error(error.response.data.message);
    }
    setDaThemSP((prevData) =>
      prevData.map((item) =>
        item.maHoaDonCT === maHoaDonCT
          ? { ...item, soLuong: newQuantity }
          : item
      )
    );
  };
  console.log();
  const columns = [
    {
      title: "Sản phẩm",
      // dataIndex: "tenSanPham",
      key: "tenSanPham",
      render: (record) => record.tenSanPham + " - " + "[" + record.tenMau + "]",
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
      render: (text, record) => (
        <InputNumber
          min={1}
          max={record.soLuongTon}
          defaultValue={text}
          onChange={(newQuantity) =>
            handleQuantityChange(
              newQuantity,
              record.maHoaDonCT,
              record.maHoaDon,
              record.soLuongTon
            )
          }
        />
      ),
    },
    {
      title: "Đơn giá",
      // dataIndex: "giaBan",
      key: "giaBan",
      render: (record) => record.giaBan * ((100 - record.phanTramGiam) / 100),
    },
    {
      title: "Thành tiền",
      key: "thanhTien", // Đặt key tương ứng với cột thành tiền
      render: (record) =>
        record.soLuong * (record.giaBan * ((100 - record.phanTramGiam) / 100)), // Sử dụng hàm render để tính thành tiền
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
      localStorage.removeItem("items");
    } else {
      // Update localStorage when removing a tab
      localStorage.setItem("items", JSON.stringify(newPanes));
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
        onTabClick={(key) =>
          handleTabChange(items.find((item) => item.key === key)?.maHoaDon)
        }
      >
        {items.map((pane) => (
          <Tabs.TabPane
            tab={pane.label}
            key={pane.key}
            closable={items.length >= 1}
            style={{ flexDirection: "row" }}
            // onClick={() => handleTabChange(pane.maHoaDon)}
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
                  <Input value={pane.maHoaDon} placeholder="Tên" />
                </Form.Item>
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
                  <Input value={tongTien} placeholder="Tên" />
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
                    value=""
                    onSelect={(value, option) =>
                      handleAddToCart(value, pane.maHoaDon)
                    }
                    style={{ width: "90%" }}
                  >
                    {dataSanPham.map((item) => (
                      <Select.Option
                        key={item.maSanPhamCT}
                        value={item.maSanPhamCT}
                        {...item}
                      >
                        <div className="flex justify-between ">
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
                  <Table columns={columns} dataSource={dataDaThemSP} />
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
