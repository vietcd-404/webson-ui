import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  hienHoaDon,
  hienHoaDonTatCa,
} from "../../../../services/HoaDonService";
import { useState } from "react";
import WebSocketService from "../../../../services/WebSocketService";

const DangGiao = () => {
  const getStatusClassName = (status) => {
    switch (status) {
      case 0:
        return "bg-gray-700 text-white";
      case 1:
        return "bg-green-500 text-white";
      case 2:
        return "bg-yellow-500 text-white";
      case 3:
        return "bg-blue-500 text-white";
      case 4:
        return "bg-red-500 text-white";
      default:
        return "bg-gray-700 text-white";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Chờ xác nhận";
      case 1:
        return "Xác nhận";
      case 2:
        return "Đang giao";
      case 3:
        return "Hoàn thành";
      case 4:
        return "Đã hủy";
      default:
        return "Chờ xác nhận";
    }
  };
  const [data, setData] = useState([]);
  const [messageValue, setMessageValue] = useState(null);

  const loadGioHang = async () => {
    try {
      const response = await hienHoaDon(2);
      setData(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  useEffect(() => {
    loadGioHang();
  }, [messageValue]);
  return (
    <div>
      <WebSocketService setValue={setMessageValue} connetTo="orderStatus" />

      {data.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        data.map((item) => (
          <div className=" hover:shadow-lg border p-3 shadow-md mb-3">
            <div className="shop-header shop-row">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <span className="mr-2"></span>
                  <span className="ml-2">Đơn hàng đã được tạo ngày </span>
                  <strong> {item.ngayTao}</strong>
                </div>
                <div
                  className={`border rounded  p-1 ${getStatusClassName(
                    item.trangThai
                  )}`}
                >
                  <div className="text-white">
                    {getStatusText(item.trangThai)}
                  </div>
                </div>
              </div>
            </div>
            <div className="shop-body">
              <div className="order-item flex items-center">
                {/* <a
              href="/nuoc-hoa-versace-eros-cho-nam-say-dam-phai-nu-minisize-5ml-ph008740"
              className="item-pic"
            >
              <img
                src="https://cdn.vuahanghieu.com/unsafe/500x0/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2019/10/nuoc-hoa-versace-eros-cho-nam-say-dam-phai-nu-minisize-5ml-5db936dcd37ed-30102019140812.jpg"
                alt="Product"
                className="w-16 h-16 object-cover"
              />
            </a> */}
                <div className="flex flex-col ml-4 mb-1">
                  {/* <a
                href="/nuoc-hoa-versace-eros-cho-nam-say-dam-phai-nu-minisize-5ml-ph008740"
                className="item-main"
              >
                Nước Hoa Nam Versace Eros Man EDT 5ml
              </a> */}
                  {/* <div className="item-sku">
                <span className="info">Số lượng: </span>
                <span className="text">1</span>
              </div> */}
                </div>
                {/* <div className="ml-auto">
              <div className="item-quantity">
                <span className="text-gray-500">Thành tiền: </span>
                <span className="text-red-400">250.000 đ</span>
              </div>
            </div> */}
              </div>
              <hr />
              <div className="flex flex-col items-end">
                <div className="mt-2 flex space-x-4">
                  <p className=" text-lg">Tổng số tiền:</p>
                  <span className="font-bold text-lg">{item.tongTien} đ</span>
                </div>
                <div className=" ml-4 flex justify-items-end mt-3 ">
                  {item.trangThai === 0 && (
                    <div className="border-[3px] mr-2 border-red-600">
                      {" "}
                      <button
                        className=" py-1 px-3 mr-2 text-red-600 uppercase"
                        type="button"
                      >
                        Hủy
                      </button>
                    </div>
                  )}

                  <div className="border-[3px] border-black">
                    <Link to={`/information/${item.maHoaDon}`}>
                      <button className="py-1 px-3 uppercase">Chi tiết</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DangGiao;
