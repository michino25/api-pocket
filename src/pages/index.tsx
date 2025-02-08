import { Button, Layout, Typography } from "antd";
import Link from "next/link";
import React from "react";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const Home: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "50px", textAlign: "center" }}>
        <Title>Chào mừng đến với API Pocket</Title>
        <Paragraph>
          API Pocket giúp bạn tạo API nhanh chóng mà không cần setup backend
          phức tạp.
        </Paragraph>
        <Link href="/auth/login">
          <Button type="primary" size="large">
            Đăng nhập / Đăng ký
          </Button>
        </Link>
      </Content>
    </Layout>
  );
};

export default Home;
