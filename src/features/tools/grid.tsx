import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Space } from 'antd';
import {
  FileTextOutlined,
  MessageOutlined,
  SendOutlined,
  CalculatorOutlined,
  BarChartOutlined,
  CheckSquareOutlined,
  TeamOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

interface Tool {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
  status: 'active' | 'coming-soon';
}

export const ToolsGrid: React.FC = () => {
  const navigate = useNavigate();

  const tools: Tool[] = [
    {
      title: 'Supabase File Viewer',
      description: 'Browse and search documents stored in the brain-bot database with hierarchical file tree navigation.',
      icon: <FileTextOutlined style={{ fontSize: '24px' }} />,
      route: '/documents',
      color: '#1890ff',
      status: 'active',
    },
    {
      title: 'Task Manager',
      description: 'Create and manage tasks using natural language. Powered by GPT parser for intelligent task extraction.',
      icon: <CheckSquareOutlined style={{ fontSize: '24px' }} />,
      route: '/tasks',
      color: '#52c41a',
      status: 'coming-soon',
    },
    {
      title: 'Field Reports',
      description: 'Submit and view field reports from technicians. Includes voice-to-text and photo attachments.',
      icon: <TeamOutlined style={{ fontSize: '24px' }} />,
      route: '/reports',
      color: '#fa8c16',
      status: 'coming-soon',
    },
    {
      title: '10NZ Assistant',
      description: 'AI-powered assistant for answering company questions and helping with daily tasks.',
      icon: <MessageOutlined style={{ fontSize: '24px' }} />,
      route: '/assistant',
      color: '#13c2c2',
      status: 'coming-soon',
    },
    {
      title: 'Talk2Telegram',
      description: 'Securely communicate with external partners through our Telegram integration.',
      icon: <SendOutlined style={{ fontSize: '24px' }} />,
      route: '/telegram',
      color: '#722ed1',
      status: 'coming-soon',
    },
    {
      title: 'Financial Dashboard',
      description: 'Track markups, partner billing, and profit sharing across all sites and projects.',
      icon: <DollarOutlined style={{ fontSize: '24px' }} />,
      route: '/finance',
      color: '#eb2f96',
      status: 'coming-soon',
    },
    {
      title: 'Analytics',
      description: 'View operational metrics, equipment performance, and predictive maintenance insights.',
      icon: <BarChartOutlined style={{ fontSize: '24px' }} />,
      route: '/analytics',
      color: '#faad14',
      status: 'coming-soon',
    },
    {
      title: 'Markup Calculator',
      description: 'Calculate and manage markup rates for vendor invoices and partner billing.',
      icon: <CalculatorOutlined style={{ fontSize: '24px' }} />,
      route: '/markup',
      color: '#f5222d',
      status: 'coming-soon',
    },
    {
      title: 'Equity Calculator',
      description: 'Calculate monthly distributions based on petahash rate and ownership percentage for 10NetZero shareholders.',
      icon: <DollarOutlined style={{ fontSize: '24px' }} />,
      route: '/equity-calculator',
      color: '#52c41a',
      status: 'active',
    },
  ];

  const handleToolClick = (tool: Tool) => {
    if (tool.status === 'active') {
      navigate(tool.route);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2}>FLRTS Operations Hub</Title>
          <Paragraph type="secondary">
            Field Reports, Lists, Reminders, Tasks & Subtasks - All in one place
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {tools.map((tool, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card
                hoverable={tool.status === 'active'}
                style={{
                  height: '100%',
                  opacity: tool.status === 'coming-soon' ? 0.7 : 1,
                  cursor: tool.status === 'active' ? 'pointer' : 'not-allowed',
                }}
                onClick={() => handleToolClick(tool)}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: tool.color + '20',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {tool.icon}
                  </div>
                  <div>
                    <Title level={4} style={{ marginBottom: '8px' }}>
                      {tool.title}
                      {tool.status === 'coming-soon' && (
                        <span
                          style={{
                            fontSize: '12px',
                            marginLeft: '8px',
                            color: '#ff7875',
                            fontWeight: 'normal',
                          }}
                        >
                          (Coming Soon)
                        </span>
                      )}
                    </Title>
                    <Paragraph
                      type="secondary"
                      style={{ marginBottom: 0, fontSize: '14px' }}
                    >
                      {tool.description}
                    </Paragraph>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </div>
  );
};