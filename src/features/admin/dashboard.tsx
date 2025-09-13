import { useState } from "react";
import { useTable } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import {
  Card,
  Button,
  Table,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Statistic,
  Row,
  Col,
  Divider,
} from "antd";
import {
  UserAddOutlined,
  TeamOutlined,
  SafetyOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { supabaseClient } from "../../utils/supabaseClient";
import { supabaseAdminClient, isAdminClientAvailable } from "../../utils/supabaseAdminClient";

const { Title, Text } = Typography;

const roleColors = {
  admin: "red",
  user: "blue",
  viewer: "green",
};

interface UserFormValues {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  telegram_id: string;
  telegram_username: string;
  role: "admin" | "user" | "viewer";
}

export const AdminDashboard = () => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const [form] = Form.useForm<UserFormValues>();
  const { data: identity } = useGetIdentity();

  const { tableProps, tableQueryResult } = useTable({
    resource: "user_profiles",
    pagination: {
      pageSize: 10,
    },
    sorters: {
      initial: [
        {
          field: "created_at",
          order: "desc",
        },
      ],
    },
  });

  const users = tableQueryResult?.data?.data || [];
  const totalUsers = users.length;
  const adminCount = users.filter((u: any) => u.role === "admin").length;
  const userCount = users.filter((u: any) => u.role === "user").length;
  const viewerCount = users.filter((u: any) => u.role === "viewer").length;

  const handleCreateUser = async (values: UserFormValues) => {
    setCreateUserLoading(true);
    try {
      if (isAdminClientAvailable() && supabaseAdminClient) {
        // Use admin API if service role key is available
        const { data: authData, error: authError } = await supabaseAdminClient.auth.admin.createUser({
          email: values.email,
          password: values.password,
          email_confirm: true,
          user_metadata: {
            first_name: values.first_name,
            last_name: values.last_name,
          },
        });

        if (authError) throw authError;

        // Update the personnel record with additional information
        const { error: profileError } = await supabaseClient
          .from("personnel")
          .update({
            first_name: values.first_name,
            last_name: values.last_name,
            telegram_id: values.telegram_id || null,
            telegram_username: values.telegram_username || null,
            app_role: values.role,
          })
          .eq("auth_user_id", authData.user.id);

        if (profileError) throw profileError;

        message.success("User created successfully!");
        form.resetFields();
        setIsCreateModalVisible(false);
        tableQueryResult?.refetch();
      } else {
        // Fallback: Direct insert into user_profiles for existing auth users
        message.info("Admin client not available. Please create the user in Supabase Auth first.");
        
        // Show instructions modal
        Modal.info({
          title: "Manual User Creation Required",
          content: (
            <div>
              <p>To create a new user:</p>
              <ol>
                <li>Go to your Supabase Dashboard</li>
                <li>Navigate to Authentication → Users</li>
                <li>Click "Add user" → "Create new user"</li>
                <li>Enter email: <strong>{values.email}</strong></li>
                <li>Set a temporary password</li>
                <li>After creation, click OK below to add their profile details</li>
              </ol>
            </div>
          ),
          onOk: async () => {
            // Try to find the user by email and create/update personnel record
            const { data: users } = await supabaseClient
              .from("personnel")
              .select("id")
              .eq("email", values.email);

            if (users && users.length > 0) {
              // Update existing personnel record
              const { error } = await supabaseClient
                .from("personnel")
                .update({
                  first_name: values.first_name,
                  last_name: values.last_name,
                  telegram_id: values.telegram_id || null,
                  telegram_username: values.telegram_username || null,
                  app_role: values.role,
                })
                .eq("email", values.email);

              if (error) throw error;
              message.success("User profile updated successfully!");
            } else {
              message.error("User not found. Please create them in Supabase first.");
            }
            
            form.resetFields();
            setIsCreateModalVisible(false);
            tableQueryResult?.refetch();
          },
        });
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      message.error(error.message || "Failed to create user");
    } finally {
      setCreateUserLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2}>Admin Dashboard</Title>
        <Text type="secondary">Manage users and system settings</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={totalUsers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Admins"
              value={adminCount}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Users"
              value={userCount}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Viewers"
              value={viewerCount}
              prefix={<EyeOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            User Management
          </Title>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
          >
            Create New User
          </Button>
        </div>

        <Table {...tableProps} rowKey="id">
          <Table.Column 
            dataIndex="email" 
            title="Email" 
            render={(value: string, record: any) => {
              const isCurrentUser: boolean = !!(identity && 
                typeof identity === 'object' && 
                'id' in identity && 
                record.id === (identity as any).id);
              
              return (
                <div>
                  <Text strong>{value}</Text>
                  {isCurrentUser && (
                    <Tag color="blue" style={{ marginLeft: 8 }}>You</Tag>
                  )}
                </div>
              );
            }}
          />
          <Table.Column
            title="Name"
            render={(_, record: any) => (
              <Text>
                {record.first_name || record.last_name
                  ? `${record.first_name || ""} ${record.last_name || ""}`.trim()
                  : "Not provided"}
              </Text>
            )}
          />
          <Table.Column
            dataIndex="telegram_username"
            title="Telegram"
            render={(value, record: any) => (
              <Space direction="vertical" size="small">
                {value && <Text>@{value}</Text>}
                {record.telegram_id && (
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    ID: {record.telegram_id}
                  </Text>
                )}
              </Space>
            )}
          />
          <Table.Column
            dataIndex="role"
            title="Role"
            render={(role: string) => (
              <Tag color={roleColors[role as keyof typeof roleColors]}>
                {role.toUpperCase()}
              </Tag>
            )}
          />
          <Table.Column
            dataIndex="created_at"
            title="Created"
            render={(value: string) => new Date(value).toLocaleDateString()}
          />
        </Table>
      </Card>

      {/* Create User Modal */}
      <Modal
        title="Create New User"
        open={isCreateModalVisible}
        onCancel={() => {
          form.resetFields();
          setIsCreateModalVisible(false);
        }}
        footer={null}
        width={600}
      >
        {!isAdminClientAvailable() && (
          <div style={{ 
            background: "#fff7e6", 
            border: "1px solid #ffd591", 
            borderRadius: "4px", 
            padding: "12px", 
            marginBottom: "16px" 
          }}>
            <Text type="warning">
              <strong>Note:</strong> Service role key not configured. Users must be created in Supabase Auth first.
            </Text>
          </div>
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateUser}
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[{ required: true, message: "Please enter first name" }]}
              >
                <Input placeholder="John" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[{ required: true, message: "Please enter last name" }]}
              >
                <Input placeholder="Doe" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder="Enter a secure password" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="telegram_id"
                label="Telegram ID"
                rules={[
                  { pattern: /^\d+$/, message: "Must be a number" },
                ]}
              >
                <Input placeholder="1234567890" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="telegram_username"
                label="Telegram Username"
              >
                <Input placeholder="johndoe" addonBefore="@" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select a role" }]}
            initialValue="viewer"
          >
            <Select>
              <Select.Option value="admin">
                <Space>
                  <Tag color="red">Admin</Tag>
                  <Text type="secondary">Full system access</Text>
                </Space>
              </Select.Option>
              <Select.Option value="user">
                <Space>
                  <Tag color="blue">User</Tag>
                  <Text type="secondary">Read documents</Text>
                </Space>
              </Select.Option>
              <Select.Option value="viewer">
                <Space>
                  <Tag color="green">Viewer</Tag>
                  <Text type="secondary">Read documents only</Text>
                </Space>
              </Select.Option>
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => setIsCreateModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={createUserLoading}>
                Create User
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};