import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Space,
  Row,
  Col,
  message,
  Checkbox,
  Menu,
  Form,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  FileImageOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  addImage,
  deleteSPCT,
  findAllSPCT,
  listImageSanPham,
  updateSPCT,
} from "../../services/SanPhamChiTietService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  findAllAnhSanPham,
  xoaAnhSanPham,
} from "../../services/AnhSanPhamService";
import ModalUpdateSPCT from "./ModalUpdateSPCT";

const ListSPCT = () => {
  const [data, setData] = useState([]);
  // const [dataAnh, setDataAnh] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPage, setTotalPage] = useState(1);
  const [visibleImageModal, setVisibleImageModal] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [selectedProductImages, setSelectedProductImages] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [availableImages, setAvailableImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [dataEdit, setDataEdit] = useState([]);

  useEffect(() => {
    loadTable();
    loadAvailableImages();
    showImageModal();
  }, []);

  const loadAvailableImages = async () => {
    try {
      const response = await findAllAnhSanPham();
      setAvailableImages(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách ảnh: ", error);
    }
  };

  const handleProductSelect = (product) => {
    setIsModal(true);
    setSelectedProduct(product);
  };

  const handleImageSelect = (ma) => {
    if (selectedImages.includes(ma)) {
      setSelectedImages(
        selectedImages.filter((selectedImage) => selectedImage !== ma)
      );
    } else {
      setSelectedImages([...selectedImages, ma]);
    }
  };
  const showEditSPCT = (record) => {
    setVisibleModal(true);
    setDataEdit(record);
  };
  const cancelEditSPCT = () => {
    setVisibleModal(false);
  };

  const handleAddSelectedImages = async () => {
    if (
      !selectedProduct ||
      !selectedProduct.maSanPhamCT ||
      selectedImages.length === 0
    ) {
      toast.error("Vui lòng chọn ảnh.");
      return;
    }

    try {
      const response = await addImage(
        selectedProduct.maSanPhamCT,
        selectedImages
      );
      if (response.status === 200) {
        toast.success("Thêm ảnh thành công!");
        setIsModal(false);
        console.log(response);
        loadAvailableImages();
        setSelectedImages([]);
      }
    } catch (error) {
      console.error("Lỗi khi thêm ảnh: ", error);
      toast.error("Thêm ảnh thất bại.");
    }
  };

  const loadTable = async () => {
    try {
      const response = await findAllSPCT();
      setData(response.data);
      setTotalPage(response.totalPage);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
      setLoading(false);
    }
  };

  const showImageModal = async (record) => {
    try {
      const productImages = await listImageSanPham(record.maSanPhamCT);
      setSelectedProductImages(productImages.data);
      setVisibleImageModal(true);
    } catch (error) {
      console.error("Lỗi khi tải danh sách ảnh sản phẩm: ", error);
    }
  };

  const handleUpdate = (value) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn cập nhập sản phẩm không?",
      okText: "OK",
      okType: "danger",
      cancelText: "Đóng",
      onOk: async () => {
        try {
          const response = await updateSPCT(dataEdit.maSanPhamCT, value);
          if (response.status === 200) {
            console.log(response);
            setVisibleModal(false);
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
          const response = await deleteSPCT(record.maSanPhamCT);
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

  const handleDeleteAnh = (record) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn xóa sản phẩm này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await xoaAnhSanPham(record);
          if (response.status === 200) {
            toast.success("Xóa thành công!");
            loadAvailableImages();
            setVisibleImageModal(false);
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
      title: "Tên sản phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
    },
    {
      title: "Tên loại",
      dataIndex: "tenLoai",
      key: "tenLoai",
    },
    {
      title: "Tên thương hiệu",
      dataIndex: "tenThuongHieu",
      key: "tenThuongHieu",
    },
    {
      title: "Tên màu",
      dataIndex: "tenMau",
      key: "tenMau",
    },
    {
      title: "Giá bán",
      dataIndex: "giaBan",
      key: "giaBan",
    },
    {
      title: "Số lượng tồn",
      dataIndex: "soLuongTon",
      key: "soLuongTon",
    },
    {
      title: "Phần trăm giảm",
      dataIndex: "phanTramGiam",
      key: "phanTramGiam",
    },
    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (trangThai) =>
        trangThai === 0 ? "Hoạt động" : "Không hoạt động",
    },
    {
      title: "Danh sách ảnh",
      dataIndex: "danhSachAnh",
      key: "danhSachAnh",
      render: (_, record) => (
        <Space>
          <Button onClick={() => showImageModal(record)}>
            <FileImageOutlined /> Xem ảnh
          </Button>
          <Button onClick={() => handleProductSelect(record)}>
            <PlusOutlined /> Thêm ảnh
          </Button>
        </Space>
      ),
    },

    {
      title: "Chức năng",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => showEditSPCT(record)}>
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
      <ModalUpdateSPCT
        visible={visibleModal}
        hidden={cancelEditSPCT}
        dataEdit={dataEdit}
        save={handleUpdate}
      ></ModalUpdateSPCT>
      <Modal
        title="Chọn ảnh để thêm"
        visible={isModal}
        onCancel={() => setIsModal(false)}
        onOk={handleAddSelectedImages}
      >
        <Button onClick={loadAvailableImages} className="mb-4">
          Tải danh sách ảnh
        </Button>
        <Menu>
          <Row gutter={16} style={{ maxHeight: "50vh" }} className="scroll">
            {availableImages.map((image) => (
              <Col span={5}>
                <div key={image.maAnh}>
                  <label>
                    <Checkbox
                      checked={selectedImages.includes(image.maAnh)}
                      onChange={() => handleImageSelect(image.maAnh)}
                    />
                    <img
                      width="100%"
                      style={{ margin: "10px", padding: "3px" }}
                      src={`data:image/png;base64,${image.anh}`}
                      alt="Ảnh"
                    />
                  </label>
                </div>
              </Col>
            ))}
          </Row>
        </Menu>

        {/* <Button onClick={handleAddSelectedImages}>Thêm ảnh</Button> */}
      </Modal>
      <Modal
        title="Danh sách ảnh sản phẩm"
        visible={visibleImageModal}
        onCancel={() => setVisibleImageModal(false)}
        footer={null}
      >
        {selectedProductImages.length === 0 ? (
          <p>Không có ảnh</p>
        ) : (
          <Row gutter={16}>
            {selectedProductImages.map((image, index) => (
              <Col span={8} key={index}>
                <img
                  width="100%"
                  src={`data:image/png;base64,${image.anh}`}
                  alt="Ảnh"
                />
                <Button
                  type="danger"
                  icon={<DeleteOutlined />}
                  size="small"
                  style={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => handleDeleteAnh(image.maAnh)}
                />
              </Col>
            ))}
          </Row>
        )}
      </Modal>
      <ToastContainer />
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

export default ListSPCT;
