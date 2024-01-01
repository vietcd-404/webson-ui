import React, { useState } from "react";
// import { FaPlus } from "react-icons/fa";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";
import { useEffect } from "react";
import { findAllLoai } from "../../../../../services/LoaiService";
import { findLoai } from "../../../../../services/SanPhamUser";

const Category = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadTable();
  }, []);

  //Hiện list danh sách lên
  const loadTable = async () => {
    try {
      const response = await findLoai();
      setData(response.data);
      console.log(response);
      // setTotalPage(response.totalPage);
      // setLoading(false);
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
      // setLoading(false);
    }
  };
  return (
    <div className="w-full">
      <NavTitle title="Shop by Category" />
      <div>
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {data.map((loai) => (
            <li
              key={loai.maLoai}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center justify-between"
            >
              {loai.tenLoai}
              {/* {icons && (
                <span
                  onClick={() => setShowSubCatOne(!showSubCatOne)}
                  className="text-[10px] lg:text-xs cursor-pointer text-gray-400 hover:text-primeColor duration-300"
                >
                  <ImPlus />
                </span>
              )} */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
