import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
const host = "https://provinces.open-api.vn/api/";

const FormHoaDon = ({ change, hoaDon }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  const callApiDistrict = (api) => {
    axios.get(api).then((response) => {
      setDistricts(response.data.districts);
    });
  };

  const handleThayDoiClick = () => {
    // Toggle the state to show/hide the additional interface
    setShow(!show);
  };
  const callApiWard = (api) => {
    axios.get(api).then((response) => {
      setWards(response.data.wards);
    });
  };
  return (
    <div className="container mx-auto mt-8">
      <div className="border rounded p-4">
        <div className="border-b-2 p-2 mb-4">
          <span className="font-bold text-lg">Thông tin nhận hàng</span>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-3">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            disabled
            value={hoaDon.tenNguoiNhan}
            className="w-full"
            class="form-control"
            name="tenNguoiNhan"
            onChange={change}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Số điện thoại<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            disabled
            value={hoaDon.sdt}
            className="w-full"
            class="form-control"
            name="sdt"
            onChange={change}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Địa chỉ nhận <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            disabled
            className="w-full"
            placeholder=""
            value={hoaDon.diaChiChiTiet}
            onChange={change}
            class="form-control"
          />
        </div>
        <div className="mb-4" onClick={handleThayDoiClick}>
          <p className="text-blue-700 hover:underline cursor-pointer">
            Thay đổi địa chỉ
          </p>
        </div>
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
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  name="tinh"
                >
                  <option disabled value="">
                    Chọn
                  </option>
                  {provinces.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
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
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  name="huyen"
                >
                  <option disabled value="">
                    Chọn
                  </option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
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
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  name="xa"
                >
                  <option disabled value="">
                    Chọn
                  </option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="form-input w-full"
                name="diaChi"
                class="form-control"
                onChange={change}
              />
            </div>
          </>
        )}
        <div className="flex justify-between">
          <div className="p-1 bg-blue-600 border w-[90px] grid place-items-center rounded">
            <button className="text-white">Lưu</button>
          </div>
          <div>
            Tổng tiền:{" "}
            <span className="text-lg font-bold">{hoaDon.tongTien} đ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormHoaDon;
