import React, { useMemo, useState, useEffect } from "react";
import { Layout, Menu, Typography } from "antd";
import Link from "next/link";
import Image from "next/image";
import {
  GalleryVerticalEnd,
  Table2,
  SquareLibrary,
  TextQuote,
  FileText,
  NotebookText,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useSidebarTableStore } from "@/stores/useSidebarTableStore";
import { splitString } from "@/utils/common";
import { ItemType, MenuItemType } from "antd/es/menu/interface";

const { Sider } = Layout;

const locationConverter = (location: string[]) =>
  location && location[0] === "table"
    ? [`${location[0]}/${location[1]}`, `${location[2]}/${location[3]}`]
    : location;

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { tables } = useSidebarTableStore();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState<string[]>([]);
  const [select, setSelect] = useState<string[]>([]);

  const menu: ItemType<MenuItemType>[] = useMemo(
    () => [
      {
        key: "tables",
        icon: <GalleryVerticalEnd size={16} />,
        label: "Dashboard",
      },
      { type: "divider" },
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
      { type: "divider" },
      {
        key: "user-guide",
        label: "User Guide",
        icon: <NotebookText size={16} />,
      },
    ],
    [tables]
  );

  const locationArray = useMemo(
    () => locationConverter(pathname?.split("/").filter(Boolean) || []),
    [pathname]
  );

  useEffect(() => {
    setSelect(locationArray);
    setOpen(locationArray);
  }, [locationArray]);

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

  return (
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
        <Typography.Title
          level={4}
          className="!m-0 px-1 sider-collapsed-hidden"
        >
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
        <p className="my-0 sider-collapsed-hidden">&copy; 2025 API Pocket</p>
        <span className="px-0.5 sider-collapsed-hidden">Version</span>
        <span className="px-0.5">1.0.0</span>
      </div>
    </Sider>
  );
};

export default Sidebar;
