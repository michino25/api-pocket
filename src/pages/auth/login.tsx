// src/pages/auth/login.tsx

import { Button, Form, Input, Typography, message } from "antd";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const { Title } = Typography;

const Login: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Nếu đã đăng nhập, chuyển hướng sang Dashboard
  if (status === "authenticated") {
    router.push("/admin/dashboard");
    return null;
  }

  const onFinish = async (values: any) => {
    // Sử dụng signIn từ NextAuth cho đăng nhập bằng credentials
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: "/admin/dashboard",
    });

    if (res?.error) {
      message.error(res.error);
    } else {
      router.push(res?.url || "/admin/dashboard");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "50px" }}>
      <Title level={2}>Login / Sign In</Title>
      <Form name="loginForm" onFinish={onFinish} layout="vertical">
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
            Sign In
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: 20 }}>
        <Button
          type="default"
          onClick={() => signIn("google", { callbackUrl: "/admin/dashboard" })}
          style={{ width: "100%", marginBottom: 8 }}
        >
          Sign in with Google
        </Button>
        <Button
          type="default"
          onClick={() => signIn("github", { callbackUrl: "/admin/dashboard" })}
          style={{ width: "100%" }}
        >
          Sign in with GitHub
        </Button>
      </div>
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <Link href="/auth/register">Don't have an account? Register here</Link>
      </div>
    </div>
  );
};

export default Login;
