import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  chiTietHoaDon,
  hoaDonChiTiet,
  updateSoLuongKhachHang,
  updateSoLuongSanPham,
  updatetHoaDon,
  xoaSanPham,
} from "../../../../services/HoaDonService";
import { useState } from "react";
import { useEffect } from "react";

import axios, { formToJSON } from "axios";
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
import {
  hienHuyen,
  hienTinh,
  hienXa,
} from "../../../../services/GiaoHangNhanhService";
const host = "https://provinces.open-api.vn/api/";

function ThongTinDonHang() {
  const { maHoaDon } = useParams();
  const [messageValue, setMessageValue] = useState(null);

  const [donHang, setDonHang] = useState([]);
  const [data, setData] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(""); //Tỉnh
  const [selectedDistrict, setSelectedDistrict] = useState(""); //Huyện
  const [selectedWard, setSelectedWard] = useState(""); //Xã

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
        phiShip: addressDetails.phiShip,
      }));
      // let foundProvinces =
      //   provinces.length > 0 &&
      //   provinces?.find((item) => item.ProvinceName === addressDetails.tinh);
      // setSelectedProvince(foundProvinces ? foundProvinces.ProvinceID : "");
      // let huyen =
      //   districts.length > 0 &&
      //   districts?.find((item) => item.DistrictName === addressDetails.huyen);
      // setSelectedDistrict(huyen ? huyen.DistrictID : "");
      // let xa =
      //   wards.length > 0 &&
      //   wards?.find((item) => item.WardName === addressDetails.xa);
      // setSelectedWard(xa ? xa.WardCode : "");
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
        const dieuKien = voucher.find((item) => item.dieuKien);
        const tt = donHang.find((item) => item.tongTien);

        if (data && data.length > 1) {
          try {
            const response = await xoaSanPham(ma);
            console.log(response);
            Swal.fire({
              title: "Xóa!",
              text: "Bạn đã xóa thành công.",
              icon: "success",
            });

            loadSanPham();
            loadHoaDonChitiet();
          } catch (error) {
            if (
              error.response &&
              error.response.data &&
              error.response.data.message === "Không đạt điều kiện voucher!"
            ) {
              toast.error("Không đạt điều kiện voucher!");
              return;
            }
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

  const [tongDonGia, setTongDonGia] = useState("");
  useEffect(() => {
    let tongDonGia = 0;

    data.map((item) => {
      tongDonGia += item.donGia * item.soLuong;
      return tongDonGia;
    });
    setTongDonGia(tongDonGia);
  }, [data]);

  const [donGia, setDonGia] = useState("");
  useEffect(() => {
    let donGia = 0;

    data.map((item) => {
      donGia += item.donGia;
      return donGia;
    });
    setDonGia(donGia);
  }, [data]);
  // const handleQuantityChange = async (
  //   event,
  //   maHoaDonCT,
  //   maHoaDon,
  //   maxQuantity,
  //   dieuKienVoucher,
  //   giaBan
  // ) => {
  //   const newQuantity = event.target.value;
  //   if (newQuantity > maxQuantity || newQuantity < 1) {
  //     // You can choose to show an error message or handle it in a way suitable for your application
  //     console.error("Quantity exceeds the maximum limit");
  //     toast.error("Số lượng vượt giới hạn");
  //     return;
  //   }

  //   try {
  //     await updateSoLuongSanPham(
  //       maHoaDonCT,
  //       newQuantity,
  //       maHoaDon,
  //       dieuKienVoucher,
  //       giaBan
  //     );

  //     loadSanPham();
  //     loadHoaDonChitiet();
  //   } catch (error) {
  //     console.error("Failed to update quantity:", error);
  //     toast.error(error.response.data.message);
  //   }
  //   setData((prevData) =>
  //     prevData.map((item) =>
  //       item.maHoaDonCT === maHoaDonCT
  //         ? { ...item, soLuong: newQuantity }
  //         : item
  //     )
  //   );
  // };

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

  const handleQuantityChange = async (action, record) => {
    try {
      let newQuantity;

      if (action === "increment") {
        console.log(record.soLuongTon);
        if (record.soLuongTon > 0) {
          newQuantity = record.soLuong + 1;
        } else {
          message.error("Đạt giới hạn số lượng tồn");
          return;
        }
      } else if (action === "decrement") {
        if (record.soLuong === 1) {
          message.error("Có tối thiều có 1 sản phẩm");
          return;
        }

        if (tongDonGia - record.donGia >= record.dieuKien) {
          newQuantity = record.soLuong - 1;
          console.log(donGia);
          loadSanPham();
          console.log(tongDonGia);
        } else {
          message.error("Không đủ điều kiện voucher");
          return;
        }
      }

      await updateSoLuongKhachHang(
        record.maHoaDonCT,
        newQuantity,
        record.maHoaDon
      );
      loadSanPham();
      loadHoaDonChitiet();
      setData((prevData) =>
        prevData.map((item) =>
          item.maHoaDonCT === record.maHoaDonCT
            ? { ...item, soLuong: newQuantity }
            : item
        )
      );

      console.log("changed", newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      message.error(error.response?.data?.message || "Error updating quantity");
    }
  };
  const [formData, setFormData] = useState({
    tenNguoiNhan: "",
    email: "",
    sdt: "",
    diaChi: "",
    tinh: "",
    huyen: "",
    xa: "",
    phiShip: "",
    diaChiChiTiet: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  ////-------------Load địa chỉ
  useEffect(() => {
    loadProvinces();
  }, []);

  //---------Detail địa chỉ hiện lên
  useEffect(() => {
    console.log();
    let foundProvinces =
      provinces.length > 0 &&
      provinces?.find((item) => item.ProvinceName === formData?.tinh);
    setSelectedProvince(foundProvinces ? foundProvinces.ProvinceID : "");
  }, [provinces]);

  useEffect(() => {
    console.log();
    let foundProvinces =
      districts.length > 0 &&
      districts?.find((item) => item.DistrictName === formData?.huyen);
    setSelectedDistrict(foundProvinces ? foundProvinces.DistrictID : "");
  }, [districts]);

  useEffect(() => {
    console.log();
    let foundProvinces =
      wards.length > 0 && wards?.find((item) => item.WardName === formData?.xa);
    setSelectedWard(foundProvinces ? foundProvinces.WardCode : "");
  }, [wards]);
  //-------------------------------------
  const loadProvinces = async () => {
    try {
      const response = await hienTinh();
      setProvinces(response.data.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const handleProvinceChange = async (provinceId) => {
    setSelectedProvince(provinceId);
    setSelectedProvince("");
    setSelectedWard("");

    try {
      const response = await hienHuyen(provinceId);
      setDistricts(response.data.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const handleDistrictChange = async (districtId) => {
    setSelectedDistrict(districtId);
    setSelectedWard("");
    try {
      const response = await hienXa(districtId);
      setWards(response.data.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  const handleWardChange = (wardId) => {
    setSelectedWard(wardId);
  };

  const handleProvinceChangeaa = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      huyen: "",
      xa: "",
    }));
    const selectedProvinceName = event.target.value;
    const selectedProvince = provinces.find(
      (province) => province.ProvinceName === selectedProvinceName
    );

    setSelectedProvince(selectedProvinceName);
    setFormData((prevFormData) => ({
      ...prevFormData,
      tinh: selectedProvince.ProvinceName,
    }));
    handleProvinceChange(selectedProvince.ProvinceID);
    console.log(selectedProvince.ProvinceName);
  };
  const handleDistrictChangeaaa = (event) => {
    const selectedDistrictName = event.target.value;
    const selectedDistrict = districts.find(
      (district) => district.DistrictName === selectedDistrictName
    );
    setSelectedDistrict(selectedDistrictName);
    setFormData({
      ...formData,
      huyen: selectedDistrict.DistrictName,
    });
    console.log(selectedDistrict.DistrictName);

    handleDistrictChange(selectedDistrict.DistrictID);
  };

  const handleWardChangeaaa = (event) => {
    const selectedWardName = event.target.value;
    const selectedWard = wards.find(
      (wards) => wards.WardName === selectedWardName
    );
    setSelectedWard(selectedWardName);
    setFormData({
      ...formData,
      xa: selectedWard.WardName,
    });
    console.log(selectedWard.WardName);

    handleWardChange(selectedWard.WardCode);
  };
  const [feeShip, setFeeShip] = useState();

  const caculateFee = async () => {
    try {
      const response = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          service_id: null,
          service_type_id: 2,
          to_district_id: Number(selectedDistrict),
          to_ward_code: selectedWard,
          height: 50,
          length: 20,
          weight: 200,
          width: 20,
          insurance_value: 10000,
          cod_failed_amount: 2000,
          coupon: null,
        },
        {
          headers: {
            token: "508b262b-8072-11ee-96dc-de6f804954c9",
            "Content-Type": "application/json",
            ShopId: 4691092,
          },
        }
      );
      setFeeShip(response.data.data.total);
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    if (selectedProvince) {
      handleProvinceChange(selectedProvince);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      handleDistrictChange(selectedDistrict);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedWard) {
      caculateFee();
    } else {
      return;
    }
  }, [selectedWard]);

  ///-----------------------------------
  const navigate = useNavigate();

  const [errors, setErrors] = useState([]);

  const validatePhone = (sdt) => {
    return String(sdt).match(/^0\d{9}$/);
  };
  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.tenNguoiNhan) {
      newErrors.tenNguoiNhan = "Tên người nhận không được trống";
      valid = false;
    }

    // if (!formData.email) {
    //   newErrors.email = "Email không được bỏ trống";
    //   valid = false;
    // }

    // if (!EmailValidation(formData.email)) {
    //   newErrors.email = "Email không hợp lệ";
    //   valid = false;
    // }

    if (!formData.sdt || !validatePhone(formData.sdt)) {
      newErrors.sdt = "Số điện thoại không hợp lệ";
      valid = false;
    }

    if (!formData.tinh) {
      newErrors.tinh = "Vui lòng nhập địa chỉ";
      valid = false;
    }
    if (!formData.huyen) {
      newErrors.huyen = "Vui lòng nhập địa chỉ";
      valid = false;
    }
    if (!formData.xa) {
      newErrors.xa = "Vui lòng nhập địa chỉ";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleUpdateOrder = async () => {
    const updatedFormData = {
      ...formData,
      phiShip: feeShip,
    };
    if (validateForm()) {
      Swal.fire({
        title: "Bạn có chắc không?",
        text: "Bạn có muốn sửa đơn hàng không!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Vâng, tôi muốn!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await updatetHoaDon(maHoaDon, updatedFormData);
            Swal.fire({
              title: "Sửa đơn hàng!",
              text: "Sửa thành công thành công",
              icon: "success",
            });

            // Redirect to the desired page
            navigate("/invoices");
          } catch (error) {
            // Handle errors, such as displaying an error message
            console.log("Lỗi ", error);
            message.error(
              error.response?.data?.message || "Error creating invoice"
            );
          }
        }
      });
    }
  };
  // const socket = new SockJS("http://localhost:8000/api/anh/ws");
  // const stompClient = Stomp.over(socket);

  // useEffect(() => {
  //   stompClient.connect({}, (frame) => {
  //     console.log("Connected: " + frame);

  //     // Đăng ký người nghe cho đường dẫn "/topic/tao-hoa-don"
  //     stompClient.subscribe("/topic/update", (message) => {
  //       const maHoaDon1 = JSON.parse(message.body).maHoaDon;
  //       try {
  //         const response = hoaDonChiTiet(maHoaDon1);
  //         setData(response.data);
  //         console.log(response);
  //       } catch (error) {
  //         console.error("Lỗi khi gọi API: ", error);
  //       }
  //       // Xử lý thông điệp ở đây, có thể cập nhật UI hoặc thực hiện các tác vụ khác
  //     });
  //   });
  // });

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
                {errors.tenNguoiNhan && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errors.tenNguoiNhan}
                  </p>
                )}

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
                {errors.sdt && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errors.sdt}
                  </p>
                )}

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Địa chỉ nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full"
                    placeholder=""
                    disabled
                    value={formData.diaChiChiTiet}
                    // disabled={hoaDon.trangThai !== 0}
                    class="form-control"
                  />
                </div>
                <div className="mb-4">
                  <span className=" text-gray-700 text-sm font-bold">
                    Phí ship:{" "}
                  </span>
                  {hoaDon.phiShip} VNĐ
                </div>
                {/* 
                {hoaDon.trangThai === 0 && (
                  <div className="mb-4" onClick={handleThayDoiClick}>
                    <p className="text-blue-700 hover:underline cursor-pointer">
                      Thay đổi địa chỉ
                    </p>
                  </div>
                )} */}
                <>
                  {hoaDon.trangThai === 0 && (
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
                            value={formData.tinh}
                            onChange={handleProvinceChangeaa}
                            name="tinh"
                          >
                            <option disabled value="">
                              ---Tỉnh/Thành phố---
                            </option>
                            {provinces.map((province) => (
                              <option
                                key={province.ProvinceID}
                                // value={province.ProvinceName}
                              >
                                {province.ProvinceName}
                              </option>
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
                            value={formData.huyen}
                            onChange={handleDistrictChangeaaa}
                            name="huyen"
                          >
                            <option disabled value="">
                              ---Quận/Huyện---
                            </option>
                            {districts.map((district) => (
                              <option
                                key={district.DistrictID}
                                // value={district.DistrictName}
                              >
                                {district.DistrictName}
                              </option>
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
                            value={formData.xa}
                            onChange={handleWardChangeaaa}
                            name="xa"
                          >
                            <option disabled value="">
                              ---Phường/Xã---
                            </option>
                            {wards.map((ward) => (
                              <option
                                key={ward.WardCode}
                                // value={ward.WardName}
                              >
                                {ward.WardName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mb-4 flex items-center">
                        <div className="w-[33%] pr-2">
                          {errors.tinh && (
                            <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                              <span className="font-bold italic mr-1">!</span>
                              {errors.tinh}
                            </p>
                          )}
                        </div>
                        <div className="w-[33%] pr-2">
                          {errors.huyen && (
                            <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                              <span className="font-bold italic mr-1">!</span>
                              {errors.huyen}
                            </p>
                          )}
                        </div>
                        <div className="w-[33%] pr-2">
                          {errors.xa && (
                            <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                              <span className="font-bold italic mr-1">!</span>
                              {errors.xa}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          Địa chỉ chi tiết{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-input w-full"
                          name="diaChi"
                          value={formData.diaChi}
                          class="form-control"
                          onChange={handleChange}
                        />
                      </div>
                    </>
                  )}
                </>
                <div className="mt-2 mb-4">
                  Phí ship:{" "}
                  <span className="text-lg font-bold">
                    + {hoaDon.phiShip.toLocaleString("en-US")} VNĐ
                  </span>
                </div>

                <div className="flex justify-between">
                  {hoaDon.trangThai === 0 && (
                    <div className="p-2 bg-blue-600 border w-[150px] grid place-items-center rounded">
                      <button
                        className="text-white"
                        onClick={() => handleUpdateOrder()}
                      >
                        Thay đổi thông tin
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="table-container overflow-x-auto mt-6">
          <div className="card ml-3 w-[98%]">
            <div className="mb-3">
              <div className="p-5">
                {data.map((item, index) => (
                  <React.Fragment key={index}>
                    {index === 0 && item.trangThai === 0 && (
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-700"
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
                    cong={() => handleQuantityChange("decrement", item)}
                    tru={() => handleQuantityChange("increment", item)}
                    // updateSoLuong={(e) =>
                    //   handleQuantityChange(
                    //     e,
                    //     item.maHoaDonCT,
                    //     item.maHoaDon,
                    //     item.soLuongTon,
                    //     item.dieuKien,
                    //     item.giaBan
                    //   )
                    // }
                    trangThai={item.trangThai !== 0}
                  />
                ))}
              </tbody>
            </table>
            {donHang.map((hoaDon) => (
              <div className="mt-3 ">
                <div className="mb-2">
                  Tổng tiền trước:{" "}
                  <span className="text-lg font-bold">
                    {(hoaDon.tongTien + hoaDon.tienGiam).toLocaleString(
                      "en-US"
                    )}{" "}
                    VNĐ
                  </span>
                </div>
                <div className="mb-2">
                  Phí ship:{" "}
                  <span className="text-lg font-bold">
                    + {hoaDon.phiShip.toLocaleString("en-US")} VNĐ
                  </span>
                </div>
                <div className="mb-2">
                  Voucher:{" "}
                  <span className="text-lg font-bold">
                    -{" "}
                    {(hoaDon.tienGiam ? hoaDon.tienGiam : "0").toLocaleString(
                      "en-US"
                    )}{" "}
                    VNĐ
                  </span>
                </div>
                <div className="">
                  Tổng tiền:{" "}
                  <span className="text-lg font-bold">
                    {(hoaDon.tongTien + hoaDon.phiShip).toLocaleString("en-US")}{" "}
                    VNĐ
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThongTinDonHang;
