import { useState } from 'react';
import {
  DashboardOutlined,
  DatabaseOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import logo from "../../assets/logo.png";
import { Avatar, Button, Col, Divider, Layout, Menu, Popover, Row, theme } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import "./Index.css";
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/admin';
import UserAvatarIcon from "../../assets/user-profile.jpg";
const { Header, Sider, Content,Footer } = Layout;
const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = JSON.parse(localStorage.getItem("user"));
  console.log("userData :",userData);
  const adminData = JSON.parse(localStorage.getItem("admin"));
  console.log("adminData :",adminData);
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const logoutHandler = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("admin");
    navigate("/");
  };

  const adminContent = (
    <Col style={{ width: "250px", height: "100px" }}>
      <Divider style={{ borderWidth: "medium", padding: "0", margin: "0" }} />
      <Row>
        <Col span={6}>
          <b>Email</b>
        </Col>
        <Col span={2}>:</Col>
        <Col span={16}>{adminData && adminData.email}</Col>
      </Row>
      <Divider style={{ borderWidth: "medium", padding: "0", margin: "0" }} />
      <Row style={{ marginTop: "5px" }}>
        <Col>
          <Button type="primary" danger onClick={logoutHandler}>
            Log Out
          </Button>
        </Col>
      </Row>
    </Col>
  );

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <img
          className="logo"
          src={logo}
        />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/dashboard']}
          onClick={({ key }) => navigate(key)}
          items={[
          {
            key:"/dashboard",
            icon: <DashboardOutlined />,
            label: 'Dashboard',
          },
          {
            key: '/certificate-issuers',
            icon: <DatabaseOutlined />,
            label: 'Certificate Issuers',
          },
          {
            key: '/certificate-collections',
            icon: <DatabaseOutlined />,
            label: 'Certificate Collections',
          },
          {
            key: '/receivers',
            icon: <UserOutlined />,
            label: 'Certificate Receivers',
          },
          {
            key: '/certificates',
            icon: <SafetyCertificateOutlined />,
            label: 'Certificates',
          }
        ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center"
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <b style={{marginRight:"10px"}}>Admin</b>
            <Popover
              content={adminContent}
              placement="leftTop"
              trigger="click"
              title="User Details"
            > 
              <Avatar
                src={UserAvatarIcon}
                size={"large"}
                draggable={"false"}
                style={{
                  marginRight:"20px"
                }}
              />
            </Popover>
          </div>
        </Header>
        <Content
          style={{
            padding: "24px 24px",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: "75vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet/>
          </div>
        </Content>
        <Footer
          style={{
              textAlign: "center",
          }}
        >
          ChainedCertificates© {new Date().getFullYear()} Created with &#10084; by <Link to={"https://www.linkedin.com/in/gauravpant31/"} target="_blank">Gaurav Pant</Link>
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;