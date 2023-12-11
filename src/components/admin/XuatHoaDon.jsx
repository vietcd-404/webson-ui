import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { logo } from "../../assets/images";
class XuatHoaDon extends React.Component {
  exportPDF = () => {
    const input = document.getElementById("pdf-content");

    html2canvas(input).then((canvas) => {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL("image/png");

      // Lấy kích thước của trang PDF và tính toán kích thước cho ảnh
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Thêm ảnh từ canvas vào tệp PDF
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Lưu tệp PDF
      pdf.save("invoice.pdf");
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.exportPDF}>Export PDF</button>
        <div id="pdf-content" className="card">
          <div className="card-header bg-black"></div>
          <div className="card-body">
            <div className="container">
              <div className="row">
                <div className="col-xl-12">
                  <i className="far fa-building text-danger fa-6x float-start"></i>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-9">
                  <img src={logo} alt="Logo" width="80" />
                </div>
                <div className="col-xl-3">
                  <ul className="list-unstyled">
                    <li style={{ fontSize: "30px", color: "red" }}>
                      Heva Shop
                    </li>
                    <li>Địa chỉ: Phạm Văn Bạch-Yên Hòa-Cầu Giấy Hà Nội</li>
                    <li>Sđt: +84.9313.32203</li>
                    <li>Email: hevashop@mail.com</li>
                  </ul>
                </div>
              </div>

              <div className="row text-center">
                <h3
                  className="text-uppercase text-center mt-3 mb-2"
                  style={{ fontSize: "40px", fontWeight: "bold" }}
                >
                  Hóa Đơn
                </h3>
                <p c>#HD</p>
              </div>
              <div
                className="row clear-both mx-3 mt-2"
                style={{ fontSize: "15px" }}
              >
                <div>Ngày mua:</div>
                <div>Khách hàng:</div>
                <div>Địa chỉ:</div>
                <div>Số điện thoại:</div>
                <div>Địa chỉ:</div>
                <div>Nhân viên:</div>
              </div>
              <div className="row mx-3 mt-3">
                <p
                  className="text-center"
                  style={{ fontSize: "22px", fontWeight: "bold" }}
                >
                  Danh sách sản phẩm mua
                </p>
              </div>
              <div className="row mx-3 mt-3">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Sản Phẩm</th>
                      <th scope="col">Số lượng</th>
                      <th scope="col">Đơn giá</th>
                      <th scope="col">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="row mt-2 mb-4">
                <div className="col-xl-8">
                  <ul className="list-unstyled float-end me-0">
                    <li>
                      <span
                        className="float-start"
                        style={{
                          marginRight: "20px",
                          fontWeight: "bold",
                          fontSize: "17px",
                        }}
                      >
                        Tổng tiền: -
                      </span>
                    </li>
                    <li>
                      <span
                        className="float-start"
                        style={{
                          marginRight: "40px",
                          fontWeight: "bold",
                          fontSize: "17px",
                        }}
                      >
                        Chiết khấu: %
                      </span>
                    </li>
                    <li>
                      <span
                        className="float-start"
                        style={{
                          marginRight: "35px",
                          fontWeight: "bold",
                          fontSize: "17px",
                        }}
                      >
                        Phí ship: -
                      </span>
                    </li>
                    <li>
                      <span
                        className="float-start"
                        style={{
                          marginRight: "35px",
                          fontWeight: "bold",
                          fontSize: "17px",
                        }}
                      >
                        Trạng thái: -
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <hr />

              <div className="row">
                <div className="col-xl-8" style={{ marginLeft: "60px" }}>
                  <p
                    className="float-end mt-1"
                    style={{
                      fontSize: "30px",
                      color: "red",
                      fontWeight: 400,
                      fontFamily: "Arial, Helvetica, sans-serif",
                    }}
                  >
                    Thành tiền: <span></span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer bg-black text-[#ffff] text-center font-size-10">
            Cảm ơn quý khách
          </div>
        </div>
      </div>
    );
  }
}

export default XuatHoaDon;
