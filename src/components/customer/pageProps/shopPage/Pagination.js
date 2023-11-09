import React, { useState, useEffect } from "react";
import Product from "../../home/Products/Product";
import { getAll } from "../../../../services/SanPhamUser";
import NavPage from "./NavPage";

const Pagination = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 9;

  const handlePageClick = (selectedPage) => {
    // setPage(selectedPage.selected + 1);
    setPage(selectedPage);
  };

  const loadTable = async () => {
    setIsLoading(true);
    try {
      // Replace this with your API call
      const response = await getAll(page, pageSize);
      setData(response.data.content);
      setTotalPages(Math.ceil(response.data.totalPages));
    } catch (error) {
      console.error("Lỗi khi gọi API: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTable();
  }, [page]);

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
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
  );
};

export default Pagination;
