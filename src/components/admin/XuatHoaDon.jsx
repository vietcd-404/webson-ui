import React, { useRef } from "react";
import { logo } from "../../assets/images";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "antd";
import { format } from "date-fns";
const XuatHoaDon = ({ editFormData, tableDataProduct }) => {
  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Chờ xác nhận";
      case 1:
        return "Đã xác nhận";
      case 2:
        return "Đang giao";
      case 3:
        return "Hoàn thành";
      case 4:
        return "Đã hủy";
      case 5:
        return "Hóa đơn tại quầy";
      default:
        return "Chờ xác nhận";
    }
  };

  const exportPDF = () => {
    const input = document.getElementById("pdf-content");
    html2canvas(input).then((canvas) => {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL("image/png");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    });
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="card m-5" id="pdf-content">
        <div>
          <div className="card-header bg-black"></div>
          <div className="card-body">
            <div className="container">
              <div className="row">
                <div className="col-xl-9">
                  <img src={logo} alt="Logo" width="80" />
                </div>
                <div class="col-xl-3">
                  <ul class="list-unstyled">
                    <li style={{ fontSize: "30px", color: "red" }}>
                      Heva Shop
                    </li>
                    <li>
                      {" "}
                      <strong>Địa chỉ:</strong> Phạm Văn Bạch-Yên Hòa-Cầu Giấy
                      Hà Nội
                    </li>
                    <li>
                      <strong>Sđt:</strong> +84.9313.32203
                    </li>
                    <li>
                      <strong> Email</strong>: hevashop@mail.com
                    </li>
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
                <p c>#HD0000{editFormData.maHoaDon}</p>
              </div>
              <div
                className="row clear-both mx-3 mt-2"
                style={{ fontSize: "15px" }}
              >
                <div>
                  <strong>Ngày mua:</strong> {editFormData.ngayTao}
                </div>
                <div>
                  <strong>Khách hàng:</strong> {editFormData.tenNguoiDung}
                </div>
                <div>
                  <strong>Địa chỉ:</strong>{" "}
                  {editFormData.diaChiChiTiet ? editFormData.diaChiChiTie : ""}
                </div>
                <div>
                  <strong>Số điện thoại:</strong> {editFormData.sdt}
                </div>
                <div>
                  <strong>Nhân viên:</strong> {editFormData.tenNhanVien}
                </div>
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
                    {tableDataProduct.map((product, index) => (
                      <tr key={index}>
                        <td>{product.tenSanPham}</td>
                        <td>{product.soLuong}</td>
                        <td>{product.donGia}</td>
                        <td>{product.soLuong * product.donGia}</td>
                      </tr>
                    ))}
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
                        Tổng tiền:{" "}
                        {(
                          editFormData.tongTien + editFormData.tienGiam
                        ).toLocaleString("en-US")}{" "}
                        VNĐ
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
                        Chiết khấu: (-){" "}
                        {(editFormData.tienGiam
                          ? editFormData.tienGiam
                          : "0"
                        ).toLocaleString("en-US")}{" "}
                        VNĐ
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
                        Phí ship: (+){" "}
                        {(editFormData.phiShip
                          ? editFormData.phiShip
                          : "0"
                        ).toLocaleString("en-US")}{" "}
                        VNĐ
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
                        {editFormData && editFormData.trangThai === 5
                          ? "Hóa đơn:"
                          : `Trạng thái:`}{" "}
                        {""} {getStatusText(editFormData.trangThai)}
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
                    Thành tiền:{" "}
                    <span>
                      {(
                        editFormData.tongTien + editFormData.phiShip
                      ).toLocaleString("en-US")}
                      VNĐ{" "}
                    </span>
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
      <div style={{ textAlign: "center" }}>
        <Button
          style={{ color: "white", backgroundColor: "red" }}
          onClick={exportPDF}
        >
          In hóa đơn
        </Button>
      </div>
    </div>
  );
};

export default XuatHoaDon;
