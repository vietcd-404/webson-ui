// FilterSidebar.js
import React from "react";

const FilterSidebar = ({
  isOpen,
  toggleSidebar,
  data,
  selectedValue,
  handleItemClick,
  title,
}) => {
  return (
    <div>
      <div
        className="flex items-center cursor-pointer border-b border-gray-300"
        onClick={toggleSidebar}
      >
        <div className="space-y-2 mb-1 font-bold">{title}</div>
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
        {data.map((item) => (
          <div
            key={item.id} // Change 'id' to the appropriate property of your data
            className={`block py-2 text-gray-800 hover:bg-gray-200 border-b border-gray-300 ${
              selectedValue === item.id ? "bg-gray-200" : ""
            }`}
            onClick={() => handleItemClick(item.id)}
          >
            {item.name}{" "}
            {/* Change 'name' to the appropriate property of your data */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSidebar;
