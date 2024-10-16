import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../../redux/actions/user";
import { useEffect } from "react";
import { resetResetPasswordPageStates } from "../../../redux/slices/userSlice";
const { Title } = Typography;

const Hero = () => {
  const { userId, token } = useParams();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isResetPasswordLoading,isResetPasswordSuccess} = useSelector(state => state.user);
  
  console.log("userId :", userId);
  console.log("token :", token);
  const validatePassword = (_, value) => {
    if (!value || form.getFieldValue("password") === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("The two passwords do not match!"));
  };
  const onFinish = (values) => {
    console.log("Success:", values);
    const data = { newPassword: values.password, userId, token };
    dispatch(resetPassword(data));
    
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  
  useEffect(() => {
    if (isResetPasswordSuccess) {
      setTimeout(() => {
        form.resetFields();
        navigate('/login', { replace: true });
        dispatch(resetResetPasswordPageStates());
      }, 500);
    }
  }, [isResetPasswordSuccess, navigate, dispatch, form]);

  return (
    <div
      style={{
        backgroundColor: "#d1d1d1",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <Title level={2}>Reset Password</Title>
      <Form
        form={form}
        name="reset_password_form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
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

        <Form.Item
          name="confirmpassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
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
        <Form.Item
          wrapperCol={{
            offset: 0,
            span: 24,
          }}
        >
          <Button loading={isResetPasswordLoading} style={{width:"100%"}} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Hero;
