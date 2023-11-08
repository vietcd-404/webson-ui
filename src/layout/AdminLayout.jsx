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
} from "@ant-design/icons";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Menu, theme, Button, Image, Modal } from "antd";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.jpg";
import { useAuth } from "../pages/customer/Account/AuthProvider";

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
    getItem(
      <Link to="/admin/san-pham-chi-tiet">Sản phẩm</Link>,
      "2",
      <DesktopOutlined />
    ),
    getItem("Quản lý thuộc tính", "sub1", <MacCommandOutlined />, [
      getItem(<Link to="/admin/san-pham">Sản phẩm</Link>, "3"),
      getItem(<Link to="/admin/loai">Loại</Link>, "4"),
      getItem(<Link to="/admin/thuong-hieu">Thương hiệu</Link>, "5"),
      getItem(<Link to="/admin/mau-sac">Màu</Link>, "6"),
    ]),
    getItem("Quản lý hóa đơn", "sub2", <BankOutlined />, [
      getItem("Team 1", "7"),
      getItem("Team 2", "8"),
    ]),
    getItem(
      <Link to="/admin/nguoi-dung">Quản lí người dùng</Link>,
      "9",
      <UserOutlined />
    ),
    getItem(
      <Link to="/admin/phuong-thuc-thanh-toan">Phương thức thanh toán</Link>,
      "10",
      <PayCircleOutlined />
    ),
    getItem(
      <Link to="/admin/quan-li-kho-anh">Kho ảnh</Link>,
      "11",
      <InboxOutlined />
    ),
    getItem(
      <Link onClick={() => handleDelete()}>Đăng xuất</Link>,
      "12",
      <LoginOutlined />
    ),
  ];
  const { signout } = useAuth();

  const handleDelete = () => {
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
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width="250"
      >
        <Image src={logo} width="100%" height="100px" preview="" />
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
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
