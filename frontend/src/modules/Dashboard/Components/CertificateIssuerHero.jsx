import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Row, Typography } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getData } from "../../../redux/actions/certificateIssuer";
import { openNotificationWithIcon } from "../../../utils/openNotificationWithIcon";
const {Title} = Typography;

const CertificateIssuerHero = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const {certificateCollectionCount,certificateCount,certificateReceiverCount} = useSelector(state => state.certificateIssuer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const createCertificateHandler = () => {
    navigate("/create-certificate");
  }
  useEffect(()=>{
    user.role==="certificateIssuer"&& dispatch(getData())
  },[dispatch,user.role])
  useEffect(() => {
    let interval;
    
    if (user.role === "certificateIssuer" && !user.ethereumAddress) {
      // Set an interval to show notification every 3 seconds
      interval = setInterval(() => {
        openNotificationWithIcon(
          "warning",
          "Ethereum Wallet Not Found",
          "It looks like your profile is incomplete, go to Settings page to complete it before using the app."
        );
      }, 2000);
    }

    // Cleanup the interval when the component unmounts or user gets an ethereum address
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user.role, user.ethereumAddress]);

  // useEffect(() => {
  //   if (user && user.role === "certificateIssuer" && !user.ethereumAddress) {
  //     setTimeout(() => {
  //       openNotificationWithIcon(
  //         "info",
  //         "Ethereum Wallet Not Found",
  //         "Your profile is incomplete, go to Settings page and complete it before using the app."
  //       );
  //     }, 3000);
  //   }
  // }, [user, user.role, user.ethereumAddress]);
  
  // useEffect(()=>{
  //   if(user.role==="certificateIssuer") {
  //     if(!user.ethereumAddress) {
  //       setTimeout(()=>{
  //         openNotificationWithIcon("info","Ethereum Wallet Not Found","It seems your profile is incomplete , go to Settings page.")
  //       },3000)
  //     }
  //   }
  // },[user.role,user.ethereumAddress])
  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Title>Hello {user && user.username},</Title>
        <Button disabled={user && !user.ethereumAddress} type="primary" size="large" icon={<PlusOutlined />} onClick={createCertificateHandler}>Create Certificate</Button>
      </div>
      <Divider/>
      <Row gutter={[20,0]}>
        <Col xs={24} sm={24} md={12} lg={8} xl={6}>
          <Card
            title="# Certificate Collections"
            extra={<a href="/certificate-collections">View</a>}
            hoverable
          >
            <div style={{color:"green",fontSize:"100px",fontWeight:"bold",textAlign:"center"}}>{certificateCollectionCount}</div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={6}>
          <Card
            title="# Certificates Issued"
            extra={<a href="/certificates">View</a>}
            hoverable
          >
            <div style={{color:"green",fontSize:"100px",fontWeight:"bold",textAlign:"center"}}>{certificateCount}</div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={6}>
          <Card
            title="# Unique Receivers"
            extra={<a href="/receivers">View</a>}
            hoverable
          >
            <div style={{color:"green",fontSize:"100px",fontWeight:"bold",textAlign:"center"}}>{certificateReceiverCount}</div>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CertificateIssuerHero