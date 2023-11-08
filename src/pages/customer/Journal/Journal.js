import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/customer/pageProps/Breadcrumbs";
import { new1, new2, new3, new4 } from "../../../assets/images/index";
const Journal = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    setPrevLocation(location.state.data);
  }, [location]);

  const journalEntries = [
    {
      title: "Tiêu đề bài viết 1",
      body: "Nội dung bài viết 1",
      image: new1,
    },
    {
      title: "Tiêu đề bài viết 2",
      body: "Nội dung bài viết 2",
      image: new2,
    },
    {
      title: "Tiêu đề bài viết 3",
      body: "Nội dung bài viết 3",
      image: new3,
    },
    {
      title: "Tiêu đề bài viết 4",
      body: "Nội dung bài viết 4",
      image: new4,
    },
  ];
  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Bảng tin" prevLocation={prevLocation} />
      <div className="pb-10">
        <h1 className="max-w-[600px] text-base text-lightText mb-2">
          <span className="text-primeColor font-semibold text-lg">
            Dưới đây là bảng các bảng tin mới nhất về son.
          </span>
        </h1>

        {journalEntries.map((entry, index) => (
          <div key={index} className="journal-entry card">
            <div className="flex flex-col items-center justify-between">
              <img
                className={"journal-entry-image"}
                src={entry.image}
                alt={entry.title}
              />
              <div className="flex flex-col items-center justify-between pt-4">
                <h2 className="text-bold">{entry.title}</h2>
                <p>{entry.body}</p>
              </div>
            </div>
          </div>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20", // Đặt chiều cao của div để làm cho nút giữa màn hình
          }}
        >
          <button className="w-52 h-10 bg-[#FF0000] text-white hover:text-white hover:bg-[#FF99CC] duration-300">
            <Link to="/shop">Tiếp tục Shopping</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Journal;
