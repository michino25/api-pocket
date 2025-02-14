import React from "react";
import { Layout, Typography, Card, Row, Col } from "antd";
import {
  RocketOutlined,
  ApiOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import CustomButton from "@/components/common/CustomButton";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const LandingPage: React.FC = () => {
  return (
    <Layout className="bg-white">
      {/* Header */}
      <Header className="fixed w-full z-10 flex items-center justify-between bg-white shadow-none">
        <div className="flex items-center">
          <Image
            src="/transparent-logo.webp"
            alt="API Pocket logo"
            width={40}
            height={40}
            priority
          />
          <Title level={4} className="!m-0 ml-2">
            API Pocket
          </Title>
        </div>
        <div className="flex gap-3">
          <CustomButton
            to="/auth/signin"
            size="large"
            type="default"
            className="rounded-full px-8"
          >
            Sign In
          </CustomButton>
          <CustomButton
            to="/auth/signup"
            size="large"
            type="primary"
            className="rounded-full px-8"
          >
            Sign Up
          </CustomButton>
        </div>
      </Header>

      <div className="mt-16 px-5">
        <div className="overflow-hidden rounded-2xl">
          {/* Hero Section */}
          <Content>
            <div className="text-center rounded-2xl overflow-hidden py-24 bg-cover bg-gradient-to-b from-red-300/60 to-red-200/40">
              <p className="text-6xl font-medium my-4 text-gray-800/90">
                Database, backend, and APIs
              </p>
              <p className="text-6xl font-medium my-4 text-gray-800/60">
                all in one place
              </p>
              <p className="text-base my-6 text-gray-800">
                Quickly integrate APIs into your application.
              </p>
              <CustomButton
                to="/auth/signup"
                type="primary"
                size="large"
                className="rounded-full px-8"
                icon={<RocketOutlined />}
              >
                Get Started
              </CustomButton>
            </div>

            {/* Features Section */}
            <div className="py-16 px-4 max-w-6xl mx-auto">
              <Title level={2} className="text-center mb-12">
                Why Choose Us?
              </Title>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <Card>
                    <ThunderboltOutlined className="text-4xl text-red-500 mb-4" />
                    <Title level={4}>Lightning Fast</Title>
                    <Paragraph>
                      Ultra-fast response times ensuring the best possible user
                      experience for your applications.
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card>
                    <ApiOutlined className="text-4xl text-red-500 mb-4" />
                    <Title level={4}>Easy Integration</Title>
                    <Paragraph>
                      Comprehensive API documentation and SDKs supporting
                      multiple programming languages.
                    </Paragraph>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card>
                    <RocketOutlined className="text-4xl text-red-500 mb-4" />
                    <Title level={4}>Scalable</Title>
                    <Paragraph>
                      Easily scale your API usage as your business grows without
                      any hassle.
                    </Paragraph>
                  </Card>
                </Col>
              </Row>
            </div>

            {/* Call to Action Section */}
            <div className="bg-gray-100 rounded-2xl py-16 px-4 text-center">
              <Title level={2}>Get Started Today</Title>
              <Paragraph className="text-lg mb-8">
                Sign up for a free account and experience our service firsthand.
              </Paragraph>
              <CustomButton
                to="/auth/signup"
                type="primary"
                size="large"
                className="rounded-full px-8"
              >
                Create Free Account
              </CustomButton>
            </div>
          </Content>
        </div>
      </div>

      {/* Footer */}
      <Footer className="text-center bg-white">
        <span>© 2025 API Pocket. All rights reserved.</span>
      </Footer>
    </Layout>
  );
};

export default LandingPage;
