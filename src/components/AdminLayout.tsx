import React from "react";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { DashboardOutlined, TableOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        {/* Logo */}
        <div
          className="logo"
          style={{
            height: 32,
            margin: 16,
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          API Pocket
        </div>

        {/* Sidebar Menu */}
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link href="/admin/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.SubMenu key="tables" icon={<TableOutlined />} title="TableList">
            {/* Đây là chỗ hiển thị danh sách bảng, hiện tại dùng link tĩnh */}
            <Menu.Item key="tables-list">
              <Link href="/admin/tables">Danh sách bảng</Link>
            </Menu.Item>
            {/* Bạn có thể map danh sách bảng động nếu muốn */}
          </Menu.SubMenu>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "16px", background: "#fff", padding: 24 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
