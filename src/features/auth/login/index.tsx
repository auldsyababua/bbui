import { useLogin } from "@refinedev/core";
import { Form, Input, Button, Card, Typography, message, Divider } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { supabaseClient } from "../../../utils/supabaseClient";

const { Title, Text } = Typography;

export const LoginPage = () => {
  const { mutate: login, isLoading } = useLogin();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        message.error(error.message || "Google login failed");
      }
    } catch (error: any) {
      message.error(error?.message || "Google login failed");
    }
  };

  const onFinish = (values: { email: string; password: string }) => {
    login(values, {
      onError: (error) => {
        message.error(error?.message || "Login failed");
      },
    });
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f0f2f5",
    }}>
      <Card style={{ width: 400 }}>
        <Title level={2} style={{ textAlign: "center" }}>
          Brain Bot Documents
        </Title>
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
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
              placeholder="email@example.com"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              block
              size="large"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
        
        <Divider>Or</Divider>
        
        <Button
          icon={<GoogleOutlined />}
          onClick={handleGoogleLogin}
          block
          size="large"
          style={{ marginBottom: 16 }}
        >
          Sign in with Google
        </Button>
        
        <Divider />
        
        <div style={{ textAlign: "center" }}>
          <Text>Don't have an account? </Text>
          <Link to="/signup">Sign up</Link>
        </div>
        
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Note: Only @10netzero.com email addresses are allowed
          </Text>
        </div>
      </Card>
    </div>
  );
};