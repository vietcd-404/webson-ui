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
      }
    } catch (error) {
      console.error(error);
    }
    startSessionTimer();
  };

  const startSessionTimer = () => {
    // Đặt thời gian tự động đăng xuất sau 30 phút (30 * 60 * 1000 ms)
    const sessionTimeout = 5 * 60 * 1000;

    // Xóa hết timer hiện tại (nếu có)
    clearTimeout(sessionTimer);

    // Thiết lập một timer mới để đăng xuất sau một khoảng thời gian
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
    localStorage.removeItem("user");
    navigate("/signin", {
      replace: true,
    });
    clearTimeout(sessionTimer);
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
  let sessionTimer;

  useEffect(() => {
    // Khi component AuthProvider được render hoặc user thay đổi, bắt đầu hoặc cập nhật timer
    if (user) {
      startSessionTimer();
    }
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
