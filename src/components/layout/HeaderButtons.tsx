import React, { useState } from "react";
import { Dropdown, Button as AntButton, Tooltip, Modal } from "antd";
import { signOut } from "next-auth/react";
import {
  Github,
  Info,
  Languages,
  Moon,
  Sun,
  Settings,
  LogOut,
} from "lucide-react";
import CustomButton from "@/components/common/CustomButton";
import { useSidebarTableStore } from "@/stores/useSidebarTableStore";
import { useNotification } from "@/hooks/useNotification";

const HeaderButtons: React.FC = () => {
  const notification = useNotification();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [langOpen, setLangOpen] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const { setTables } = useSidebarTableStore();

  return (
    <>
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
        onClick={() => notification.info("Coming Soon!")}
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
          onClick: () => notification.info("Coming Soon!"),
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
        onClick={() => {
          setTheme(theme === "light" ? "dark" : "light");
          notification.info("Coming Soon!");
        }}
        tooltip="Toggle Theme"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </CustomButton>
      <CustomButton
        className="flex bg-gray-50 !h-10 !w-10 p-2.5 rounded-full"
        type="text"
        size="large"
        tooltip="Settings"
        onClick={() => notification.info("Coming Soon!")}
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
    </>
  );
};

export default HeaderButtons;
