import { Show, DateField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Space, Tag, Divider } from "antd";
import { MessageOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const roleColors = {
  admin: "red",
  user: "blue",
  viewer: "green",
};

export const UserShow = () => {
  const { queryResult } = useShow({
    resource: "personnel",
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div>
          <Divider orientation="left">Account Information</Divider>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Title level={5}>Email</Title>
              <Text>{record?.email}</Text>
            </div>
            <div>
              <Title level={5}>Role</Title>
              <Tag color={roleColors[record?.app_role as keyof typeof roleColors]}>
                {record?.app_role?.toUpperCase()}
              </Tag>
            </div>
          </Space>
        </div>

        <div>
          <Divider orientation="left">Profile Information</Divider>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Title level={5}>Name</Title>
              <Text>
                {record ? `${record.first_name || ''} ${record.last_name || ''}`.trim() : 'Not provided'}
              </Text>
            </div>
            <div>
              <Title level={5}>Job Title</Title>
              <Text>{record?.job_title || "Not provided"}</Text>
            </div>
          </Space>
        </div>

        <div>
          <Divider orientation="left">Telegram Integration</Divider>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Title level={5}>Telegram Username</Title>
              {record?.telegram_username ? (
                <Space>
                  <MessageOutlined />
                  <Text>@{record.telegram_username}</Text>
                </Space>
              ) : (
                <Text type="secondary">Not provided</Text>
              )}
            </div>
            <div>
              <Title level={5}>Telegram ID</Title>
              <Text>{record?.telegram_id || <Text type="secondary">Not provided</Text>}</Text>
            </div>
          </Space>
        </div>

        <div>
          <Divider orientation="left">Preferences</Divider>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Title level={5}>Timezone</Title>
              {record?.timezone ? (
                <Space>
                  <ClockCircleOutlined />
                  <Text>{record.timezone}</Text>
                </Space>
              ) : (
                <Text type="secondary">Not set</Text>
              )}
            </div>
          </Space>
        </div>

        <div>
          <Divider orientation="left">System Information</Divider>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Title level={5}>Created At</Title>
              <DateField value={record?.created_at} />
            </div>
            <div>
              <Title level={5}>Updated At</Title>
              <DateField value={record?.updated_at} />
            </div>
          </Space>
        </div>
      </Space>
    </Show>
  );
};