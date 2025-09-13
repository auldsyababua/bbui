import { useGetIdentity, useLogout } from "@refinedev/core";
import { Avatar, Button, Dropdown, Menu, Space, Typography } from "antd";
import { UserOutlined, LogoutOutlined, SettingOutlined, HomeOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Text } = Typography;

interface Identity {
  id: string;
  name?: string;
  email?: string;
}

export const CustomHeader = () => {
  const { data: identity } = useGetIdentity<Identity>();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const menu = (
    <Menu>
      <Menu.Item
        key="profile"
        icon={<SettingOutlined />}
        onClick={() => navigate("/profile")}
      >
        Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => logout()}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

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
      
      <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
        <Space style={{ cursor: "pointer" }}>
          <Avatar icon={<UserOutlined />} />
          <Text>{identity?.name || identity?.email}</Text>
        </Space>
      </Dropdown>
    </div>
  );
};