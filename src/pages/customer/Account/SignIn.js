import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignIn = () => {
  const navigate = useNavigate();
  // ============= Initial State Start here =============
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // ============= Initial State End here ===============
  // ============= Error Msg Start here =================
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");

  // ============= Error Msg End here ===================
  const [successMsg, setSuccessMsg] = useState("");
  // ============= Event Handler Start here =============
  const handleEmail = (e) => {
    setUsername(e.target.value);
    setErrEmail("");
  };
  const { signin } = useAuth();

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };
  // ============= Event Handler End here ===============
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!username) {
      setErrEmail("User name không bỏ trông");
    }
    if (!password) {
      setErrPassword("Mật khẩu không bỏ trống");
    }

    await signin(username, password);
  };

  // const handleSubmit = async (e) => {
  //   await signin(username, password);
  //   e.preventDefault();
  // };
  return (
    <div className="container mx-auto h-screen flex items-center justify-center">
      <ToastContainer />
      <div className="w-full lgl:w-1/2 h-full">
        {successMsg ? (
          <div className="w-full lgl:w-[200px] h-full flex flex-col justify-center">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
              <ToastContainer />
            </p>
          </div>
        ) : (
          <form
            // onSubmit={handleSubmit}
            className="w-full lgl:w-[450px] h-screen flex items-center justify-center"
          >
            <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center ">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
                Đăng Nhập
              </h1>
              <div className="flex flex-col gap-3">
                {/* Email */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Tên đăng nhập
                  </p>
                  <input
                    onChange={handleEmail}
                    value={username}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="username"
                  />
                  {errEmail && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errEmail}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Mật khẩu
                  </p>
                  <input
                    onChange={handlePassword}
                    value={password}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="password"
                    placeholder="password"
                  />
                  {errPassword && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errPassword}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleSignUp}
                  className="bg-black text-white hover:bg-[#FFBBFF] text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md  duration-300"
                >
                  Đăng nhập
                </button>
                <p className="text-sm text-center font-titleFont font-medium">
                  Đăng ký thành viên?{" "}
                  <Link to="/signup">
                    <span className="hover:text-blue-600 duration-300 text-red-600">
                      Đăng ký
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;
