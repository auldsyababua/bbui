import { Button, Space, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Title } = Typography;

export const CustomHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        height: "64px",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Space size="large">
        <Button
          type={location.pathname === "/" ? "primary" : "text"}
          icon={<HomeOutlined />}
          onClick={() => navigate("/")}
        >
          Home
        </Button>
      </Space>

      <Title level={4} style={{ margin: 0 }}>
        FLRTS Operations Hub
      </Title>
    </div>
  );
};
