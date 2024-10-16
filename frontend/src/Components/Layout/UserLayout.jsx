import { useEffect, useState } from 'react';
import {
  DashboardOutlined,
  DatabaseOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import logo from "../../assets/logo.png";
import { Avatar, Button, Col, Divider, Layout, Menu, Popover, Row, Select, theme,Typography } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import "./Index.css";
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/user';
import { getUserBalance } from '../../utils/web3functions';
import base from '../../assets/base.svg';
import matic from "../../assets/matic.svg";

const {Text} = Typography;
const { Header, Sider, Content,Footer } = Layout;
const UserLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const defaultLocation = useLocation();
  console.log("defaultLocation :",defaultLocation);
  const userData = JSON.parse(localStorage.getItem("user"));
  const [collapsed, setCollapsed] = useState(false);
  const [userBalance,setUserBalance] = useState();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const logoutHandler = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(()=>{
    const fetchUserBalance = async()=>{
      const balance = await getUserBalance(userData.ethereumAddress)
      setUserBalance(balance);
    }
    userData.ethereumAddress && fetchUserBalance();
  },[userData.ethereumAddress])

  const content = (
    <Col style={{ width: "250px", height: "120px" }}>
      <Divider style={{ borderWidth: "medium", padding: "0", margin: "0" }} />
      <Row>
        <Col span={6}>
          <b>Name</b>
        </Col>
        <Col span={2}>:</Col>
        <Col span={16}>{userData && userData.fullname}</Col>
      </Row>
      <Row>
        <Col span={6}>
          <b>Email</b>
        </Col>
        <Col span={2}>:</Col>
        <Col span={16}>{userData && userData.email}</Col>
      </Row>
      {userData && userData.ethereumAddress && 
      <>
        <Row>
          <Col span={6}>
            <b>Address</b>
          </Col>
          <Col span={2}>:</Col>
          <Col span={16}><Text className='wallet-address' copyable={{text:userData.ethereumAddress}}>{userData.ethereumAddress.slice(0, 6)}...{userData.ethereumAddress.slice(-4)}</Text></Col>
        </Row>
        
        <Row>
          <Col span={6}>
            <b>Balance</b>
          </Col>
          <Col span={2}>:</Col>
          <Col span={16}>{userBalance}</Col>
        </Row>
      </>
      }
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

  const getRole = (role)=>{
    switch (role) {
      case 'admin':
        return 'Admin'
      case 'user':
        return 'User'
      case 'certificateIssuer':
        return 'Certificate Issuer'
  }};

  const getMenuItemsList = (role)=>{
    switch(role) {
      case 'admin':
        return [
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
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
          },
        ]
      case 'user':
        return [
          {
            key:"/dashboard",
            icon: <DashboardOutlined />,
            label: 'Dashboard',
          },
          {
            key: '/certificates',
            icon: <SafetyCertificateOutlined />,
            label: 'Certificates',
          },
          {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
          },
        ]
      case 'certificateIssuer':
        return [
          {
            key:"/dashboard",
            icon: <DashboardOutlined />,
            label: 'Dashboard',
          },
          {
            key: '/certificate-collections',
            icon: <DatabaseOutlined />,
            label: 'Certificate Collections',
          },
          {
            key: '/certificates',
            icon: <SafetyCertificateOutlined />,
            label: 'Certificates',
          },
          {
            key: '/receivers',
            icon: <UserOutlined />,
            label: 'Receivers',
          },
          {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
          },
        ]
    }
  };

  const items = [
    {
      type: 'group',
      label: 'Testnets',
      title:'Testnets',
      options: [
        {
          value: 'base_sepolia',
          label: (
            <div style={{display:"flex",width:"150px",justifyContent:"space-between",alignItems:"center"}}>
              <span>Base Sepolia</span>
              <img src={base} width={25} height={25}/>
            </div>
          ),
        },
        {
          value: 'polygon_amoy',
          label: (
            <div style={{display:"flex",width:"150px",justifyContent:"space-evenly",alignItems:"center"}}>
              <span>Polygon Amoy</span>
              <img src={matic} width={25} height={25}/>
            </div>
          ),
          disabled:true
        },
      ]
    },
    {
      type: 'group',
      label: 'Mainnets',
      title:'Mainnets',
      options: [
        {
          value: 'base_mainnet',
          label: (
            <div style={{display:"flex",width:"150px",justifyContent:"space-evenly",alignItems:"center"}}>
              <span>Base Mainnet</span>
              <img src={base} width={25} height={25}/>
            </div>
          ),
          disabled:true
        },
        {
          value: 'polygon_mainnet',
          label: (
            <div style={{display:"flex",width:"150px",justifyContent:"space-evenly",alignItems:"center"}}>
              <span>Polygon Mainnet</span>
              <img src={matic} width={25} height={25}/>
            </div>
          ),
          disabled:true
        }    
      ]
    }
  ];
  

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
          selectedKeys={[defaultLocation.pathname]}
          onClick={({ key }) => navigate(key)}
          items={userData && getMenuItemsList(userData.role)}
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
            <Select
              defaultValue="base_sepolia"
              size='large'
              options={items}
              style={{marginRight:"10px"}}
            />
            <b style={{marginRight:"10px"}}>{userData && getRole(userData.role)}</b>
            <Popover
              content={content}
              placement="leftTop"
              trigger="click"
              title="User Details"
            > 
              <Avatar
                src={userData.avatar && userData.avatar}
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
export default UserLayout;