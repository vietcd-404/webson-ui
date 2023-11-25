import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  chiTietHoaDon,
  hoaDonChiTiet,
  updateSoLuongSanPham,
  updatetHoaDon,
  xoaSanPham,
} from "../../../../services/HoaDonService";
import { useState } from "react";
import { useEffect } from "react";

import axios from "axios";
import { message } from "antd";

import Swal from "sweetalert2";
import Model from "../../../../components/customer/Model";
import FormSanPham from "./FormSanPham";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

import WebSocketService from "../../../../services/WebSocketService";
import ThemSanPhamVaoHoaDon from "./ThemSanPhamVaoHoaDon";
import { findVoucher } from "../../../../services/VoucherService";
const host = "https://provinces.open-api.vn/api/";

function ThongTinDonHang() {
  const { maHoaDon } = useParams();

  console.log(maHoaDon);
  const [messageValue, setMessageValue] = useState(null);

  const [donHang, setDonHang] = useState([]);
  const [data, setData] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [show, setShow] = useState(false);
  const [showDiaChi, setShowDiaChi] = useState(false);

  // const loadSanPham = async () => {
  //   try {
  //     const response = await chiTietHoaDon(maHoaDon);
  //     setData(response.data[0].hoaDonChiTiet);
  //     console.error("APINNNNNNsdfsdfd: ", response.data[0].hoaDonChiTiet);
  //   } catch (error) {
  //     console.error("Lỗi khi gọi API: ", error);
  //   }
  // };

  const loadSanPham = async () => {
    try {
      const response = await hoaDonChiTiet(maHoaDon);
      setData(response.data);
      console.error("APINNNNNNsdfsdfd: ", response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const loadHoaDonChitiet = async () => {
    try {
      const response = await chiTietHoaDon(maHoaDon);
      setDonHang(response.data);
      const addressDetails = response.data[0];
      setFormData((prevFormData) => ({
        ...prevFormData,
        tenNguoiNhan: addressDetails.tenNguoiNhan,
        sdt: addressDetails.sdt,
        diaChi: addressDetails.diaChi,
        diaChiChiTiet: addressDetails.diaChiChiTiet,
        tinh: addressDetails.tinh,
        huyen: addressDetails.huyen,
        xa: addressDetails.xa,
      }));
      console.log(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const [voucher, setVoucher] = useState([]);
  useEffect(() => {
    loadTableVoucher();
  }, []);

  //Hiện list danh sách lên
  const loadTableVoucher = async () => {
    try {
      const response = await findVoucher();
      setVoucher(response.data);
      console.log(response);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  const [selectedVoucherCode, setSelectedVoucherCode] = useState("");

  const xoaSanPhamCT = (ma) => {
    Swal.fire({
      title: "Bạn có chắc không?",
      text: "Bạn có muốn xóa sản phẩm không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vâng, tôi muốn!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // const voucherCode = selectedVoucherCode;

        // // Tìm thông tin voucher từ mảng voucher
        // const selectedVoucher = voucher.find(
        //   (item) => item.tenVoucher === voucherCode
        // );
        // if (!selectedVoucher) {
        //   // Handle case when selected voucher is not found
        //   toast.error("Voucher not found");
        //   return;
        // }
        // const dieuKien = selectedVoucher.dieuKien;

        // Assuming donHang and data are defined somewhere in your component
        const dieuKien = voucher.find((item) => item.dieuKien);
        const tt = donHang.find((item) => item.tongTien); // Adjust this based on your data structure

        if (data && data.length > 1) {
          try {
            Swal.fire({
              title: "Xóa!",
              text: "Bạn đã xóa thành công.",
              icon: "success",
            });
            const response = await xoaSanPham(ma);
            console.log(response);
            loadSanPham();
            loadHoaDonChitiet();
          } catch (error) {
            toast.error(error.response.data.message);
          }
        } else {
          Swal.fire({
            title: "Không thể xóa!",
            text: "Phải có ít nhất một sản phẩm trong hóa đơn.",
            icon: "warning",
          });
        }
      }
    });
  };
  useEffect(() => {
    loadSanPham();
    loadHoaDonChitiet();
  }, [maHoaDon, messageValue]);

  const [tongTien, setTongTien] = useState("");
  useEffect(() => {
    let tongTien = 0;
    let sanPham = 0;
    data.map((item) => {
      const giaBan = item.giaBan * ((100 - item.phanTramGiam) / 100);
      tongTien += giaBan * item.soLuong;
      return tongTien;
    });
    setTongTien(tongTien);
  }, [data]);
  const handleQuantityChange = async (
    event,
    maHoaDonCT,
    maHoaDon,
    maxQuantity,
    dieuKienVoucher,
    giaBan
  ) => {
    const newQuantity = event.target.value;
    if (newQuantity > maxQuantity || newQuantity < 1) {
      // You can choose to show an error message or handle it in a way suitable for your application
      console.error("Quantity exceeds the maximum limit");
      toast.error("Số lượng vượt giới hạn");
      return;
    }

    try {
      await updateSoLuongSanPham(
        maHoaDonCT,
        newQuantity,
        maHoaDon,
        dieuKienVoucher,
        giaBan
      );

      loadSanPham();
      loadHoaDonChitiet();
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error(error.response.data.message);
    }
    setData((prevData) =>
      prevData.map((item) =>
        item.maHoaDonCT === maHoaDonCT
          ? { ...item, soLuong: newQuantity }
          : item
      )
    );
  };

  //   const handleXoa = async (ma) => {
  //     try {
  //       const response = await xoaGioHang(ma);
  //       if (response.status === 200) {
  //         toast.success("Xóa thành công!");
  //         loadGioHang();
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi xóa loại: ", errogur);
  //       toast.error("Xóa thất bại.");
  //     }
  //   };
  const [formData, setFormData] = useState({
    tenNguoiNhan: "",
    email: "",
    sdt: "",
    diaChi: "",
    tinh: "",
    huyen: "",
    xa: "",
    diaChiChiTiet: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    // Fetch provinces data
    axios.get(host).then((response) => {
      setProvinces(response.data);
    });
  }, []);

  const callApiDistrict = (api) => {
    axios.get(api).then((response) => {
      setDistricts(response.data.districts);
    });
  };

  const callApiWard = (api) => {
    axios.get(api).then((response) => {
      setWards(response.data.wards);
    });
  };
  const handleProvinceChange = (event) => {
    const selectedProvinceName = event.target.value;
    const selectedProvince = provinces.find(
      (province) => province.name === selectedProvinceName
    );
    setSelectedProvince(selectedProvinceName);
    setFormData({
      ...formData,
      tinh: selectedProvince.name,
    });
    callApiDistrict(host + "p/" + selectedProvince.code + "?depth=2");
  };

  const handleDistrictChange = (event) => {
    const selectedDistrictName = event.target.value;
    const selectedDistrict = districts.find(
      (district) => district.name === selectedDistrictName
    );
    setSelectedDistrict(selectedDistrictName);
    setFormData({
      ...formData,
      huyen: selectedDistrict.name,
    });
    callApiWard(host + "d/" + selectedDistrict.code + "?depth=2");
  };
  const handleThayDoiClick = () => {
    const selectedDistr = districts.find(
      (district) => district.name === formData.huyen
    );
    const selectedProvince = provinces.find(
      (province) => province.name === formData.tinh
    );
    // Toggle the state to show/hide the additional interface
    setShow(!show);
    if (!show) {
      if (selectedDistr) {
        callApiWard(host + "d/" + selectedDistr.code + "?depth=2");
      } else if (selectedProvince) {
        callApiDistrict(host + "p/" + selectedProvince.code + "?depth=2");
      }
    }

    if (!show) {
      setSelectedProvince(formData.tinh);
      setSelectedDistrict(formData.huyen);
      setSelectedWard(formData.xa);
    }
  };
  const handleWardChange = (event) => {
    const wardCode = event.target.value;
    setSelectedWard(wardCode);
    setFormData({
      ...formData,
      xa: wardCode,
    });
  };
  const navigate = useNavigate();

  const handleUpdateOrder = async () => {
    try {
      await updatetHoaDon(maHoaDon, formData);
      Swal.fire({
        title: "Sửa hóa đơn!",
        text: "Sửa thành công thành công",
        icon: "success",
      });

      // Redirect to the desired page
      navigate("/invoices");
    } catch (error) {
      // Handle errors, such as displaying an error message
      console.log("Lỗi ", error);
      message.error(error.response?.data?.message || "Error creating invoice");
    }
  };
  const socket = new SockJS("http://localhost:8000/api/anh/ws");
  const stompClient = Stomp.over(socket);

  useEffect(() => {
    stompClient.connect({}, (frame) => {
      console.log("Connected: " + frame);

      // Đăng ký người nghe cho đường dẫn "/topic/tao-hoa-don"
      stompClient.subscribe("/topic/update", (message) => {
        const maHoaDon1 = JSON.parse(message.body).maHoaDon;
        try {
          const response = hoaDonChiTiet(maHoaDon1);
          setData(response.data);
          console.log(response);
        } catch (error) {
          console.error("Lỗi khi gọi API: ", error);
        }
        // Xử lý thông điệp ở đây, có thể cập nhật UI hoặc thực hiện các tác vụ khác
      });
    });
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    loadSanPham();
    loadHoaDonChitiet();
  };

  return (
    <div>
      <h5>Thông tin đơn hàng</h5>
      <div>
        <div>
          <WebSocketService setValue={setMessageValue} connetTo="orderStatus" />
          <ToastContainer />
          {data.map((item, index) => (
            <React.Fragment key={index} className="p-2 bg-slate-400">
              {index === 0 && item.dieuKien && (
                <div className="text-3xl">
                  Bạn đã áp voucher không thể sửa được số lượng hóa đơn này
                </div>
              )}
            </React.Fragment>
          ))}
          {donHang.map((hoaDon) => (
            <div className="container mx-auto mt-8">
              <div className="border rounded p-4" key={hoaDon.maHoaDon}>
                <div className="border-b-2 p-2 mb-4">
                  <span className="font-bold text-lg">Thông tin nhận hàng</span>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-3">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tenNguoiNhan}
                    className="w-full"
                    class="form-control"
                    name="tenNguoiNhan"
                    onChange={handleChange}
                    disabled={hoaDon.trangThai !== 0}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Số điện thoại<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sdt}
                    className="w-full"
                    class="form-control"
                    name="sdt"
                    disabled={hoaDon.trangThai !== 0}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Địa chỉ nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full"
                    placeholder=""
                    value={formData.diaChiChiTiet}
                    disabled={hoaDon.trangThai !== 0}
                    class="form-control"
                  />
                </div>

                {hoaDon.trangThai === 0 && (
                  <div className="mb-4" onClick={handleThayDoiClick}>
                    <p className="text-blue-700 hover:underline cursor-pointer">
                      Thay đổi địa chỉ
                    </p>
                  </div>
                )}
                {show && (
                  <>
                    <div className="mb-4 flex items-center">
                      <div className="w-[33%] pr-2">
                        <label
                          htmlFor="province"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Tỉnh thành <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="form-select w-full p-2 border border-gray-300 rounded-md"
                          value={selectedProvince}
                          onChange={handleProvinceChange}
                          name="tinh"
                        >
                          <option disabled value="">
                            Chọn
                          </option>
                          {provinces.map((province) => (
                            <option>{province.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-[33%] pr-2">
                        <label
                          htmlFor="district"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Quận huyện <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="form-select w-full p-2 border border-gray-300 rounded-md"
                          value={selectedDistrict}
                          onChange={handleDistrictChange}
                          name="huyen"
                        >
                          <option disabled value="">
                            Chọn
                          </option>
                          {districts.map((district) => (
                            <option>{district.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-[33%] pr-2">
                        <label
                          htmlFor="ward"
                          className="block text-gray-700 text-sm font-bold mb-2"
                        >
                          Phường xã <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="form-select w-full p-2 border border-gray-300 rounded-md"
                          value={selectedWard}
                          onChange={handleWardChange}
                          name="xa"
                        >
                          <option disabled value="">
                            Chọn
                          </option>
                          {wards.map((ward) => (
                            <option>{ward.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Địa chỉ chi tiết <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-input w-full"
                        name="diaChi"
                        class="form-control"
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  {hoaDon.trangThai === 0 && (
                    <div className="p-1 bg-blue-600 border w-[90px] grid place-items-center rounded">
                      <button
                        className="text-white"
                        onClick={handleUpdateOrder}
                      >
                        Lưu
                      </button>
                    </div>
                  )}
                  <div>
                    Tổng tiền:{" "}
                    <span className="text-lg font-bold">
                      {hoaDon.tongTien} đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="table-container overflow-x-auto">
          <p className="font-bold">Danh sách sản phẩm</p>
          <table className="page-table table table-hover mb-4">
            <thead>
              <tr className="font-bold">
                <th></th>
                <th>Sản phẩm</th>
                <th>Giá sản phẩm</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <FormSanPham
                  item={item}
                  xoa={() => xoaSanPhamCT(item.maHoaDonCT)}
                  updateSoLuong={(e) =>
                    handleQuantityChange(
                      e,
                      item.maHoaDonCT,
                      item.maHoaDon,
                      item.soLuongTon,
                      item.dieuKien,
                      item.giaBan
                    )
                  }
                  trangThai={item.trangThai !== 0 || item.dieuKien}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div className="p-4">
            {data.map((item, index) => (
              <React.Fragment key={index}>
                {index === 0 && !item.dieuKien && item.trangThai === 0 && (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={openModal}
                  >
                    Thêm sản phẩm
                  </button>
                )}
              </React.Fragment>
            ))}

            <Model
              isOpen={isModalOpen}
              closeModal={closeModal}
              title="Thêm sản phẩm vào hóa đơn"
              content={<ThemSanPhamVaoHoaDon maHoaDon={maHoaDon} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThongTinDonHang;
