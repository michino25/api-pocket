import React, { useEffect } from "react";
import { Layout } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import HeaderButtons from "./HeaderButtons";
import Sidebar from "./Sidebar";

const { Header, Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminPanelLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [router, status]);

  return (
    <Layout className="layout h-screen">
      <Sidebar />
      <Layout>
        <Header className="bg-white px-4 flex justify-between items-center">
          <div className="flex flex-col px-5">
            <span className="leading-5">Welcome,</span>
            <span className="leading-6 text-lg font-semibold">
              {session?.user?.name || session?.user?.email}
            </span>
          </div>
          <div className="flex gap-3">
            <HeaderButtons />
          </div>
        </Header>
        <Content className="bg-white h-full pb-4 pr-4 pl-1">
          <div className="bg-gray-100 rounded-3xl h-full overflow-hidden p-4">
            <div className="overflow-auto h-full rounded-2xl">{children}</div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPanelLayout;
