import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";

import dayjs from "dayjs";

import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createVoucher,
  deleteVoucher,
  findAllVoucher,
  updateVoucher,
} from "../../services/VoucherService";
import SearchInput from "./SearchInput";

const TableVoucher = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null); // Data for editing

  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showEditModal = (record) => {
    setEditFormData(record);
    formUpdate.setFieldsValue({
      maVoucher: record.maVoucher,
      soLuong: record.soLuong,
      thoiGianBatDau: dayjs(record.thoiGianBatDau),
      thoiGianKetThuc: dayjs(record.thoiGianKetThuc),
      giaTriGiam: record.giaTriGiam,
      kieuGiamGia: record.kieuGiamGia,
      moTa: record.moTa,
      tenVoucher: record.tenVoucher,
    });
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    // formUpdate.resetFields();
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    loadTable();
  }, []);

  //Hiện list danh sách lên
  const loadTable = async () => {
    try {
      const response = await findAllVoucher();
      setData(response.data);
      setTotalPage(response.totalPage);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
      setLoading(false);
    }
  };

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
          if (values.thoiGianBatDau.isAfter(values.thoiGianKetThuc)) {
            toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc");
            return;
          }
          const response = await createVoucher(values);
          if (response.status === 200) {
            console.log(response);
            setIsModalOpen(false);
            toast.success("Thêm mới thành công!");
            loadTable();
            form.resetFields();
          }
        } catch (error) {
          console.error("Lỗi khi tạo thương hiệu : ", error);
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
      content: "Bạn có chắc muốn cập nhập thương hiệu không?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const values = await formUpdate.validateFields();
          const response = await updateVoucher(values, editFormData.maVoucher);
          if (response.status === 200) {
            console.log(response);
            setIsEditModalOpen(false);
            toast.success("Cập nhật thành công!");
            loadTable();
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật thương hiệu : ", error);
          toast.error("Cập nhật thất bại.");
        }
      },

      onCancel: () => {},
    });
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn xóa voucher này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await deleteVoucher(record.maVoucher);
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

  const columns = [
    {
      title: "Tên",
      dataIndex: "tenVoucher",
      key: "tenVoucher",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "thoiGianBatDau",
      key: "thoiGianBatDau",
      render: (thoiGianBatDau) =>
        format(new Date(thoiGianBatDau), "dd-MM-yyyy "),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "thoiGianKetThuc",
      key: "thoiGianKetThuc",
      render: (thoiGianKetThuc) =>
        format(new Date(thoiGianKetThuc), "dd-MM-yyyy "),
    },
    {
      title: "Số lượng",
      dataIndex: "soLuong",
      key: "soLuong",
    },
    {
      title: "Giá trị giảm",
      dataIndex: "giaTriGiam",
      key: "giaTriGiam",
    },
    {
      title: "Kiểu giảm giá",
      dataIndex: "kieuGiamGia",
      key: "kieuGiamGia",
    },
    {
      title: "Mô tả",
      dataIndex: "moTa",
      key: "moTa",
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (trangThai) =>
        trangThai === 0 ? "Hoạt động" : "Không hoạt động",
    },
    {
      title: "Chức năng",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showEditModal(record)}>
            <EditOutlined />
          </Button>
          <Button onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </Button>
        </Space>
      ),
    },
  ];

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
            <Form
              onFinish={handleAdd}
              form={form}
              layout="vertical"
              autoComplete="off"
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Form.Item
                    label="Tên"
                    name="tenVoucher"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[
                      {
                        required: true,
                        message: "Tên loại không được để trống!",
                      },
                    ]}
                  >
                    <Input placeholder="Tên" />
                  </Form.Item>
                  <Form.Item
                    label="Số lượng"
                    name="soLuong"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[
                      {
                        required: true,
                        message: "Số lượng không được để trống!",
                      },
                    ]}
                  >
                    <Input type="number" placeholder="Số lượng" />
                  </Form.Item>
                  <Form.Item
                    label="Giá trị giảm"
                    name="giaTriGiam"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[
                      {
                        required: true,
                        message: "Giá trị giảm không được để trống!",
                      },
                    ]}
                  >
                    <Input type="number" placeholder="Giá trị giảm" />
                  </Form.Item>
                  <Form.Item
                    label="Mô tả"
                    name="moTa"
                    style={{ width: "360px", marginLeft: "40px" }}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Kiểu giảm giá"
                    name="kieuGiamGia"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[
                      {
                        required: true,
                        message: "Kiểu giảm giá không được để trống!",
                      },
                    ]}
                  >
                    <Input placeholder="Kiểu giảm giá" />
                  </Form.Item>
                  <Form.Item
                    name="thoiGianBatDau"
                    label="Ngày bắt đầu"
                    style={{
                      marginLeft: "40px",
                    }}
                    rules={[{ required: true, message: "Chọn ngày bắt đầu!" }]}
                  >
                    <DatePicker
                      format="DD-MM-YYYY"
                      style={{ width: "360px" }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="thoiGianKetThuc"
                    label="Ngày kết thúc"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[{ required: true, message: "Chọn ngày kết thúc!" }]}
                  >
                    <DatePicker
                      format="DD-MM-YYYY"
                      style={{ width: "360px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Col>
      </Row>

      <Modal
        title="Cập nhật voucher"
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        onOk={handleUpdate}
        width={900}
      >
        <Form
          form={formUpdate}
          name="editForm"
          initialValues={editFormData}
          layout="vertical"
          autoComplete="off"
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Tên"
                name="tenVoucher"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  { required: true, message: "Tên loại không được để trống!" },
                ]}
              >
                <Input placeholder="Tên" />
              </Form.Item>
              <Form.Item
                label="Số lượng"
                name="soLuong"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  { required: true, message: "Số lượng không được để trống!" },
                ]}
              >
                <Input type="number" placeholder="Số lượng" />
              </Form.Item>
              <Form.Item
                label="Giá trị giảm"
                name="giaTriGiam"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  {
                    required: true,
                    message: "Giá trị giảm không được để trống!",
                  },
                ]}
              >
                <Input type="number" placeholder="Giá trị giảm" />
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="moTa"
                style={{ width: "360px", marginLeft: "40px" }}
              >
                <TextArea rows={4} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Kiểu giảm giá"
                name="kieuGiamGia"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  {
                    required: true,
                    message: "Kiểu giảm giá không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Kiểu giảm giá" />
              </Form.Item>
              <Form.Item
                name="thoiGianBatDau"
                label="Ngày bắt đầu"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[{ required: true, message: "Chọn ngày bắt đầu!" }]}
              >
                <DatePicker format="DD-MM-YYYY" style={{ width: "360px" }} />
              </Form.Item>

              <Form.Item
                name="thoiGianKetThuc"
                label="Ngày kết thúc"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[{ required: true, message: "Chọn ngày kết thúc!" }]}
              >
                <DatePicker format="DD-MM-YYYY" style={{ width: "360px" }} />
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
export default TableVoucher;
