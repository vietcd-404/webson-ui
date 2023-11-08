import React, { useEffect, useState } from "react";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Card, Col, Image, Modal, Row, Upload, message } from "antd";
import {
  createAnh,
  findAllAnh,
  findAllAnhSanPham,
  xoaAnh,
} from "../../services/AnhSanPhamService";
import { ToastContainer, toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../pages/customer/Account/AuthProvider";
import ReactPaginate from "react-paginate";
import NavPage from "../customer/pageProps/shopPage/NavPage";

const UploadImage = () => {
  const [totalPages, setTotalPages] = useState(0);
  const [data, setData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [page, setPage] = useState(1);

  const size = 8;

  const handlePageClick = (selectedPage) => {
    setPage(selectedPage);
  };
  const loadTable = async () => {
    try {
      const response = await findAllAnh(page, size);
      setData(response.data.content);
      setTotalPages(response.data.totalPages);
      console.log(response);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  // const hanldAdd = async () => {
  //   try {
  //     const response = await createAnh();
  //     if (response.status === 200) {
  //       console.log(response);

  //       toast.success("Thêm mới thành công!");
  //       loadTable();
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi tạo thương hiệu : ", error);
  //     toast.error("Thêm mới thất bại.");
  //   }
  // };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn xóa thương hiệu này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await xoaAnh(record);
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

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("file", file.originFileObj);
      });

      const response = await createAnh(formData);

      if (response.status === 200) {
        loadTable();
        setFileList([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải lên ảnh: ", error);
      toast.error("Thêm mới thất bại.");
    }
  };

  const handleRemove = (file) => {
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const load = () => {
    toast.success("Tải ảnh thành công!");
    loadTable();
    setFileList([]);
  };
  useEffect(() => {
    loadTable();
  }, [page]);

  return (
    <>
      <ToastContainer />

      <div>
        <Upload
          action="http://localhost:8000/api/anh/upload"
          // Thay đổi URL theo đường dẫn của API tải lên
          listType="picture-card"
          fileList={fileList}
          onRemove={handleRemove}
          onChange={handleFileChange}
        >
          {fileList.length >= 8 ? null : (
            <div>
              <Button icon={<UploadOutlined />}>Tải lên</Button>
            </div>
          )}
        </Upload>
        <Button onClick={load}>Tải lên ảnh</Button>
      </div>
      <div className="mt-6">
        <Row gutter={16}>
          {data.map((item) => (
            <Col span={6} key={item.maAnh}>
              <Card className="mb-4">
                <Image
                  style={{
                    padding: "30px",
                  }}
                  src={`data:image/png;base64,${item.anh}`}
                  width="100%"
                  height="270px"
                  alt={item.anh}
                />
                <Button
                  type="danger"
                  icon={<DeleteOutlined />}
                  size="small"
                  style={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => handleDelete(item.maAnh)}
                />
              </Card>
            </Col>
          ))}
        </Row>
        {/* <div className="mt-4">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={Math.ceil(data.length / ItemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </div> */}
        <div className="mt-7 flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
          <NavPage
            totalPages={totalPages}
            page={page}
            setPage={handlePageClick}
          />
        </div>
      </div>
    </>
  );
};

export default UploadImage;
