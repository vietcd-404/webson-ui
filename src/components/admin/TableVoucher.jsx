import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Switch,
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
  updateStatusVoucher,
  updateVoucher,
} from "../../services/VoucherService";
import SearchInput from "./SearchInput";
import moment from "moment";

const TableVoucher = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null); // Data for editing
  const [switchStatus, setSwitchStatus] = useState({});
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();

  // Tìm kiếm
  const [searchTenVoucher, setSearchTenVoucher] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Edit
  const dayjs = require("dayjs");
  const timezone = require("dayjs/plugin/timezone");
  const utc = require("dayjs/plugin/utc");

  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

  const showEditModal = (record) => {
    formUpdate.resetFields();
    setEditFormData(record);
    formUpdate.setFieldsValue({
      maVoucher: record.maVoucher,
      soLuong: record.soLuong,
      thoiGianBatDau: dayjs(record.thoiGianBatDau),
      // ? dayjs(record.thoiGianBatDau).utc()
      // : "",
      thoiGianKetThuc: dayjs(record.thoiGianKetThuc),
      // ? dayjs(record.thoiGianKetThuc).utc()
      // : "",
      giaTriGiam: record.giaTriGiam,
      dieuKien: record.dieuKien,
      giamToiDa: record.giamToiDa,
      moTa: record.moTa,
      tenVoucher: record.tenVoucher,
    });
    console.log(dayjs(record.thoiGianBatDau));

    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    loadTable();
  }, []);

  const handleStartDateChange = (date, dateString) => {
    setStartDate(dateString);
  };

  const handleEndDateChange = (date, dateString) => {
    setEndDate(dateString);
  };
  const filterVouchersByTimeRange = () => {
    if (startDate && endDate) {
      const convertedStartDate = startDate.split("-").reverse().join("-");
      const convertedEndDate = endDate.split("-").reverse().join("-");

      if (data.length === 0) {
        loadTable();
      }
      const filteredData = data.filter((voucher) => {
        const voucherStartDate = new Date(voucher.thoiGianBatDau);
        const voucherEndDate = new Date(voucher.thoiGianKetThuc);
        const filterEndDate = new Date(convertedEndDate);
        const filterStartDate = new Date(convertedStartDate);
        return (
          voucherStartDate.getTime() >= filterStartDate.getTime() &&
          voucherEndDate.getTime() <= filterEndDate.getTime()
        );
      });
      setData(filteredData);
      setStartDate("");
      setEndDate("");
    } else {
      console.log("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ");
    }
  };

  const handelClear = () => {
    setStartDate(null);
    setEndDate(null);
    loadTable();
  };

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
      content: "Bạn có chắc muốn thêm voucher mới?",
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
            setIsModalOpen(false);
            toast.success("Thêm mới thành công!");
            loadTable();
            form.resetFields();
          }
        } catch (error) {
          console.error("Lỗi khi tạo voucher : ", error);
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
      content: "Bạn có chắc muốn cập nhập voucher không?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const values = await formUpdate.validateFields();
          values.thoiGianBatDau = dayjs(values.thoiGianBatDau);
          values.thoiGianKetThuc = dayjs(values.thoiGianKetThuc);
          if (values.thoiGianBatDau.isAfter(values.thoiGianKetThuc)) {
            toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc");
            return;
          }
          const response = await updateVoucher(values, editFormData.maVoucher);
          if (response.status === 200) {
            toast.success("Cập nhật thành công!");
            setIsEditModalOpen(false);
            loadTable();
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật voucher : ", error);
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
          console.error("Lỗi khi xóa voucher: ", error);
          toast.error("Xóa thất bại.");
        }
      },
      onCancel: () => {},
    });
  };

  const handleSwitchChange = async (record, checked) => {
    try {
      const currentDate = new Date();
      const startDate = new Date(record.thoiGianBatDau);
      const endDate = new Date(record.thoiGianKetThuc);
      console.log(currentDate);
      console.log(startDate);
      if (!(currentDate >= startDate && currentDate <= endDate)) {
        toast.error(
          "Không thể chuyển trạng thái do thời gian bắt đầu không hợp lệ."
        );
        await updateStatusVoucher(
          { ...record, trangThai: 1 },
          record.maVoucher
        );
        loadTable();
        return;
      }
      const response = await updateStatusVoucher(
        { ...record, trangThai: checked ? 0 : 1 },
        record.maVoucher
      );
      if (response.status === 200) {
        setSwitchStatus((prevStatus) => ({
          ...prevStatus,
          [record.maVoucher]: checked,
        }));
        toast.success("Cập nhật trạng thái thành công!");
        loadTable();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái voucher: ", error);
      toast.error("Cập nhật trạng thái thất bại.");
    }
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "tenVoucher",
      key: "tenVoucher",
      filteredValue: [searchTenVoucher],
      onFilter: (value, record) => {
        return String(record.tenVoucher)
          .toLowerCase()
          .includes(value.toLowerCase());
      },
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
      render: (giaTriGiam) => `${giaTriGiam}%`,
    },
    {
      title: "Điều kiện",
      dataIndex: "dieuKien",
      key: "dieuKien",
      render: (text) => parseFloat(text).toLocaleString("en-US"),
    },
    {
      title: "Giảm tối đa",
      dataIndex: "giamToiDa",
      key: "giamToiDa",
      render: (text) => parseFloat(text).toLocaleString("en-US"),
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
      render: (_, record) => (
        <Switch
          checked={record.trangThai === 0}
          onChange={(checked) => handleSwitchChange(record, checked)}
        />
      ),
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
      <Row className="mb-2">
        <Col span={10}>
          <Input.Search
            placeholder="Tìm kiếm tên voucher ..."
            onSearch={(value) => {
              setSearchTenVoucher(value);
            }}
            onChange={(e) => {
              setSearchTenVoucher(e.target.value);
            }}
            width={100}
          />
        </Col>
        <Col span={4} offset={10}>
          <Button className="ml-5 bg-blue-500 text-white" onClick={showModal}>
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
                        message: "Tên voucher không được để trống!",
                      },
                    ]}
                  >
                    <Input placeholder="Tên" />
                  </Form.Item>

                  <Form.Item
                    label="Giảm Phần Trăm"
                    name="giaTriGiam"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[
                      {
                        required: true,
                        message: "Giá trị phần trăm giảm không được để trống!",
                      },
                      ({ giaTriGiam }) => ({
                        validator(_, value) {
                          if (value >= 100) {
                            return Promise.reject(
                              "Giá trị giảm không được lớn hơn hoặc bằng 100!"
                            );
                          }
                          if (value < 0) {
                            return Promise.reject(
                              "Giá trị giảm không được nhỏ hơn 0!"
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input type="number" placeholder="Giá trị giảm" />
                  </Form.Item>
                  <Form.Item
                    label="Giá trị giảm tối đa"
                    name="giamToiDa"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[
                      {
                        required: true,
                        message: "Giá trị giảm tối đa không được để trống!",
                      },
                      ({ giamToiDa }) => ({
                        validator(_, value) {
                          if (value < 0) {
                            return Promise.reject(
                              "Giá trị giảm tối đa không được nhỏ hơn 0!"
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input type="number" placeholder="Giá trị giảm tối đa" />
                  </Form.Item>
                  <Form.Item
                    label="Điều kiện"
                    name="dieuKien"
                    style={{ width: "360px", marginLeft: "40px" }}
                    rules={[
                      {
                        required: true,
                        message: "Điều kiện giảm không được để trống!",
                      },
                      ({ dieuKien }) => ({
                        validator(_, value) {
                          if (value <= 0) {
                            return Promise.reject(
                              "Điều kiện giảm tối đa không được nhỏ hơn 0!"
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input type="number" placeholder="Giá trị giảm tối đa" />
                  </Form.Item>
                </Col>
                <Col span={12}>
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
                      disabledDate={(current) =>
                        current && current < moment().startOf("day")
                      }
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
                      disabledDate={(current) =>
                        current && current < moment().startOf("day")
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Mô tả"
                    name="moTa"
                    style={{ width: "360px", marginLeft: "40px" }}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Col>
      </Row>
      <Row justify="center" align="middle" className="mt-2 mb-2 border-1 p-2">
        <Col>
          <Row
            justify="center"
            align="middle"
            className="mt-2 mb-2 border-1 p-2"
          >
            <Col>
              Ngày bắt đầu{" "}
              <DatePicker
                format="DD-MM-YYYY"
                style={{ width: "200px" }}
                className="mr-5"
                onChange={handleStartDateChange}
                value={startDate ? moment(startDate, "DD-MM-YYYY") : null}
              />
              Ngày kết thúc{" "}
              <DatePicker
                format="DD-MM-YYYY"
                style={{ width: "200px" }}
                className="mr-5"
                onChange={handleEndDateChange}
                value={endDate ? moment(endDate, "DD-MM-YYYY") : null}
              />
              <Button
                className="ml-5 mr-2 bg-red-500 text-white"
                onClick={() => filterVouchersByTimeRange()}
              >
                Lọc
              </Button>
              <Button onClick={handelClear}>Xóa</Button>
            </Col>
          </Row>
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
                  {
                    required: true,
                    message: "Tên voucher không được để trống!",
                  },
                ]}
              >
                <Input placeholder="Tên" />
              </Form.Item>

              <Form.Item
                label="Giảm Phần Trăm"
                name="giaTriGiam"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  {
                    required: true,
                    message: "Giá trị phần trăm giảm không được để trống!",
                  },
                  ({ giaTriGiam }) => ({
                    validator(_, value) {
                      if (value >= 100) {
                        return Promise.reject(
                          "Giá trị giảm không được lớn hơn hoặc bằng 100!"
                        );
                      }
                      if (value < 0) {
                        return Promise.reject(
                          "Giá trị giảm không được nhỏ hơn 0!"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input type="number" placeholder="Giá trị giảm" />
              </Form.Item>
              <Form.Item
                label="Giá trị giảm tối đa"
                name="giamToiDa"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  {
                    required: true,
                    message: "Giá trị giảm tối đa không được để trống!",
                  },
                  ({ giamToiDa }) => ({
                    validator(_, value) {
                      if (value < 0) {
                        return Promise.reject(
                          "Giá trị giảm tối đa không được nhỏ hơn 0!"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input type="number" placeholder="Giá trị giảm tối đa" />
              </Form.Item>
              <Form.Item
                label="Điều kiện"
                name="dieuKien"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  {
                    required: true,
                    message: "Điều kiện giảm không được để trống!",
                  },
                  ({ dieuKien }) => ({
                    validator(_, value) {
                      if (value <= 0) {
                        return Promise.reject(
                          "Điều kiện giảm tối đa không được nhỏ hơn 0!"
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input type="number" placeholder="Giá trị giảm tối đa" />
              </Form.Item>
            </Col>
            <Col span={12}>
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
                  disabledDate={(current) =>
                    current && current < moment().startOf("day")
                  }
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
                  disabledDate={(current) =>
                    current && current < moment().startOf("day")
                  }
                />
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="moTa"
                style={{ width: "360px", marginLeft: "40px" }}
              >
                <TextArea rows={4} />
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
            pageSize: 8,
            total: totalPage,
          }}
        />
      )}
    </div>
  );
};
export default TableVoucher;
