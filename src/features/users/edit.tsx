import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Divider } from "antd";

// Common timezones
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

export const UserEdit = () => {
  const { formProps, saveButtonProps } = useForm({
    resource: "personnel",
  });


  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Divider orientation="left">Account Information</Divider>
        
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
            },
          ]}
        >
          <Input disabled />
        </Form.Item>
        
        <Form.Item
          label="Role"
          name="app_role"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select>
            <Select.Option value="viewer">Viewer</Select.Option>
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </Form.Item>

        <Divider orientation="left">Profile Information</Divider>
        
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: "Please enter first name" }]}
        >
          <Input placeholder="John" />
        </Form.Item>
        
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: "Please enter last name" }]}
        >
          <Input placeholder="Doe" />
        </Form.Item>
        
        <Form.Item
          label="Job Title"
          name="job_title"
        >
          <Input placeholder="e.g., Site Manager, Field Technician" />
        </Form.Item>

        <Divider orientation="left">Telegram Integration</Divider>
        
        <Form.Item
          label="Telegram ID"
          name="telegram_id"
          help="Numeric Telegram user ID"
        >
          <Input placeholder="123456789" />
        </Form.Item>
        
        <Form.Item
          label="Telegram Username"
          name="telegram_username"
          help="Without @ symbol"
        >
          <Input placeholder="johndoe" />
        </Form.Item>

        <Divider orientation="left">Preferences</Divider>
        
        <Form.Item
          label="Timezone"
          name="timezone"
          rules={[{ required: true, message: "Please select timezone" }]}
        >
          <Select
            showSearch
            placeholder="Select timezone"
            optionFilterProp="label"
            options={timezones}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};