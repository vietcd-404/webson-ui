import React, { useEffect, useRef, useState } from "react";
import {
  createDiaChi,
  deleteDiaChi,
  findAllDiaChi,
  getByDiaChi,
  updateDiaChi,
} from "../../../services/DiaChiService";
import ModelDiaChi from "./ModelThemDiaChi";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  hienHuyen,
  hienTinh,
  hienXa,
} from "../../../services/GiaoHangNhanhService";
const host = "https://provinces.open-api.vn/api/";

const DiaChi = () => {
  const [data, setData] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [formData, setFormData] = useState({
    maDiaChi: "",
    sdt: "",
    diaChi: "",
    tinh: "",
    huyen: "",
    xa: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [errors, setErrors] = useState([]);

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
    if (!formData.diaChi) {
      newErrors.diaChi = "Vui lòng nhập địa chỉ chi tiết";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const xoaDiaChi = (ma) => {
    Swal.fire({
      title: "Bạn có chắc không?",
      text: "Bạn có muốn xóa địa chỉ không!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vâng, tôi muốn!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: "Xóa!",
            text: "Bạn đã xóa thành công.",
            icon: "success",
          });
          const response = await deleteDiaChi(ma);
          console.log(response);
          loadDiaChi();
        } catch (error) {
          toast.error(error.response.data.message);
        }
      }
    });
  };

  const handleAddDiaChi = async () => {
    if (validateForm()) {
      //   setLoading(true);
      try {
        await createDiaChi(formData);
        // setLoading(true);
        Swal.fire({
          title: "Tạo địa chỉ!",
          text: "Tạo địa chỉ thành công",
          icon: "success",
        });

        setIsModalOpen(false);
        loadDiaChi();
      } catch (error) {
        // Handle errors, such as displaying an error message
        console.log("Lỗi ", error);
        toast.error(error.response.data.message);
        //   setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadProvinces();
  }, []);

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
      setFeeShip(response?.data?.data?.total);
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
  const loadDiaChi = async () => {
    try {
      const response = await findAllDiaChi();
      setData(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  useEffect(() => {
    loadDiaChi();
  }, []);
  const frm = useRef();
  const [dataDiaChi, setDataDiaChi] = useState([]);
  const handleFinDiaChi = async (ma) => {
    try {
      const response = await getByDiaChi(ma);
      setDataDiaChi(response.data);
      console.log(response.data);
      const dataDiaChi = response.data;
      setFormData((prevFormData) => ({
        ...prevFormData,
        maDiaChi: dataDiaChi.maDiaChi,
        huyen: dataDiaChi.huyen,
        xa: dataDiaChi.xa,
        tinh: dataDiaChi.tinh,
        diaChi: dataDiaChi.diaChi,
        sdt: dataDiaChi.sdt,
      }));
      setIsModalOpenEdit(true);
      let foundProvinces =
        provinces.length > 0 &&
        provinces?.find((item) => item.ProvinceName === dataDiaChi.tinh);
      console.log(foundProvinces);
      setSelectedProvince(foundProvinces ? foundProvinces.ProvinceID : "");
    } catch (error) {
      // Handle errors, such as displaying an error message
      console.log("Lỗi ", error);
      toast.error(error.response.data.message);
      //   setLoading(false);
    }
  };

  const handleUpdateDiaChi = async (ma) => {
    if (validateForm()) {
      //   setLoading(true);
      try {
        await updateDiaChi(formData, ma);
        // setLoading(true);
        Swal.fire({
          title: "Sửa địa chỉ!",
          text: "Sửa địa chỉ thành công",
          icon: "success",
        });

        setIsModalOpenEdit(false);
        loadDiaChi();
      } catch (error) {
        // Handle errors, such as displaying an error message
        console.log("Lỗi ", error);
        toast.error(error.response.data.message);
        //   setLoading(false);
      }
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  const openModalEdit = (ma) => {
    handleFinDiaChi(ma);
    // setIsModalOpenEdit(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeModalEdit = () => {
    setIsModalOpenEdit(false);
  };
  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        ...formData,
        huyen: "",
        xa: "",
        tinh: "",
        diaChi: "",
        sdt: "",
      });
      setSelectedDistrict("");
      setSelectedProvince("");
      setSelectedWard("");
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpenEdit) {
      setFormData({
        ...formData,
        huyen: "",
        xa: "",
        tinh: "",
        diaChi: "",
        sdt: "",
      });
      setSelectedDistrict("");
      setSelectedProvince("");
      setSelectedWard("");
    }
  }, [isModalOpenEdit]);
  return (
    <div className="flex min-h-screen container mx-auto m-10">
      <div className="min-h-screen w-[759px] ">
        {data.map((item) => (
          <div>
            <div className=" hover:shadow-lg border p-3 shadow-md mb-3">
              <div className="shop-header shop-row">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <span className="mr-2"></span>
                    <span
                      className="ml-2 font-bold cursor-pointer"
                      onClick={() => handleFinDiaChi(item.maDiaChi)}
                    >
                      Chỉnh sửa{" "}
                    </span>
                    <strong> {item.loaiDiaChi}</strong>
                  </div>
                  <div>
                    <div className="text-white">
                      {/* {getStatusText(item.trangThai)} */}
                      sssss
                    </div>
                  </div>
                </div>
              </div>
              <div className="shop-body">
                <div className="order-item flex items-center">
                  <div className="flex flex-col ml-4 mb-1"></div>
                </div>
                <hr />
                <div className="flex flex-col ">
                  <div className="flex justify-between p-2">
                    <div className="mt-2 flex space-x-4">
                      {item.diaChi}, {item.xa}, {item.huyen}, {item.tinh}
                    </div>
                    <div className="mt-2 flex space-x-4">
                      <p className=" text-lg">SĐT:</p>
                      <span className="text-lg">{item.sdt}</span>
                    </div>
                  </div>

                  <div className=" ml-4 flex justify-items-end mt-3 ">
                    <div className="border-[3px] mr-2 border-red-600">
                      <button
                        className=" py-1 px-3 mr-2 text-red-600 uppercase"
                        type="button"
                        onClick={() => xoaDiaChi(item.maDiaChi)}
                      >
                        Xóa
                      </button>
                    </div>

                    {/* <div className="border-[3px] border-black">
                      <button className="py-1 px-3 uppercase">Sửa</button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 border-gray-600 min-h-screen flex justify-center ">
        <div
          className="p-2 bg-pink-400 border rounded-md flex justify-center w-[200px] h-[40px]  hover:opacity-80 cursor-pointer"
          onClick={openModal}
        >
          <button className="text-sm text-white ">Thêm địa chỉ mới</button>
        </div>
      </div>
      <ModelDiaChi
        isOpen={isModalOpen}
        closeModal={closeModal}
        title="Thêm địa chỉ"
        content={
          <>
            <div>
              <div className="border rounded p-2">
                <div className="border-b-2 p-2">
                  <span className="font-bold text-lg">Thông tin địa chỉ</span>
                </div>
                {/* <div className="flex flex-wrap mt-6 pr-3 pl-3">
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
                </div> */}
                {/* {errors.tenNguoiNhan && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errors.tenNguoiNhan}
                  </p>
                )} */}
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
                {/* <div className="flex flex-wrap mt-6 pr-3 pl-3">
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
                </div> */}
                {/* {errors.email && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errors.email}
                  </p>
                )} */}
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
                    onChange={handleProvinceChangeaa}
                    name="tinh"
                  >
                    <option disabled value="">
                      Chọn
                    </option>
                    {provinces.map((province) => (
                      <option>{province.ProvinceName}</option>
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
                    onChange={handleDistrictChangeaaa}
                    name="huyen"
                  >
                    <option disabled value="">
                      Chọn
                    </option>
                    {districts.map((district) => (
                      <option>{district.DistrictName}</option>
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
                    onChange={handleWardChangeaaa}
                    name="xa"
                  >
                    <option disabled value="">
                      Chọn
                    </option>
                    {wards.map((ward) => (
                      <option>{ward.WardName}</option>
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
                {errors.diaChi && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errors.diaChi}
                  </p>
                )}
                <div className="flex flex-col items-end mt-4">
                  <div
                    className="p-2 border rounded-md bg-pink-300 w-28 flex justify-center cursor-pointer"
                    onClick={() => handleAddDiaChi()}
                  >
                    <button>Thêm</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      />
      <ModelDiaChi
        isOpen={isModalOpenEdit}
        closeModal={closeModalEdit}
        title="Sửa địa chỉ"
        content={
          <>
            <div>
              <div className="border rounded p-2">
                <div className="border-b-2 p-2">
                  <span className="font-bold text-lg">Thông tin địa chỉ</span>
                </div>
                {/* <div className="flex flex-wrap mt-6 pr-3 pl-3">
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
                </div> */}
                {/* {errors.tenNguoiNhan && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errors.tenNguoiNhan}
                  </p>
                )} */}
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
                {/* <div className="flex flex-wrap mt-6 pr-3 pl-3">
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
                </div> */}
                {/* {errors.email && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errors.email}
                  </p>
                )} */}
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
                    onChange={handleProvinceChangeaa}
                    name="tinh"
                  >
                    <option disabled value="">
                      Chọn
                    </option>
                    {provinces.map((province) => (
                      <option>{province.ProvinceName}</option>
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
                    onChange={handleDistrictChangeaaa}
                    name="huyen"
                  >
                    <option disabled value="">
                      Chọn
                    </option>
                    {districts.map((district) => (
                      <option>{district.DistrictName}</option>
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
                    onChange={handleWardChangeaaa}
                    name="xa"
                  >
                    <option disabled value="">
                      Chọn
                    </option>
                    {wards.map((ward) => (
                      <option>{ward.WardName}</option>
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
                {errors.diaChi && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errors.diaChi}
                  </p>
                )}
                <div className="flex flex-col items-end mt-4">
                  <div
                    className="p-2 border rounded-md bg-pink-300 w-28 flex justify-center cursor-pointer"
                    onClick={() => handleUpdateDiaChi(formData.maDiaChi)}
                  >
                    <button>Sửa</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default DiaChi;
