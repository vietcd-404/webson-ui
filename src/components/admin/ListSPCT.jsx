import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Space,
  Row,
  Col,
  Checkbox,
  Menu,
  Switch,
  Input,
  Select,
  Card,
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
  updateSPCTStatus,
} from "../../services/SanPhamChiTietService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  findAllAnhSanPham,
  xoaAnhSanPham,
} from "../../services/AnhSanPhamService";
import ModalUpdateSPCT from "./ModalUpdateSPCT";
import { loadAllMau } from "../../services/MauService";
import { loadAllSanPham } from "../../services/SanPhamService";
import { loadAllLoai } from "../../services/LoaiService";
import { loadAllThuongHieu } from "../../services/ThuongHieuService";

const { Option } = Select;

const ListSPCT = () => {
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);
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

  // Search tên
  const [searchTenSP, setSearchTenSP] = useState("");

  // Thay đổi trạng thái
  const [switchStatus, setSwitchStatus] = useState({});

  // Tìm kiếm phân trang
  const [filterValues, setFilterValues] = useState({
    tenSanPham: "",
    tenLoai: "",
    tenMau: "",
    tenThuongHieu: "",
  });

  const [mauList, setMauList] = useState([]);
  const [sanPhamList, setSanPhamList] = useState([]);
  const [loaiList, setLoaiList] = useState([]);
  const [thuongHieuList, setThuongHieuList] = useState([]);

  // Select Combobox
  const [selectedSanPham, setSelectedSanPham] = useState(null);
  const [selectedLoai, setSelectedLoai] = useState(null);
  const [selectedMau, setSelectedMau] = useState(null);
  const [selectedThuongHieu, setSelectedThuongHieu] = useState(null);

  useEffect(() => {
    loadTable();
    loadAvailableImages();
    showImageModal();
    fetchMauList();
    fetchSanPhamList();
    fetchLoaiList();
    fetchThuongHieuList();
  }, []);

  // Thêm, sửa, xóa ảnh
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
  // Sửa thông tin sản phẩm chi tiết
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

  const showEditSPCT = (record) => {
    setVisibleModal(true);
    setDataEdit(record);
  };
  const cancelEditSPCT = () => {
    setVisibleModal(false);
  };

  // Hiển thị thông tin lên table
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

  // Hiển thị model cập nhập ảnh
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
            setVisibleModal(false);
            toast.success("Cập nhật thành công!");
            loadTable();
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật sản phẩm : ", error);
          if (error.errorFields && error.errorFields.length > 0) {
            toast.error("Cập nhật thất bại.");
            return;
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
  const handleSwitchChange = async (record, checked) => {
    const trangThaiValue = checked ? 1 : 0;
    console.log(trangThaiValue);
    try {
      const response = await updateSPCTStatus(
        { ...record, trangThai: checked ? 1 : 0 },
        record.maSanPhamCT
      );
      if (response.status === 200) {
        setSwitchStatus((prevStatus) => ({
          ...prevStatus,
          [record.maSanPhamCT]: checked,
        }));
        toast.success("Cập nhật trạng thái thành công!");
        loadTable();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái người dùng: ", error);
      toast.error("Cập nhật trạng thái thất bại.");
    }
  };

  // Filter và tìm kiếm
  const fetchMauList = async () => {
    try {
      const response = await loadAllMau();
      setMauList(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách màu: ", error);
    }
  };

  const fetchSanPhamList = async () => {
    try {
      const response = await loadAllSanPham();
      setSanPhamList(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm: ", error);
    }
  };

  const fetchLoaiList = async () => {
    try {
      const response = await loadAllLoai();
      setLoaiList(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách loại: ", error);
    }
  };

  const fetchThuongHieuList = async () => {
    try {
      const response = await loadAllThuongHieu();
      setThuongHieuList(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách thương hiệu: ", error);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilterValues({ ...filterValues, [name]: String(value) }); // Convert value to string
  };

  const handleFilter = () => {
    const filtered = data.filter(
      (item) =>
        item.tenSanPham
          .toLowerCase()
          .includes(filterValues.tenSanPham.toLowerCase()) &&
        item.tenLoai
          .toLowerCase()
          .includes(filterValues.tenLoai.toLowerCase()) &&
        item.tenMau.toLowerCase().includes(filterValues.tenMau.toLowerCase()) &&
        item.tenThuongHieu
          .toLowerCase()
          .includes(filterValues.tenThuongHieu.toLowerCase())
    );
    if (filtered.length === 0) {
      setDataFilter([{}]);
    } else {
      setDataFilter(filtered);
    }
  };

  // Đặt lại dữ liệu lọc về rỗng để hiển thị toàn bộ dữ liệu

  const handleResetFilter = () => {
    setFilterValues({
      tenSanPham: "",
      tenLoai: "",
      tenMau: "",
      tenThuongHieu: "",
    });
    setDataFilter([]);
    setSelectedSanPham(null);
    setSelectedLoai(null);
    setSelectedMau(null);
    setSelectedThuongHieu(null);
    loadTable();
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "tenSanPham",
      key: "tenSanPham",
      filteredValue: [searchTenSP],
      onFilter: (value, record) => {
        return String(record.tenSanPham)
          .toLowerCase()
          .includes(value.toLowerCase());
      },
      width: 150,
    },
    {
      title: "Tên loại",
      dataIndex: "tenLoai",
      key: "tenLoai",
      // width: 70,
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
      // width: 70,
    },
    {
      title: "Giá bán",
      dataIndex: "giaBan",
      key: "giaBan",
      sorter: (a, b) => a.giaBan - b.giaBan,
      ellipsis: true,
      // width: 95,
    },
    {
      title: "Số lượng",
      dataIndex: "soLuongTon",
      key: "soLuongTon",
      sorter: (a, b) => a.soLuongTon - b.soLuongTon,
      ellipsis: true,
      // width: 105,
    },
    {
      title: "Phần trăm giảm",
      dataIndex: "phanTramGiam",
      key: "phanTramGiam",
      width: 80,
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
      width: 70,
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
      width: 250,
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
      width: 130,
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
      <div className="mb-2 mt-2">
        <Input.Search
          placeholder="Tìm kiếm sản phẩm ..."
          onSearch={(value) => {
            setSearchTenSP(value);
          }}
          onChange={(e) => {
            setSearchTenSP(e.target.value);
          }}
        />
      </div>
      <Card title="Lọc sản phẩm" bordered={true} className="mb-2">
        <form
          className="mb-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleFilter();
          }}
        >
          <Select
            style={{ width: 200, marginRight: 8 }}
            placeholder="Chọn tên sản phẩm"
            onChange={(value) => {
              handleFilterChange("tenSanPham", value);
              setSelectedSanPham(value);
            }}
            value={selectedSanPham} // Thiết lập giá trị đã chọn
          >
            {sanPhamList.map((sanPham) => (
              <Option key={sanPham.maSanPham} value={sanPham.tenSanPham}>
                {sanPham.tenSanPham}
              </Option>
            ))}
          </Select>

          {/* Combobox cho lựa chọn loại */}
          <Select
            style={{ width: 200, marginRight: 8 }}
            placeholder="Chọn tên loại"
            onChange={(value) => {
              handleFilterChange("tenLoai", value);
              setSelectedLoai(value);
            }}
            value={selectedLoai}
          >
            {loaiList.map((loai) => (
              <Option key={loai.maLoai} value={loai.tenLoai}>
                {loai.tenLoai}
              </Option>
            ))}
          </Select>

          <Select
            style={{ width: 200, marginRight: 8 }}
            placeholder="Chọn màu"
            onChange={(value) => {
              handleFilterChange("tenMau", value);
              setSelectedMau(value);
            }}
            value={selectedMau}
          >
            {mauList.map((mau) => (
              <Option key={mau.maMau} value={mau.tenMau}>
                {mau.tenMau}
              </Option>
            ))}
          </Select>

          <Select
            style={{ width: 200, marginRight: 8 }}
            placeholder="Chọn tên thương hiệu"
            onChange={(value) => {
              handleFilterChange("tenThuongHieu", value);
              setSelectedThuongHieu(value);
            }}
            value={selectedThuongHieu}
          >
            {thuongHieuList.map((th) => (
              <Option key={th.maThuongHieu} value={th.tenThuongHieu}>
                {th.tenThuongHieu}
              </Option>
            ))}
          </Select>

          <Button className="mr-2" type="primary" htmlType="submit">
            Lọc
          </Button>
          <Button onClick={handleResetFilter} htmlType="submit">
            Clear
          </Button>
        </form>
      </Card>

      <ToastContainer />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table
          columns={columns}
          dataSource={dataFilter.length > 0 ? dataFilter : data}
          pagination={{
            pageSize: 6,
            total: totalPage,
          }}
        />
      )}
    </div>
  );
};

export default ListSPCT;
