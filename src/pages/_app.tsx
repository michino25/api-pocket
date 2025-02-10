import "@/styles/globals.css";
import { ConfigProvider } from "antd";

import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#d73636",
          colorInfo: "#206fed",
          colorSuccess: "#52c41a",
          colorWarning: "#faad14",
          colorError: "#ff4d4f",
          borderRadius: 16,
        },
      }}
    >
      <Head>
        <title>API Pocket</title>
      </Head>

      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ConfigProvider>
  );
}

export default App;
