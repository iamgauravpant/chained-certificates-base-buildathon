import { Card, Col, Divider, Row, Typography, notification } from "antd"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getData } from "../../../redux/actions/certificateReceiver";
const {Title} = Typography;
const UserHero = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const {certificateCount} = useSelector(state => state.certificateReceiver);
  console.log("user :",user);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (!user?.ethereumAddress) {
      console.log("No ethereumAddress found, triggering notification");
      api.info({
        message: 'Notice',
        description:
          'Please complete your profile . Go to Settings Page .',
        showProgress: true,
        pauseOnHover: true,
        placement:"top"
      });
    }
  }, [user, api]);

  useEffect(()=>{
    dispatch(getData());
  },[dispatch])
  return (
    <>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Title>Hello {user && user.username},</Title>
        {contextHolder}
      </div>
      <Divider/>
      <Row gutter={[20,0]}>
        <Col xs={24} sm={24} md={12} lg={8} xl={6}>
          <Card
            title="# Certificates Issued"
            extra={<a href="/certificates">View</a>}
            hoverable
          >
            <div style={{color:"green",fontSize:"100px",fontWeight:"bold",textAlign:"center"}}>{certificateCount}</div>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default UserHero