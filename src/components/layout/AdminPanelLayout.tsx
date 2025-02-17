import React, { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Dropdown,
  Button as AntButton,
  Tooltip,
  Modal,
} from "antd";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  GalleryVerticalEnd,
  Github,
  Info,
  Languages,
  LogOut,
  Moon,
  NotebookText,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  SquareLibrary,
  Sun,
  Table2,
  TextQuote,
} from "lucide-react";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useSidebarTableStore } from "@/stores/useSidebarTableStore";
import { useNotification } from "@/hooks/useNotification";
import { splitString } from "@/utils/common";
import CustomButton from "@/components/common/CustomButton";

const { Header, Sider, Content } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminPanelLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const { tables, setTables } = useSidebarTableStore();
  const notification = useNotification();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [langOpen, setLangOpen] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  const menu: ItemType<MenuItemType>[] = useMemo(
    () => [
      {
        key: "tables",
        icon: <GalleryVerticalEnd size={16} />,
        label: "Dashboard",
      },
      {
        type: "divider",
      },
      {
        label: "Tables",
        type: "group",
        children: tables?.map(({ _id, tableName }) => ({
          key: "table/" + splitString(_id)[0],
          icon: <Table2 size={16} />,
          label: tableName,
          children: [
            {
              key: splitString(_id)[1] + "/schema",
              icon: <SquareLibrary size={16} />,
              label: "Schema",
            },
            {
              key: splitString(_id)[1] + "/data",
              icon: <TextQuote size={16} />,
              label: "Data",
            },
            {
              key: splitString(_id)[1] + "/api-docs",
              icon: <FileText size={16} />,
              label: "API Docs",
            },
          ],
        })),
      },
      {
        type: "divider",
      },
      {
        key: "user-guide",
        label: "User Guide",
        icon: <NotebookText size={16} />,
      },
    ],
    [tables]
  );

  const locationConverter = (location: string[]) =>
    location && location[0] === "table"
      ? [`${location[0]}/${location[1]}`, `${location[2]}/${location[3]}`]
      : location;

  const locationArray = useMemo(
    () => locationConverter(pathname?.split("/").filter(Boolean)),
    [pathname]
  );

  const [open, setOpen] = useState(locationArray);
  const [select, setSelect] = useState(locationArray);

  const onMenuItemClick = ({
    key,
    keyPath,
  }: {
    key: string;
    keyPath: string[];
  }) => {
    const location = key === keyPath[0] ? keyPath.reverse() : keyPath;
    setSelect(locationConverter(location));
    router.push(`/${location.join("/")}`);
  };

  useEffect(() => {
    setSelect(locationArray);
    setOpen(locationArray);
  }, [locationArray]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [router, status]);

  return (
    <Layout className="layout h-screen">
      <Sider
        theme="light"
        className="pl-3 h-screen select-none [&_.ant-layout-sider-children]:flex [&_.ant-layout-sider-children]:flex-col"
        collapsed={collapsed}
      >
        <Link
          href="/tables"
          className="flex items-center w-full justify-center py-3"
        >
          <Image
            src="/transparent-logo.webp"
            alt="API Pocket logo"
            width={32}
            height={32}
            priority
          />
          <Typography.Title level={4} className="!m-0 px-1 admin-layout-title">
            API Pocket
          </Typography.Title>
        </Link>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          className="h-full overflow-auto pr-3"
          style={{ borderInlineEnd: 0 }}
          items={menu}
          selectedKeys={select}
          onClick={onMenuItemClick}
          openKeys={open}
          onOpenChange={setOpen}
        />
        <Menu
          className="!border-none mt-auto"
          items={[
            {
              key: "menu",
              label: collapsed ? "Expand" : "Collapse",
              icon: collapsed ? (
                <PanelLeftOpen size={16} />
              ) : (
                <PanelLeftClose size={16} />
              ),
              onClick: () => setCollapsed(!collapsed),
            },
            { type: "divider" },
          ]}
          selectedKeys={[]}
        />
        <div className="flex-center text-center text-sm flex-col center py-4 text-gray-400 font-light">
          {!collapsed && <p className="my-0">&copy; 2025 API Pocket</p>}
          <span className="px-1">
            {!collapsed && "Version "}
            1.0.0
          </span>
        </div>
      </Sider>
      <Layout>
        <Header className="bg-white px-4 flex justify-between items-center">
          <div className="flex flex-col px-5">
            <span className="leading-5">Welcome,</span>
            <span className="leading-6 text-lg font-semibold">
              {session?.user?.name || session?.user?.email}
            </span>
          </div>
          <div className="flex gap-3">
            <CustomButton
              className="flex bg-gray-50 !h-10 !w-10 p-2.5 rounded-full"
              type="text"
              size="large"
              tooltip="Github Repository"
              to="https://github.com/michino25/api-pocket"
              target="_blank"
            >
              <Github size={20} />
            </CustomButton>
            <CustomButton
              className="flex bg-gray-50 !h-10 !w-10 p-2.5 rounded-full"
              type="text"
              size="large"
              onClick={() => notification.info("Info")}
              tooltip="Information"
            >
              <Info size={20} />
            </CustomButton>

            <Dropdown
              menu={{
                items: [
                  { key: "en", label: "English" },
                  { key: "vi", label: "Tiếng Việt" },
                  { key: "zh", label: "中文" },
                  { key: "es", label: "Español" },
                  { key: "fr", label: "Français" },
                  { key: "de", label: "Deutsch" },
                  { key: "ru", label: "Русский" },
                  { key: "ja", label: "日本語" },
                  { key: "ko", label: "한국어" },
                ],
                selectable: true,
                defaultSelectedKeys: ["en"],
              }}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
              trigger={["click"]}
              onOpenChange={setLangOpen}
            >
              <Tooltip title={!langOpen && "Languages"}>
                <AntButton
                  className="flex bg-gray-50 !h-10 !w-10 p-2.5 rounded-full"
                  type="text"
                  size="large"
                >
                  <Languages size={20} />
                </AntButton>
              </Tooltip>
            </Dropdown>

            <CustomButton
              className="flex bg-gray-50 !h-10 !w-10 p-2.5 rounded-full"
              type="text"
              size="large"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              tooltip="Toggle Theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </CustomButton>
            <CustomButton
              className="flex bg-gray-50 !h-10 !w-10 p-2.5 rounded-full"
              type="text"
              size="large"
              tooltip="Settings"
            >
              <Settings size={20} />
            </CustomButton>
            <CustomButton
              className="flex bg-gray-50 !h-10 !w-10 p-2.5 rounded-full"
              type="text"
              size="large"
              onClick={() =>
                modal.confirm({
                  title: "Sign Out Confirmation",
                  content: "Are you sure you want to sign out of your account?",
                  okText: "Sign Out",
                  cancelText: "Cancel",
                  onOk: () => {
                    setTables(null);
                    signOut({ callbackUrl: "/auth/signin" });
                  },
                })
              }
              tooltip="Sign Out"
            >
              <LogOut size={20} />
            </CustomButton>
            {contextHolder}
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
