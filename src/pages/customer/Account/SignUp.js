import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { dangKy, kichHoat } from "../../../services/AuthService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const SignUp = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    sdt: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePhone = (sdt) => {
    return String(sdt).match(/^0\d{9}$/);
  };
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Tên đăng nhập không được trống";
      valid = false;
    } else if (/\s/.test(formData.username)) {
      newErrors.username = "Tên đăng nhập không hợp lệ";
      valid = false;
    }

    if (!formData.email || !EmailValidation(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      valid = false;
    }

    if (formData.sdt.length !== 10) {
      newErrors.sdt = "Số điện thoại cần có đúng 10 chữ số";
      valid = false;
    }

    if (!formData.sdt || !validatePhone(formData.sdt)) {
      newErrors.sdt = "Số điện thoại không hợp lệ";
      valid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu không được nhỏ hơn 6 ký tự";
      valid = false;
    } else if (/\s/.test(formData.password)) {
      newErrors.password = "Mật khẩu không hợp lệ";
      valid = false;
    }

    if (!checked) {
      toast.error("Vui lòng đồng ý với Điều khoản và Chính sách");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const EmailValidation = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);
  };

  // ================= Email Validation End here ===============
  const handleAdd = async (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      username: formData.username.trim(),
      email: formData.email.trim(),
      sdt: formData.sdt.trim(),
    };
    if (validateForm()) {
      setLoading(true);
      await dangKy(updatedFormData)
        .then((response) => {
          setLoading(true);
          toast.success(response.data.message);

          setTimeout(() => {
            setLoading(true);
            const email = formData.email;
            navigate(`/active?email=${email}`);
          }, 3000);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          setLoading(false);
        });
    }
  };

  return (
    <div className="container mx-auto h-screen flex items-center justify-start">
      <div
        className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 ${
          loading ? "" : "hidden"
        }`}
      >
        <div className="border-t-4 border-r-[3px] border-l-2 border-gray-700 border-solid rounded-full h-14 w-14 animate-spin"></div>
      </div>
      <ToastContainer />
      <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
        <form
          onSubmit={handleAdd}
          className="w-full lgl:w-[500px] h-screen flex items-center justify-center"
        >
          <div className="px-6 py-4 w-full h-[96%] flex flex-col justify-start overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
            <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">
              Đăng ký tài khoản
            </h1>
            <div className="flex flex-col gap-3">
              {/* user name */}
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Tên đăng nhập
                </p>
                <input
                  onChange={handleChange}
                  // value={username}
                  name="username"
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="text"
                  placeholder="username"
                />
                {errors.username && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Email
                </p>
                <input
                  onChange={handleChange}
                  // value={email}
                  name="email"
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="email"
                  placeholder="abc@gmail.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errors.email}
                  </p>
                )}
              </div>
              {/* Phone Number */}
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Số điện thoại
                </p>
                <input
                  onChange={handleChange}
                  // value={sdt}
                  name="sdt"
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="text"
                  placeholder="số điện thoại"
                />
                {errors.sdt && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errors.sdt}
                  </p>
                )}
              </div>
              {/* Password */}
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Mật khẩu
                </p>
                <input
                  onChange={handleChange}
                  // value={password}
                  name="password"
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="password"
                  placeholder="Create password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Checkbox */}
              <div className="flex items-start mdl:items-center gap-2">
                <input
                  onChange={() => setChecked(!checked)}
                  className="w-4 h-4 mt-1 mdl:mt-0 cursor-pointer"
                  type="checkbox"
                />
                <p className="text-sm text-primeColor">
                  Tôi đồng ý với các{" "}
                  <span className="text-blue-500">Điều khoản </span>và{" "}
                  <span className="text-blue-500">Chính sách</span>.
                </p>
              </div>
              <button
                type="submit"
                // onClick={handleAdd}
                className={`${
                  checked
                    ? "bg-[#FF0000] text-white hover:bg-black hover:text-white cursor-pointer"
                    : "bg-gray-500 hover:bg-gray-500 hover:text-gray-200 cursor-none"
                } w-full text-gray-200 text-base font-medium h-10 rounded-md hover:text-white duration-300`}
              >
                Đăng ký
              </button>
              <p className="text-sm text-center font-titleFont font-medium">
                Đã có tài khoản?{" "}
                <Link to="/signin">
                  <span className="hover:text-blue-600 duration-300 text-red-600">
                    Đăng nhập
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
