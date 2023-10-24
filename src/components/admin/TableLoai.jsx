import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Space, Table, Modal } from "antd";

import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import SearchInput from "./SearchInput";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  createLoai,
  deleteById,
  findAllLoai,
  updateLoai,
} from "../../services/LoaiService";
import { toast } from "react-toastify";

const TableLoai = () => {
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
      const response = await findAllLoai();
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
      content: "Bạn có chắc muốn thêm loại mới?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const values = await form.validateFields();
          const response = await createLoai(values);
          if (response.status === 200) {
            console.log(response);
            setIsModalOpen(false);
            toast.success("Thêm mới thành công!");
            loadTable();
            form.resetFields();
          }
        } catch (error) {
          console.error("Lỗi khi tạo loại: ", error);
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
      content: "Bạn có chắc muốn cập nhập loại không?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const values = await formUpdate.validateFields();
          const response = await updateLoai(values, editFormData.maLoai);
          if (response.status === 200) {
            console.log(response);
            setIsEditModalOpen(false);
            toast.success("Cập nhật thành công!");
            loadTable();
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật loại: ", error);
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
      content: "Bạn có chắc muốn xóa loại này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await deleteById(record.maLoai);
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
      dataIndex: "tenLoai",
      key: "tenLoai",
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
      <Row>
        <Col span={12}>
          <SearchInput text="Tìm kiếm loại" />
        </Col>
        <Col span={4} offset={8}>
          <Button type="primary" onClick={showModal}>
            Thêm
          </Button>
          <Modal
            title="Thêm loại"
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleAdd}
          >
            <Form onFinish={handleAdd} form={form}>
              <Form.Item
                label="Tên"
                name="tenLoai"
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
        // onOk={handleUpdate}
        footer={[
          <Button key="cancel" onClick={handleEditCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleUpdate}
            style={{ background: "green", borderColor: "green" }}
          >
            Update
          </Button>,
        ]}
      >
        <Form form={formUpdate} name="editForm" initialValues={editFormData}>
          <Form.Item
            label="Tên"
            name="tenLoai"
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
export default TableLoai;
