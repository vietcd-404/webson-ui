import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
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
} from "../../../services/BanHangTaiQuayService";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../pages/customer/Account/AuthProvider";
import Swal from "sweetalert2";
import { FaSearch } from "react-icons/fa";
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
  const [searchText, setSearchText] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [filteredData, setFilteredData] = useState(dataSanPham);

  // const handleSearch = (value) => {
  //   setSearchText(value);
  //   // Your search logic here to filter the data based on the input value
  //   const filteredResults = dataSanPham.filter((item) =>
  //     item.tenSanPham.toLowerCase().includes(value.toLowerCase())
  //   );
  //   setFilteredData(filteredResults);
  // };
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const filtered = dataSanPham.filter((item) =>
      item.tenSanPham.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchText]);
  const [selectedSanPham, setSelectedSanPham] = useState(null);
  const [taoHoaDon, setTaoHoaDon] = useState({});
  const [isChecked, setIsChecked] = useState(false);

  const [formData, setFormData] = useState({
    tenNguoiNhan: "",
    maNguoiDung: "",
    diaChi: "",
    sdt: "",
    phuongThucThanhToan: "MONEY",
    tinh: "",
    huyen: "",
    xa: "",
    thanhToan: 1,
    trong: "",
  });
  const [formSP, setFormSP] = useState({
    trong: "",
  });

  function validatePhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      return "Số điện thoại không được để trống";
    }

    const phoneNumberPattern = /^\d{10}$/;
    if (!phoneNumberPattern.test(phoneNumber)) {
      return "Số điện thoại không hợp lệ";
    }
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const selectedAddress = khachHang.find(
      (item) => item.maNguoiDung === value
    );
    console.log(selectedAddress);
    if (selectedAddress) {
      setFormData({
        ...formData,
        sdt: selectedAddress.sdt,
      });
    }

    if (name === "maNguoiDung" && value === "KhachNgoai") {
      setFormData({
        ...formData,
        [name]: null,
      });
    } else {
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
      setDataSanPham(response.data);
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
  const [showProductList, setShowProductList] = useState(false);

  const handleInputClick = () => {
    // Show the product list when the input field is clicked
    setShowProductList(true);
  };
  const handleAddToCart = async (maSanPhamCT, maHoaDon) => {
    try {
      await themSanPhamTaiQuay(maSanPhamCT, 1, maHoaDon);

      // Swal.fire({
      //   title: "Thành công!",
      //   text: "Thêm vào giỏ hàng thành công",
      //   icon: "success",
      // });
      setShowProductList(false);
      setSelectedValue(maSanPhamCT);
      loadDaThemSanPham(maHoaDon);
      loadSanPham();
      setSearchText("");
      message.success("Thêm thành công");
      return;
    } catch (error) {
      console.log("Lỗi ", error);
      message.error(error.response?.data?.message || "Error adding to cart");
    }
  };
  const handleThanhToan = async (maHoaDon) => {
    if (dataDaThemSP.length === 0) {
      message.error("Không có sản phẩm nào nên không thể thanh toán");
      return;
    }
    const phoneNumberError = validatePhoneNumber(formData.sdt);
    if (phoneNumberError) {
      message.error(phoneNumberError);
      return;
    }
    try {
      await thanhToanHoaDon(maHoaDon, formData);
      message.success("Thanh toán thành công");
      remove(activeKey);
      return;
    } catch (error) {
      console.log("Lỗi ", error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data &&
        error.response.data.message !== null
      ) {
        message.error(error.response.data.message);
      }
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
    record.soLuong = value;
    record.thanhTien = value * record.giaBan;

    console.log("changed", value);
  };
  const onChange = (key) => {
    setActiveKey(key);
  };
  const choThanhToan = (e) => {
    const checked = e.target.checked;
    // setIsChecked(checked);

    setFormData({
      ...formData,
      thanhToan: checked ? 0 : 1,
    });
    console.log(`checked = ${isChecked}`);
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

  const handleQuantityChange = async (action, record) => {
    loadDaThemSanPham(record.maHoaDon);
    try {
      let newQuantity;

      if (action === "increment") {
        console.log(record.soLuongTon);
        if (record.soLuong < record.soLuongTon) {
          newQuantity = record.soLuong + 1;
          loadDaThemSanPham(record.maHoaDon);
        } else {
          message.error("Đạt giới hạn số lượng tồn");
          return;
        }
      } else if (action === "decrement") {
        if (record.soLuong === 1) {
          message.error("Có tối thiều có 1 sản phẩm");
          return;
        }
        newQuantity = record.soLuong - 1;
        loadDaThemSanPham(record.maHoaDon);
      }

      // if (newQuantity > 0 && newQuantity <= record.soLuongTon) {
      // Make an API call to update the quantity on the server
      await updateSoLuongTaiQuay(
        record.maHoaDonCT,
        newQuantity,
        record.maHoaDon
      );
      loadSanPham();
      loadDaThemSanPham(record.maHoaDon);

      // Update the state to trigger a re-render
      setDaThemSP((prevData) =>
        prevData.map((item) =>
          item.maHoaDonCT === record.maHoaDonCT
            ? { ...item, soLuong: newQuantity }
            : item
        )
      );

      // Log the changed value for demonstration purposes
      console.log("changed", newQuantity);
      // } else {
      //   message.error("Số lượng vượt giới hạn");
      // }
    } catch (error) {
      console.error("Failed to update quantity:", error);
      message.error(error.response?.data?.message || "Error updating quantity");
    }
  };

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
        <div className="flex justify-between">
          <MinusCircleOutlined
            onClick={() => handleQuantityChange("decrement", record)}
          />
          <p>{record.soLuong}</p>
          <PlusCircleOutlined
            onClick={() => handleQuantityChange("increment", record)}
          />
        </div>
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
                        htmlFor="nguoiBan"
                      >
                        Tổng tiền
                      </label>
                      <input
                        // name="tinh"
                        className="border rounded-l-md w-3/4 p-[6.5px]"
                        type="text"
                        value={tongTien}
                        // onChange={handleChange}
                      />
                      <span className="border rounded-r-md p-2 bg-gray-300">
                        VND
                      </span>
                    </div>
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
                        Số điện thoại
                      </label>
                      <input
                        name="sdt"
                        className="border rounded w-3/4 p-2"
                        type="text"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <Checkbox onChange={choThanhToan}>
                        Chờ thanh toán
                      </Checkbox>
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
                        name="phuongThucThanhToan"
                        onChange={handleChange}
                      >
                        <option value="MONEY" selected>
                          Tiền mặt
                        </option>
                        <option value="ELECTRONIC_WALLET">Chuyển khoản</option>
                      </select>
                    </div>
                  </div>
                  <div className=" p-2 rounded-md mt-2">
                    <Button
                      style={{ color: "white", backgroundColor: "red" }}
                      onClick={() => handleThanhToan(pane.maHoaDon)}
                    >
                      Thanh toán
                    </Button>
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
                {/* <Form.Item name="tenLoai" label="Tìm kiếm sản phẩm"> */}
                {/* <Select
                    showSearch
                    size="large"
                    placeholder="Tìm kiếm sản phẩm"
                    onSelect={(value, option) =>
                      handleAddToCart(value, pane.maHoaDon)
                    }
                    value={selectedValue}
                    onSearch={handleSearch}
                    style={{ width: "90%" }}
                    filterOption={false}
                  >
                    {filteredData.map((item) => (
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
                  </Select> */}
                <div className="relative  w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white center gap-2 justify-center px-6 rounded-xl">
                  <input
                    className="border rounded w-full p-2"
                    // className=" h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
                    type="text"
                    onChange={handleSearch}
                    onClick={handleInputClick}
                    // value={searchText}
                    placeholder="Tìm kiếm sản phẩm tại đây"
                  />
                  {/* <FaSearch className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2" /> */}
                  {searchText && (
                    <div
                      className={`w-[90%]  rounded-md  mt-1 lg:mt-0 lg:left-[30px] lg:right-0 absolute z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer `}
                    >
                      {searchText &&
                        filteredData.map((item) => (
                          <div
                            onClick={() =>
                              handleAddToCart(item.maSanPhamCT, pane.maHoaDon)
                            }
                            key={item.maSanPhamCT}
                            className="max-w-[600px] h-24 bg-gray-100 mb-2 gap-3 cursor-pointer hover:bg-gray-200 p-3"
                          >
                            {/* <img
                              className="w-[20%] h-[80%] object-cover"
                              src={`data:image/png;base64,${item.img}`}
                              alt=""
                            /> */}
                            <div className="flex justify-between ">
                              <div className="font-bold text-sm">
                                {item.tenSanPham}-[{item.tenMau}]
                              </div>
                              <div className="flex space-x-2">
                                <del>{item.giaBan} đ</del>
                              </div>
                              <div className="flex space-x-2">
                                <div>
                                  {item.giaBan *
                                    ((100 - item.phanTramGiam) / 100)}{" "}
                                  đ
                                </div>
                              </div>
                            </div>
                            <div>{item.tenThuongHieu}</div>
                            <div>
                              <i className="text-gray-500">Số lượng: </i>
                              {item.soLuongTon}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                {/* </Form.Item> */}
                <div className="border rounded-md">
                  <Table
                    columns={columns}
                    dataSource={dataDaThemSP}
                    pagination={false}
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
