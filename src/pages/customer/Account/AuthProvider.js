import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { APP_BASE_URL } from "../../../configs/constans";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();
  let sessionTimer;

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
      if (data.trangThai === 0) {
        setTimeout(() => {
          const email = data.email;
          navigate(`/active?email=${email}`, {
            replace: true,
          });
        }, 3000);
        return;
      }
      // const cookies = new Cookies();
      // Cookies.set("jwt", JSON.stringify(data.token), { httpOnly: true });
      // Cookies.set("jwt", JSON.stringify(data.token), { httpOnly: true });

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      Swal.fire({
        title: "Đăng nhập!",
        text: "Đăng nhập thành công",
        icon: "success",
      });
      if (data.vaiTro === "ROLE_ADMIN") {
        navigate("/admin/tong-quan", {
          replace: true,
        });
      } else if (data.vaiTro === "ROLE_USER") {
        navigate("/", {
          replace: true,
        });
      } else if (data.vaiTro === "ROLE_STAFF") {
        navigate("/admin/ban-hang", {
          replace: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
    startSessionTimer();
  };

  const startSessionTimer = () => {
    const sessionTimeout = 60 * 60 * 1000;

    clearTimeout(sessionTimer);

    sessionTimer = setTimeout(() => {
      signout();
      toast.info("Đã tự động đăng xuất do hết phiên làm việc.");
    }, sessionTimeout);
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
    Cookies.remove("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("items");
    clearTimeout(sessionTimer);
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
    [user]
  );

  useEffect(() => {
    if (user) {
      startSessionTimer();
    }
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
