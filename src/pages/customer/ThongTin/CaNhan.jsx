import { React, useState, useEffect } from "react";
import axios from "axios";
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
  Switch,
  Table,
} from "antd";
import { format } from "date-fns";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import {
  deleteCustomer,
  updatePassUser,
  updateUser,
} from "../../../services/CustomerDetail";
import { useAuth } from "../Account/AuthProvider";

const { Option } = Select;
const CaNhan = ({ props }) => {
  const [editFormData, setEditFormData] = useState(null);
  const [wards, setWards] = useState([]);
  const [formUpdate] = Form.useForm();
  const [show, setShow] = useState(false);
  const { user, signout } = useAuth();
  const [formChangPass] = Form.useForm();
  useEffect(() => {
    formUpdate.setFieldsValue({
      email: user.email,
      ngaySinh: user.ngaySinh ? dayjs(user.ngaySinh) : null,
      username: user.username,
      gioiTinh: user.gioiTinh.toString(),
      sdt: user.sdt,
      tenDem: user.tenDem,
      ten: user.ten,
      ho: user.ho,
    });
  }, []);

  const handleDelete = () => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn xóa người dùng này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await deleteCustomer({}, user.id);
          if (response.status === 200) {
            toast.success("Xóa thành công!");
            signout();
          }
        } catch (error) {
          console.error("Lỗi khi xóa: ", error);
          toast.error("Xóa thất bại.");
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
          values.password = user.password;
          if (user.vaiTro === "ROLE_USER") {
            values.vaiTro = 2;
          } else if (user.vaiTro === "ROLE_ADMIN") {
            values.vaiTro = 1;
          }
          console.log(values);
          const response = await updateUser(values, user.id);
          if (response.status === 200) {
            console.log(response);
            toast.success("Cập nhật thành công!");
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật người dùng : ", error);
          toast.error("Lỗi khi cập nhập người dùng!");
        }
      },

      onCancel: () => {},
    });
  };

  const handleChangePass = () => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn thay đổi mật khẩu không?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const values = await formChangPass.validateFields();
          const response = await updatePassUser(values, user.id);
          if (response.status === 200) {
            console.log(response);
            toast.success("Cập nhật thành công!");
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật người dùng : ", error);
          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Lỗi khi cập nhật người dùng");
          }
        }
      },

      onCancel: () => {},
    });
  };

  const validateEmail = (rule, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return Promise.reject("Email không hợp lệ!");
    }
    return Promise.resolve();
  };

  const validatePhoneNumber = (rule, value) => {
    const phoneRegex = /^(0|\\+84)[3|5|7|8|9][0-9]{8}$/;

    if (value && (!phoneRegex.test(value) || value.length !== 10)) {
      return Promise.reject("Số điện thoại không hợp lệ!");
    }

    return Promise.resolve();
  };

  const handleThayDoiClick = () => {
    // Toggle the state to show/hide the additional interface
    setShow(!show);
  };
  const callApiWard = (api) => {
    axios.get(api).then((response) => {
      setWards(response.data.wards);
    });
  };

  return (
    <div>
      <ToastContainer />

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
                      message: "Tên không được để trống!",
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
                  message: "Tài khoản không được để trống!",
                },
              ]}
            >
              <Input placeholder="Username" disabled />
            </Form.Item>
            <Form.Item
              label="Giới tính"
              name="gioiTinh"
              style={{ width: "360px", marginLeft: "40px" }}
              rules={[
                {
                  required: true,
                  message: "Giới tính không được để trống!",
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
              <DatePicker style={{ width: "360px" }} allowClear />
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
                {
                  validator: validatePhoneNumber,
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
                {
                  validator: validateEmail,
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button
          className="mr-9"
          type="primary"
          style={{ backgroundColor: "red", borderColor: "red" }}
          onClick={handleUpdate}
        >
          Cập nhập
        </Button>
        <Button
          className="ml-9"
          type="primary"
          style={{ backgroundColor: "red", borderColor: "red" }}
          onClick={handleDelete}
        >
          Xóa tài khoản
        </Button>
      </div>
      <div className="mb-4 mt-4 text-center" onClick={handleThayDoiClick}>
        <p className="text-blue-700 hover:underline cursor-pointer">
          Thay đổi mật khẩu
        </p>
      </div>
      {show && (
        <>
          <div className="mt-2">
            <Form
              form={formChangPass}
              name="form"
              layout="vertical"
              autoComplete="off"
              initialValues={editFormData}
            >
              <Form.Item
                label="Mật khẩu cũ"
                name="oldpassword"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  {
                    required: true,
                    message: "Mật khẩu không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Password" type="password" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu mới"
                name="newpass"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  {
                    required: true,
                    message: "Mật khẩu không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Password" type="password" />
              </Form.Item>
              <Form.Item
                label="Nhập lại mật khẩu mới"
                name="repass"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  {
                    required: true,
                    message: "Mật khẩu không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Password" type="password" />
              </Form.Item>
            </Form>
            <Button
              className="ml-9"
              type="primary"
              style={{ backgroundColor: "blue" }}
              onClick={handleChangePass}
            >
              Thay đổi mật khẩu
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CaNhan;
