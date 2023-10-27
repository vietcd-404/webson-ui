import React from "react";

const Badge = ({ text }) => {
  return (
    <div className="bg-primeColor w-[92px] h-[35px] text-[#FF0000] flex justify-center items-center text-base font-semibold duration-300 cursor-pointer">
      {text}
    </div>
  );
};

export default Badge;
