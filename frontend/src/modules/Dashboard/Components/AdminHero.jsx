import { Card, Col, Divider, Row, Typography } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {getAdminDashboardData} from "../../../redux/actions/admin";
const {Title} = Typography;

const AdminHero = () => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const {certificateCollectionCount,certificateCount,certificateReceiverCount,certificateIssuerCount} = useSelector(state => state.admin);
  const dispatch = useDispatch();
  useEffect(()=>{
    admin.role==="admin"&& dispatch(getAdminDashboardData())
  },[dispatch,admin.role])

  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Title>Hello Admin,</Title>
      </div>
      <Divider/>
      <Row gutter={[20,0]}>
        <Col xs={24} sm={24} md={12} lg={8} xl={6}>
          <Card
            title="# Certificate Issuers"
            extra={<a href="/certificate-issuers">View</a>}
            hoverable
          >
            <div style={{color:"green",fontSize:"100px",fontWeight:"bold",textAlign:"center"}}>{certificateIssuerCount}</div>
          </Card>
        </Col>

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
            title="# Certificate Receivers"
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

export default AdminHero