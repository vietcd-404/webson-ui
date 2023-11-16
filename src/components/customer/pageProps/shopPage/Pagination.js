import React, { useState, useEffect } from "react";
import Product from "../../home/Products/Product";
import { findLoai, findMauSac, getAll } from "../../../../services/SanPhamUser";
import NavPage from "./NavPage";
import { GoTriangleDown } from "react-icons/go";
import { PulseLoader } from "react-spinners";
import { Link } from "react-router-dom";

const Pagination = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [giaGiamDan, setGiaGiamDan] = useState(false);
  const [giaTangDan, setGiaTangDan] = useState(false);
  const [selectedLoai, setSelectedLoai] = useState(""); // Mã loại đã chọn
  const [selectedMau, setSelectedMau] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [sortingOrder, setSortingOrder] = useState("");

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
        selectedMau
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };
  const toggleSidebarMau = () => {
    setIsOpenMau(!isOpenMau);
  };

  useEffect(() => {
    loadTable();
  }, [page, sortingOrder]);

  const handleLoaiClick = (maLoai) => {
    setSelectedLoai(maLoai);
    loadTable();
    // closeSidebar(); // Đóng sidebar sau khi chọn loại
  };

  const handleMauClick = (maMau) => {
    setSelectedMau(maMau);
    loadTable();
    // toggleSidebarMau(); // Đóng sidebar sau khi chọn màu
  };

  const [dataLoai, setDataLoai] = useState([]);
  const [dataMau, setDataMau] = useState([]);

  useEffect(() => {
    loadTableLoai();
    loadTableMau();
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

  return (
    <div className="flex min-h-screen container mx-auto m-10">
      <div className="min-h-screen w-64">
        <div className="font-bold text-lg mb-5">Lọc sản phẩm</div>
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
                selectedLoai === item.maLoai ? "bg-gray-200" : ""
              }`}
              onClick={() => handleLoaiClick(item.maLoai)}
            >
              {item.tenLoai}
            </Link>
          ))}
        </div>
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
              {data.map((item) => (
                <div key={item.maSanPhamCT} className="w-full">
                  <Product
                    maSanPhamCT={item.maSanPhamCT}
                    img={item.danhSachAnh[0]}
                    tenSanPham={item.tenSanPham}
                    giaBan={item.giaBan}
                    tenMau={item.tenMau}
                    tenThuongHieu={item.tenThuongHieu}
                    tenLoai={item.tenLoai}
                    doLi={item.doLi}
                    doBong={item.doBong}
                    soLuongTon={item.soLuongTon}
                  />
                </div>
              ))}
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

export default Pagination;
