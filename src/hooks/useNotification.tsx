import React, { createContext, ReactNode, useContext } from "react";
import { message } from "antd";
import { MessageInstance } from "antd/es/message/interface";

const NotificationContext = createContext<MessageInstance | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [api, contextHolder] = message.useMessage();

  const contextValue: MessageInstance = api;

  return (
    <NotificationContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
