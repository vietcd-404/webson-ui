import React from "react";

const Badge = ({ text }) => {
  return (
    <div className="w-[92px] h-[35px] flex justify-center items-center text-base font-semibold duration-300 cursor-pointer">
      <div className="twinkling text-red-500">{text}</div>
    </div>
    // <div className="w-[92px] h-[35px] text-red-500 flex justify-center items-center text-base font-semibold duration-300 cursor-pointer animate-blink">
    //   {text}
    // </div>
  );
};

export default Badge;
