import { Button, Form, Input, Typography } from "antd";
import React from "react";

const { Title } = Typography;

const Login: React.FC = () => {
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
    // Tích hợp API call đến /api/auth/login hoặc xử lý với next-auth sau
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "50px" }}>
      <Title level={2}>Đăng nhập / Đăng ký</Title>
      <Form name="loginForm" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Vui lòng nhập username!" }]}
        >
          <Input placeholder="Nhập username" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Vui lòng nhập password!" }]}
        >
          <Input.Password placeholder="Nhập password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
