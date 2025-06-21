import React from "react";
import { Menu, Button } from "antd";
import { ShoppingOutlined, ShoppingCartOutlined, DollarOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { DashboardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const AdminSidebar = ({ selectedKey }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div style={{ width: 220, background: "#fff", borderRight: "1px solid #eee", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 22, padding: 24, textAlign: "center", borderBottom: "1px solid #eee" }}>
          Admin Panel
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0, marginTop: 16 }}
          items={[
            {
              key: "dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
              onClick: () => navigate("/admin/dashboard"),
            },
            {
              key: "product",
              icon: <ShoppingOutlined />,
              label: "Product",
              onClick: () => navigate("/admin/dashboard/product"),
            },
            {
              key: "order",
              icon: <ShoppingCartOutlined />,
              label: "Order",
              onClick: () => navigate("/admin/dashboard/order"),
            },
            {
              key: "discount",
              icon: <DollarOutlined />,
              label: "Discount",
              onClick: () => navigate("/admin/dashboard/discount"),
            },
            {
              key: "user",
              icon: <UserOutlined />,
              label: "User",
              onClick: () => navigate("/admin/dashboard/user"),
            },
          ]}
        />
      </div>
      <div style={{ padding: 24 }}>
        <Button icon={<LogoutOutlined />} danger block onClick={logout}>
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar; 