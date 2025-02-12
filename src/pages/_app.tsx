import "@/styles/globals.css";
import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import AdminPanelLayout from "@/components/layout/AdminPanelLayout";
import { Fragment } from "react";
import { NotificationProvider } from "@/hooks/useNotification";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  const isAdminPanelRoute =
    router.pathname.startsWith("/user-guide") ||
    router.pathname.startsWith("/tables") ||
    router.pathname.startsWith("/table");

  const Layout = isAdminPanelRoute ? AdminPanelLayout : Fragment;

  const antdTheme = {
    token: {
      colorPrimary: "#d73636",
      colorInfo: "#206fed",
      colorSuccess: "#52c41a",
      colorWarning: "#faad14",
      colorError: "#ff4d4f",
      borderRadius: 16,
    },
  };

  return (
    <ConfigProvider theme={antdTheme}>
      <NotificationProvider>
        <Head>
          <title>API Pocket</title>
        </Head>
        <SessionProvider session={session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </NotificationProvider>
    </ConfigProvider>
  );
}

export default App;
