import React, { ReactNode } from "react";
import { Layout, Menu, Button } from "antd";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  DashboardOutlined,
  TableOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { data: session } = useSession();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
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
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["dashboard"]}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            <Link href="/admin/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="tables" icon={<TableOutlined />}>
            <Link href="/admin/tables">Tables</Link>
          </Menu.Item>
          <Menu.Item key="api-docs" icon={<FileTextOutlined />}>
            <Link href="/admin/api-docs">API Docs</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            Welcome, {session?.user?.name || session?.user?.email || "User"}
          </div>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </Header>
        <Content style={{ margin: "16px", background: "#fff", padding: 24 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
