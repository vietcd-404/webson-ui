import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Otp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    // Sử dụng useEffect để lấy email từ tham số URL khi component được tạo
    const urlSearchParams = new URLSearchParams(window.location.search);
    const urlEmail = urlSearchParams.get("email");
    if (urlEmail) {
      setEmail(urlEmail);
    }
  }, []);

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value) && value.length <= 1) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Focus the next input field, if available
      if (index < updatedOtp.length - 1 && value !== "") {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const isOtpValid = otp.join("").length === 6; // Kiểm tra xem mã OTP đã đủ 6 chữ số chưa

  const handleActivate = () => {
    if (!isOtpValid) {
      setMessage("Mã OTP cần phải đủ 6 chữ số.");
      return;
    }

    // const data = {
    //   otp: otp.join(""), // Combine OTP digits into a single string
    // };

    axios
      .post(
        `http://localhost:8000/api/auth/active?email=${email}&otp=${otp.join(
          ""
        )}`
      )
      .then((response) => {
        setLoading(true);
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      })
      .catch((error) => {
        // setMessage(error.response.data.message);
        toast.error(error.response.data.message);
        setLoading(false);
      });
  };

  const handleResendOtp = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/auth/resend-otp?email=${email}`)
      .then((response) => {
        toast.success(response.data.message);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoading(false);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen border">
      <div
        className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50 ${
          loading ? "" : "hidden"
        }`}
      >
        <div className="border-t-4 border-r-[3px] border-l-2 border-gray-700 border-solid rounded-full h-14 w-14 animate-spin"></div>
      </div>
      <ToastContainer />
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">
          Vui lòng kiểm tra email của bạn để nhập mã xác minh
        </h1>
        <div className="flex justify-center items-center">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              className="w-10 h-10 mx-1 text-center border rounded"
              value={value}
              onChange={(e) => handleOtpChange(e, index)}
              maxLength="1"
            />
          ))}
        </div>
        <button
          onClick={handleActivate}
          className="mt-4 mr-3 px-4 py-2 bg-blue-500 text-white rounded hover:opacity-80"
          disabled={!isOtpValid} // Vô hiệu hóa nút Xác nhận nếu mã OTP không hợp lệ
        >
          Xác nhận
        </button>
        <button
          onClick={handleResendOtp}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover-bg-blue-700 hover:opacity-80"
        >
          Gửi lại
        </button>
        {/* <p>{message}</p> */}
      </div>
    </div>
  );
}

export default Otp;
