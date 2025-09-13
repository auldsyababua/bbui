import { List, useTable, EditButton } from "@refinedev/antd";
import { CanAccess } from "@refinedev/core";
import { BaseRecord } from "@refinedev/core";
import { Table, Space, Tag, Tooltip } from "antd";
import { MessageOutlined, ClockCircleOutlined } from "@ant-design/icons";

const roleColors = {
  admin: "red",
  user: "blue",
  viewer: "green",
};

export const UserList = () => {
  const { tableProps } = useTable({
    resource: "personnel",
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id" scroll={{ x: 1200 }}>
        <Table.Column dataIndex="email" title="Email" width={200} />
        <Table.Column 
          title="Name" 
          width={150}
          render={(_, record: BaseRecord) => 
            `${record.first_name || ''} ${record.last_name || ''}`.trim() || 'Not set'
          }
        />
        <Table.Column dataIndex="job_title" title="Job Title" width={150} />
        <Table.Column
          dataIndex="app_role"
          title="Role"
          width={100}
          render={(role: string) => (
            <Tag color={roleColors[role as keyof typeof roleColors]}>
              {role.toUpperCase()}
            </Tag>
          )}
        />
        <Table.Column
          title="Telegram"
          width={150}
          render={(_, record: BaseRecord) => {
            if (record.telegram_username) {
              return (
                <Space>
                  <MessageOutlined />
                  <span>@{record.telegram_username}</span>
                </Space>
              );
            }
            return <span style={{ color: '#999' }}>Not set</span>;
          }}
        />
        <Table.Column
          dataIndex="timezone"
          title="Timezone"
          width={150}
          render={(value: string) => (
            <Tooltip title={value || 'Not set'}>
              <Space>
                <ClockCircleOutlined />
                <span>{value ? value.split('/').pop() : 'Not set'}</span>
              </Space>
            </Tooltip>
          )}
        />
        <Table.Column
          dataIndex="updated_at"
          title="Last Updated"
          width={120}
          render={(value: string) => new Date(value).toLocaleDateString()}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <CanAccess
                resource="personnel"
                action="edit"
                params={{ id: record.id }}
              >
                <EditButton hideText size="small" recordItemId={record.id} />
              </CanAccess>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};