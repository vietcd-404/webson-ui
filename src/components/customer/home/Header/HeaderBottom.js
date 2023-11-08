import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
// import { HiOutlineMenuAlt4 } from "react-icons/hi";
import {
  FaSearch,
  FaUser,
  FaCaretDown,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";
import Flex from "../../designLayouts/Flex";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { paginationItems } from "../../../../constants";
import { useAuth } from "../../../../pages/customer/Account/AuthProvider";

const HeaderBottom = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const [show, setShow] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();
  useEffect(() => {
    const handleBodyClick = (e) => {
      if (ref.current && ref.current.contains(e.target)) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    document.body.addEventListener("click", handleBodyClick);
    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, [show]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const { user, signout } = useAuth();

  useEffect(() => {
    const filtered = paginationItems.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          <div className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
            <input
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
              type="text"
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Tìm kiếm sản phẩm tại đây"
            />
            <FaSearch className="w-5 h-5 ml-20" />
            {searchQuery && (
              <div
                className={`w-full mt-2 lg:mt-0 lg:left-0 lg:right-0 absolute z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer`}
              >
                {searchQuery &&
                  filteredProducts.map((item) => (
                    <div
                      onClick={() =>
                        navigate(
                          `/product/${item.productName
                            .toLowerCase()
                            .split(" ")
                            .join("")}`,
                          {
                            state: {
                              item: item,
                            },
                          }
                        ) &
                        setShowSearchBar(true) &
                        setSearchQuery("")
                      }
                      key={item._id}
                      className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3"
                    >
                      <img className="w-24" src={item.img} alt="productImg" />
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-lg">
                          {item.productName}
                        </p>
                        <p className="text-xs">{item.des}</p>
                        <p className="text-sm">
                          Price:{" "}
                          <span className="text-primeColor font-semibold">
                            ${item.price}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            <div onClick={() => setShowUser(!showUser)} className="flex">
              <FaUser size={20} />
              <FaCaretDown size={20} />
              {showUser && (
                <motion.ul
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute top-6 right-0 z-50 bg-white w-44 text-[#767676] h-auto p-4 pb-6"
                >
                  {user ? (
                    <>
                      <li className="text-400 text-black hover:bg-[#FF99CC] px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-black hover:text-white duration-300 cursor-pointer">
                        <Link to="/profile">Chào, {user.username}</Link>
                      </li>
                      <li className="text-400 text-black hover:bg-[#FF99CC] px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-black hover:text-white duration-300 cursor-pointer">
                        <Link to="/bill">Hóa đơn</Link>
                      </li>
                      <li className="text-400 text-black hover:bg-[#FF99CC] px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-black hover:text-white duration-300 cursor-pointer">
                        <Link to="/signin" onClick={signout}>
                          Đăng xuất
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="text-400 text-black hover:bg-[#FF99CC] px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-black hover:text-white duration-300 cursor-pointer">
                        <Link to="/signin">Đăng nhập</Link>
                      </li>
                      <li className="text-400 text-black hover:bg-[#FF99CC] px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-black hover:text-white duration-300 cursor-pointer">
                        <Link onClick={() => setShowUser(false)} to="/signup">
                          Đăng ký
                        </Link>
                      </li>
                    </>
                  )}
                </motion.ul>
              )}
            </div>

            <Link to="/my-favorites">
              <div className="relative ml-2 mr-2">
                <FaHeart size={20} />
                <span className="absolute font-titleFont -top-4 -right-2 text-xs flex items-center justify-center bg-[#FF0000] text-white font-bold w-3.5">
                  {products.length > 0 ? products.length : 0}
                </span>
              </div>
            </Link>

            <Link to="/cart">
              <div className="relative">
                <FaShoppingCart size={20} />
                <span className="absolute font-titleFont -top-4 -right-2 text-xs flex items-center justify-center bg-[#0033CC] text-white font-bold w-3.5">
                  {products.length > 0 ? products.length : 0}
                </span>
              </div>
            </Link>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
