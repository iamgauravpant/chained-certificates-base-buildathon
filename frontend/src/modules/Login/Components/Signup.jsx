import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Space, Typography } from 'antd';
import "./Login.css";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../../redux/actions/user';
const {Title} = Typography;
const {Option} = Select;
// eslint-disable-next-line react/prop-types
const Signup = ({setOption}) => {
  const {isRegisterLoading} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState('horizontal');
  const onFinish = (values) => {
    console.log('Success:', values);
    dispatch(register(values));
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleLoginClick = (e) => {
    e.preventDefault();
    setOption("login");
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

  const validatePassword = (_, value) => {
    if (!value || form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('The two passwords do not match!'));
  };


  return (
    <div style={{backgroundColor:"#d1d1d1",padding:"20px",borderRadius:"10px"}} >
      <Title level={2}>Signup</Title>
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
          name="fullname"
          rules={[
            {
              required: true,
              message: 'Please input your Name!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Name" />
        </Form.Item>

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
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="role"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Role"
            allowClear
          >
            <Option value="certificateIssuer">Certificate Issuer</Option>
            <Option value="user">User</Option>
          </Select>
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
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          name="confirmpassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            {
            validator: validatePassword,
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Confirm Password"
          />
        </Form.Item>

        <Form.Item {...buttonItemLayout}>
          <Space align='center' direction='horizontal' >
            <Button loading={isRegisterLoading} type="primary" htmlType="submit" className="login-form-button">
              Sign Up
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div onClick={handleLoginClick}>
        Or <a href="">Login Now!</a>
      </div>

    </div>
  )
}

export default Signup