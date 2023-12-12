import React from "react";
import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Input, Row, Select, Tabs } from "antd";
import { Link } from "react-router-dom";
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
} from "../../../services/HoaDonService";
const { Option } = Select;
const ChoXacNhan = ({ updateCountByStatus }) => {
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

  // Search
  const [searchType, setSearchType] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [form] = Form.useForm();

  // Phí ship
  const [phiShip, setPhiShip] = useState(0);

  const showEditModal = async (record) => {
    const response = await inforUserHoaDon(record.maHoaDon);
    setEditFormData(response.data[0]);
    formUpdate.setFieldsValue({
      tenNguoiDung: response.data[0].tenNguoiDung,
      maHoaDon: response.data[0].maHoaDon,
      tenNguoiNhan: response.data[0].tenNguoiNhan,
      email: response.data[0].email,
      sdt: response.data[0].sdt,
      diaChi: response.data[0].diaChi,
      diaChiChiTiet: response.data[0].diaChiChiTiet,
      tinh: response.data[0].tinh,
      huyen: response.data[0].huyen,
      xa: response.data[0].xa,
    });
    try {
      const response1 = await productInforHoaDon(record.maHoaDon);
      setTableDataProduct(response1.data);
      setTotalPageProduct(response1.totalPage);
      setTongTien(response1.data[0].tongTien);
      setPhiShip(response1.data[0].phiShip);
      if (response1.data[0].tienGiam == null) {
        setGiamGia(0);
      } else {
        setGiamGia(response1.data[0].tienGiam);
      }
      console.log(response1.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
      setLoading(false);
    }
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    formUpdate.resetFields();
    setIsEditModalOpen(false);
  };

  const loadTable = async () => {
    try {
      const response = await getAllOrderByAdmin(1);
      setTotalPage(response.totalPage);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await getAllOrderByAdmin(1);

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
  }, []);

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

  const handleCancel = (maHD) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn hủy xác nhận hóa đơn này?",
      okText: "Đồng ý",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const response = await huytHoaDonByAdmin(maHD);
          if (response.status === 200) {
            toast.success("Hủy đơn hàng thành công!");
            fetchData();
          }
        } catch (error) {
          console.error("Lỗi khi hủy loại: ", error);
          toast.error("Xóa thất bại.");
        }
      },
      onCancel: () => {},
    });
  };

  const handleUpdate = (trangThai, maHD) => {
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
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật: ", error);
          toast.error("Cập nhật thất bại.");
        }
      },

      onCancel: () => {},
    });
  };

  const handleUpdateProduct = () => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn cập nhập loại không?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      // onOk: async () => {
      //   try {
      //     // const values = await formUpdate.validateFields();
      //     // const response = await updateMau(values, editFormData.maMau);
      //     // if (response.status === 200) {
      //     //   console.log(response);
      //     //   setIsModalOpen(false);

      //       toast.success("Cập nhật thành công!");
      //       loadTable();
      //     }
      //   } catch (error) {
      //     console.error("Lỗi khi cập nhật loại: ", error);
      //     toast.error("Cập nhật thất bại.");
      //   }
      // },

      onCancel: () => {},
    });
  };

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await searchHoaDon(searchType, searchValue, 1);
      console.log(response);
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
          <Button disabled>
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
      width: 140,
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
            <Button onClick={() => handleUpdate(1, record.maHoaDon)}>
              Xác nhận
            </Button>
          )}

          {record.trangThai === 0 && (
            <Button onClick={() => handleCancel(record.maHoaDon)}>Hủy</Button>
          )}
          {record.trangThai === 1 && (
            <Button onClick={() => handleUpdate(2, record.maHoaDon)}>
              Giao Hàng
            </Button>
          )}
          {record.trangThai === 1 && (
            <Button onClick={() => handleUpdate(0, record.maHoaDon)}>
              Hủy
            </Button>
          )}
          {record.trangThai === 2 && (
            <Button onClick={() => handleUpdate(3, record.maHoaDon)}>
              Hoàn Thành
            </Button>
          )}
          {record.trangThai === 4 && (
            <Button onClick={() => handleCancel(record.maHoaDon)}>
              Xóa đơn hàng
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

  return (
    <div>
      <ToastContainer />
      <Modal
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        onOk={handleUpdateProduct}
        width={1000}
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
                labelCol={{ span: 8 }} // Điều chỉnh độ rộng của nhãn
                wrapperCol={{ span: 16 }} // Điều chỉnh độ rộng của dữ liệu
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Tên người nhận"
                name="tenNguoiNhan"
                labelCol={{ span: 8 }} // Điều chỉnh độ rộng của nhãn
                wrapperCol={{ span: 16 }} // Điều chỉnh độ rộng của dữ liệu
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="sdt"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tỉnh"
                name="tinh"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Huyện"
                name="huyen"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Xã"
                name="xa"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Địa chỉ chi tiết"
                name="diaChiChiTiet"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              >
                <Input.TextArea rows={4} disabled />
              </Form.Item>
            </Col>
          </Row>
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
              placeholder="Tìm kiếm sản phẩm tại đây"
            />
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
              disabled
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
            Tổng tiền sau khi giảm:{" "}
            <span className="text-lg text-bold">
              {(tongTien + phiShip).toLocaleString("en-US")} VNĐ
            </span>{" "}
          </p>
        </div>
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
              format="yyyy/MM/dd"
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
            total: totalPage * 5, // Assuming totalPage is the total number of pages
            current: totalPage,
          }}
        />
      )}
    </div>
  );
};

export default ChoXacNhan;
