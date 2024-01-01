import React, { useState } from "react";
import {
  DesktopOutlined,
  BankOutlined,
  UserOutlined,
  DashboardOutlined,
  MacCommandOutlined,
  PayCircleOutlined,
  InboxOutlined,
  LoginOutlined,
  ExclamationCircleFilled,
  GiftOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, theme, Button, Image, Modal } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../pages/customer/Account/AuthProvider";
import { logoWhite } from "../assets/images";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const LayoutAdmin = ({ children }) => {
  const items = [
    getItem(
      <Link to="/admin/tong-quan">Tổng quan</Link>,
      "1",
      <DashboardOutlined />
    ),
    // getItem(
    //   <Link to="/admin/san-pham-chi-tiet">Quản lý sản phẩm chi tiết</Link>,
    //   "2",
    //   <DesktopOutlined />
    // ),
    getItem("Quản lý sản phẩm", "sub3", <DesktopOutlined />, [
      getItem(<Link to="/admin/san-pham">Sản phẩm</Link>, "3"),
      getItem(
        <Link to="/admin/san-pham-chi-tiet">Chi tiết sản phẩm</Link>,
        "2"
      ),
    ]),
    getItem("Quản lý thuộc tính", "sub1", <MacCommandOutlined />, [
      // getItem(<Link to="/admin/san-pham">Sản phẩm</Link>, "3"),
      getItem(<Link to="/admin/loai">Loại</Link>, "4"),
      getItem(<Link to="/admin/thuong-hieu">Thương hiệu</Link>, "5"),
      getItem(<Link to="/admin/mau-sac">Màu</Link>, "6"),
    ]),
    getItem("Bán hàng tại quầy", "sub2", <ShoppingCartOutlined />, [
      getItem(<Link to="/admin/ban-hang">Bán hàng</Link>, "12"),
      getItem(<Link to="/admin/hoa-don-tai-quay">Quản lý đơn hàng</Link>, "13"),
    ]),
    getItem(
      <Link to="/admin/hoa-don/cho-xac-nhan">Quản lý hóa đơn</Link>,
      "7",
      <BankOutlined />
    ),
    getItem(
      <Link to="/admin/nguoi-dung">Quản lí người dùng</Link>,
      "8",
      <UserOutlined />
    ),
    getItem(
      <Link to="/admin/quan-li-kho-anh">Kho ảnh</Link>,
      "9",
      <InboxOutlined />
    ),
    getItem(<Link to="/admin/voucher">Voucher</Link>, "10", <GiftOutlined />),
    getItem(
      <Link onClick={() => handleLogout()}>Đăng xuất</Link>,
      "11",
      <LoginOutlined />
    ),
  ];
  const { signout } = useAuth();

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn đăng xuất không?",
      okText: "Ok",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        signout();
      },
      onCancel: () => {},
    });
  };
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width="250"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
        }}
      >
        <Image src={logoWhite} width="90%" height="125px" preview="" />
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 250 }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            zIndex: 1,
            width: "100%",
            position: "fixed",
            marginBottom: 20,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "0 16px",
            marginTop: "20px",
            padding: "24px",
            background: colorBgContainer,
            minHeight: "100vh",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Shop HEVA ©2023 Created by HEVA
        </Footer>
      </Layout>
    </Layout>
  );
};
export default LayoutAdmin;
