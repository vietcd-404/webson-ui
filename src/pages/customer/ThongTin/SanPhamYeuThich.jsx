import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { findAllYThich, xoaYT } from "../../../services/SanPhamYeuThichService";
import Breadcrumbs from "../../../components/customer/pageProps/Breadcrumbs";
import ItemsFavorite from "./ItemsFavorite";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";

const SanPhamYeuThich = () => {
  const [data, setData] = useState([]);

  const loadSanPhamYThich = async () => {
    try {
      const response = await findAllYThich();
      setData(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const handleDelete = (maSanPhamCT) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn xóa sản phẩm này ra danh sách?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await xoaYT(maSanPhamCT);
          if (response.status === 200) {
            toast.success("Xóa thành công!");
            loadSanPhamYThich();
          }
        } catch (error) {
          console.error("Lỗi khi xóa loại: ", error);
          toast.error("Xóa thất bại.");
        }
      },
      onCancel: () => {},
    });
  };

  useEffect(() => {
    loadSanPhamYThich();
  }, []);

  return (
    <div className="max-w-container mx-auto px-4">
      <ToastContainer />
      <Breadcrumbs title="Danh sách yêu thích" />
      <div className="pb-20">
        <div className="mt-5">
          <div className="container mx-auto mb-4 border py-2">
            <div>
              {data.length === 0 ? (
                <>
                  <div>Rất tiếc không có sản phẩm yêu thích nào</div>
                </>
              ) : (
                <>
                  <div className="layout-page-checkout mt-4 mb-5">
                    <div className="page-title mb-2 font-bold text-2xl">
                      Danh sách yêu thích
                    </div>

                    <div className="table-container overflow-x-auto">
                      <table className="page-table table table-hover mb-4">
                        <thead>
                          <tr className="font-bold">
                            <th></th>
                            <th>Sản phẩm</th>
                            <th>Giá sản phẩm</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((item) => (
                            <ItemsFavorite
                              item={item}
                              xoa={() => handleDelete(item.maSanPhamCT)}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanPhamYeuThich;
