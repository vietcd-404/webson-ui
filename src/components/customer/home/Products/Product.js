import React, { useState } from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { GiReturnArrow } from "react-icons/gi";
import { FaShoppingCart } from "react-icons/fa";
import { MdOutlineLabelImportant } from "react-icons/md";
import Image from "../../designLayouts/Image";
import Badge from "./Badge";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../../redux/orebiSlice";
import Swal from "sweetalert2";
import { findGioHang, themGioHang } from "../../../../services/GioHangService";
import { message } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import da from "date-fns/esm/locale/da/index.js";
import { themYthich } from "../../../../services/SanPhamYeuThichService";

const Product = (props) => {
  console.log("Props: ", props);

  const [maSanPhamID, setmaSanPhamID] = useState();
  const [soLuong, setSoLuong] = useState();
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const maSanPhamCT = props.maSanPhamCT;
  const idString = (_id) => {
    return String(_id).toLowerCase().split(" ").join("");
  };

  const loadGioHang = async () => {
    try {
      const response = await findGioHang();
      setData(response.data);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  useEffect(() => {
    loadGioHang();
  }, []);
  const handleConfirm = () => {
    Swal.fire({
      title: "Thành công!",
      text: "Thêm vào giỏ hàng thành công",
      icon: "success",
    });
  };

  const rootId = idString(maSanPhamCT);

  const navigate = useNavigate();
  const productItem = props;
  const handleProductDetails = () => {
    navigate(`/product/${rootId}`, {
      state: {
        productInfo: productItem,
        maSanPhamCT: maSanPhamCT,
      },
    });
  };

  const handleAddToCart = async () => {
    // await themGioHang(props.maSanPhamCT, props.soLuong)
    // .then((response) => {
    //   // toast.success(response.data.message);
    //   Swal.fire({
    //     title: "Thành công!",
    //     text: "Thêm vào giỏ hàng thành công",
    //     icon: "success",
    //   });
    // })
    // .catch((error) => {
    //   console.log("Lỗi ", error);
    //   toast.error(error.response.data.message);
    // });
    try {
      await themGioHang(props.maSanPhamCT, 1);

      // Show a success message using Swal (SweetAlert) or toast
      Swal.fire({
        title: "Thành công!",
        text: "Thêm vào giỏ hàng thành công",
        icon: "success",
      });
      // Optionally, you can navigate to the cart page or update the cart state
      // Example: navigate("/cart");
    } catch (error) {
      // Handle errors, such as displaying an error message
      console.log("Lỗi ", error);
      toast.error(error.response?.data?.message || "Error adding to cart");
    }
  };

  const handleAddToFavorite = async () => {
    try {
      await themYthich(props.maSanPhamCT);
      Swal.fire({
        title: "Thành công!",
        text: "Thêm vào danh sách yêu thích thành công",
        icon: "success",
      });
    } catch (error) {
      console.log("Lỗi ", error);
      toast.error(
        error.response?.data?.message || "Lỗi khi thêm vào danh sách yêu thích"
      );
    }
  };

  return (
    <div className="w-full relative group">
      <ToastContainer />

      <div className="max-w-80 max-h-80 relative overflow-y-hidden ">
        <div>
          <img
            className="w-full h-full"
            src={`data:image/png;base64,${props.img}`}
            onClick={handleProductDetails}
          />
        </div>
        <div className="absolute top-6 left-8">
          {props.badge && <Badge text="New" />}
        </div>
        <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
          <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
            <li
              onClick={handleProductDetails}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full hover:text-pink-500"
            >
              Xem chi tiết
              <span className="text-lg">
                <MdOutlineLabelImportant />
              </span>
            </li>
            <li
              onClick={() => handleAddToCart(props.maSanPhamCT, 1)}
              // onClick={() =>
              //   dispatch(
              //     addToCart({
              //       _id: props._id,
              //       name: props.productName,
              //       quantity: 1,
              //       image: props.img,
              //       badge: props.badge,
              //       price: props.price,
              //       colors: props.color,
              //     })
              //   )
              // }
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full hover:text-pink-500"
            >
              Thêm vào giỏ hàng
              <span>
                <FaShoppingCart />
              </span>
            </li>

            <li
              onClick={() => handleAddToFavorite(props.maSanPhamCT)}
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full hover:text-pink-500"
            >
              Thêm vào sản phẩm yêu thích
              <span>
                <BsSuitHeartFill />
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-80 py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4">
        <div className="flex items-center justify-between font-titleFont">
          <h2 className="text-lg text-primeColor font-bold">
            <p onClick={handleProductDetails}>{props.tenSanPham}</p>
          </h2>
          <p className="text-[#767676] text-[14px]">${props.giaBan}</p>
        </div>
        <div>
          <p className="text-[#767676] text-[14px]">{props.tenMau}</p>
          <p className="text-[#767676] text-[14px]">{props.tenLoai}</p>
        </div>
      </div>
    </div>
  );
};

export default Product;
