import { Card, Col, Row, Typography } from "antd";
import { RobotOutlined, CommentOutlined, EditOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface AppCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path?: string;
  disabled?: boolean;
  comingSoon?: boolean;
}

const AppCard: React.FC<AppCardProps> = ({ 
  title, 
  description, 
  icon, 
  path, 
  disabled = false,
  comingSoon = false 
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (!disabled && path) {
      navigate(path);
    }
  };
  
  return (
    <Card
      hoverable={!disabled}
      style={{ 
        height: "100%",
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        textAlign: "center"
      }}
      onClick={handleClick}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>
        {icon}
      </div>
      <Title level={4}>{title}</Title>
      <Text type={disabled ? "secondary" : undefined}>
        {description}
      </Text>
      {comingSoon && (
        <div style={{ marginTop: 12 }}>
          <Text type="secondary" italic>
            Coming Soon
          </Text>
        </div>
      )}
    </Card>
  );
};

export const Homepage = () => {
  const apps = [
    {
      title: "Supabase Doc Viewer",
      description: "View and manage Supabase documentation",
      icon: <FileTextOutlined style={{ color: "#1890ff" }} />,
      path: "/documents",
      disabled: false,
    },
    {
      title: "Brain Bot",
      description: "AI-powered chat interface for intelligent assistance",
      icon: <RobotOutlined style={{ color: "#52c41a" }} />,
      disabled: true,
      comingSoon: true,
    },
    {
      title: "Talk2Telegram",
      description: "Connect and communicate through Telegram integration",
      icon: <CommentOutlined style={{ color: "#faad14" }} />,
      disabled: true,
      comingSoon: true,
    },
    {
      title: "Markup Manager",
      description: "Manage and track project markups efficiently",
      icon: <EditOutlined style={{ color: "#722ed1" }} />,
      disabled: true,
      comingSoon: true,
    },
  ];
  
  return (
    <div style={{ padding: "24px" }}>
      <Title level={2} style={{ marginBottom: 32 }}>
        10NetZero Apps
      </Title>
      
      <Row gutter={[24, 24]}>
        {apps.map((app, index) => (
          <Col key={index} xs={24} sm={12} lg={8}>
            <AppCard {...app} />
          </Col>
        ))}
      </Row>
    </div>
  );
};