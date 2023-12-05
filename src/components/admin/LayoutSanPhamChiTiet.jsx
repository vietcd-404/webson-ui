import React from "react";
import { Button, Tabs } from "antd";
import { Link } from "react-router-dom";

const SanPhamChiTietLayout = ({ children }) => {
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: (
        <Button>
          <Link className="p-2" to="/admin/san-pham-chi-tiet">
            Thêm sản phẩm
          </Link>
        </Button>
      ),
    },
    {
      key: "2",
      label: (
        <Button>
          <Link to="/admin/san-pham-chi-tiet/danh-sach">Danh Sách</Link>
        </Button>
      ),
    },
  ];
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      <div>{children}</div>
    </div>
  );
  // const activeTab = window.location.pathname; // Lấy đường dẫn hiện tại để xác định tab đang được chọn

  // return (
  //   <div>
  //     <Menu selectedKeys={[activeTab]} mode="horizontal">
  //       <Item key="/admin/san-pham-chi-tiet/quan-ly-san-pham">
  // <Link to="/admin/san-pham-chi-tiet/quan-ly-san-pham">Quản lý sản phẩm</Link>;
  //       </Item>
  //       <Item key="/admin/san-pham-chi-tiet/danh-sach">
  // <Link to="/admin/san-pham-chi-tiet/danh-sach">Danh Sách</Link>
  //       </Item>
  //     </Menu>
  //     <div>{children}</div>
  //   </div>
  // );
};

export default SanPhamChiTietLayout;
