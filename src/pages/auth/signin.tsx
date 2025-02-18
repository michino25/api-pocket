import React from "react";
import {
  Button,
  Form,
  Input,
  Card,
  Divider,
  Typography,
  Layout,
  message,
} from "antd";
import {
  GithubOutlined,
  GoogleOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import CustomButton from "@/components/common/CustomButton";

const { Title, Text } = Typography;

// Define types for form values
interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();

  const { status } = useSession();
  if (status === "authenticated") {
    router.push("/tables");
    return null;
  }

  // Handle form submission
  const onFinish = async (values: LoginFormValues) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: "/tables",
      });

      if (res?.error) {
        message.error(res.error);
      } else {
        router.push(res?.url || "/tables");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error("Login failed. Please try again.");
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      await signIn(provider, { callbackUrl: "/tables" });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      message.error(
        `${
          provider.charAt(0).toUpperCase() + provider.slice(1)
        } login failed. Please try again.`
      );
    }
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto my-auto p-5">
        <Card className="w-full shadow-md">
          {/* Header */}
          <div className="flex items-center justify-center">
            <CustomButton to="/" type="link" className="w-full h-full">
              <Image
                src="/transparent-logo.webp"
                alt="API Pocket logo"
                width={64}
                height={64}
                priority
              />
            </CustomButton>
          </div>

          <div className="text-center mb-8">
            <Title level={2}>Welcome Back</Title>
            <Text className="text-gray-500">Sign in to your account</Text>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-4 mb-6">
            <Button
              icon={<GithubOutlined />}
              block
              size="large"
              onClick={() => handleSocialLogin("github")}
            >
              Continue with GitHub
            </Button>
            <Button
              icon={<GoogleOutlined />}
              block
              size="large"
              onClick={() => handleSocialLogin("google")}
            >
              Continue with Google
            </Button>
          </div>

          <Divider>Or</Divider>

          {/* Email/Password Login Form */}
          <Form<LoginFormValues>
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Sign In
              </Button>
            </Form.Item>
          </Form>

          {/* Footer Links */}
          <div className="text-center mt-4">
            <Text className="text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-blue-500 hover:text-blue-600"
              >
                Sign up here
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default LoginPage;
