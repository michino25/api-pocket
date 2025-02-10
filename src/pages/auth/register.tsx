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
  MailOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react";

const { Title, Text } = Typography;

// Define types for form values
interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  // Handle form submission
  const onFinish = async (values: SignupFormValues) => {
    try {
      setLoading(true);

      // Register user via API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Auto login after successful registration
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      message.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      message.error(error.message || "Error during registration");
    } finally {
      setLoading(false);
    }
  };

  // Handle social signup
  const handleSocialSignup = async (provider: "github" | "google") => {
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      message.error(
        `${
          provider.charAt(0).toUpperCase() + provider.slice(1)
        } signup failed. Please try again.`
      );
    }
  };

  return (
    <Layout className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto pt-24 px-4">
        <Card className="w-full shadow-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Title level={2}>Create Account</Title>
            <Text className="text-gray-500">Get started with our service</Text>
          </div>

          {/* Social Signup Buttons */}
          <div className="space-y-4 mb-6">
            <Button
              icon={<GithubOutlined />}
              block
              size="large"
              onClick={() => handleSocialSignup("github")}
            >
              Sign up with GitHub
            </Button>
            <Button
              icon={<GoogleOutlined />}
              block
              size="large"
              onClick={() => handleSocialSignup("google")}
            >
              Sign up with Google
            </Button>
          </div>

          <Divider>Or</Divider>

          {/* Email/Password Signup Form */}
          <Form<SignupFormValues>
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            {/* Full Name */}
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "Please input your full name!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Full Name"
                size="large"
              />
            </Form.Item>

            {/* Email */}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 8, message: "Password must be at least 8 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
                size="large"
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          {/* Footer Links */}
          <div className="text-center mt-4">
            <Text className="text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:text-blue-600">
                Sign in
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default SignupPage;
