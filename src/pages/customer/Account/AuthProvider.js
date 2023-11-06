import React, { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_BASE_URL } from "../../../configs/constans";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  const signin = async (username, password) => {
    try {
      const response = await fetch(`${APP_BASE_URL}/auth/signin`, {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 401) {
        const data = await response.json();
        toast.error(data.message);
        return;
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      toast.success("Đăng nhập thành công");
      if (data.vaiTro === "ROLE_ADMIN") {
        navigate("/admin/thong-ke", {
          replace: true,
        });
      } else if (data.vaiTro === "ROLE_USER") {
        navigate("/", {
          replace: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const signup = async (username, password, email, sdt) => {
    try {
      const response = await fetch(`${APP_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(username, password, email, sdt),
      });

      if (response.ok) {
        // Đăng ký thành công, thực hiện chuyển hướng hoặc hiển thị thông báo
      } else {
        // Xử lý lỗi đăng ký không thành công
        const data = await response.json();
        console.error("Đăng ký thất bại:", data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu đăng ký:", error);
    }
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/signin", {
      replace: true,
    });
  };

  const value = useMemo(
    () => ({
      user,
      signin,
      signout,
      signup,
    }),

    // eslint-disable-next-line
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
