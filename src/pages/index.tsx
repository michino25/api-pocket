import React from "react";
import { Button, Layout, Typography, Space, Card, Row, Col } from "antd";
import {
  RocketOutlined,
  ApiOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage: React.FC = () => {
  return (
    <Layout>
      {/* Header */}
      <Header className="fixed w-full z-10 flex items-center justify-between bg-white shadow">
        <div className="flex items-center">
          <Image
            src="/transparent-logo.png"
            alt="API Pocket logo"
            width={40}
            height={40}
            priority
          />
          <Title level={4} className="!m-0 ml-2">
            API Pocket
          </Title>
        </div>
        <Space>
          <Link href="/auth/signup">
            <Button size="large" type="default">
              Sign Up
            </Button>
          </Link>
          <Link href="/auth/signin">
            <Button size="large" type="primary">
              Sign In
            </Button>
          </Link>
        </Space>
      </Header>

      {/* Hero Section */}
      <Content className="pt-16">
        <div className="text-center py-24 bg-gradient-to-r from-red-400/40 to-red-600/80">
          <Title className="!text-white">Simple & Fast API Solutions</Title>
          <Paragraph className="text-white text-lg mb-8">
            Integrate reliable and fast APIs into your applications with ease.
          </Paragraph>
          <Space size="large">
            <Link href="/auth/signup">
              <Button type="primary" size="large" icon={<RocketOutlined />}>
                Get Started
              </Button>
            </Link>
            <Button size="large">Learn More</Button>
          </Space>
        </div>

        {/* Features Section */}
        <div className="py-16 px-4 max-w-6xl mx-auto">
          <Title level={2} className="text-center mb-12">
            Why Choose Us?
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="h-full">
                <ThunderboltOutlined className="text-4xl text-red-500 mb-4" />
                <Title level={4}>Lightning Fast</Title>
                <Paragraph>
                  Ultra-fast response times ensuring the best possible user
                  experience for your applications.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full">
                <ApiOutlined className="text-4xl text-red-500 mb-4" />
                <Title level={4}>Easy Integration</Title>
                <Paragraph>
                  Comprehensive API documentation and SDKs supporting multiple
                  programming languages.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card className="h-full">
                <RocketOutlined className="text-4xl text-red-500 mb-4" />
                <Title level={4}>Scalable</Title>
                <Paragraph>
                  Easily scale your API usage as your business grows without any
                  hassle.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Call to Action Section */}
        <div className="bg-gray-100 py-16 px-4 text-center">
          <Title level={2}>Get Started Today</Title>
          <Paragraph className="text-lg mb-8">
            Sign up for a free account and experience our service firsthand.
          </Paragraph>
          <Link href="/auth/signup">
            <Button type="primary" size="large">
              Create Free Account
            </Button>
          </Link>
        </div>
      </Content>

      {/* Footer */}
      <Footer className="text-center">
        <Paragraph>© 2025 API Pocket. All rights reserved.</Paragraph>
      </Footer>
    </Layout>
  );
};

export default LandingPage;
