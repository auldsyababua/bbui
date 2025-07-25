import { useState, useEffect } from "react";
import { useGetIdentity } from "@refinedev/core";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Typography,
  message,
  Space,
  Divider,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  GlobalOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { supabaseClient } from "../../utils/supabaseClient";

const { Title, Text } = Typography;
const { Option } = Select;

interface Identity {
  id: string;
  name?: string;
  email?: string;
}

// Common timezones - you can expand this list
const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Phoenix", label: "Arizona Time" },
  { value: "America/Anchorage", label: "Alaska Time" },
  { value: "Pacific/Honolulu", label: "Hawaii Time" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
  { value: "Pacific/Auckland", label: "Auckland (NZDT)" },
];

interface ProfileFormValues {
  first_name: string;
  last_name: string;
  job_title: string;
  telegram_id: string;
  telegram_username: string;
  timezone: string;
}

export const ProfilePage = () => {
  const { data: identity, isLoading: identityLoading } = useGetIdentity<Identity>();
  const [form] = Form.useForm<ProfileFormValues>();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!identity?.id) return;

      try {
        const { data: profile, error } = await supabaseClient
          .from("personnel")
          .select("*")
          .eq("auth_user_id", identity.id)
          .single();

        if (error) throw error;

        if (profile) {
          form.setFieldsValue({
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            job_title: profile.job_title || "",
            telegram_id: profile.telegram_id || "",
            telegram_username: profile.telegram_username || "",
            timezone: profile.timezone || "America/New_York",
          });
        }
      } catch (error: any) {
        console.error("Error loading profile:", error);
        message.error("Failed to load profile");
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [identity, form]);

  const onFinish = async (values: ProfileFormValues) => {
    if (!identity?.id) return;

    setLoading(true);
    try {
      const { error } = await supabaseClient
        .from("personnel")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          job_title: values.job_title,
          telegram_id: values.telegram_id,
          telegram_username: values.telegram_username,
          timezone: values.timezone,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_user_id", identity.id);

      if (error) throw error;

      message.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      message.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (identityLoading || profileLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px" }}>
      <Card>
        <Title level={2}>Profile Settings</Title>
        <Text type="secondary">
          Update your personal information and preferences
        </Text>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <div style={{ marginBottom: 24 }}>
            <Space>
              <MailOutlined />
              <Text strong>Email:</Text>
              <Text>{identity?.email}</Text>
            </Space>
          </div>

          <Form.Item
            label="First Name"
            name="first_name"
            rules={[{ required: true, message: "Please enter your first name" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="John"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Doe"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Job Title"
            name="job_title"
          >
            <Input
              prefix={<IdcardOutlined />}
              placeholder="e.g., Site Manager, Field Technician"
              size="large"
            />
          </Form.Item>

          <Divider orientation="left">Telegram Integration</Divider>

          <Form.Item
            label="Telegram ID"
            name="telegram_id"
            help="Your numeric Telegram user ID"
          >
            <Input
              placeholder="123456789"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Telegram Username"
            name="telegram_username"
            help="Your Telegram username (without @)"
          >
            <Input
              placeholder="johndoe"
              size="large"
            />
          </Form.Item>

          <Divider orientation="left">Preferences</Divider>

          <Form.Item
            label="Timezone"
            name="timezone"
            rules={[{ required: true, message: "Please select your timezone" }]}
          >
            <Select
              size="large"
              showSearch
              placeholder="Select your timezone"
              optionFilterProp="label"
              suffixIcon={<GlobalOutlined />}
            >
              {timezones.map((tz) => (
                <Option key={tz.value} value={tz.value} label={tz.label}>
                  {tz.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
              block
            >
              Save Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};