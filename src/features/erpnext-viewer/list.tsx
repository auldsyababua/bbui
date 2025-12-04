/**
 * DocType List Component
 * Displays paginated list of available DocTypes from ERPNext
 */

import React from 'react';
import { List, useTable } from '@refinedev/antd';
import { Table, Space, Button, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { DocType } from './types';

export const DocTypeList: React.FC = () => {
  const navigate = useNavigate();

  // Use Refine's useTable hook for table functionality
  const { tableProps, tableQueryResult } = useTable<DocType>({
    resource: 'DocType',
    pagination: {
      mode: 'server',
      pageSize: 25,
    },
    filters: {
      // Permanent filter: only show non-table DocTypes (istable=0)
      permanent: [
        {
          field: 'istable',
          operator: 'eq',
          value: 0,
        },
      ],
    },
    meta: {
      dataProviderName: 'erpnext', // Use erpnext data provider
    },
  });

  const { isLoading, isError } = tableQueryResult || {};

  return (
    <List
      title="ERPNext DocTypes"
      breadcrumb={false}
    >
      <Table
        {...tableProps}
        rowKey="name"
        loading={isLoading}
      >
        <Table.Column
          dataIndex="name"
          title="DocType"
          sorter
          render={(value: string) => (
            <strong>{value}</strong>
          )}
        />

        <Table.Column
          dataIndex="module"
          title="Module"
          sorter
        />

        <Table.Column
          dataIndex="istable"
          title="Type"
          render={(value: 0 | 1) => (
            <Tag color={value === 0 ? 'blue' : 'orange'}>
              {value === 0 ? 'DocType' : 'Child Table'}
            </Tag>
          )}
        />

        <Table.Column
          title="Actions"
          render={(_, record: DocType) => (
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/tools/erpnext/doctypes/${record.name}`)}
              >
                View Records
              </Button>
            </Space>
          )}
        />
      </Table>

      {isError && (
        <div style={{ marginTop: 16, padding: 16, background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 4 }}>
          <strong>Error loading DocTypes</strong>
          <p>Failed to fetch DocTypes from ERPNext. Please check your API credentials and try again.</p>
        </div>
      )}
    </List>
  );
};
