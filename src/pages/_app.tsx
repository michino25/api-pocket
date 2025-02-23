import "@/styles/globals.css";
import { ConfigProvider } from "antd";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import AdminPanelLayout from "@/components/layout/AdminPanelLayout";
import { Fragment, useEffect } from "react";
import { NotificationProvider } from "@/hooks/useNotification";
import { Analytics } from "@vercel/analytics/next";

const adminPanelRoutes = [
  "/user-guide",
  "/dashboard",
  "/data-forge",
  "/file-hub",
  "/socket-flow",
  "/auth-core",
];

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  const isAdminPanelRoute = adminPanelRoutes.some((route) =>
    router.pathname.startsWith(route)
  );

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

  //  Customize website's scrollbar like Mac OS
  //  Not supported in Firefox and IE
  useEffect(() => {
    const isMacOS = /Macintosh|MacIntel/.test(navigator.userAgent);
    if (!isMacOS) document.documentElement.classList.add("not-macos");
  }, []);

  return (
    <ConfigProvider theme={antdTheme}>
      <NotificationProvider>
        <Head>
          <title>API Pocket</title>
        </Head>
        <SessionProvider session={session}>
          <Analytics />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </NotificationProvider>
    </ConfigProvider>
  );
}

export default App;
