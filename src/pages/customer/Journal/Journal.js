import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/customer/pageProps/Breadcrumbs";
import {
  new1,
  new2,
  new3,
  new4,
  new5,
  new6,
} from "../../../assets/images/index";
import { Col, Row } from "antd";
const Journal = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");
  useEffect(() => {
    setPrevLocation(location.state.data);
  }, [location]);

  const journalEntries = [
    {
      title: "Bảng Màu Son Black Rouge Mới Nhất 2022 – 2023",
      body: "Thành công của son Black Rouge hiện tại khiến ai cũng tưởng hãng đã có nhiều năm kinh nghiệm trong giới son môi. Hào quang của Black Rouge xuất hiện từ ngay khi hãng ra đời vào năm 2016 từ BST đầu tiên. Black Rouge khiến ai nấy say mê chẳng hề kém “tiền bối” 3CE, Bbia chút nào và có sự cạnh tranh cao với nhiều thương hiệu son Hàn mới hiện nay. Thuộc phân khúc bình dân nhưng chất lượng của bảng màu son Black Rouge  khiến ai nấy cảm thấy mê mẩn bởi vì quá xuất sắc.",
      image: new1,
    },
    {
      title: "Bảng Màu Son Romand Mới Nhất 2022 – 2023",
      body: "Romand khiến phái đẹp say mê bởi những cây son bóng mọng môi, cho ai nấy hết nấc quyến rũ. Bảng màu son Romand  không chỉ mang đến những điều thú vị như vậy mà còn nhiều loại son thỏi, son kem lì đặc sắc khác chiêu đãi phái đẹp. Theo dõi đầy đủ bảng màu sống động nhà Romand trong bài viết dưới đây, ai nấy đều phải tấm tắc ngợi khen là điều chắc chắn.",
      image: new2,
    },
    {
      title:
        "Review Son MAC 95 Vicious Màu Đỏ Cam Gạch Locked Kiss 24h Lipstick Mới Nhất",
      body: "son MAC Locked Kiss 24h Lipstick dạng son thỏi. Phải nói là thỏi son mới cầm trên tay thích mắt cực kỳ; bởi cái giao diện khác hẳn trước đây mà còn sành điệu. Dĩ nhiên là chất son mới là điểm nhấn chính; cơ mà mình cũng không thể thôi tò mò về những sắc son xuất hiện trong bộ sưu tập lần này. Và nhân đây nàng hãy cùng minh khám phá sắc đỏ cam gạch siêu ấn tượng thông qua bài viết  ngay dưới đây nhé!",
      image: new5,
    },
    {
      title:
        "Review Son MAC 88 Ruby True Màu Đỏ Lạnh Locked Kiss 24h Lipstick Mới Nhất",
      body: "Từ trước đến nay liệu có nàng nào giống mình; thấy son môi lưu màu 8 tiếng đã là siêu đỉnh rồi không? Ấy thế mà ai có thể ngờ được trong 1 năm; MAC lại tung ra tận 2 bộ sưu tập son siêu khủng; và đặc biệt là có thể giữ màu 24 giờ. Phiên bản đầu tiên là son kem; còn phiên bản mới đây nhất là son MAC Locked Kiss 24h Lipstick dạng son thỏi. Phải nói là thỏi son mới cầm trên tay thích mắt cực kỳ; bởi cái giao diện khác hẳn trước đây mà còn sành điệu. Dĩ nhiên là chất son mới là điểm nhấn chính; cơ mà mình cũng không thể thôi tò mò về những sắc son xuất hiện trong bộ sưu tập lần này. Và nhân đây nàng hãy cùng minh khám phá sắc đỏ lạnh siêu ấn tượng thông qua bài viết ",
      image: new6,
    },
  ];

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Bảng tin" prevLocation={prevLocation} />
      <div className="pb-10 mt-4">
        <h1 className="max-w-[600px] text-base text-lightText mb-2">
          <span className="text-primeColor font-semibold text-lg">
            Dưới đây là bảng các bảng tin mới nhất về son.
          </span>
        </h1>

        <div className="mt-5 ml-6 mb-4">
          {journalEntries.map((entry, index) => (
            <div
              key={index}
              className="journal-entry flex mb-5"
              style={{ marginLeft: "300px" }}
            >
              <Row>
                <Col span={6} className="d-flex justify-content-center">
                  <img
                    className="journal-entry-image mx-auto"
                    src={entry.image}
                    alt={entry.title}
                    width={1600}
                  />
                </Col>
                <Col span={8}>
                  <div className="journal-entry-content flex flex-col ml-4">
                    <h2 className="text-bold" style={{ fontSize: "1.5rem" }}>
                      {entry.title}
                    </h2>
                    <p style={{ fontSize: "1.2rem" }}>{entry.body}</p>
                  </div>
                </Col>
              </Row>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20",
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
