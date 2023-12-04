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
  getAllKhachHang,
  getAllTaiQuay,
  hienHoaDonTaiQuay,
  taoHoaDonTaiQuay,
  thanhToanHoaDon,
  themSanPhamTaiQuay,
  updateSoLuongTaiQuay,
  xoaSanPhamTaiQuay,
} from "../../../services/BanHangTaiQuay";
import { DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "../../../pages/customer/Account/AuthProvider";
import Swal from "sweetalert2";
const HoaDon2 = () => {
  const [activeKey, setActiveKey] = useState("1");
  const [items, setItems] = useState(() => {
    const storedItems = localStorage.getItem("items");
    return storedItems ? JSON.parse(storedItems) : [];
  });
  const [dataSanPham, setDataSanPham] = useState([]);
  const [khachHang, setKhachhang] = useState([]);
  const [tongTien, setTongTien] = useState([]);
  const [selectedTenKhachHang, setSelectedTenKhachHang] = useState(false);

  const [dataDaThemSP, setDaThemSP] = useState([]);
  const [selectedSanPham, setSelectedSanPham] = useState(null);
  const [taoHoaDon, setTaoHoaDon] = useState({});
  const [formData, setFormData] = useState({
    tenNguoiNhan: "",
    maNguoiDung: "",
    diaChi: "",
    sdt: "",
  });
  const [formSP, setFormSP] = useState({
    trong: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "maNguoiDung" && value === "KhachNgoai") {
      // Nếu chọn option "Khách ngoài", đặt giá trị của maNguoiDung bằng null
      setFormData({
        ...formData,
        [name]: null,
      });
    } else {
      // Ngược lại, giữ nguyên giá trị của maNguoiDung
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const [editFormData, setEditFormData] = useState(null); // Data for editing

  const newTabIndex = useRef(1);
  const handleSelectSanPham = (values) => {
    setSelectedSanPham("");
  };
  const handleSelectTenKhachHang = (values) => {
    setSelectedTenKhachHang(values);
  };
  const loadSanPham = async () => {
    try {
      const response = await getAllTaiQuay();
      setDataSanPham(response.data.content);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const loadKhachHang = async () => {
    try {
      const response = await getAllKhachHang();
      setKhachhang(response.data);
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
      loadSanPham();
      message.success("Thêm thành công");
      return;
    } catch (error) {
      console.log("Lỗi ", error);
      message.error(error.response?.data?.message || "Error adding to cart");
    }
  };
  const handleThanhToan = async (maHoaDon) => {
    try {
      // const maHoaDon = items.find((item) => item.key === maHoaDon)?.maHoaDon;
      await thanhToanHoaDon(maHoaDon, formData);
      console.log(maHoaDon);
      message.success("Thanh toán thành công");
      return;
    } catch (error) {
      console.log("Lỗi ", error);
    }
  };

  useEffect(() => {
    loadKhachHang();
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
    event,
    maHoaDonCT,
    maHoaDon,
    maxQuantity
  ) => {
    const newQuantity = event.target.value; // Ensure it's parsed as an integer

    if (maxQuantity === 0) {
      // You can choose to show an error message or handle it in a way suitable for your application
      console.error("Quantity exceeds the maximum limit");
      message.error("Số lượng vượt giới hạn");
      return;
    }
    if (newQuantity > 0) {
      try {
        await updateSoLuongTaiQuay(maHoaDonCT, newQuantity, maHoaDon);

        loadSanPham();
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
    }
  };

  // const handleQuantityChange = async (
  //   event,
  //   maHoaDonCT,
  //   maHoaDon,
  //   maxQuantity,
  //   action
  // ) => {
  //   let newQuantity;

  //   if (action === "increment") {
  //     newQuantity++;
  //   } else if (action === "decrement") {
  //     newQuantity--;
  //   } else {
  //     newQuantity = parseInt(event.target.value, 10);
  //   }

  //   if (maxQuantity + 1 === 0 || newQuantity < 1) {
  //     // Handle error or show a message
  //     console.error("Quantity exceeds the maximum limit");
  //     message.error("Số lượng vượt giới hạn");
  //     return;
  //   }

  //   if (maxQuantity > 1) {
  //     try {
  //       await updateSoLuongTaiQuay(maHoaDonCT, newQuantity, maHoaDon);

  //       loadSanPham();
  //       loadDaThemSanPham(maHoaDon);
  //     } catch (error) {
  //       console.error("Failed to update quantity:", error);
  //       message.error(error.response.data.message);
  //     }

  //     setDaThemSP((prevData) =>
  //       prevData.map((item) =>
  //         item.maHoaDonCT === maHoaDonCT
  //           ? { ...item, soLuong: newQuantity }
  //           : item
  //       )
  //     );
  //   }
  // };

  const xoaSanPhamCT = (ma, maHoaDon) => {
    Swal.fire({
      title: "Bạn có chắc không?",
      text: "Bạn có muốn xóa sản phẩm không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vâng, tôi muốn!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Xóa!",
            text: "Bạn đã xóa thành công.",
            icon: "success",
          });
          const response = await xoaSanPhamTaiQuay(ma);
          console.log(response);
          loadSanPham();
          loadDaThemSanPham(maHoaDon);
        } catch (error) {
          message.error(error.response.data.message);
        }
      }
    });
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
        <>
          <Input
            min={1}
            type="number"
            max={record.soLuongTon === 0 ? record.soLuong : "disabled"}
            value={record.soLuong}
            onChange={(e) =>
              handleQuantityChange(
                e,
                record.maHoaDonCT,
                record.maHoaDon,
                record.soLuongTon
              )
            }
          />
        </>
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
          <Button
            onClick={() => xoaSanPhamCT(record.maHoaDonCT, record.maHoaDon)}
          >
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
                <div>
                  <div className="border rounded-md p-4">
                    <div className="mb-4">
                      <label
                        className="block text-sm font-bold mb-2"
                        htmlFor="nguoiBan"
                      >
                        Người bán
                      </label>
                      <input
                        className="border rounded w-3/4 p-2"
                        id="nguoiBan"
                        type="text"
                        value={formData.tenNguoiNhan}
                        readOnly
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-bold mb-2"
                        htmlFor="nguoiBan"
                      >
                        Hóa đơn
                      </label>
                      <input
                        className="border rounded w-3/4 p-2"
                        type="text"
                        value={pane.maHoaDon}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-bold mb-2"
                        htmlFor="khachHang"
                      >
                        Khách hàng
                      </label>
                      <select
                        className="border rounded w-full p-2"
                        id="khachHang"
                        name="maNguoiDung"
                        onChange={handleChange}
                        // value={formData.maNguoiDung || "KhachNgoai"}
                      >
                        <option value="KhachNgoai">Khách ngoài</option>
                        {khachHang.map((item) => (
                          <option
                            key={item.maNguoiDung}
                            value={item.maNguoiDung}
                          >
                            {item.tenKhachHang}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-bold mb-2"
                        htmlFor="nguoiBan"
                      >
                        Địa chỉ
                      </label>
                      <input
                        name="diaChi"
                        className="border rounded w-3/4 p-2"
                        type="text"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-bold mb-2"
                        htmlFor="nguoiBan"
                      >
                        Sdt
                      </label>
                      <input
                        name="sdt"
                        className="border rounded w-3/4 p-2"
                        type="text"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-sm font-bold mb-2"
                        htmlFor="nguoiBan"
                      >
                        Phương thức thanh toán
                      </label>
                      <select
                        className="border rounded w-full p-2"
                        id="khachHang"
                        name="maNguoiDung"
                        onChange={handleChange}
                      >
                        <option value="KhachNgoai">Tiền mặt</option>
                        <option value="KhachNgoai">Chuyển khoản</option>
                      </select>
                    </div>
                  </div>
                  <div className="border p-2 rounded-md">
                    <button onClick={() => handleThanhToan(pane.maHoaDon)}>
                      Thanh toán
                    </button>
                  </div>
                </div>
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
                    value={formSP.trong}
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
