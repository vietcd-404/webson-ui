import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Button, Card, Col, Form, Input, Row, Select } from "antd";
import {
  ExclamationCircleFilled,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Modal, Space, Table } from "antd";
import { ToastContainer, toast } from "react-toastify";
import {
  capNhapThanhToanHoaDonByAdmin,
  capNhapTrangThaiHoaDonByAdmin,
  getAllOrderByAdmin,
  huytHoaDonByAdmin,
  inforUserHoaDon,
  productInforHoaDon,
  searchHoaDon,
  themSanPhamHDByAdmin,
  updateSoLuongByAdmin,
  updatetHoaDonByAdmin,
  xoaSanPhamHdByAdmin,
} from "../../../services/HoaDonService";

import WebSocketService from "../../../services/WebSocketService";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { format } from "date-fns";
import { getAllLocByAdmin } from "../../../services/SanPhamService";
import { tab } from "@testing-library/user-event/dist/tab";
import XuatHoaDon from "../XuatHoaDon";
const { Option } = Select;

const ChoXacNhan = () => {
  const [totalPage, setTotalPage] = useState(1);
  const [totalPageProduct, setTotalPageProduct] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [tableDataProduct, setTableDataProduct] = useState([]);
  const [tongTien, setTongTien] = useState(0);
  const [giamGia, setGiamGia] = useState(0);
  const [formUpdate] = Form.useForm();
  const [editFormData, setEditFormData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [messageValue, setMessageValue] = useState(null);

  // Search
  const [searchType, setSearchType] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [form] = Form.useForm();

  // Update sp
  const [searchQuery, setSearchQuery] = useState("");
  const [dataSanPham, setDataSanPham] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const [maHD, setMaHD] = useState("");
  const [updateProductSL, setUpdateProductSL] = useState([]);

  // Xuất hóa đơn
  const [isXuatHoaDonVisible, setIsXuatHoaDonVisible] = useState(false);

  // Hiển thị thông tin chi tiết order
  const showEditModal = async (record) => {
    setMaHD(null);
    const response = await inforUserHoaDon(record.maHoaDon);
    setEditFormData(response.data[0]);
    setMaHD(response.data[0].maHoaDon);
    formUpdate.setFieldsValue({
      maHoaDon: response.data[0].maHoaDon,
      tenNguoiDung: response.data[0].tenNguoiDung,
      tenNguoiNhan: response.data[0].tenNguoiNhan,
      tenNhanVien: response.data[0].tenNhanVien,
      email: response.data[0].email,
      sdt: response.data[0].sdt,
      diaChi: response.data[0].diaChi,
      diaChiChiTiet: response.data[0].diaChiChiTiet,
      tinh: response.data[0].tinh,
      huyen: response.data[0].huyen,
      xa: response.data[0].xa,
      tenPhuongThucThanhToan: response.data[0].tenPhuongThucThanhToan,
    });
    loadProductInOrder(response.data[0].maHoaDon);
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    formUpdate.resetFields();
    setIsEditModalOpen(false);
    fetchData();
  };

  // Load thông tin sản phẩm ở trên oder
  const loadProductInOrder = async (maHoaDon) => {
    try {
      const response1 = await productInforHoaDon(maHoaDon);
      setTableDataProduct(response1.data);
      setTotalPageProduct(response1.totalPage);
      setTongTien(response1.data[0].tongTien);
      if (response1.data[0].tienGiam == null) {
        setGiamGia(0);
      } else {
        setGiamGia(response1.data[0].tienGiam);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  // Load sản phẩm tìm kiếm order
  const loadSanPham = async () => {
    try {
      const response = await getAllLocByAdmin();
      setDataSanPham(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  useEffect(() => {
    const filtered = dataSanPham.filter((item) =>
      item.tenSanPham.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

  // Load hóa đơn

  const loadTable = async () => {
    try {
      const response = await getAllOrderByAdmin(5);
      setTotalPage(response.totalPage);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await getAllOrderByAdmin(5);

      if (
        response.data &&
        response.data.content &&
        Array.isArray(response.data.content)
      ) {
        const modifiedData = response.data.content.map((item, index) => {
          return { ...item, index: index + 1 };
        });
        setTableData(modifiedData);
      } else {
        console.error("Dữ liệu trả về không phải là một mảng.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  useEffect(() => {
    loadTable();
    fetchData();
    loadSanPham();
  }, [messageValue]);

  // Chuyển đổi trạng thái
  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Chờ xác nhận";
      case 1:
        return "Đã xác nhận";
      case 2:
        return "Đang giao";
      case 3:
        return "Hoàn thành";
      case 4:
        return "Đã hủy";
      case 5:
        return "Bán tại quầy";
      default:
        return "Chờ xác nhận";
    }
  };

  const handleUpdateStatus = (trangThai, maHD) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn cập nhập trạng thái đơn hàng không?",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const response = await capNhapTrangThaiHoaDonByAdmin(trangThai, maHD);
          if (response.status === 200) {
            toast.success("Cập nhật trạng thái đơn hàng thành công!");
            fetchData();
            return;
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật: ", error);
          toast.error("Cập nhật thất bại.");
        }
      },

      onCancel: () => {},
    });
  };

  // Searh Hóa Đơn
  const handleSearchProduct = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await searchHoaDon(searchType, searchValue, 0);
      if (response.data.length === 0) {
        setTableData(response.data);
      } else {
        if (Array.isArray(response.data)) {
          const modifiedData = response.data.map((item, index) => {
            return { ...item, index: index + 1 };
          });
          setTableData(modifiedData);
        } else {
          console.error("Dữ liệu trả về không phải là một mảng.");
        }
      }
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const handleClear = async () => {
    setSearchValue(null);
    fetchData();
  };

  // Cập nhập thanh toán
  const handleUpdatePaid = (thanhToan, maHD) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content:
        "Bạn có chắc muốn cập nhập trạng thái thanh toán cho đơn hàng không?",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const response = await capNhapThanhToanHoaDonByAdmin(thanhToan, maHD);
          if (response.status === 200) {
            toast.success("Cập nhật trạng thái đơn hàng thành công!");
            fetchData();
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật: ", error);
          toast.error("Cập nhật thất bại.");
        }
      },

      onCancel: () => {},
    });
  };

  // Cập nhập thông tin đơn hàng
  const handleUpdate = () => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content:
        "Bạn có chắc muốn cập nhập thông tin người dùng đơn hàng này không?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const values = await formUpdate.validateFields();
          const response = await updatetHoaDonByAdmin(
            editFormData.maHoaDon,
            values
          );
          if (response.status === 200) {
            console.log(response);
            setIsEditModalOpen(false);
            toast.success("Cập nhật thành công!");
            fetchData();
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật loại: ", error);
          toast.error("Cập nhật thất bại.");
          setIsEditModalOpen(true);
        }
      },

      onCancel: () => {},
    });
  };

  // Update sản phẩm

  function handleThemSanPham(maSPCT) {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn thêm sản phẩm này vào dơn hàng?",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const response = await themSanPhamHDByAdmin(maSPCT, 1, maHD);
          if (response.status === 200) {
            toast.success(" Thêm sản phẩm thành công!");
            loadProductInOrder(maHD);
            setSearchQuery("");
            loadSanPham();
          }
        } catch (error) {
          console.error("Lỗi khi thêm: ", error);
          if (
            error.response &&
            error.response.data &&
            error.response.data.message ===
              "Số lượng cập nhật vượt quá số lượng tồn kho"
          ) {
            toast.error("Số lượng cập nhật vượt quá số lượng tồn kho");
          } else if (
            error.response &&
            error.response.data &&
            error.response.data.message ===
              "Hóa đơn đã thanh toán không thể cập nhập"
          ) {
            toast.error("Hóa đơn đã thanh toán không thể cập nhập");
          } else {
            toast.error("Thêm thất bại. Lỗi: " + error.message);
          }
        }
      },
      onCancel: () => {
        fetchData();
      },
    });
  }

  const handleXoaSanPham = (maHDCT) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn xóa sản phẩm này khỏi dơn hàng?",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        if (tableDataProduct.length === 1) {
          toast.error("Không thể để trống hóa đơn!");
        } else {
          try {
            const response = await xoaSanPhamHdByAdmin(maHDCT);
            if (response.status === 200) {
              toast.success(" Xóa sản phẩm thành công!");
              loadProductInOrder(maHD);
              fetchData();
              loadSanPham();
            }
          } catch (error) {
            console.error("Lỗi khi xóa: ", error);
            if (
              error.response &&
              error.response.data &&
              error.response.data.message === "Không đạt điều kiện voucher!"
            ) {
              toast.error("Không đạt điều kiện voucher!");
            }
            if (
              error.response &&
              error.response.data &&
              error.response.data.message ===
                "Hóa đơn đã thanh toán không thể cập nhập"
            ) {
              toast.error("Hóa đơn đã thanh toán không thể cập nhập");
            }
          }
        }
      },
      onCancel: () => {},
    });
  };

  const handleQuantityChange = (e, key) => {
    const { value } = e.target;
    const index = tableDataProduct.findIndex(
      (item) => item.maSanPhamCT === key
    );

    if (index !== -1) {
      const updatedData = [...tableDataProduct];
      updatedData[index] = {
        ...updatedData[index],
        soLuong: parseInt(value, 10),
      };
      setTableDataProduct(updatedData);
      setUpdateProductSL(updatedData);
    }
    console.log(updateProductSL);
  };

  const updateProductQuantity = async () => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn cập nhập số lượng sản phẩm này vào đơn hàng?",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        let hasError = false;
        let count = 0;
        try {
          for (const product of updateProductSL) {
            try {
              const response = await updateSoLuongByAdmin(
                product.maHoaDonCT,
                product.soLuong,
                maHD
              );
              if (response.status === 200) {
                count++;
              }
            } catch (error) {
              console.error("Lỗi khi cập nhật số lượng sản phẩm: ", error);
              if (
                error.response &&
                error.response.status === 400 &&
                error.response.data &&
                error.response.data.message !== null
              ) {
                toast.error(error.response.data.message);
              } else {
                toast.error("Đã xảy ra lỗi khi cập nhật số lượng sản phẩm.");
              }
              hasError = true;
              break;
            }
          }
          if (hasError) {
            return;
          }
          if (count !== 0) {
            loadProductInOrder(maHD);
            loadSanPham();
            toast.success("Cập nhập thành công");
          }
        } catch (err) {
          console.error(
            "Lỗi khi duyệt danh sách cập nhật số lượng sản phẩm: ",
            err
          );
          toast.error("Đã xảy ra lỗi khi cập nhật số lượng sản phẩm.");
        }
      },
      onCancel: () => {},
    });
  };

  const socket = new SockJS("http://localhost:8000/api/anh/ws");
  const stompClient = Stomp.over(socket);

  const columnProduct = [
    {
      title: "Ảnh",
      dataIndex: "anh",
      key: "anh",
      render: (imageSrc, record) => (
        <img
          width="30%"
          src={`data:image/png;base64,${record.anh}`}
          alt={record.tenSanPham}
          className="img-fluid rounded"
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
      width: "150",
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
      render: (soLuong, record) => (
        <input
          type="number"
          value={soLuong}
          name="soLuong"
          className="border-1"
          onChange={(e) => handleQuantityChange(e, record.maSanPhamCT)}
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "donGia",
      key: "thanhTien",
      render: (donGia, record) => {
        return <span>{donGia.toLocaleString("en-US")} VNĐ</span>;
      },
      width: 140,
    },
    {
      title: "Thành Tiền",
      dataIndex: "donGia",
      key: "thanhTien",
      render: (donGia, record) => {
        const thanhTien = donGia * record.soLuong;
        return <span>{thanhTien.toLocaleString("en-US")} VNĐ</span>;
      },
      width: 140,
    },
    {
      title: "Chức năng",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleXoaSanPham(record.maHoaDonCT)}>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "stt",
    },
    {
      title: "Mã Hóa Đơn",
      dataIndex: "maHoaDon",
      key: "x",
      render: (maHoaDon) => `HD0000${maHoaDon}`,
    },

    {
      title: "Khách Hàng",
      dataIndex: "tenNguoiDung",
      key: "x",
    },

    {
      title: "Ngày Đặt",
      dataIndex: "ngayTao",
      key: "ngayTao",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "tongTien",
      key: "tongTien",
      render: (text) => parseFloat(text).toLocaleString("en-US"),
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      width: 130,
      key: "trangThai",
      render: (status) => {
        let statusStyle = {};
        let statusText = getStatusText(status);

        switch (status) {
          case 0:
            statusStyle = {
              color: "#FFD700",
              border: "1px solid #FFD700",
              borderRadius: "5px",
              padding: "2px 6px",
            };
            break;
          case 1:
            statusStyle = {
              color: "orange",
              border: "1px solid orange",
              borderRadius: "5px",
              padding: "2px 6px",
            };
            break;
          case 2:
            statusStyle = {
              color: "blue",
              border: "1px solid blue",
              borderRadius: "5px",
              padding: "2px 6px",
            };
            break;
          case 3:
            statusStyle = {
              color: "green",
              border: "1px solid green",
              borderRadius: "5px",
              padding: "2px 6px",
            };
            break;
          case 4:
            statusStyle = {
              color: "red",
              border: "1px solid red",
              borderRadius: "5px",
              padding: "2px 6px",
            };
            break;
          default:
            statusStyle = {
              color: "green",
              border: "1px solid green",
              borderRadius: "5px",
              padding: "2px 6px",
            };
        }

        return <span style={statusStyle}>{statusText}</span>;
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "thanhToan",
      key: "thanhToan",
      width: 190,
      render: (thanhToan) => {
        let style = {};
        let text = "";

        if (thanhToan === 1) {
          style = {
            color: "green",
            border: "1px solid green",
            borderRadius: "5px",
            padding: "2px 6px",
          };
          text = "Đã thanh toán";
        } else {
          style = {
            color: "red",
            border: "1px solid red",
            borderRadius: "5px",
            padding: "2px 6px",
          };
          text = "Chờ thanh toán";
        }

        return (
          <span className="ml-5 mr-5" style={style}>
            {text}
          </span>
        );
      },
    },
    {
      title: "Ngày Thanh Toán",
      dataIndex: "ngayThanhToan",
      key: "ngayThanhToan",
      width: 110,
    },
    {
      title: "Thao Tác",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {record.trangThai === 5 && record.thanhToan === 0 && (
            <Button onClick={() => handleUpdatePaid(1, record.maHoaDon)}>
              Đã Thanh Toán
            </Button>
          )}
        </Space>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showEditModal(record)}>
            <EyeOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const isPrintOke = () => {
    setIsXuatHoaDonVisible(true);
  };

  const isPrintCancel = () => {
    setIsXuatHoaDonVisible(false);
  };

  const notify = () => {
    toast.success("Đã nhận được đơn hàng mới!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div>
      <WebSocketService setValue={setMessageValue} connetTo="orderStatus" />

      <ToastContainer />
      <Modal
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        onOk={handleUpdate}
        width={900}
      >
        <p className="text-bold mb-2" style={{ fontSize: "20px" }}>
          Thông tin nhận hàng
        </p>
        <Form
          form={formUpdate}
          name="editForm"
          initialValues={editFormData}
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Khách hàng"
                name="tenNguoiDung"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Tên nhân viên"
                name="tenNhanVien"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                rules={[
                  { required: true, message: "Tên nhân viên không để trống!" },
                ]}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Hình thức thanh toán"
                name="tenPhuongThucThanhToan"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input disabled className="border-none" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                rules={[
                  { required: true, message: "Email không để trống!" },
                  {
                    type: "email",
                    message: "Email không hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="abc@gmail.com" />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="sdt"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                rules={[
                  { required: true, message: "Số điện thoại không để trống!" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" onClick={handleUpdate}>
            Cập Nhập
          </Button>
        </Form>
        <p className="text-bold mt-2 mb-2" style={{ fontSize: "20px" }}>
          Thông tin sản phẩm
        </p>
        <div
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <p className="padding-right mt-2 mb-4">
            <input
              className="h-full w-full border-2 border-black outline-none px-3 py-2 rounded-md placeholder-[#C4C4C4] text-sm"
              type="text"
              onChange={handleSearchProduct}
              value={searchQuery}
              placeholder="Tìm kiếm sản phẩm tại đây"
            />
            {searchQuery && (
              <div
                className={`w-full mt-1 ml-3 lg:mt-0 lg:left-0 lg:right-0 absolute z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer`}
              >
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {searchQuery &&
                    filteredProducts.map((item) => (
                      <div
                        key={item.maSanPhamCT}
                        className="max-w-[600px] h-28 bg-gray-100 mb-2 flex items-center gap-3 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleThemSanPham(item.maSanPhamCT)}
                      >
                        <img
                          className="w-[20%] h-[80%] object-cover"
                          src={`data:image/png;base64,${item.img}`}
                          alt=""
                        />
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold text-lg">
                            {"[" + item.tenMau + "] - " + item.tenSanPham}
                          </p>
                          <p className="text-xs">{item.tenThuongHieu}</p>
                          <p className="text-xs">Số lượng: {item.soLuongTon}</p>
                          <p className="text-sm">
                            {item.phanTramGiam !== 0 ? (
                              <>
                                Giá bán:{" "}
                                <span className="text-primeColor font-semibold">
                                  {(
                                    item.giaBan *
                                    (1 - item.phanTramGiam / 100)
                                  ).toLocaleString("en-US")}{" "}
                                  VNĐ
                                </span>{" "}
                                <span className="text-sm line-through text-gray-500">
                                  {item.giaBan.toLocaleString("en-US")} VNĐ{" "}
                                  {/* Giá gốc */}
                                </span>
                              </>
                            ) : (
                              <>
                                Giá bán:{" "}
                                <span className="text-primeColor font-semibold">
                                  {item.giaBan.toLocaleString("en-US")} VNĐ{" "}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </p>
          <Table
            columns={columnProduct}
            dataSource={tableDataProduct}
            pagination={{
              pageSize: 5,
              total: totalPageProduct * 5, // Assuming totalPage is the total number of pages
              current: totalPageProduct,
            }}
          />
          <p className="padding-right mt-2">
            <Button
              style={{ color: "white", backgroundColor: "green" }}
              onClick={updateProductQuantity}
            >
              Cập nhập sản phẩm
            </Button>
          </p>
          <p className="padding-right mt-2">
            Tổng tiền trước khi giảm:{" "}
            <span className="text-lg text-bold">
              {(tongTien + giamGia).toLocaleString("en-US")} VNĐ
            </span>{" "}
          </p>
          <p className="padding-right">
            Voucher:{" "}
            <span className="text-lg text-bold">
              -{giamGia.toLocaleString("en-US")} VNĐ
            </span>{" "}
          </p>
          <p className="padding-right">
            Tổng tiền sau khi giảm:{" "}
            <span className="text-lg text-bold">
              {tongTien.toLocaleString("en-US")} VNĐ
            </span>{" "}
          </p>
        </div>
        <div className="row mt-3 mb-3">
          <div className="col-10"></div>
          <div className="col-1">
            <Button
              style={{ color: "white", backgroundColor: "red" }}
              onClick={() => isPrintOke()}
            >
              Xuất hóa đơn
            </Button>
          </div>
        </div>

        <Modal
          open={isXuatHoaDonVisible}
          onCancel={isPrintCancel}
          onOk={isPrintCancel}
          width={1000}
        >
          <XuatHoaDon
            editFormData={editFormData}
            tableDataProduct={tableDataProduct}
          />
        </Modal>
      </Modal>

      <Card title="Lọc hóa đơn" bordered={true} className="mb-2">
        <form className="mb-2">
          <Select
            style={{ width: 200, marginRight: 8, marginBottom: 10 }}
            placeholder="Chọn giá trị"
            onChange={(value) => setSearchType(value)}
          >
            <Option value="maHoaDon">Mã HĐ</Option>
            <Option value="tenNguoiDung">Tên Khách Hàng</Option>
            <Option value="ngayTao">Ngày Đặt Hàng</Option>
          </Select>
          {searchType === "maHoaDon" ? (
            <Input
              style={{ width: 200, marginRight: 8, marginBottom: 10 }}
              type="number"
              onChange={handleSearchInputChange}
              value={searchValue}
              placeholder="Nhập Mã HĐ"
            />
          ) : searchType === "ngayTao" ? (
            <Input
              style={{ width: 200, marginRight: 8, marginBottom: 10 }}
              type="date"
              format="yyyy-MM-dd"
              onChange={handleSearchInputChange}
              value={searchValue}
              placeholder="Chọn Ngày Đặt Hàng"
            />
          ) : (
            <Input
              style={{ width: 200, marginRight: 8, marginBottom: 10 }}
              onChange={handleSearchInputChange}
              value={searchValue}
              placeholder="Nhập thông tin tìm kiếm"
            />
          )}
          <Button
            style={{ color: "white", backgroundColor: "red", marginRight: 10 }}
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
          <Button onClick={handleClear}>Clear</Button>
        </form>
      </Card>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{
            pageSize: 7,
            total: totalPage * 5,
            current: totalPage,
          }}
          // style={{ maxHeight: "500px", overflowY: "auto" }}
        />
      )}
    </div>
  );
};

export default ChoXacNhan;
