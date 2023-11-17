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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const navigate = useNavigate();

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

  useEffect(() => {
    let tongTien = 0;
    data.map((item) => {
      tongTien += item.giaBan * item.soLuong;
      return tongTien;
    });
    setTongTien1(tongTien);
  }, [data]);

  useEffect(() => {
    let sl = 0;
    products.map((item) => {
      sl = item.soLuong;
      return sl;
    });
    setSoLuong(sl);
  }, [products]);

  useEffect(() => {
    let tt = 0;
    products.map((item) => {
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

  const printResultf = async (ma) => {
    if (data.length === 0) {
      toast.error("Không có sản phẩm trong giỏ hàng");
      return;
    }
    if (validateForm()) {
      try {
        // if (
        //   !formData.tenNguoiNhan ||
        //   !formData.sdt ||
        //   !formData.email ||
        //   !formData.diaChi
        // ) {
        //   message.error("Không được bỏ trống");
        //   return;
        // }
        if (!formData.tenPhuongThuc) {
          toast.error("Vui lòng chọn phương thức thanh toán");
          return;
        }

        const maGH = data[0].maGH;

        await taoHoaDon(maGH, formData);
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
        message.error(
          error.response?.data?.message || "Error creating invoice"
        );
      }
    }
  };

  const hanldeOrderKhachHAang = async () => {
    if (products.length === 0) {
      toast.error("Không có sản phẩm trong giỏ hàng");
      return;
    }
    if (validateForm()) {
      try {
        // if (
        //   !formData.tenNguoiNhan ||
        //   !formData.sdt ||
        //   !formData.email ||
        //   !formData.diaChi
        // ) {
        //   message.error("Không được bỏ trống");
        //   return;
        // }
        if (!formData.tenPhuongThuc) {
          toast.error("Vui lòng chọn phương thức thanh toán");
          return;
        }
        const maSanPhamCTArray = products.map((product) => product.maSanPhamCT);
        // const soLuong = products.map((product) => Number(product.soLuong));
        const updatedFormData = {
          ...formData,
          tongTien: totalAmt,
          soLuong: soLuong,
        };

        await taoHoaDonKhach(maSanPhamCTArray, updatedFormData);
        Swal.fire({
          title: "Tạo hóa đơn!",
          text: "Tạo hóa đơn thành công",
          icon: "success",
        });
        dispatch(resetCart());
        // Redirect to the desired page
        navigate("/shop");
      } catch (error) {
        // Handle errors, such as displaying an error message
        console.log("Lỗi ", error);
        message.error(error.response.data.message);
      }
    }
  };
  const [customCode, setCustomCode] = useState("");
  const [availableVouchers, setAvailableVouchers] = useState([
    "Voucher1",
    "Voucher2",
    "Voucher3",
    // Add your list of vouchers here
  ]);

  const handleInputChange = (e) => {
    setCustomCode(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to apply the voucher code
    console.log(`Voucher code applied: ${customCode}`);
  };

  const handleVoucherClick = (voucher) => {
    setCustomCode(voucher);
  };
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 ">
      {/* Breadcrumbs component */}
      <ToastContainer />
      <Breadcrumbs title="Thanh toán hóa đơn" />

      <div className="pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-4 mb-5">
          <div className="md:col-span-9 layout-form">
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
                      <img
                        src={`data:image/png;base64,${item.anh}`}
                        alt={item.tenSanPham}
                        className="img-fluid flex-shrink-0 w-[30%]" // Use flex-shrink-0 to prevent image shrinking
                      />
                      <div className="item-info ml-4">
                        <p className="item-brand mb-0 fw-bold text-uppercase">
                          {item.tenthuongHieu}
                        </p>
                        <p className="item-title mb-0">{item.tenSanPham}</p>
                        <p className="item-quantity mb-0">
                          SL: <span className="fw-bold">{item.soLuong}</span>
                        </p>
                        <div className="item-price fw-bold">
                          <div className="public-price">{item.giaBan}đ</div>
                        </div>
                      </div>
                    </div>
                  ))
                : products.map((item) => (
                    <div className="flex list-product mb-4">
                      <img
                        src={`data:image/png;base64,${item.anh}`}
                        alt={item.tenSanPham}
                        className="img-fluid flex-shrink-0 w-[30%]" // Use flex-shrink-0 to prevent image shrinking
                      />
                      <div className="item-info ml-4">
                        <p className="item-brand mb-0 fw-bold text-uppercase">
                          {item.tenthuongHieu}
                        </p>
                        <p className="item-title mb-0">{item.tenSanPham}</p>
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
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col md:flex-row md:justify-between relative"
                  >
                    <div className="mb-2 md:w-1/2">
                      <input
                        type="text"
                        id="customCode"
                        name="customCode"
                        value={customCode}
                        placeholder="Mã Voucher"
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="md:ml-2 ml-1">
                      <button
                        type="submit"
                        className="bg-blue-500 p-2 rounded-md text-white"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </form>
                  <label className="block text-blue-400 text-sm mb-2  md:text-right md:right-8">
                    Chọn mã
                  </label>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span>Tạm tính:</span>
                  <span>{tongTien1}</span>
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
