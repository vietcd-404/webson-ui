import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../../components/customer/pageProps/Breadcrumbs";
import axios, { Axios } from "axios";
import { format, set } from "date-fns";
import Item from "antd/es/list/Item";
import Swal from "sweetalert2";
import { taoHoaDon } from "../../../services/HoaDonService";
import { message } from "antd";
import { findGioHang } from "../../../services/GioHangService";

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

  const configApi = {
    headers: {
      token: "508b262b-8072-11ee-96dc-de6f804954c9",
      "Content-Type": "application/json",
      ShopId: 124173,
    },
  };

  const [tongTien, setTongTien] = useState("");

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
    setTongTien(tongTien);
  }, [data]);

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
      message.error("Không có sản phẩm trong giỏ hàng");
      return;
    }
    try {
      if (
        !formData.tenNguoiNhan ||
        !formData.sdt ||
        !formData.email ||
        !formData.diaChi
      ) {
        message.error("Không được bỏ trống");
        return;
      }
      if (!formData.tenPhuongThuc) {
        message.error("Vui lòng chọn phương thức thanh toán");
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
      message.error(error.response?.data?.message || "Error creating invoice");
    }
  };

  return (
    <div className="container mx-auto px-4 ">
      {/* Breadcrumbs component */}
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
                  Chuyển khoản: Tên tài khoản: Phạm Tiến Lợi - Vietcombank:
                  103878062018 TP Hà Nội - Hội sở
                </label>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 p-2">
            <div className="border-b-2 p-2">
              <div className="font-bold text-lg">Danh sách sản phẩm</div>
            </div>
            <div class=" bg-white max-h-[345px] overflow-y-auto">
              {data.map((item) => (
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
              ))}
            </div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span>Tạm tính:</span>
              <span>{tongTien}</span>
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
                {tongTien}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
