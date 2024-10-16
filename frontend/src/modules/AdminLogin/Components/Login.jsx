import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Typography } from 'antd';
import "./Login.css";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../../redux/actions/admin';
const {Title} = Typography;
// eslint-disable-next-line react/prop-types
const Login = ({setOption}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {isLoginLoading,isLoginSuccess} = useSelector(state => state.admin);

  const [formLayout, setFormLayout] = useState('horizontal');
  const onFinish = (values) => {
    console.log('Success:', values);
    dispatch(login(values));
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleSignupClick = (e) => {
    e.preventDefault()
    setOption("signup");
  };
  
  const buttonItemLayout =
  formLayout === 'vertical'
  ? {
        wrapperCol: {
          span: 24,
          offset: 0,
        },
      }
  : null;
  const onReset = () => {
    form.resetFields();
  };

  return (
    <div style={{backgroundColor:"#e8e8e8",padding:"20px",borderRadius:"10px"}} >
      <Title level={2}>Admin Login</Title>
      <Title level={5}>Login with email and password</Title>
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >

      <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your Email!',
            },
          ]}
      >
        <Input prefix={<MailOutlined className="site-form-item-icon"/>} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <a className="login-form-forgot" href="">
        Forgot password ?
      </a>

      <Form.Item {...buttonItemLayout}>
        <Space align='center' direction='horizontal' >
        <Button loading={isLoginLoading} type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
        </Space>
      </Form.Item>
      </Form>
      <div onClick={handleSignupClick}>
          Or <a href="">register now!</a>
      </div>
    </div>
  )
}

export default Login