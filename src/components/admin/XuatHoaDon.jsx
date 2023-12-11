import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { logo } from "../../assets/images";
class XuatHoaDon extends React.Component {
  exportPDF = () => {
    const input = document.getElementById("pdf-content");

    html2canvas(input).then((canvas) => {
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(logo);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(logo, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.exportPDF}>Export PDF</button>
        <div id="pdf-content" className="card">
          <div className="card">
            <div className="card-header bg-black"></div>
            <div className="card-body">
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <i className="far fa-building text-danger fa-6x float-start"></i>
                  </div>
                </div>

                <div className="row">
                  <div className="col-xl-12">
                    <img src={logo} alt="Logo" width="80" />

                    <ul className="list-unstyled">
                      <li style={{ fontSize: "30px", color: "red" }}>
                        Heva Shop
                      </li>
                      <li>Phạm Văn Bạch-Yên Hòa-Cầu Giấy Hà Nội</li>
                      <li>+84.9313.32203</li>
                      <li>hevashop@mail.com</li>
                    </ul>
                  </div>
                </div>

                <div className="row text-center">
                  <h3
                    className="text-uppercase text-center mt-3"
                    style={{ fontSize: "40px" }}
                  >
                    Hóa Đơn
                  </h3>
                  <p>#HD123456789</p>
                </div>

                <div className="row mx-3">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Sản Phẩm</th>
                        <th scope="col">Số lượng</th>
                        <th scope="col">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Samsung TV</td>
                        <td>
                          <i className="fas fa-dollar-sign"></i> 500,00
                        </td>
                      </tr>
                      <tr>
                        <td>JBL Speaker</td>
                        <td>
                          <i className="fas fa-dollar-sign"></i> 300,00
                        </td>
                      </tr>
                      <tr>
                        <td>Macbook Air</td>
                        <td>
                          <i className="fas fa-dollar-sign"></i> 1000,00
                        </td>
                      </tr>
                      <tr>
                        <td>Iphone 11 PRO</td>
                        <td>
                          <i className="fas fa-dollar-sign"></i> 5000,00
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="row">
                  <div className="col-xl-8">
                    <ul className="list-unstyled float-end me-0">
                      <li>
                        <span className="me-3 float-start">Tổng tiền:</span>
                        <i className="fas fa-dollar-sign"></i> 6850,00
                      </li>
                      <li>
                        <span
                          className="float-start"
                          style={{ marginRight: "35px" }}
                        >
                          Phí ship:{" "}
                        </span>
                        <i className="fas fa-dollar-sign"></i> -500,00
                      </li>
                      <li>
                        <span
                          className="float-start"
                          style={{ marginRight: "35px" }}
                        >
                          Phí ship:{" "}
                        </span>
                        <i className="fas fa-dollar-sign"></i> -500,00
                      </li>
                    </ul>
                  </div>
                </div>

                <hr />

                <div className="row">
                  <div className="col-xl-8" style={{ marginLeft: "60px" }}>
                    <p
                      className="float-end"
                      style={{
                        fontSize: "30px",
                        color: "red",
                        fontWeight: 400,
                        fontFamily: "Arial, Helvetica, sans-serif",
                      }}
                    >
                      Total:{" "}
                      <span>
                        <i className="fas fa-dollar-sign"></i> 6350,00
                      </span>
                    </p>
                  </div>
                </div>

                <div className="row mt-2 mb-5">
                  <p className="fw-bold">
                    Date: <span className="text-muted">23 June 20221</span>
                  </p>
                  <p className="fw-bold mt-3">Signature:</p>
                </div>
              </div>
            </div>
            <div className="card-footer bg-black"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default XuatHoaDon;
