import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Space,
  Table,
  Modal,
  Switch,
} from "antd";
import "react-toastify/dist/ReactToastify.css";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import {
  createMau,
  deleteMau,
  findAllMau,
  updateMau,
  updateStatusMau,
} from "../../services/MauService";

const TableMau = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [searchTenMau, setSearchTenMau] = useState("");
  const [switchStatus, setSwitchStatus] = useState({});

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
    formUpdate.setFieldsValue({ tenMau: record.tenMau });
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    formUpdate.resetFields();
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    loadTable();
  }, []);

  //Hiện list danh sách lên
  const loadTable = async () => {
    try {
      const response = await findAllMau();
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
      content: "Bạn có chắc muốn thêm màu mới?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          values.tenMau = values.tenMau.trim().replace(/\s+/g, " ");

          const response = await createMau(values);
          if (response.status === 200) {
            console.log(response);
            setIsModalOpen(false);
            toast.success("Thêm mới thành công!");
            loadTable();
            form.resetFields();
          }
        } catch (error) {
          console.error("Lỗi khi tạo màu: ", error);
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message);
            return;
          } else {
            toast.error("Thêm mới thất bại.");
          }
        }
      },
      onCancel: () => {},
    });
  };

  const handleUpdate = () => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn cập nhập màu không?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const values = await formUpdate.validateFields();
          values.tenMau = values.tenMau.trim().replace(/\s+/g, " ");

          const response = await updateMau(values, editFormData.maMau);
          if (response.status === 200) {
            console.log(response);
            setIsEditModalOpen(false);

            toast.success("Cập nhật thành công!");
            loadTable();
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật màu: ", error);
          if (error.response && error.response.status === 400) {
            toast.error(error.response.data.message);
            return;
          } else {
            toast.error("Cập nhập thất bại.");
          }
        }
      },

      onCancel: () => {},
    });
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn xóa màu này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await deleteMau(record.maMau);
          if (response.status === 200) {
            toast.success("Xóa thành công!");
            loadTable();
          }
        } catch (error) {
          console.error("Lỗi khi xóa màu: ", error);
          toast.error("Xóa thất bại.");
        }
      },
      onCancel: () => {},
    });
  };

  const handleSwitchChange = async (record, checked) => {
    const trangThaiValue = checked ? 1 : 0;
    console.log(trangThaiValue);
    try {
      const response = await updateStatusMau(
        { ...record, trangThai: checked ? 1 : 0 },
        record.maMau
      );
      if (response.status === 200) {
        setSwitchStatus((prevStatus) => ({
          ...prevStatus,
          [record.maMau]: checked,
        }));
        toast.success("Cập nhật trạng thái thành công!");
        loadTable();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái màu: ", error);
      toast.error("Cập nhật trạng thái thất bại.");
    }
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "tenMau",
      key: "tenMau",
      filteredValue: [searchTenMau],
      onFilter: (value, record) => {
        return String(record.tenMau)
          .toLowerCase()
          .includes(value.toLowerCase());
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (_, record) => (
        <Switch
          checked={record.trangThai === 1}
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
      <Row style={{ marginBottom: "20px" }}>
        <Col span={12}>
          <Input.Search
            placeholder="Tìm kiếm màu ..."
            onSearch={(value) => {
              setSearchTenMau(value);
            }}
            onChange={(e) => {
              setSearchTenMau(e.target.value);
            }}
          />
        </Col>
        <Col span={4} offset={8}>
          <Button type="primary" onClick={showModal}>
            Thêm
          </Button>
          <Modal
            title="Thêm màu"
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleAdd}
          >
            <Form onFinish={handleAdd} form={form}>
              <Form.Item
                label="Tên"
                name="tenMau"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  { required: true, message: "Tên màu không được để trống!" },
                ]}
              >
                <Input placeholder="Tên" />
              </Form.Item>
            </Form>
          </Modal>
        </Col>
      </Row>

      <Modal
        title="Cập nhật màu"
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        onOk={handleUpdate}
      >
        <Form form={formUpdate} name="editForm" initialValues={editFormData}>
          <Form.Item
            label="Tên"
            name="tenMau"
            style={{ width: "360px", marginLeft: "40px" }}
            rules={[
              { required: true, message: "Tên màu không được để trống!" },
            ]}
          >
            <Input value={editFormData?.tenMau} placeholder="Tên" />
          </Form.Item>
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
            current: totalPage,
          }}
        />
      )}
    </div>
  );
};
export default TableMau;
