import { EditOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, Row, Select, Typography } from "antd"
import userPic from "../../../assets/user-profile.jpg";
import { useDispatch, useSelector } from "react-redux";
import { createEthWallet, updateUserDetails } from "../../../redux/actions/user";
import "./Hero.scss";
import { useEffect, useRef, useState } from "react";
import { resetEthWalletState, resetUpdateUserState } from "../../../redux/slices/userSlice";

const {Title} = Typography;
const {Option} = Select;
const Hero = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const {isEthWalletCreated,isUpdateUserDetailsSuccess} = useSelector(state => state.user);
  const [userProfile, setUserProfile] = useState(userPic);
  const dispatch = useDispatch();
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
        defaultValue="91"
      >
        <Option value="91">+91</Option>
        <Option value="1">+1</Option>
      </Select>
    </Form.Item>
  );

  const createWallet = () => {
    dispatch(createEthWallet())
  }

  const fileInputRef = useRef(null);

  const handleEditButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onFinish = (values) => {
    const {prefix,country,phone} = values;
    const contactenatedPhoneNumber = prefix + phone;
    if (userProfile) {
      // Perform the file upload here
      const formData = new FormData();
      formData.append('avatar', userProfile);
      formData.append('phoneNumber',contactenatedPhoneNumber);
      formData.append('country',country);
      
      dispatch(updateUserDetails(formData));
    }
  }

  useEffect(()=>{
    const functionsToRun = () => {
      dispatch(resetEthWalletState())
      setTimeout(()=>{
        window.location.reload()
      },1000)
    }
    isEthWalletCreated && functionsToRun();
    
  },[isEthWalletCreated,dispatch]);
  useEffect(()=>{
    const functionsToRun = () => {
      dispatch(resetUpdateUserState())
      setTimeout(()=>{
        window.location.reload()
      },1000)
    }
    isUpdateUserDetailsSuccess && functionsToRun();
    
  },[isUpdateUserDetailsSuccess,dispatch]);

  return (
    <>
      <Title>Settings <SettingOutlined /></Title>
      <Divider/>
      <Title level={3}>Profile</Title>
      <Row justify={"space-between"}>
        <Col xs={24} sm={24} md={24} lg={6} xl={6} >
          <div className="avatar-uploader-container">
            {userData.avatar &&
              <img src={userData.avatar} alt="user profile" className="avatar-image" />}
            {!userData.avatar && <>
                <img src={userProfile} alt="user profile" className="avatar-image" />
                <Button
                  className="avatar-uploader-btn"
                  icon={<EditOutlined />}
                  shape="circle"
                  onClick={handleEditButtonClick}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </>
            }
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={18} xl={18}>
          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{prefix:"91"}}
          >
            <Form.Item label="Name">
              <Input disabled value={userData && userData.fullname}/>
            </Form.Item>
            <Form.Item label="Email">
              <Input disabled value={userData && userData.email}/>
            </Form.Item>
            <Form.Item label="Role">
              <Input disabled value={userData && userData.role}/>
            </Form.Item>
            <Form.Item 
              name="ethereumAddress"
              label="Ethereum Address" 
            >
              <div style={{ display: "flex", gap: "8px" }}>
                <Input readOnly disabled={userData.ethereumAddress} value={userData && userData.ethereumAddress}/>
                <Button disabled={userData.ethereumAddress} size="large" type="primary" icon={<PlusOutlined/>} onClick={createWallet}>Create Wallet</Button>
              </div>
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                {
                  required: true,
                  message: 'Please input your phone number!',
                },
              ]}
            >
              <Input
                addonBefore={prefixSelector}
                disabled={userData.phoneNumber}
                defaultValue={userData.phoneNumber}
                style={{
                  width: '100%',
                }}
              />
            </Form.Item>
            <Form.Item
              name="country" 
              label="Country"
              rules={[
                {
                  required: true,
                  message: 'Please input your phone number!',
                },
              ]}
            >
              <Select
                disabled={userData.country}
                defaultValue={userData.country}
                allowClear
                options={[
                  {
                    value: 'India',
                    label: 'India',
                  },
                  {
                    value: 'USA',
                    label: 'USA',
                  },
                ]}
              />
            </Form.Item>
            <Form.Item>
              <Button disabled={userData.phoneNumber && userData.country} type="primary" htmlType="submit">Submit</Button>
            </Form.Item>

          </Form>
        </Col>
      </Row>
    </>
  )
}

export default Hero