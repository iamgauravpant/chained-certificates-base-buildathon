import { Layout,Menu,Row,theme } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Index.css";

const { Header, Footer, Content } = Layout;
const Index = () => {
  const navigate = useNavigate();
  const defaultLocation = useLocation();
  console.log("defaultLocation :",defaultLocation);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navbar_items = [
    {
      label: "About Us",
      key:"/about-us"
    },
    {
      label: "Verify Certificate",
      key:"/verify"
    },
    {
      label: "Admin Portal",
      key:"/admin-login"
    }
  ]
  
  return (
    <Layout>
      <Header>
        <Row justify={"space-between"} align={"middle"}>
        <img
          className="logo"
          src={logo}
          style={{
            width:"200px",
            height:"90%",
            cursor:"pointer"
          }}
          onClick={()=>navigate("/")}
        />
        <Menu
          theme="dark"
          mode="horizontal"
          items={navbar_items}
          selectedKeys={[defaultLocation.pathname]}
          style={{
            flex: 1,
            minWidth: 0,
          }}
          onClick={({ key }) => navigate(key)}
        />
        </Row>
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
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              flexDirection:"column"
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
          ChainedCertificates&copy; {new Date().getFullYear()} Created with &#10084; by <Link to={"https://www.linkedin.com/in/gauravpant31/"} target="_blank">Gaurav Pant</Link>
        </Footer>
    </Layout>
  );
};

export default Index;
