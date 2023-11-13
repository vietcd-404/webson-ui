import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { logo } from "../../../../assets/images";
import Image from "../../designLayouts/Image";
import { navBarList } from "../../../../constants";
import Flex from "../../designLayouts/Flex";

const Header = () => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    let ResponsiveMenu = () => {
      if (window.innerWidth < 667) {
        setShowMenu(false);
      } else {
        setShowMenu(true);
      }
    };
    ResponsiveMenu();
    window.addEventListener("resize", ResponsiveMenu);
  }, []);

  return (
    <div className="w-full h-20 bg-[#E5677D] sticky top-0 z-50 border-b-[1px] border-b-gray-200">
      <nav className="h-full px-4 max-w-container mx-auto relative">
        <Flex className="flex items-center justify-between h-full">
          <Link to="/">
            <div>
              <Image className="w-20 object-cover" imgSrc={logo} />
            </div>
          </Link>
          <div className="">
            {showMenu && (
              <ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center z-50 p-0"
              >
                {navBarList.map(({ _id, title, link }) => (
                  <li
                    key={_id}
                    className="flex font-normal text-base hover:font-bold   text-white  hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] hoverEffect justify-center items-center px-12 md:border-r-[2px] border-r-gray-300 last:border-r-0"
                  >
                    <NavLink
                      key={_id}
                      to={link}
                      state={{ data: location.pathname.split("/")[1] }}
                      className={` ${
                        link === location.pathname ? "active-link-head" : ""
                      }`}
                    >
                      {title}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Flex>
      </nav>
    </div>
  );
};

export default Header;
