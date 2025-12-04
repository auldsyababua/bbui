/**
 * DocType Show Component
 * Displays records for selected DocType with dynamic columns
 */

import React, { useMemo } from 'react';
import { useTable } from '@refinedev/antd';
import { Show } from '@refinedev/antd';
import { Table, Typography, Alert } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import type { DocTypeRecord } from './types';

const { Text } = Typography;

/**
 * Format field name for display
 * Converts "field_name" to "Field Name"
 */
const formatFieldName = (fieldName: string): string => {
  return fieldName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generate dynamic columns from first record
 */
const generateColumns = (data: DocTypeRecord[] | undefined) => {
  if (!data || data.length === 0) {
    // Default column if no data
    return [
      {
        key: 'name',
        dataIndex: 'name',
        title: 'Name',
      },
    ];
  }

  const firstRecord = data[0];
  const fields = Object.keys(firstRecord);

  return fields.map((field) => {
    // Special handling for 'name' field (primary key)
    if (field === 'name') {
      return {
        key: field,
        dataIndex: field,
        title: formatFieldName(field),
        fixed: 'left' as const,
        width: 200,
        render: (value: any) => <Text strong>{value}</Text>,
      };
    }

    // Default column configuration
    return {
      key: field,
      dataIndex: field,
      title: formatFieldName(field),
      ellipsis: true, // Truncate long values
      render: (value: any) => {
        // Handle null/undefined
        if (value === null || value === undefined) {
          return <Text type="secondary">—</Text>;
        }

        // Handle objects/arrays (stringify)
        if (typeof value === 'object') {
          return <Text code>{JSON.stringify(value)}</Text>;
        }

        // Handle booleans
        if (typeof value === 'boolean') {
          return <Text>{value ? 'Yes' : 'No'}</Text>;
        }

        // Handle numbers
        if (typeof value === 'number') {
          return <Text>{value.toLocaleString()}</Text>;
        }

        // Handle strings
        return <Text>{String(value)}</Text>;
      },
    };
  });
};

export const DocTypeShow: React.FC = () => {
  const { doctype } = useParams<{ doctype: string }>();
  const navigate = useNavigate();

  // Validate doctype parameter
  if (!doctype) {
    return (
      <Show title="Error">
        <Alert
          message="Invalid DocType"
          description="No DocType specified in URL. Please select a DocType from the list."
          type="error"
          showIcon
          action={
            <Typography.Link onClick={() => navigate('/tools/erpnext/doctypes')}>
              Back to DocType List
            </Typography.Link>
          }
        />
      </Show>
    );
  }

  const { tableProps, tableQueryResult } = useTable<DocTypeRecord>({
    resource: doctype,
    pagination: {
      mode: 'server',
      pageSize: 25,
    },
    meta: {
      dataProviderName: 'erpnext',
    },
  });

  const { isLoading, isError, error } = tableQueryResult || {};

  // Generate columns dynamically from data
  const columns = useMemo(() => {
    return generateColumns(tableProps.dataSource ? [...tableProps.dataSource] : undefined);
  }, [tableProps.dataSource]);

  // Handle error state
  if (isError) {
    return (
      <Show title={`${doctype} Records`}>
        <Alert
          message="Error Loading Records"
          description={
            error?.message ||
            `Failed to fetch records for ${doctype}. Please check your permissions or try again.`
          }
          type="error"
          showIcon
        />
      </Show>
    );
  }

  return (
    <Show
      title={`${doctype} Records`}
      breadcrumb={true}
    >
      <Table
        {...tableProps}
        rowKey="name"
        loading={isLoading}
        columns={columns}
        scroll={{ x: true }} // Enable horizontal scroll for many columns
        size="small"
      />
    </Show>
  );
};
