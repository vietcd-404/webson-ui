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
import {
  hienHuyen,
  hienTinh,
  hienXa,
} from "../../../services/GiaoHangNhanhService";
import axios from "axios";
import XuatHoaDon from "../XuatHoaDon";
const { Option } = Select;

const HoaDonDesign = (props) => {
  const { trangThaiHD } = props;
  const [totalPage, setTotalPage] = useState(1);
  const [totalPageProduct, setTotalPageProduct] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [tableDataProduct, setTableDataProduct] = useState([]);
  const [tongTien, setTongTien] = useState(0);
  const [giamGia, setGiamGia] = useState(0);
  const [phiShip, setPhiShip] = useState(0);
  const [formUpdate] = Form.useForm();
  const [editFormData, setEditFormData] = useState({
    maHoaDon: "",
    tenNguoiDung: "",
    tenNguoiNhan: "",
    email: "",
    sdt: "",
    diaChi: "",
    tinh: "",
    huyen: "",
    xa: "",
    phiShip: "",
    diaChiChiTiet: "",
    tongTien: "",
    tenNhanVien: "",
    trangThai: "",
    tienGiam: "",
    ngayTao: "",
    thanhToan: "",
  });
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

  // Dia chi
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Xuất hóa đơn
  const [isXuatHoaDonVisible, setIsXuatHoaDonVisible] = useState(false);

  // Hiển thị thông tin chi tiết order
  const showEditModal = async (record) => {
    setMaHD(null);

    const response = await inforUserHoaDon(record.maHoaDon);
    setEditFormData((prevFormData) => ({
      ...prevFormData,
      maHoaDon: response.data[0].maHoaDon,
      tenNguoiDung: response.data[0].tenNguoiDung,
      tenNguoiNhan: response.data[0].tenNguoiNhan,
      email: response.data[0].email,
      sdt: response.data[0].sdt,
      diaChi: response.data[0].diaChi,
      diaChiChiTiet: response.data[0].diaChiChiTiet,
      tinh: response.data[0].tinh,
      huyen: response.data[0].huyen,
      xa: response.data[0].xa,
      phiShip: response.data[0].phiShip,
      tongTien: response.data[0].tongTien,
      tenNhanVien: response.data[0].tenNguoiNhan,
      trangThai: response.data[0].trangThai,
      tienGiam: response.data[0].tienGiam,
      ngayTao: response.data[0].ngayTao,
      thanhToan: response.data[0].thanhToan,
    }));
    setMaHD(response.data[0].maHoaDon);
    formUpdate.setFieldsValue({
      maHoaDon: response.data[0].maHoaDon,
      tenNguoiDung: response.data[0].tenNguoiDung,
      tenNguoiNhan: response.data[0].tenNguoiNhan,
      email: response.data[0].email,
      sdt: response.data[0].sdt,
      diaChi: response.data[0].diaChi,
      diaChiChiTiet: response.data[0].diaChiChiTiet,
      tinh: response.data[0].tinh,
      huyen: response.data[0].huyen,
      xa: response.data[0].xa,
      tenPhuongThucThanhToan: response.data[0].tenPhuongThucThanhToan,
      phiShip: response.data[0].phiShip,
    });
    loadProductInOrder(response.data[0].maHoaDon);
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    formUpdate.resetFields();
    setIsEditModalOpen(false);
    setSearchQuery("");
    fetchData();
  };

  // Load thông tin sản phẩm ở trên oder
  const loadProductInOrder = async (maHoaDon) => {
    try {
      const response1 = await productInforHoaDon(maHoaDon);
      setTableDataProduct(response1.data);
      setTotalPageProduct(response1.totalPage);
      setTongTien(response1.data[0].tongTien);
      setPhiShip(response1.data[0].phiShip);
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
      const response = await getAllOrderByAdmin(trangThaiHD);
      setTotalPage(response.totalPage);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await getAllOrderByAdmin(trangThaiHD);

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
      if (searchQuery === null) {
        toast.error("Mời chọn giá trị mong muốn tìm kiếm!");
        return;
      }
      if (searchValue === null) {
        toast.error("Mời nhập giá trị mong muốn tìm kiếm!");
        return;
      }
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
          values.phiShip = phiShip;
          const response = await updatetHoaDonByAdmin(
            editFormData.maHoaDon,
            values
          );
          if (response.status === 200) {
            setIsEditModalOpen(false);
            toast.success("Cập nhật thành công!");
            fetchData();
          }
        } catch (error) {
          if (
            error.response &&
            error.response.status === 400 &&
            error.response.data &&
            error.response.data.message !== null
          ) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Cập nhật thất bại.");
            console.error("Lỗi khi cập nhật: ", error);
          }

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
          disabled={editFormData.thanhToan === 1}
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
          <Button
            onClick={() => handleXoaSanPham(record.maHoaDonCT)}
            disabled={editFormData.thanhToan === 1}
          >
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
              color: "#FFD700",
              border: "1px solid #FFD700",
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
          text = "Chưa thanh toán";
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
          {record.trangThai === 0 && (
            <Button onClick={() => handleUpdateStatus(1, record.maHoaDon)}>
              Xác nhận
            </Button>
          )}

          {record.trangThai === 0 && record.thanhToan === 0 && (
            <Button onClick={() => handleUpdateStatus(4, record.maHoaDon)}>
              Hủy
            </Button>
          )}
          {record.trangThai === 1 && (
            <Button onClick={() => handleUpdateStatus(2, record.maHoaDon)}>
              Xác nhận
            </Button>
          )}

          {record.trangThai === 1 && (
            <Button onClick={() => handleUpdateStatus(0, record.maHoaDon)}>
              Hủy
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

  ////-------------Load địa chỉ
  useEffect(() => {
    loadProvinces();
  }, []);

  //---------Detail địa chỉ hiện lên
  useEffect(() => {
    let foundProvinces =
      provinces.length > 0 &&
      provinces?.find((item) => item.ProvinceName === editFormData.tinh);
    setSelectedProvince(foundProvinces ? foundProvinces.ProvinceID : "");
  }, [provinces]);

  useEffect(() => {
    let foundProvinces =
      districts.length > 0 &&
      districts?.find((item) => item.DistrictName === editFormData.huyen);
    setSelectedDistrict(foundProvinces ? foundProvinces.DistrictID : "");
  }, [districts, wards]);

  useEffect(() => {
    let foundProvinces =
      wards.length > 0 &&
      wards?.find((item) => item.WardName === editFormData.xa);
    setSelectedWard(foundProvinces ? foundProvinces.WardCode : "");
  }, [wards]);
  //-------------------------------------

  const loadProvinces = async () => {
    try {
      const response = await hienTinh();
      setProvinces(response.data.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const handleProvinceChange = async (provinceId) => {
    setSelectedProvince(provinceId);
    setSelectedWard("");

    try {
      const response = await hienHuyen(provinceId);
      setDistricts(response.data.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const handleDistrictChange = async (districtId) => {
    setSelectedDistrict(districtId);
    setSelectedWard("");
    try {
      const response = await hienXa(districtId);
      setWards(response.data.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  const handleWardChange = (wardId) => {
    setSelectedWard(wardId);
  };

  // Thay doi thanh pho
  const handleProvinceChangeaa = (selectedValue) => {
    setEditFormData((prevFormData) => ({
      ...prevFormData,
      huyen: "",
      xa: "",
    }));
    formUpdate.setFieldValue("huyen", "");
    formUpdate.setFieldValue("xa", "");

    const selectedProvinceName = selectedValue;
    const selectedProvince = provinces.find(
      (province) => province.ProvinceName === selectedProvinceName
    );

    setSelectedProvince(selectedProvinceName);
    setEditFormData((prevFormData) => ({
      ...prevFormData,
      tinh: selectedProvince.ProvinceName,
    }));
    handleProvinceChange(selectedProvince.ProvinceID);
  };
  // Thay doi huyen
  const handleDistrictChangeaaa = (selectedValue) => {
    const selectedDistrictName = selectedValue;
    const selectedDistrict = districts.find(
      (district) => district.DistrictName === selectedDistrictName
    );
    setSelectedDistrict(selectedDistrictName);
    setEditFormData({
      ...editFormData,
      huyen: selectedDistrict.DistrictName,
    });

    handleDistrictChange(selectedDistrict.DistrictID);
  };

  // Thay doi xa

  const handleWardChangeaaa = (selectedValue) => {
    const selectedWardName = selectedValue;
    const selectedWard = wards.find(
      (wards) => wards.WardName === selectedWardName
    );
    setSelectedWard(selectedWardName);
    setEditFormData({
      ...editFormData,
      xa: selectedWard.WardName,
    });
    console.log(selectedWard.WardName);

    handleWardChange(selectedWard.WardCode);
  };

  const caculateFee = async () => {
    try {
      const response = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          service_id: null,
          service_type_id: 2,
          to_district_id: Number(selectedDistrict),
          to_ward_code: selectedWard,
          height: 50,
          length: 20,
          weight: 200,
          width: 20,
          insurance_value: 10000,
          cod_failed_amount: 2000,
          coupon: null,
        },
        {
          headers: {
            token: "508b262b-8072-11ee-96dc-de6f804954c9",
            "Content-Type": "application/json",
            ShopId: 4691092,
          },
        }
      );
      setPhiShip(response.data.data.total);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    if (selectedProvince) {
      handleProvinceChange(selectedProvince);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      handleDistrictChange(selectedDistrict);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedWard) {
      caculateFee();
    } else {
      return;
    }
  }, [selectedWard]);

  // Xuất hóa đơn
  const isPrintOke = () => {
    setIsXuatHoaDonVisible(true);
  };

  const isPrintCancel = () => {
    setIsXuatHoaDonVisible(false);
  };

  return (
    <div>
      <WebSocketService setValue={setMessageValue} connetTo="orderStatus" />

      <ToastContainer />
      <Modal
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        onOk={handleEditCancel}
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
                <Input
                  className="border-none"
                  disabled={editFormData.thanhToan === 1}
                />
              </Form.Item>
              <Form.Item
                label="Tên người nhận"
                name="tenNguoiNhan"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                rules={[
                  { required: true, message: "Tên người nhận không để trống!" },
                ]}
              >
                <Input
                  placeholder="Nguyen Van A..."
                  disabled={editFormData.thanhToan === 1}
                />
              </Form.Item>
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
                <Input
                  placeholder="abc@gmail.com"
                  disabled={editFormData.thanhToan === 1}
                />
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
                <Input disabled={editFormData.thanhToan === 1} />
              </Form.Item>
              <Form.Item
                label="Kiểu thanh toán:"
                name="tenPhuongThucThanhToan"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                rules={[
                  {
                    required: true,
                    message: "Phương thức thanh toán không để trống!",
                  },
                ]}
              >
                <Input
                  className="border-none"
                  disabled={editFormData.thanhToan === 1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tỉnh thành"
                name="tinh"
                rules={[
                  { required: true, message: "Vui lòng chọn tỉnh thành!" },
                ]}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  onChange={(value) => handleProvinceChangeaa(value)}
                  placeholder="Chọn"
                  disabled={editFormData.thanhToan === 1}
                >
                  {provinces.map((province) => (
                    <Select.Option
                      key={province.ProvinceID}
                      value={province.ProvinceName}
                    >
                      {province.ProvinceName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Quận huyện"
                name="huyen"
                rules={[
                  { required: true, message: "Vui lòng chọn quận huyện!" },
                ]}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  onChange={(value) => handleDistrictChangeaaa(value)}
                  placeholder="Chọn"
                  disabled={editFormData.thanhToan === 1}
                >
                  {districts.map((district) => (
                    <Select.Option
                      key={district.DistrictID}
                      value={district.DistrictName}
                    >
                      {district.DistrictName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Phường xã"
                name="xa"
                rules={[
                  { required: true, message: "Vui lòng chọn phường xã!" },
                ]}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Select
                  onChange={(value) => handleWardChangeaaa(value)}
                  placeholder="Chọn"
                  disabled={editFormData.thanhToan === 1}
                >
                  {wards.map((ward) => (
                    <Select.Option key={ward.WardCode} value={ward.WardName}>
                      {ward.WardName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Địa chỉ chi tiết"
                name="diaChi"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                rules={[{ required: true, message: "Địa chỉ không để trống!" }]}
              >
                <Input.TextArea
                  rows={4}
                  disabled={editFormData.thanhToan === 1}
                />
              </Form.Item>
            </Col>
          </Row>
          <Button
            type="primary"
            onClick={handleUpdate}
            disabled={editFormData.thanhToan === 1}
          >
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
              disabled={editFormData.thanhToan === 1}
            />
            {searchQuery && (
              <div
                className={`w-600 mt-1 ml-3 lg:mt-0 lg:left-0 lg:right-0 absolute z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer`}
              >
                <div
                  style={{
                    maxHeight: "400px",
                    width: "600px",
                    overflowY: "auto",
                  }}
                >
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
              disabled={editFormData.thanhToan === 1}
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
            Phí ship:{" "}
            <span className="text-lg text-bold">
              +{phiShip.toLocaleString("en-US")} VNĐ
            </span>{" "}
          </p>
          <p className="padding-right">
            Thành tiền:{" "}
            <span className="text-lg text-bold">
              {(tongTien + phiShip).toLocaleString("en-US")} VNĐ
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
            pageSize: 5,
            total: totalPage * 5,
            current: totalPage,
          }}
          style={{ maxHeight: "500px", overflowY: "auto" }}
        />
      )}
    </div>
  );
};

export default HoaDonDesign;
