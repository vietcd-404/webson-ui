import React from "react";
import { useEffect } from "react";
import {
  createNguoiDung,
  deleteNguoiDung,
  findAllNguoiDung,
  updateNguoiDung,
} from "../../services/NguoiDungService";
import { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import SearchInput from "./SearchInput";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";

const { Option } = Select;
const TableNguoiDung = () => {
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();

  useEffect(() => {
    loadTable();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const showEditModal = (record) => {
    setEditFormData(record);

    formUpdate.setFieldsValue({
      maNguoiDung: record.maNguoiDung,
      email: record.email,
      ngaySinh: dayjs(record.ngaySinh),
      username: record.username,
      gioiTinh: record.gioiTinh,
      sdt: record.sdt,
      tenDem: record.tenDem,
      ten: record.ten,
      ho: record.ho,
      vaiTro: record.vaiTro,
    });
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    // formUpdate.resetFields();
    setIsEditModalOpen(false);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn xóa người dùng này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await deleteNguoiDung(record.maNguoiDung);
          console.log(response.status);
          if (response.status === 200) {
            toast.success("Xóa thành công!");
            loadTable();
          }
        } catch (error) {
          console.error("Lỗi khi xóa loại: ", error);
          toast.error("Xóa thất bại.");
        }
      },
      onCancel: () => {},
    });
  };

  //Hiện list danh sách lên
  const loadTable = async () => {
    try {
      const response = await findAllNguoiDung();
      setData(response.data);
      setTotalPage(response.totalPage);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Tài khản",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Vai trò",
      dataIndex: "vaiTro",
      key: "vaiTro",
    },
    {
      title: "Họ",
      dataIndex: "ho",
      key: "d",
    },
    {
      title: "Tên đệm",
      dataIndex: "tenDem",
      key: "d",
    },
    {
      title: "Tên",
      dataIndex: "ten",
      key: "d",
    },
    {
      title: "Ngày sinh",
      dataIndex: "ngaySinh",
      key: "ngaySinh",
      render: (ngaySinh) => format(new Date(ngaySinh), "dd-MM-yyyy "),
    },
    {
      title: "Giới tính",
      dataIndex: "gioiTinh",
      key: "gioiTinh",
      render: (gioiTinh) => (gioiTinh === 1 ? "Nam" : "Nữ"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "sdt",
      key: "sdt",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (trangThai) =>
        trangThai === 1 ? "Hoạt động" : "Không hoạt động",
    },
    {
      title: "Chức năng",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showEditModal(record)}>
            <EditOutlined />
          </Button>
          {/* onClick={() => handleDelete(record)} */}
          <Button onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn thêm thương hiệu mới?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const response = await createNguoiDung(values);
          if (response.status === 200) {
            console.log(response);
            setIsModalOpen(false);
            toast.success("Thêm mới thành công!");
            loadTable();
            form.resetFields();
          }
        } catch (error) {
          console.error("Lỗi khi tạo người dùng : ", error);
          toast.error("Thêm mới thất bại.");
        }
      },
      onCancel: () => {},
    });
  };
  const handleUpdate = () => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn cập nhập người dùng không?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const values = await formUpdate.validateFields();
          const response = await updateNguoiDung(
            values,
            editFormData.maNguoiDung
          );
          if (response.status === 200) {
            console.log(response);
            setIsEditModalOpen(false);
            toast.success("Cập nhật thành công!");
            loadTable();
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật người dùng : ", error);
          toast.error("Cập nhật thất bại.");
        }
      },

      onCancel: () => {},
    });
  };
  return (
    <div>
      <ToastContainer />
      <Row>
        <Col span={12}>
          <SearchInput text="Tìm kiếm voucher" />
        </Col>
        <Col span={4} offset={8}>
          <Button className="bg-blue-500 text-white" onClick={showModal}>
            Thêm
          </Button>
          <Modal
            title="Thêm voucher"
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleAdd}
            width={900}
          >
            <Form form={form} name="form" layout="vertical" autoComplete="off">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Row gutter={[16, 16]} style={{ marginLeft: "40px" }}>
                    <Col span={8}>
                      <Form.Item
                        label="Họ"
                        name="ho"
                        style={{
                          width: "100px",
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Họ không được để trống!",
                          },
                        ]}
                      >
                        <Input placeholder="Họ" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      {" "}
                      <Form.Item
                        label="Tên đệm"
                        name="tenDem"
                        style={{ width: "100px" }}
                        rules={[
                          {
                            required: true,
                            message: "Tên đệm không được để trống!",
                          },
                        ]}
                      >
                        <Input placeholder="Tên đệm" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      {" "}
                      <Form.Item
                        label="Tên"
                        name="ten"
                        style={{ width: "100px" }}
                        rules={[
                          {
                            required: true,
                            message: "Tên  không được để trống!",
                          },
                        ]}
                      >
                        <Input placeholder="Tên" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Tài khoản"
                    name="username"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[
                      {
                        required: true,
                        message: "Số lượng không được để trống!",
                      },
                    ]}
                  >
                    <Input placeholder="Username" />
                  </Form.Item>
                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[
                      {
                        required: true,
                        message: "Số lượng không được để trống!",
                      },
                    ]}
                  >
                    <Input placeholder="Username" />
                  </Form.Item>
                  <Form.Item
                    label="Giới tính"
                    name="gioiTinh"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[
                      {
                        required: true,
                        message: "Giá trị giảm không được để trống!",
                      },
                    ]}
                  >
                    <Select placeholder="Giới tính" style={{ width: "100%" }}>
                      <Option value="0">Nam</Option>
                      <Option value="1">Nữ</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="ngaySinh"
                    label="Ngày sinh"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[{ required: true, message: "Chọn ngày bắt đầu!" }]}
                  >
                    <DatePicker
                      style={{ width: "360px" }}
                      format="DD-MM-YYYY"
                    />
                  </Form.Item>
                  <Form.Item
                    name="sdt"
                    label="Số điện thoại"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[
                      {
                        required: true,
                        message: "Số điện thoại không bỏ trống!",
                      },
                    ]}
                  >
                    <Input placeholder="sdt" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[
                      {
                        required: true,
                        message: "Email không được để trống!",
                      },
                    ]}
                  >
                    <Input placeholder="Email" />
                  </Form.Item>
                  <Form.Item
                    label="Vai trò"
                    name="vaiTro"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[
                      {
                        required: true,
                        message: "Giá trị giảm không được để trống!",
                      },
                    ]}
                  >
                    <Select placeholder="Vai trò" style={{ width: "100%" }}>
                      <Option value="1">ROLE_ADMIN</Option>
                      <Option value="2">ROLE_USER</Option>
                      <Option value="3">ROLE_STAFF</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Col>
      </Row>

      <Modal
        title="Cập nhập người dùng"
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        onOk={handleUpdate}
        width={900}
      >
        <Form
          form={formUpdate}
          name="form"
          layout="vertical"
          autoComplete="off"
          initialValues={editFormData}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Row gutter={[16, 16]} style={{ marginLeft: "40px" }}>
                <Col span={8}>
                  <Form.Item
                    label="Họ"
                    name="ho"
                    style={{
                      width: "100px",
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Họ không được để trống!",
                      },
                    ]}
                  >
                    <Input placeholder="Họ" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  {" "}
                  <Form.Item
                    label="Tên đệm"
                    name="tenDem"
                    style={{ width: "100px" }}
                    rules={[
                      {
                        required: true,
                        message: "Tên đệm không được để trống!",
                      },
                    ]}
                  >
                    <Input placeholder="Tên đệm" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  {" "}
                  <Form.Item
                    label="Tên"
                    name="ten"
                    style={{ width: "100px" }}
                    rules={[
                      {
                        required: true,
                        message: "Tên  không được để trống!",
                      },
                    ]}
                  >
                    <Input placeholder="Tên" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Tài khoản"
                name="username"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  {
                    required: true,
                    message: "Số lượng không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Username" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu"
                name="password"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  {
                    required: true,
                    message: "Số lượng không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Username" />
              </Form.Item>
              <Form.Item
                label="Giới tính"
                name="gioiTinh"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  {
                    required: true,
                    message: "Giá trị giảm không được để trống!",
                  },
                ]}
              >
                <Select placeholder="Giới tính" style={{ width: "100%" }}>
                  <Option value="0">Nam</Option>
                  <Option value="1">Nữ</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ngaySinh"
                label="Ngày sinh"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[{ required: true, message: "Chọn ngày bắt đầu!" }]}
              >
                <DatePicker style={{ width: "360px" }} />
              </Form.Item>
              <Form.Item
                name="sdt"
                label="Số điện thoại"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  {
                    required: true,
                    message: "Số điện thoại không bỏ trống!",
                  },
                ]}
              >
                <Input placeholder="sdt" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  {
                    required: true,
                    message: "Email không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                label="Vai trò"
                name="vaiTro"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  {
                    required: true,
                    message: "Giá trị giảm không được để trống!",
                  },
                ]}
              >
                <Select placeholder="Vai trò" style={{ width: "100%" }}>
                  <Option value="1">ROLE_ADMIN</Option>
                  <Option value="2">ROLE_USER</Option>
                  <Option value="3">ROLE_STAFF</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            pageSize: 5,
            total: totalPage,
          }}
        />
      )}
    </div>
  );
};

export default TableNguoiDung;
