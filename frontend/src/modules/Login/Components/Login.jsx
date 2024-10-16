import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Space,
  Typography,
} from "antd";
import "./Login.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../redux/actions/user";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { resetForgotPasswordModalStates } from "../../../redux/slices/userSlice";
const { Title } = Typography;
// eslint-disable-next-line react/prop-types
const Login = ({ setOption }) => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();

  const dispatch = useDispatch();
  const { isLoginLoading, isForgotPasswordOTPSuccess } =
    useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLayout, setFormLayout] = useState("horizontal");
  const [isUsernameFilled, setIsUsernameFilled] = useState(false);
  const [isEmailFilled, setIsEmailFilled] = useState(false);

  const onFinish = (values) => {
    console.log("Success:", values);
    dispatch(login(values));
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    setOption("signup");
  };

  const buttonItemLayout =
    formLayout === "vertical"
      ? {
          wrapperCol: {
            span: 24,
            offset: 0,
          },
        }
      : null;
  const onReset = () => {
    form.resetFields();
    setIsUsernameFilled(false);
    setIsEmailFilled(false);
  };

  const handleUsernameChange = (e) => {
    setIsUsernameFilled(!!e.target.value);
    if (!e.target.value) setIsEmailFilled(false);
  };

  const handleEmailChange = (e) => {
    setIsEmailFilled(!!e.target.value);
    if (!e.target.value) setIsUsernameFilled(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    dispatch(resetForgotPasswordModalStates());
    form2.resetFields();
  };

  useEffect(() => {
    isForgotPasswordOTPSuccess && form2.resetFields();
    isForgotPasswordOTPSuccess && setIsModalOpen(false);
  }, [isForgotPasswordOTPSuccess, form2]);

  useEffect(() => {
    isForgotPasswordOTPSuccess && dispatch(resetForgotPasswordModalStates());
  }, [dispatch, isForgotPasswordOTPSuccess]);

  return (
    <>
      <div
        style={{
          backgroundColor: "#e8e8e8",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <Title level={2}>Login</Title>
        <Title level={5}>Login with your username or email</Title>
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
            name="username"
            rules={[
              {
                required: !isEmailFilled,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              onChange={handleUsernameChange}
              disabled={isEmailFilled}
            />
          </Form.Item>

          <Divider>OR</Divider>

          <Form.Item
            name="email"
            rules={[
              {
                required: !isUsernameFilled,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
              onChange={handleEmailChange}
              disabled={isUsernameFilled}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            {/* <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item> */}

            <a className="login-form-forgot" onClick={showModal}>
              Forgot password ?
            </a>
          </Form.Item>

          <Form.Item {...buttonItemLayout}>
            <Space align="center" direction="horizontal">
              <Button
                loading={isLoginLoading}
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
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
      {isModalOpen && (
        <ForgotPasswordModal
          form2={form2}
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
        />
      )}
    </>
  );
};

export default Login;
