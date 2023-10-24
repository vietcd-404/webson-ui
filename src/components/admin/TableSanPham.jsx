import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Space, Table, Modal, Tag } from "antd";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import SearchInput from "./SearchInput";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createSanPham,
  deleteBySanPham,
  findAllSanPham,
  updateSanPham,
} from "../../services/SanPhamService";

const TableSanPham = () => {
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
      const response = await findAllSanPham();
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
      content: "Bạn có chắc muốn thêm sản phẩm mới?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const response = await createSanPham(values);
          if (response.status === 200) {
            console.log(response);
            setIsModalOpen(false);
            toast.success("Thêm mới thành công!");
            loadTable();
            form.resetFields();
          }
        } catch (error) {
          console.error("Lỗi khi tạo sản phẩm : ", error);
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
      content: "Bạn có chắc muốn cập nhập sản phẩm không?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const values = await formUpdate.validateFields();
          const response = await updateSanPham(values, editFormData.maSanPham);
          if (response.status === 200) {
            console.log(response);
            setIsEditModalOpen(false);
            toast.success("Cập nhật thành công!");
            loadTable();
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật sản phẩm : ", error);
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
      content: "Bạn có chắc muốn xóa sản phẩm này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await deleteBySanPham(record.maSanPham);
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
      dataIndex: "tenSanPham",
      key: "tenSanPham",
    },
    {
      title: "Độ bóng",
      dataIndex: "doBong",
      key: "doBong",
      render: (doBong) =>
        doBong === 0 ? (
          <Tag color="green">Độ bóng</Tag>
        ) : (
          <Tag color="red">Độ lì</Tag>
        ),
    },
    {
      title: "Độ lì",
      dataIndex: "doLi",
      key: "doLi",
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
          <SearchInput text="Tìm kiếm loại" />
        </Col>
        <Col span={4} offset={8}>
          <Button className="bg-blue-500 text-white" onClick={showModal}>
            Thêm
          </Button>
          <Modal
            title="Thêm sản phẩm"
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleAdd}
          >
            <Form onFinish={handleAdd} form={form}>
              <Form.Item
                label="Tên"
                name="tenSanPham"
                style={{ width: "360px", marginLeft: "40px" }}
                rules={[
                  { required: true, message: "Tên loại không được để trống!" },
                ]}
              >
                <Input placeholder="Tên" />
              </Form.Item>
            </Form>
          </Modal>
        </Col>
      </Row>

      <Modal
        title="Cập nhật loại"
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        onOk={handleUpdate}
      >
        <Form form={formUpdate} name="editForm" initialValues={editFormData}>
          <Form.Item
            label="Tên"
            name="tenSanPham"
            style={{ width: "360px", marginLeft: "40px" }}
            rules={[
              { required: true, message: "Tên loại không được để trống!" },
            ]}
          >
            <Input placeholder="Tên" />
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
            total: totalPage,
          }}
        />
      )}
    </div>
  );
};
export default TableSanPham;
