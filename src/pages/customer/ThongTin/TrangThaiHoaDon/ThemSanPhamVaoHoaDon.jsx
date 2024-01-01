import React from "react";
import Product from "../../../../components/customer/home/Products/Product";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { useState } from "react";
import NavPage from "../../../../components/customer/pageProps/shopPage/NavPage";
import { useEffect } from "react";
import {
  findLoai,
  findMauSac,
  findThuongHieu,
  getAll,
} from "../../../../services/SanPhamUser";
import { ToastContainer, toast } from "react-toastify";
import { MdOutlineLabelImportant } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { themSanPhamVaoHoaDon } from "../../../../services/HoaDonService";
import Swal from "sweetalert2";

const ThemSanPhamVaoHoaDon = ({ maHoaDon, load }) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [giaGiamDan, setGiaGiamDan] = useState(false);
  const [giaTangDan, setGiaTangDan] = useState(false);
  const [selectedLoai, setSelectedLoai] = useState(""); // Mã loại đã chọn
  const [selectedMau, setSelectedMau] = useState("");
  const [selectedThuongHieu, setSelectedThuongHieu] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [sortingOrder, setSortingOrder] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const pageSize = 9;

  const handlePageClick = (selectedPage) => {
    // setPage(selectedPage.selected + 1);
    setPage(selectedPage);
  };

  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    if (selectedSort === "") {
      // Clear sorting conditions
      setSortingOrder("");
      setGiaGiamDan(false);
      setGiaTangDan(false);
    } else {
      // Set sorting order based on the selected option
      setSortingOrder(selectedSort);

      // Reset sorting options
      setGiaGiamDan(selectedSort === "desc");
      setGiaTangDan(selectedSort === "asc");
    }
  };
  const loadTable = async () => {
    setIsLoading(true);
    try {
      // Replace this with your API call
      const response = await getAll(
        page,
        pageSize,
        sortingOrder === "asc" ? false : giaGiamDan,
        sortingOrder === "desc" ? false : giaTangDan,
        selectedLoai, // Sử dụng mã loại đã chọn thay vì maLoai
        selectedMau,
        selectedThuongHieu,
        minPrice,
        maxPrice
      );
      setData(response.data.content);
      setTotalPages(Math.ceil(response.data.totalPages));
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMau, setIsOpenMau] = useState(false);
  const [isOpenThuongHieu, setIsOpenthuongHieu] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSelectedLoai("");
    }
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };
  const toggleSidebarMau = () => {
    setIsOpenMau(!isOpenMau);
    if (isOpenMau) {
      setSelectedMau("");
    }
  };
  const toggleSidebarThuongHieu = () => {
    setIsOpenthuongHieu(!isOpenThuongHieu);
    if (isOpenThuongHieu) {
      setSelectedThuongHieu("");
    }
  };

  useEffect(() => {
    loadTable();
  }, [page, sortingOrder, selectedLoai, selectedMau, selectedThuongHieu]);

  const handleLoaiClick = (maLoai) => {
    if (selectedLoai === maLoai) {
      setSelectedLoai("");
    } else {
      setSelectedLoai(maLoai);
    }
  };

  const handleMauClick = (maMau) => {
    if (selectedMau === maMau) {
      setSelectedMau("");
    } else {
      setSelectedMau(maMau);
    }
  };

  const handleThuongHieuClick = (maThuongHieu) => {
    if (selectedThuongHieu === maThuongHieu) {
      setSelectedThuongHieu("");
    } else {
      setSelectedThuongHieu(maThuongHieu);
    }
  };

  const [dataLoai, setDataLoai] = useState([]);
  const [dataMau, setDataMau] = useState([]);
  const [dataThuongHieu, setDataThuongHieu] = useState([]);

  useEffect(() => {
    loadTableLoai();
    loadTableMau();
    loadTableThuongHieu();
  }, []);

  //Hiện list danh sách lên
  const loadTableLoai = async () => {
    try {
      const response = await findLoai();
      setDataLoai(response.data);
      console.log(response);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  const loadTableMau = async () => {
    try {
      const response = await findMauSac();
      setDataMau(response.data);
      console.log(response);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };
  const loadTableThuongHieu = async () => {
    try {
      const response = await findThuongHieu();
      setDataThuongHieu(response.data);
      console.log(response);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    }
  };

  const handleFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    loadTable();
  };

  const handleSanPham = async (maSanPhamCT) => {
    try {
      await themSanPhamVaoHoaDon(maSanPhamCT, 1, maHoaDon);
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
    <div className="flex container mx-auto m-10 h-[800px]">
      <div className="min-h-screen w-64 pr-[55px]">
        <div className="font-bold text-lg mb-5">Lọc sản phẩm</div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Lọc theo giá</h2>
          <div className="w-full flex flex-col mb-4">
            <label htmlFor="minPrice" className="mb-1">
              Giá thấp nhất
            </label>
            <input
              type="number"
              id="minPrice"
              min="0"
              className="p-2 border border-gray-300 mb-2"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />

            <label htmlFor="maxPrice" className="mb-1">
              Giá cao nhất
            </label>
            <input
              type="number"
              id="maxPrice"
              min="0"
              className="p-2 border border-gray-300 mb-2"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={handleFilter}
            >
              <span className="mr-2">Áp dụng</span>
            </button>
          </div>
        </div>
        <div className="mb-4">
          <div
            className="flex items-center cursor-pointer border-b border-gray-300 "
            onClick={toggleSidebar}
          >
            <div className="space-y-2 mb-1 font-bold">Loại son</div>
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              )}
            </svg>
          </div>
          <div className={`p-4 ${isOpen ? "" : "hidden"}`}>
            {dataLoai.map((item) => (
              <Link
                key={item.maLoai} // Thêm key để tránh lỗi warning
                className={`block py-2 text-gray-800 hover:bg-gray-200 border-b border-gray-300 ${
                  selectedLoai === item.maLoai
                    ? "bg-gray-200  underline text-pink-500"
                    : ""
                }`}
                onClick={() => handleLoaiClick(item.maLoai)}
              >
                {item.tenLoai}
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <div
            className="flex items-center cursor-pointer border-b border-gray-300 "
            onClick={toggleSidebarMau}
          >
            <div className="space-y-2 mb-1 font-bold">Màu sắc</div>
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpenMau ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              )}
            </svg>
          </div>
          <div className={`p-4 ${isOpenMau ? "" : "hidden"}`}>
            {dataMau.map((item) => (
              <Link
                key={item.maMau} // Thêm key để tránh lỗi warning
                className={`block py-2 text-gray-800 hover:bg-gray-200 border-b border-gray-300 ${
                  selectedMau === item.maMau ? "bg-gray-200" : ""
                }`}
                onClick={() => handleMauClick(item.maMau)}
              >
                {item.tenMau}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div
            className="flex items-center cursor-pointer border-b border-gray-300 "
            onClick={toggleSidebarThuongHieu}
          >
            <div className="space-y-2 mb-1 font-bold">Thương hiệu</div>
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              )}
            </svg>
          </div>
          <div className={`p-4 ${isOpenThuongHieu ? "" : "hidden"}`}>
            {dataThuongHieu.map((item) => (
              <Link
                key={item.maThuongHieu} // Thêm key để tránh lỗi warning
                className={`block py-2 text-gray-800 hover:bg-gray-200 border-b border-gray-300 ${
                  selectedThuongHieu === item.maThuongHieu ? "bg-gray-200" : ""
                }`}
                onClick={() => handleThuongHieuClick(item.maThuongHieu)}
              >
                {item.tenThuongHieu}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 border-gray-600  min-h-screen">
        <div className="flex items-center gap-2 text-base text-[#767676] relative mb-5">
          <label className="block">Sắp xếp theo:</label>
          <select
            onChange={handleSortChange}
            value={sortingOrder}
            className="w-[100px] md:w-[150px]  border-[1px] border-gray-200 py-1 px-4 cursor-pointer text-primeColor text-base block dark:placeholder-gray-400 appearance-none focus-within:outline-none "
          >
            <option value="">-- Chọn --</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
        </div>

        {isLoading ? (
          <p className="flex flex-wrap justify-center">
            <PulseLoader color="#4f605c" className="py-4" />
          </p>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
              {data.length === 0 ? (
                <p>Không có sản phẩm nào.</p>
              ) : (
                data.map((item) => (
                  <div key={item.maSanPhamCT} className="w-full">
                    <div className="w-full relative group">
                      <ToastContainer />

                      <div className="max-w-80 max-h-80 relative overflow-y-hidden ">
                        <div>
                          <img
                            className="w-full h-[90%] cursor-pointer"
                            alt={item.tenSanPham}
                            src={`data:image/png;base64,${item.danhSachAnh[0]}`}
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
                              onClick={() => handleSanPham(item.maSanPhamCT, 1)}
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
                              style={{
                                textOverflow: "ellipsis",
                                maxWidth: "200px",
                              }}
                            >
                              {item.tenSanPham}
                            </p>
                          </h2>
                          <del className="text-[#767676] text-[14px]">
                            {item.giaBan} đ
                          </del>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <p className="text-[#767676] text-[14px]">
                              {item.tenMau}
                            </p>
                            <p className="text-[#767676] text-[16px]">
                              {item.giaBan * ((100 - item.phanTramGiam) / 100)}{" "}
                              đ
                            </p>
                          </div>
                          <p className="text-[#767676] text-[14px]">
                            {item.tenLoai}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-7 flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
              <NavPage
                totalPages={totalPages}
                page={page}
                setPage={handlePageClick}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemSanPhamVaoHoaDon;
