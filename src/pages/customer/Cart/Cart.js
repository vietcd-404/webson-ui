import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../../components/customer/pageProps/Breadcrumbs";
import { resetCart } from "../../../redux/orebiSlice";
import { emptyCart } from "../../../assets/images/index";
import ItemCard from "./ItemCard";
import ButtonShop from "../../../components/customer/designLayouts/buttons/ShopNow";
const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);
  const [totalAmt, setTotalAmt] = useState("");
  const [shippingCharge, setShippingCharge] = useState("");
  const [policy, setPolicy] = useState({
    title: "Chính sách mua hàng",
    content: [
      "Quý khách được kiểm tra hàng trước khi thanh toán, quay video unbox nếu như đã nhận hàng mà chưa kiểm hàng.",
      "- Đổi sản phẩm trong 24h nếu còn đủ tem mạc, nếu phát hiện lỗi khi sử dụng cùng với hình ảnh chi tiết.",
      "- Giao hàng từ 3-5 ngày các ngày trong tuần.",
    ],
  });
  useEffect(() => {
    let price = 0;
    products.map((item) => {
      price += item.price * item.quantity;
      return price;
    });
    setTotalAmt(price);
  }, [products]);
  useEffect(() => {
    if (totalAmt <= 200) {
      setShippingCharge(30);
    } else if (totalAmt <= 400) {
      setShippingCharge(25);
    } else if (totalAmt > 401) {
      setShippingCharge(20);
    }
  }, [totalAmt]);
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Giỏ Hàng" />
      {products.length > 0 ? (
        <div className="pb-20">
          <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-2">Product</h2>
            <h2>Price</h2>
            <h2>Quantity</h2>
            <h2>Sub Total</h2>
          </div>
          <div className="mt-5">
            {products.map((item) => (
              <div key={item._id}>
                <ItemCard item={item} />
              </div>
            ))}
          </div>

          <button
            onClick={() => dispatch(resetCart())}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
          >
            Làm trống giỏ hàng
          </button>

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
            <div className="col-4 ml-6">
              <h1 className="text-2xl font-semibold text-right">
                Thông tin đơn hàng
              </h1>
              <div className="pb-2">
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                  Tổng tiền:
                  <span className="font-semibold tracking-wide font-titleFont text-[#ff6347]">
                    ${totalAmt}
                  </span>
                </p>
              </div>
              <Link to="/paymentgateway">
                <button className="bg-[#FFA500] text-white rounded-md cursor-pointer hover:bg-[#8B0000] active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                  Thanh Toán
                </button>
              </Link>
            </div>
          </div>
          {/* <div className="flex flex-col mdl:flex-row justify-between border py-4 px-4 items-center gap-2 mdl:gap-0">
            <div className="flex items-center gap-4">
              <input
                className="w-44 mdl:w-52 h-8 px-4 border text-primeColor text-sm outline-none border-gray-400"
                type="text"
                placeholder="Coupon Number"
              />
              <p className="text-sm mdl:text-base font-semibold">
                Áp dụng voucher
              </p>
            </div>
            <p className="text-lg font-semibold">Update Cart</p>
          </div> */}
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
