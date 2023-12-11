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
      setErrEmail("User name không được bỏ trông");
    }
    if (!password) {
      setErrPassword("Mật khẩu không được bỏ trống");
    }

    await signin(username, password);
  };

  // const handleSubmit = async (e) => {
  //   await signin(username, password);
  //   e.preventDefault();
  // };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="w-full sm:max-w-md">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="font-semibold text-3xl mb-4 text-center">Đăng Nhập</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Tên đăng nhập
            </label>
            <input
              onChange={handleEmail}
              value={username}
              className="w-full h-10 px-4 rounded border border-gray-450 focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="Tên đăng nhập"
            />
            {errEmail && (
              <p className="text-red-500 text-xs italic">{errEmail}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Mật khẩu
            </label>
            <input
              onChange={handlePassword}
              value={password}
              className="w-full h-10 px-4 rounded border border-gray-450 focus:outline-none focus:border-blue-500"
              type="password"
              placeholder="Mật khẩu"
            />
            {errPassword && (
              <p className="text-red-500 text-xs italic">{errPassword}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleSignUp}
              className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Đăng nhập
            </button>
            <p className="text-sm">
              Đăng ký thành viên?{" "}
              <Link to="/signup" className="text-blue-500 hover:text-blue-700">
                Đăng ký
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
