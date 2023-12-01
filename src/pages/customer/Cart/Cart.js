import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../../components/customer/pageProps/Breadcrumbs";
import { resetCart } from "../../../redux/orebiSlice";
import { emptyCart } from "../../../assets/images/index";
import ItemCard from "./ItemCard";
import ButtonShop from "../../../components/customer/designLayouts/buttons/ShopNow";
import {
  findGioHang,
  hienGioHangSession,
  updateSoLuong,
  xoaGioHang,
  xoaTatCaGioHang,
} from "../../../services/GioHangService";
import { message } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Account/AuthProvider";
import CartSession from "./CartSession";
import Cookies from "js-cookie";

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);

  const [totalAmt, setTotalAmt] = useState("");
  const [tongTien, setTongTien] = useState("");

  const [shippingCharge, setShippingCharge] = useState("");
  const [policy, setPolicy] = useState({
    title: "Chính sách mua hàng",
    content: [
      "Quý khách được kiểm tra hàng trước khi thanh toán, quay video unbox nếu như đã nhận hàng mà chưa kiểm hàng.",
      "- Đổi sản phẩm trong 24h nếu còn đủ tem mạc, nếu phát hiện lỗi khi sử dụng cùng với hình ảnh chi tiết.",
      "- Giao hàng từ 3-5 ngày các ngày trong tuần.",
    ],
  });

  const [data, setData] = useState([]);
  const [dataSession, setDataSession] = useState([]);

  const fetchCart = async () => {
    try {
      // Retrieve the cart from localStorage
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setDataSession(JSON.parse(storedCart));
      }

      // Fetch the cart from the server and update the local cart
      const response = await hienGioHangSession();
      setDataSession(response.data);

      // Save the updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const loadGioHang = async () => {
    try {
      const response = await findGioHang();
      setData(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  const handleXoaTatCa = async () => {
    try {
      const response = await xoaTatCaGioHang();
      if (response.status === 200) {
        toast.success("Xóa tất cả thành công!");
      }
      loadGioHang();
    } catch (error) {
      console.error("Lỗi khi xóa loại: ", error);
      message.error("Xóa thất bại.");
    }
  };

  const handleQuantityChange = async (event, sanPham, maxQuantity) => {
    const newQuantity = event.target.value;
    if (newQuantity === "") {
      toast.error("Số lượng không được để trống");
      return;
    }
    if (newQuantity > maxQuantity) {
      console.error("Quantity exceeds the maximum limit");
      toast.error("Số lượng vượt giới hạn");
      return;
    }
    setData((prevData) =>
      prevData.map((item) =>
        item.maSanPhamCT === sanPham ? { ...item, soLuong: newQuantity } : item
      )
    );
    try {
      await updateSoLuong(sanPham, newQuantity);
      loadGioHang();
    } catch (error) {
      console.error("Failed to update quantity:", error);
      message.error(error.response.data.message);
    }
  };

  const handleXoa = async (ma) => {
    try {
      const response = await xoaGioHang(ma);
      if (response.status === 200) {
        toast.success("Xóa thành công!");
        loadGioHang();
      }
    } catch (error) {
      console.error("Lỗi khi xóa loại: ", error);
      toast.error("Xóa thất bại.");
    }
  };

  useEffect(() => {
    let tongTien = 0;
    data.map((item) => {
      const giaBan = item.giaBan * ((100 - item.phanTramGiam) / 100);
      tongTien += giaBan * item.soLuong;
      return tongTien;
    });
    setTotalAmt(tongTien);
  }, [data]);

  useEffect(() => {
    let tt = 0;
    products.map((item) => {
      const giaBan = item.giaBan * (item.phanTramGiam / 100);
      tt += item.giaBan * item.soLuong;
      return tt;
    });
    setTongTien(tt);
  }, [products]);

  useEffect(() => {
    if (user) {
      // User is authenticated
      loadGioHang();
    } else {
      // User is not authenticated
      fetchCart();
    }
    console.log(products);
  }, []);

  // useEffect(() => {
  //   if (totalAmt <= 200) {
  //     setShippingCharge(30);
  //   } else if (totalAmt <= 400) {
  //     setShippingCharge(25);
  //   } else if (totalAmt > 401) {
  //     setShippingCharge(20);
  //   }
  // }, [totalAmt]);
  const { user } = useAuth();

  return (
    <div className="max-w-container mx-auto px-4">
      <ToastContainer />
      <Breadcrumbs title="Giỏ Hàng" />
      {data.length > 0 ? (
        <div className="pb-20">
          <div className="mt-5">
            <div className="container mx-auto mb-4 border py-2">
              <div>
                <div className="layout-page-checkout mt-4 mb-5">
                  <div className="page-title mb-2 font-bold text-2xl">
                    Giỏ hàng
                  </div>

                  <div className="table-container overflow-x-auto">
                    <table className="page-table table table-hover mb-4">
                      <thead>
                        <tr className="font-bold">
                          <th></th>
                          <th>Sản phẩm</th>
                          <th>Giá sản phẩm</th>
                          <th>Số lượng</th>
                          <th>Thành tiền</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user
                          ? data.map((item) => (
                              <ItemCard
                                key={item.maGioHang} // Don't forget to add a unique key when mapping over arrays in React
                                item={item}
                                xoa={() => handleXoa(item.maGioHang)}
                                updateSoLuong={(e) =>
                                  handleQuantityChange(
                                    e,
                                    item.maSanPhamCT,
                                    item.soLuongTon
                                  )
                                }
                              />
                            ))
                          : products.map((item) => (
                              <CartSession
                                key={item.maGioHang} // Don't forget to add a unique key when mapping over arrays in React
                                item={item}
                                // xoa={() => handleXoa(item.maGioHang)}
                                // updateSoLuong={(e) =>
                                //   handleQuantityChange(e, item.maSanPhamCT)
                                // }
                              />
                            ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="page-confirm flex justify-end items-center">
                    <div className="item-confirm pr-4 text-end font-bold">
                      <p className="mb-1">Tổng tiền hàng</p>
                      {user ? (
                        <p className="text-danger mb-1">{totalAmt}đ</p>
                      ) : (
                        <p className="text-danger mb-1">{tongTien}đ</p>
                      )}
                    </div>
                    <div className=" bg-[#C73030] rounded-lg hover:bg-red-700">
                      <Link to="/paymentgateway">
                        <button className="btn-confirm  text-white p-2  cursor-pointer ">
                          Tiến hành đặt hàng
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {user ? (
            <button
              // onClick={() => dispatch(resetCart())}
              onClick={() => handleXoaTatCa()}
              className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
            >
              Làm trống giỏ hàng
            </button>
          ) : (
            <button
              onClick={() => dispatch(resetCart())}
              className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
            >
              Làm trống giỏ hàng
            </button>
          )}

          <div className="flex flex-direction: row mt-3">
            <div className="col-5">
              <h1 style={{ fontWeight: "bold", color: "black", fontSize: 20 }}>
                *Chính sách mua hàng
              </h1>
              <ul>
                {policy.content.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : products.length > 0 ? (
        <div className="pb-20">
          <div className="mt-5">
            <div className="container mx-auto mb-4 border py-2">
              <div>
                <div className="layout-page-checkout mt-4 mb-5">
                  <div className="page-title mb-2 font-bold text-2xl">
                    Giỏ hàng
                  </div>

                  <div className="table-container overflow-x-auto">
                    <table className="page-table table table-hover mb-4">
                      <thead>
                        <tr className="font-bold">
                          <th></th>
                          <th>Sản phẩm</th>
                          <th>Giá sản phẩm</th>
                          <th>Số lượng</th>
                          <th>Thành tiền</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user
                          ? data.map((item) => (
                              <ItemCard
                                key={item.maGioHang} // Don't forget to add a unique key when mapping over arrays in React
                                item={item}
                                xoa={() => handleXoa(item.maGioHang)}
                                updateSoLuong={(e) =>
                                  handleQuantityChange(e, item.maSanPhamCT)
                                }
                              />
                            ))
                          : products.map((item) => (
                              <CartSession
                                key={item.maGioHang} // Don't forget to add a unique key when mapping over arrays in React
                                item={item}
                                // xoa={() => handleXoa(item.maGioHang)}
                                // updateSoLuong={(e) =>
                                //   handleQuantityChange(e, item.maSanPhamCT)
                                // }
                              />
                            ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="page-confirm flex justify-end items-center">
                    <div className="item-confirm pr-4 text-end font-bold">
                      <p className="mb-1">Tổng tiền hàng</p>
                      {user ? (
                        <p className="text-danger mb-1">{totalAmt}đ</p>
                      ) : (
                        <p className="text-danger mb-1">{tongTien}đ</p>
                      )}
                    </div>
                    <div className=" bg-[#C73030] rounded-lg hover:bg-red-700">
                      <Link to="/paymentgateway">
                        <button className="btn-confirm  text-white p-2  cursor-pointer ">
                          Tiến hành đặt hàng
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {user ? (
            <button
              // onClick={() => dispatch(resetCart())}
              onClick={() => handleXoaTatCa()}
              className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
            >
              Làm trống giỏ hàng
            </button>
          ) : (
            <button
              onClick={() => dispatch(resetCart())}
              className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
            >
              Làm trống giỏ hàng
            </button>
          )}

          <div className="flex flex-direction: row mt-3">
            <div className="col-5">
              <h1 style={{ fontWeight: "bold", color: "black", fontSize: 20 }}>
                *Chính sách mua hàng
              </h1>
              <ul>
                {policy.content.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={emptyCart}
              alt="emptyCart"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Giỏ hàng của bạn đang trống.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Hãy Shopping ngay bây giờ nào.
            </p>
            <Link to={"/shop"}>
              <ButtonShop />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
