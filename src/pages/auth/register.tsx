// src/pages/auth/register.tsx

import { Button, Form, Input, Typography, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const { Title } = Typography;

const Register: React.FC = () => {
  const router = useRouter();

  const onFinish = async (values: any) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Registration failed");
      }
      message.success("Registration successful! Please login.");
      router.push("/auth/login");
    } catch (error: any) {
      message.error(error.message || "Error during registration");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "50px" }}>
      <Title level={2}>Register</Title>
      <Form name="registerForm" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Your Name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <Link href="/auth/login">Already have an account? Login here</Link>
      </div>
    </div>
  );
};

export default Register;
