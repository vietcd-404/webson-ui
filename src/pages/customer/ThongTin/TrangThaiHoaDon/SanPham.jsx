import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { MdOutlineLabelImportant } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { themSanPhamVaoHoaDon } from "../../../../services/HoaDonService";
import Swal from "sweetalert2";
const SanPham = (item, maHoaDon) => {
  //   const loadGioHang = async () => {
  //     try {
  //       const response = await findGioHang();
  //       setData(response.data);
  //     } catch (error) {
  //       console.error("Lỗi khi gọi API: ", error);
  //     }
  //   };
  //   useEffect(() => {
  //     loadGioHang();
  //   }, []);

  const handleSanPham = async (maHoaDon) => {
    try {
      await themSanPhamVaoHoaDon(item.maSanPhamCT, 1, maHoaDon);
      Swal.fire({
        title: "Thành công!",
        text: "Thêm vào giỏ hàng thành công",
        icon: "success",
      });
    } catch (error) {
      console.log("Lỗi ", error);
      toast.error(error.response?.data?.message || "Error adding to cart");
    }
  };

  return (
    <div className="w-full relative group">
      <ToastContainer />

      <div className="max-w-80 max-h-80 relative overflow-y-hidden ">
        <div>
          <img
            className="w-full h-[90%] cursor-pointer"
            alt={item.tenSanPham}
            src={`data:image/png;base64,${item.img}`}
          />
        </div>

        <div className="w-full h-32 absolute bg-white -bottom-[130px] group-hover:bottom-0 duration-700">
          <ul className="w-full h-full flex flex-col items-end justify-center gap-2 font-titleFont px-2 border-l border-r">
            <li className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full hover:text-pink-500">
              Xem chi tiết
              <span className="text-lg">
                <MdOutlineLabelImportant />
              </span>
            </li>

            <li
              className="text-[#767676] hover:text-primeColor text-sm font-normal border-b-[1px] border-b-gray-200 hover:border-b-primeColor flex items-center justify-end gap-2 hover:cursor-pointer pb-1 duration-300 w-full hover:text-pink-500"
              onClick={() => handleSanPham(item.maSanPhamCT, 1, item.maHoaDon)}
            >
              Thêm sản phẩm
              <span>
                <FaShoppingCart />
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-80 py-6 flex flex-col gap-1 border-[1px] border-t-0 px-4">
        <div className="flex items-center justify-between font-titleFont">
          <h2 className="text-lg text-primeColor font-bold cursor-pointer">
            <p
              className="hover:text-pink-500 translate-x-0 overflow-hidden whitespace-nowrap"
              style={{ textOverflow: "ellipsis", maxWidth: "200px" }}
            >
              {item.tenSanPham}
            </p>
          </h2>
          <del className="text-[#767676] text-[14px]">{item.giaBan} đ</del>
        </div>
        <div>
          <div className="flex justify-between">
            <p className="text-[#767676] text-[14px]">{item.tenMau}</p>
            <p className="text-[#767676] text-[16px]">
              {item.giaBan * ((100 - item.phanTramGiam) / 100)} đ
            </p>
          </div>
          <p className="text-[#767676] text-[14px]">{item.tenLoai}</p>
        </div>
      </div>
    </div>
  );
};
export default SanPham;
