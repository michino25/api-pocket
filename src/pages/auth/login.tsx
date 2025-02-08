import { Button, Form, Input, Typography } from "antd";
import { signIn } from "next-auth/react";
import React from "react";

const { Title } = Typography;

const Login: React.FC = () => {
  const onFinish = (values: any) => {
    // Xử lý đăng nhập bằng credentials (nếu cần)
    console.log("Credentials:", values);
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

      <div style={{ marginTop: 20 }}>
        <Button
          type="default"
          onClick={() => signIn("google")}
          style={{ width: "100%", marginBottom: 8 }}
        >
          Đăng nhập bằng Google
        </Button>
        <Button
          type="default"
          onClick={() => signIn("github")}
          style={{ width: "100%" }}
        >
          Đăng nhập bằng GitHub
        </Button>
      </div>
    </div>
  );
};

export default Login;
