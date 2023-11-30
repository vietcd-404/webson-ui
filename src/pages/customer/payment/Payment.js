import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../components/customer/pageProps/Breadcrumbs";
import axios, { Axios } from "axios";
import { format, set } from "date-fns";
import Item from "antd/es/list/Item";
import Swal from "sweetalert2";
import { taoHoaDon, taoHoaDonKhach } from "../../../services/HoaDonService";
import { message } from "antd";
import { findGioHang } from "../../../services/GioHangService";
import { useAuth } from "../Account/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import { resetCart } from "../../../redux/orebiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Model from "../../../components/customer/Model";
import ModelVoucher from "../../../components/customer/ModelVoucher";
import { findVoucher } from "../../../services/VoucherService";
import { thanhToanVnPay } from "../../../services/VnPayService";
import { RingLoader } from "react-spinners";
import WebSocketService from "../../../services/WebSocketService";
import { findAllDiaChi } from "../../../services/DiaChiService";

/* <p>Payment gateway only applicable for Production build.</p>
        <Link to="/">
          <button className="w-52 h-10 bg-primeColor text-white text-lg mt-4 hover:bg-black duration-300">
            Explore More
          </button>
        </Link> */
const host = "https://provinces.open-api.vn/api/";

const Payment = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [data, setData] = useState([]);
  const [totalAmt, setTotalAmt] = useState("");
  const [soLuong, setSoLuong] = useState("");

  const products = useSelector((state) => state.orebiReducer.products);

  const configApi = {
    headers: {
      token: "508b262b-8072-11ee-96dc-de6f804954c9",
      "Content-Type": "application/json",
      ShopId: 124173,
    },
  };
  const [errors, setErrors] = useState([]);

  const dispatch = useDispatch();

  const [tongTien1, setTongTien1] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const [soLuong, setSoLuong] = useState(0);

  const [formData, setFormData] = useState({
    tenNguoiNhan: "",
    email: "",
    sdt: "",
    diaChi: "",
    tinh: "",
    huyen: "",
    xa: "",
    tenPhuongThuc: "",
  });
  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };
  const validatePhone = (sdt) => {
    return String(sdt).match(/^0?\d{10}$/);
  };
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.tenNguoiNhan) {
      newErrors.tenNguoiNhan = "Tên người nhận không được trống";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email không được bỏ trống";
      valid = false;
    }

    if (!EmailValidation(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      valid = false;
    }

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
  const { user } = useAuth();

  useEffect(() => {
    // Assuming user.email is the property containing the user's email
    if (user) {
      setFormData({
        ...formData,
        email: user.email,
        sdt: user.sdt,
        tenNguoiNhan: user.ho + " " + user.tenDem + " " + user.ten,
        // You can set other user-related data here if needed
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const load = () =>
    axios.get(host).then((response) => {
      setProvinces(response.data);
      console.log(response);
    });

  useEffect(() => {
    load();
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

  const [tamTinh, setTamTinh] = useState("");

  useEffect(() => {
    let tongTien = 0;
    data.map((item) => {
      const giaBan = item.giaBan * ((100 - item.phanTramGiam) / 100);
      tongTien += giaBan * item.soLuong;
      return tongTien;
    });
    setTongTien1(tongTien);
  }, [data]);
  useEffect(() => {
    let tongTien = 0;
    data.map((item) => {
      const giaBan = item.giaBan * ((100 - item.phanTramGiam) / 100);
      tongTien += giaBan * item.soLuong;
      return tongTien;
    });
    setTamTinh(tongTien);
  }, [data]);

  // useEffect(() => {
  //   let sl = 0;
  //   products.map((item) => {
  //     sl = item.soLuong;
  //     return sl;
  //   });
  //   setSoLuong(sl);
  // }, [products]);
  useEffect(() => {
    // Calculate the total quantity for each product
    const updatedProducts = products.map((item) => {
      const totalQuantity = item.soLuong; // You can perform any other calculations here
      return {
        ...item,
        soLuong: totalQuantity,
      };
    });

    // Update the state with the products containing the total quantity information
    setSoLuong(updatedProducts);
  }, [products]);

  useEffect(() => {
    let tt = 0;
    products.map((item) => {
      const giaBan = item.giaBan * ((100 - item.phanTramGiam) / 100);
      tt += item.giaBan * item.soLuong;
      return tt;
    });
    setTotalAmt(tt);
  }, [products]);

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

  const handleWardChange = (event) => {
    const wardCode = event.target.value;
    setSelectedWard(wardCode);
    setFormData({
      ...formData,
      xa: wardCode,
    });
  };

  const loadGioHang = async () => {
    try {
      const response = await findGioHang();
      setData(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  useEffect(() => {
    loadGioHang();
  }, []);

  const printResultf = async () => {
    if (data.length === 0) {
      toast.error("Không có sản phẩm trong giỏ hàng");
      return;
    }
    if (validateForm()) {
      setLoading(true);
      try {
        if (!formData.tenPhuongThuc) {
          toast.error("Vui lòng chọn phương thức thanh toán");
          return;
        }
        const updatedFormData = {
          ...formData,
          tenVoucher: selectedVoucherCode,
        };

        const maGH = data[0].maGH;

        await taoHoaDon(maGH, updatedFormData);
        setLoading(true);
        Swal.fire({
          title: "Tạo hóa đơn!",
          text: "Tạo hóa đơn thành công",
          icon: "success",
        });

        // Redirect to the desired page
        navigate("/shop");
      } catch (error) {
        // Handle errors, such as displaying an error message
        console.log("Lỗi ", error);
        toast.error(error.response.data.message);
        setLoading(false);
      }
    }
  };

  const thanhToanVNPay = async () => {
    try {
      var totalAmount = parseInt(totalAmt, 10);

      if (
        isNaN(totalAmount) ||
        totalAmount < 5000 ||
        totalAmount >= 1000000000
      ) {
        // Nếu số tiền không hợp lệ, xử lý lỗi ở đây (ví dụ: hiển thị thông báo)
        console.error("Số tiền không hợp lệ");
        console.log(totalAmount);

        // Hiển thị thông báo lỗi cho người dùng hoặc thực hiện các bước khác để xử lý lỗi.
      } else {
        const response = await thanhToanVnPay(totalAmount);
        const thanhToanUrl = response.data.url;
        window.location.href = thanhToanUrl;
        console.log(totalAmount);
      }
      // Nếu số tiền hợp lệ, thực hiện thanh toán

      // Tiếp tục xử lý dữ liệu hoặc thực hiện các bước tiếp theo sau khi thanh toán thành công.
    } catch (error) {
      // Handle errors, such as displaying an error message
      console.log("Lỗi ", error);
      toast.error(error.response.data.message);
    }
  };
  const [loading, setLoading] = useState(false);
  const [thanhCong, setThanhCong] = useState(false);

  const hanldeOrderKhachHAang = async () => {
    if (products.length === 0) {
      toast.error("Không có sản phẩm trong giỏ hàng");
      return;
    }
    if (validateForm()) {
      setLoading(true);
      try {
        if (!formData.tenPhuongThuc) {
          toast.error("Vui lòng chọn phương thức thanh toán");
          return;
        }
        const maSanPhamCT = products.map((product) => product.maSanPhamCT);
        const maSanPhamCTArray = products.map((product) => ({
          maSanPhamCT: product.maSanPhamCT,
          soLuong: product.soLuong,
        }));

        maSanPhamCTArray.forEach((item) => {
          console.log(`ID: ${item.maSanPhamCT}, Số lượng: ${item.soLuong}`);
        });

        const updatedFormData = {
          ...formData,
          tongTien: totalAmt,
          soLuongList: maSanPhamCTArray.map((item) => item.soLuong),
        };
        if (formData.tenPhuongThuc === "MONEY") {
          await taoHoaDonKhach(maSanPhamCT, updatedFormData);
          setLoading(true);
          Swal.fire({
            title: "Tạo hóa đơn!",
            text: "Tạo hóa đơn thành công",
            icon: "success",
          });
          navigate("/shop");
          dispatch(resetCart());
        } else if (formData.tenPhuongThuc === "ELECTRONIC_WALLET") {
          setLoading(true);
          thanhToanVNPay();
          await taoHoaDonKhach(maSanPhamCTArray, updatedFormData);

          dispatch(resetCart());
        } else {
        }

        dispatch(resetCart());
        // Redirect to the desired page
      } catch (error) {
        // Handle errors, such as displaying an error message
        console.log("Lỗi ", error);
        message.error(error.response.data.message);
        setLoading(false);
      }
    }
  };
  const [customCode, setCustomCode] = useState("");
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [voucherDaSuDung, setVoucherDaSuDung] = useState(false);
  const [voucherApplied, setVoucherApplied] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();

    const voucherCode = selectedVoucherCode;
    // if (!voucherApplied) {
    //   toast.warning("Please press the 'Apply' button to use the voucher");
    //   setSelectedVoucherCode("");
    //   return;
    // }

    // Tìm thông tin voucher từ mảng voucher
    const selectedVoucher = voucher.find(
      (item) => item.tenVoucher === voucherCode
    );
    if (voucherCode === null) {
      toast.error("Voucher không khả dụng hoặc đã được sử dụng trước đó");
      return;
    }

    if (!selectedVoucher || !selectedVoucherCode) {
      toast.warning("Voucher không khả dụng hoặc đã được sử dụng trước đó");
      return;
    }
    const dieuKien = selectedVoucher.dieuKien;

    if (tongTien1 <= dieuKien) {
      toast.error("Không đủ điều kiện áp mã");
      return tongTien1;
    }
    if (voucherDaSuDung) {
      toast.warning("Voucher không khả dụng hoặc đã được sử dụng trước đó");
      return;
    }

    const tongTienSauKhiGiamGia = calculateTotalPrice();

    if (tongTienSauKhiGiamGia === false) {
      // Handle the case where the voucher conditions are not met
      return;
    }
    if (!voucherDaSuDung) {
      setTongTien1(tongTienSauKhiGiamGia);
      toast.success("Sử dụng voucher thành công");

      setVoucherDaSuDung(true);
      return;
    }
  };

  const handleVoucherSelection = (selectedVoucherCode) => {
    setSelectedVoucherCode(selectedVoucherCode);
    setVoucherDaSuDung(false);
    setTongTien1(tamTinh);
    closeModal();
  };

  const calculateTotalPrice = () => {
    const voucherCode = selectedVoucherCode;

    // Tìm thông tin voucher từ mảng voucher
    const selectedVoucher = voucher.find(
      (item) => item.tenVoucher === voucherCode
    );

    if (selectedVoucher) {
      const giamToiDa = selectedVoucher.giamToiDa;
      const giaTriGiam = selectedVoucher.giaTriGiam;
      const dieuKien = selectedVoucher.dieuKien;

      let giamGia = 0;
      if (tongTien1 >= dieuKien) {
        giamGia = (giaTriGiam / 100) * tongTien1;
      } else {
        return tongTien1;
      }
      console.log(giamGia);
      if (giamGia > giamToiDa) {
        giamGia = giamToiDa;
      }
      console.log(giamGia);
      const tongTienSauKhiGiamGia = tongTien1 - giamGia;
      console.log(tongTienSauKhiGiamGia);
      return tongTienSauKhiGiamGia;
    }

    return tongTien1;
  };

  const handleInput = (e) => {
    setSelectedVoucherCode(e.target.value);
    setTongTien1(tamTinh);
    setVoucherDaSuDung(true);
    // if (setSelectedVoucherCode("")) {
    //   setTongTien1(tamTinh);
    // }
  };

  const [messageValue, setMessageValue] = useState(null);
  const [dataDiaChi, setDataDiaChi] = useState([]);
  const loadDiaChi = async () => {
    try {
      const response = await findAllDiaChi();
      setDataDiaChi(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  const [selectedValue, setValue] = useState("");
  const handleSelectChange = async (selectedValue) => {
    // Find the selected address based on the value
    const selectedAddress = dataDiaChi.find(
      (item) => item.sdt === selectedValue
    );
    console.log(selectedValue);

    if (selectedAddress) {
      setFormData({
        ...formData,
        sdt: selectedAddress ? selectedAddress.sdt : "",
        diaChi: selectedAddress ? selectedAddress.diaChi : "",
        tinh: selectedAddress ? selectedAddress.tinh : "",
        huyen: selectedAddress ? selectedAddress.huyen : "",
        xa: selectedAddress ? selectedAddress.xa : "",
      });
      const selectedProvinceData = provinces.find(
        (province) => province.name === selectedAddress.tinh
      );
      const selectedDistrictData = districts.find(
        (district) => district.name === selectedAddress.huyen
      );
      console.log("sádfsdfsdfsdf", selectedProvinceData);

      console.log("selected District Data:", selectedDistrictData);
      if (selectedProvinceData) {
        try {
          await callApiDistrict(
            host + "p/" + selectedProvinceData.code + "?depth=2"
          );

          if (selectedDistrictData) {
            await callApiWard(
              host + "d/" + selectedDistrictData.code + "?depth=2"
            );
          }

          // Additional logic after callApiWard if needed
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }
  };
  useEffect(() => {
    loadDiaChi();
  }, []);

  const [districtsLoaded, setDistrictsLoaded] = useState(false);

  useEffect(() => {
    handleSelectChange(selectedValue);
  }, [districts, wards, selectedValue, provinces]);

  return (
    <div className="container mx-auto px-4 ">
      {/* Breadcrumbs component */}
      <ToastContainer />
      <WebSocketService setValue={setMessageValue} connetTo="orderStatus" />

      <Breadcrumbs title="Thanh toán hóa đơn" />
      <div
        className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 ${
          loading ? "" : "hidden"
        }`}
      >
        <div className="border-t-4 border-r-[3px] border-l-2 border-gray-700 border-solid rounded-full h-14 w-14 animate-spin"></div>
      </div>
      <div className="pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-4 mb-5">
          <div className="md:col-span-9 layout-form">
            {user && (
              <div className="mb-2">
                <select
                  className="form-select w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => handleSelectChange(e.target.value)}
                >
                  <option value="">Chọn địa chỉ</option>
                  {dataDiaChi.map((item) => (
                    <option key={item.maDiaChi} value={item.sdt}>
                      {item.xa},{item.huyen}...{item.sdt}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="border rounded p-2">
              <div className="border-b-2 p-2">
                <span className="font-bold text-lg">Thông tin nhận hàng</span>
              </div>
              <div className="flex flex-wrap mt-6 pr-3 pl-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="tenNguoiNhan"
                  value={formData.tenNguoiNhan}
                  onChange={handleChange}
                />
              </div>
              {errors.tenNguoiNhan && (
                <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                  <span className="font-bold italic mr-1">!</span>
                  {errors.tenNguoiNhan}
                </p>
              )}
              <div className="flex flex-wrap mt-6 pr-3 pl-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Số điện thoại<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  placeholder=""
                  name="sdt"
                  value={formData.sdt}
                  onChange={handleChange}
                />
              </div>
              {errors.sdt && (
                <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                  <span className="font-bold italic mr-1">!</span>
                  {errors.sdt}
                </p>
              )}
              <div className="flex flex-wrap mt-6 pr-3 pl-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  placeholder=""
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                  <span className="font-bold italic mr-1">!</span>
                  {errors.email}
                </p>
              )}
              <div className="flex flex-wrap mt-6 pr-3 pl-3">
                <label
                  htmlFor="province"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Tỉnh thành <span className="text-red-500">*</span>
                </label>
                <select
                  className="form-select w-full p-2 border border-gray-300 rounded-md"
                  value={formData.tinh}
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
              {errors.tinh && (
                <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                  <span className="font-bold italic mr-1">!</span>
                  {errors.tinh}
                </p>
              )}

              <div className="flex flex-wrap mt-6 pr-3 pl-3">
                <label
                  htmlFor="district"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Quận huyện <span className="text-red-500">*</span>
                </label>
                <select
                  className="form-select w-full p-2 border border-gray-300 rounded-md"
                  value={formData.huyen}
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
              {errors.huyen && (
                <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                  <span className="font-bold italic mr-1">!</span>
                  {errors.huyen}
                </p>
              )}

              <div className="flex flex-wrap mt-6 pr-3 pl-3">
                <label
                  htmlFor="ward"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Phường xã <span className="text-red-500">*</span>
                </label>
                <select
                  className="form-select w-full p-2 border border-gray-300 rounded-md"
                  value={formData.xa}
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
              {errors.xa && (
                <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                  <span className="font-bold italic mr-1">!</span>
                  {errors.xa}
                </p>
              )}
              <div className="flex flex-wrap mt-6 pr-3 pl-3">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="diaChi"
                  value={formData.diaChi}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="border rounded mt-5 p-2">
              <div className="border-b-2 p-2 mt-3">
                <span className="font-bold text-lg">
                  Vận chuyển & Thanh toán
                </span>
              </div>
              <p class="font-bold mt-2">Hình thức thanh toán</p>
              <div className="mb-5">
                <input
                  className="mr-2 form-radio text-blue-500"
                  type="radio"
                  onChange={handleChange}
                  value="MONEY"
                  name="tenPhuongThuc"
                  id="payment0"
                />
                <label
                  className="inline-block text-sm font-medium text-gray-700"
                  htmlFor="payment0"
                >
                  Thanh toán khi nhận hàng (COD)
                </label>
              </div>

              <div className="mb-5">
                <input
                  className="mr-2 form-radio text-blue-500"
                  type="radio"
                  onChange={handleChange}
                  value="ELECTRONIC_WALLET"
                  name="tenPhuongThuc"
                  id="payment1"
                />
                <label
                  className="inline-block text-sm font-medium text-gray-700"
                  htmlFor="payment1"
                >
                  Chuyển khoản: Tên tài khoản: Cao Đức Việt - Techcombank:
                  902928689999 TP Hà Nội - Hội sở
                </label>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 p-2">
            <div className="border-b-2 p-2">
              <div className="font-bold text-lg">Danh sách sản phẩm</div>
            </div>
            <div class=" bg-white max-h-[345px] overflow-y-auto">
              {user
                ? data.map((item) => (
                    <div className="flex list-product mb-4">
                      <Link to={`/product/${item.maSanPhamCT}`}>
                        <img
                          src={`data:image/png;base64,${item.anh}`}
                          alt={item.tenSanPham}
                          className="img-fluid flex-shrink-0 w-[30%]" // Use flex-shrink-0 to prevent image shrinking
                        />
                      </Link>

                      <div className="item-info ml-4">
                        <p className="item-brand mb-0 fw-bold text-uppercase">
                          {item.tenthuongHieu}
                        </p>
                        <p className="item-title mb-0">{item.tenSanPham}</p>
                        <p className="item-quantity mb-0">
                          SL: <span className="fw-bold">{item.soLuong}</span>
                        </p>
                        <div className="item-price fw-bold">
                          <div className="public-price">
                            {item.giaBan * ((100 - item.phanTramGiam) / 100)}đ
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : products.map((item) => (
                    <div className="flex list-product mb-4">
                      <Link to={`/product/${item.maSanPhamCT}`}>
                        <img
                          src={`data:image/png;base64,${item.anh}`}
                          alt={item.tenSanPham}
                          className="img-fluid flex-shrink-0 w-[30%]" // Use flex-shrink-0 to prevent image shrinking
                        />
                      </Link>

                      <div className="item-info ml-4">
                        <p className="item-brand mb-0 fw-bold text-uppercase">
                          {item.tenthuongHieu}
                        </p>
                        <Link to={`/product/${item.maSanPhamCT}`}>
                          <p className="item-title mb-0">{item.tenSanPham}</p>
                        </Link>
                        <p className="item-quantity mb-0">
                          SL:{" "}
                          <span className="fw-bold" name="soLuong">
                            {item.soLuong}
                          </span>
                        </p>
                        <div className="item-price fw-bold">
                          <div className="public-price">{item.giaBan}đ</div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {user ? (
              <>
                <div className=" bg-white mt-3 ">
                  <form className="flex flex-col md:flex-row md:justify-between relative">
                    <div className="mb-2 md:w-1/2">
                      <input
                        type="text"
                        name="tenVoucher"
                        value={selectedVoucherCode}
                        placeholder="Mã Voucher"
                        onChange={handleInput}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="md:ml-2 ml-1">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-blue-500 p-2 rounded-md text-white"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </form>
                  <label
                    onClick={openModal}
                    className="block text-blue-400 text-sm mb-2  md:text-right md:right-8"
                  >
                    Chọn mã
                  </label>

                  <ModelVoucher
                    isOpen={isModalOpen}
                    closeModal={closeModal}
                    title="Voucher"
                    content={
                      <>
                        {voucher.map((item) => (
                          <div className="border rounded-md p-2 shadow-md mb-3 overflow">
                            <div className="flex justify-between ">
                              <div class="icon-svg">
                                <svg
                                  width="48"
                                  height="48"
                                  viewBox="0 0 48 48"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M28.4325 45.5026C27.418 45.5026 26.5115 44.7611 25.631 44.0411C25.093 43.6006 24.3555 42.9976 23.9995 42.9976C23.644 42.9976 22.9065 43.6006 22.3685 44.0411C21.404 44.8296 20.31 45.7261 19.1055 45.4501C17.8625 45.1676 17.254 43.8606 16.717 42.7081C16.449 42.1316 16.043 41.2601 15.7545 41.1206C15.4485 40.9711 14.4985 41.2016 13.87 41.3526C12.6465 41.6471 11.2605 41.9791 10.2805 41.1976C9.297 40.4121 9.3145 38.9816 9.331 37.7201C9.339 37.0766 9.351 36.1046 9.144 35.8446C8.9395 35.5886 7.993 35.3861 7.3665 35.2521C6.1275 34.9871 4.7245 34.6866 4.1745 33.5466C3.6325 32.4241 4.265 31.1511 4.822 30.0281C5.1115 29.4461 5.5485 28.5656 5.472 28.2281C5.403 27.9256 4.65 27.3411 4.152 26.9541C3.1435 26.1721 2 25.2841 2 24.0001C2 22.7161 3.1435 21.8286 4.1525 21.0456C4.6505 20.6591 5.4035 20.0746 5.4725 19.7716C5.549 19.4341 5.112 18.5536 4.823 17.9711C4.2655 16.8481 3.6335 15.5756 4.176 14.4521C4.726 13.3126 6.129 13.0121 7.3675 12.7471C7.994 12.6131 8.9405 12.4106 9.1445 12.1551C9.3525 11.8946 9.3405 10.9221 9.3325 10.2786C9.3165 9.01706 9.299 7.58706 10.282 6.80156C11.2615 6.01956 12.6485 6.35256 13.8715 6.64656C14.501 6.79756 15.45 7.02606 15.7555 6.87906C16.0445 6.73956 16.45 5.86856 16.7185 5.29156C17.255 4.13856 17.863 2.83206 19.106 2.54956C20.309 2.27656 21.405 3.16956 22.369 3.95856C22.9075 4.39906 23.645 5.00206 24.0005 5.00206C24.356 5.00206 25.0935 4.39906 25.6315 3.95906C26.5965 3.16956 27.69 2.27456 28.895 2.54956C30.1375 2.83206 30.746 4.13906 31.283 5.29206C31.5515 5.86856 31.957 6.74006 32.246 6.87956C32.5525 7.02706 33.501 6.79806 34.1295 6.64706C35.353 6.35306 36.7395 6.02006 37.7195 6.80206C38.703 7.58756 38.6855 9.01756 38.669 10.2796C38.661 10.9231 38.649 11.8956 38.856 12.1551C39.0605 12.4106 40.007 12.6136 40.6335 12.7476C41.8725 13.0126 43.2755 13.3126 43.8255 14.4526C44.3675 15.5756 43.735 16.8486 43.178 17.9716C42.8885 18.5541 42.4515 19.4341 42.528 19.7716C42.597 20.0746 43.35 20.6591 43.848 21.0456C44.8565 21.8286 46 22.7161 46 24.0001C46 25.2841 44.8565 26.1716 43.8475 26.9546C43.3495 27.3411 42.5965 27.9251 42.5275 28.2291C42.451 28.5666 42.888 29.4466 43.177 30.0291C43.7345 31.1521 44.3665 32.4246 43.824 33.5481C43.274 34.6876 41.871 34.9881 40.6325 35.2526C40.006 35.3871 39.0595 35.5896 38.855 35.8451C38.6475 36.1056 38.6595 37.0781 38.6675 37.7216C38.6835 38.9826 38.701 40.4126 37.718 41.1981C36.7385 41.9801 35.3515 41.6466 34.1285 41.3531C33.499 41.2021 32.55 40.9726 32.2445 41.1211C31.9555 41.2601 31.55 42.1316 31.2815 42.7081C30.745 43.8616 30.137 45.1681 28.894 45.4506C28.738 45.4861 28.584 45.5026 28.4325 45.5026ZM15.445 39.0751C15.8595 39.0751 16.257 39.1421 16.6235 39.3186C17.555 39.7676 18.051 40.8331 18.5305 41.8636C18.768 42.3736 19.262 43.4346 19.5485 43.4996C19.815 43.5466 20.685 42.8331 21.102 42.4921C22.001 41.7571 22.93 40.9971 23.9995 40.9971C25.069 40.9971 25.9985 41.7576 26.897 42.4921C27.314 42.8331 28.158 43.5326 28.4515 43.4996C28.737 43.4341 29.2315 42.3736 29.4685 41.8636C29.9475 40.8331 30.4435 39.7686 31.3755 39.3186C32.3235 38.8611 33.4775 39.1396 34.595 39.4081C35.1325 39.5371 36.253 39.8066 36.469 39.6346C36.6885 39.4596 36.674 38.3021 36.667 37.7461C36.6525 36.6001 36.6375 35.4156 37.2915 34.5966C37.9415 33.7826 39.096 33.5356 40.213 33.2966C40.76 33.1796 41.8975 32.9361 42.022 32.6786C42.138 32.4371 41.629 31.4111 41.3845 30.9181C40.872 29.8856 40.3415 28.8176 40.5765 27.7856C40.804 26.7846 41.7275 26.0676 42.62 25.3746C43.103 25.0006 44 24.3046 44 24.0001C44 23.6956 43.103 22.9996 42.621 22.6251C41.728 21.9321 40.8045 21.2156 40.577 20.2141C40.3425 19.1821 40.873 18.1141 41.3855 17.0816C41.63 16.5886 42.1395 15.5631 42.023 15.3211C41.8985 15.0631 40.761 14.8201 40.2145 14.7031C39.0975 14.4641 37.9425 14.2171 37.2925 13.4036C36.639 12.5851 36.654 11.4001 36.6685 10.2546C36.6755 9.69856 36.69 8.54056 36.4705 8.36556C36.2555 8.19356 35.1345 8.46306 34.596 8.59206C33.479 8.86056 32.325 9.13856 31.3765 8.68106C30.445 8.23156 29.949 7.16656 29.4695 6.13656C29.232 5.62656 28.7385 4.56556 28.4515 4.50056C28.1765 4.45306 27.3145 5.16706 26.8975 5.50756C25.999 6.24306 25.07 7.00306 24.0005 7.00306C22.931 7.00306 22.002 6.24256 21.103 5.50756C20.686 5.16656 19.816 4.45606 19.5485 4.50006C19.2625 4.56506 18.768 5.62606 18.531 6.13606C18.0515 7.16606 17.556 8.23106 16.6245 8.68056C15.6765 9.13756 14.5225 8.86056 13.4045 8.59156C12.867 8.46206 11.7455 8.19306 11.5305 8.36456C11.311 8.54006 11.3255 9.69756 11.3325 10.2536C11.347 11.3996 11.362 12.5846 10.708 13.4026C10.058 14.2166 8.9035 14.4636 7.7865 14.7026C7.2395 14.8196 6.102 15.0631 5.9775 15.3206C5.8615 15.5621 6.3705 16.5881 6.615 17.0811C7.1275 18.1136 7.658 19.1816 7.423 20.2136C7.1955 21.2146 6.272 21.9316 5.3795 22.6246C4.897 22.9996 4 23.6956 4 24.0001C4 24.3046 4.897 25.0011 5.379 25.3751C6.272 26.0681 7.1955 26.7841 7.423 27.7856C7.6575 28.8176 7.127 29.8851 6.6145 30.9181C6.37 31.4111 5.8605 32.4366 5.977 32.6786C6.1015 32.9371 7.239 33.1801 7.786 33.2971C8.9025 33.5361 10.0575 33.7831 10.7075 34.5971C11.361 35.4156 11.346 36.6001 11.3315 37.7461C11.3245 38.3021 11.31 39.4601 11.5295 39.6351C11.7445 39.8046 12.8655 39.5376 13.404 39.4081C14.0885 39.2431 14.788 39.0751 15.445 39.0751Z"
                                    fill="#F47560"
                                  ></path>
                                  <path
                                    d="M18.207 32.207L32.207 18.207C32.5975 17.8165 32.5975 17.1835 32.207 16.793C31.8165 16.4025 31.1835 16.4025 30.793 16.793L16.793 30.793C16.4025 31.1835 16.4025 31.8165 16.793 32.207C16.9885 32.4025 17.244 32.5 17.5 32.5C17.756 32.5 18.0115 32.4025 18.207 32.207ZM19.5 23C17.5705 23 16 21.43 16 19.5C16 17.57 17.5705 16 19.5 16C21.4295 16 23 17.57 23 19.5C23 21.43 21.4295 23 19.5 23ZM19.5 18C18.673 18 18 18.673 18 19.5C18 20.327 18.673 21 19.5 21C20.327 21 21 20.327 21 19.5C21 18.673 20.327 18 19.5 18ZM29.5 33C27.5705 33 26 31.4295 26 29.5C26 27.5705 27.5705 26 29.5 26C31.4295 26 33 27.5705 33 29.5C33 31.4295 31.4295 33 29.5 33ZM29.5 28C28.673 28 28 28.673 28 29.5C28 30.327 28.673 31 29.5 31C30.327 31 31 30.327 31 29.5C31 28.673 30.327 28 29.5 28Z"
                                    fill="#F47560"
                                  ></path>
                                </svg>
                              </div>
                              <span className="font-bold uppercase">
                                {item.tenVoucher}
                              </span>
                            </div>
                            <div className="mt-2">
                              <li>Giảm {item.giaTriGiam}%</li>
                              <li>Tối đa {item.giamToiDa} đ</li>
                              <li>Đơn tối thiểu {item.dieuKien} đ</li>
                              <div className="flex justify-between">
                                <li>
                                  <span className="cursor-pointer text-blue-500">
                                    Xem chi tiết
                                  </span>
                                </li>
                                <button
                                  onClick={() =>
                                    handleVoucherSelection(item.tenVoucher)
                                  }
                                  type="submit"
                                  className="bg-blue-500 p-2 rounded-md text-white"
                                >
                                  Áp dụng
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    }
                  />
                </div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span>Tạm tính:</span>
                  <span>{tamTinh}</span>
                  <input
                    type="hidden"
                    value="318000"
                    name="total_price"
                    id="total_price"
                  />
                </div>

                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span>Phí vận chuyển:</span>
                  <span id="price_ship">0 đ</span>
                  <input
                    type="hidden"
                    value="0"
                    name="price_ship_coco"
                    id="price_ship_coco"
                  />
                </div>
                <hr />

                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span class="text-uppercase">Tổng cộng</span>
                  <span class="fw-bold text-danger" id="total_price_ship">
                    {tongTien1}
                  </span>
                </div>
                <div className=" bg-[#C73030] rounded-lg hover:bg-red-700 w-[85px]">
                  <button
                    className="text-white p-2  cursor-pointer "
                    onClick={printResultf}
                  >
                    Đặt hàng
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span>Tạm tính:</span>
                  <span>{totalAmt}</span>
                  <input
                    type="hidden"
                    value="318000"
                    name="total_price"
                    id="total_price"
                  />
                </div>

                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span>Phí vận chuyển:</span>
                  <span id="price_ship">0 đ</span>
                  <input
                    type="hidden"
                    value="0"
                    name="price_ship_coco"
                    id="price_ship_coco"
                  />
                </div>
                <hr />

                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span class="text-uppercase">Tổng cộng</span>
                  <span
                    class="fw-bold text-danger"
                    id="total_price_ship"
                    name="tongTien"
                  >
                    {totalAmt}
                  </span>
                </div>
                <div className=" bg-[#C73030] rounded-lg hover:bg-red-700 w-[85px]">
                  <button
                    className="text-white p-2  cursor-pointer "
                    onClick={hanldeOrderKhachHAang}
                  >
                    Đặt hàng
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
