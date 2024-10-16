import { Button, Form, Input, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, sendForgotPasswordOTP } from "../../../redux/actions/user";

// eslint-disable-next-line react/prop-types
const ForgotPasswordModal = ({form2, isModalOpen, handleCancel }) => {
  const dispatch = useDispatch();
  const {isForgotPasswordLoading,isForgotPasswordSuccess,isForgotPasswordOTPLoading,isForgotPasswordOTPSuccess,forgotPasswordModalUserIdentifier} = useSelector(state => state.user);
  const onFinish = (values) => {
    console.log("Success:", values);
    !isForgotPasswordSuccess && !isForgotPasswordOTPSuccess && dispatch(forgotPassword({identifier:values.identifier}));
    isForgotPasswordSuccess && !isForgotPasswordOTPSuccess && dispatch(sendForgotPasswordOTP({otp:values.otp,identifier:forgotPasswordModalUserIdentifier}))
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onChange = (text) => {
    console.log('onChange:', text);
  };
  const sharedProps = {
    onChange,
  };

  return (
    <Modal
      title="Forgot Password?"
      maskClosable={false}
      footer={false}
      open={isModalOpen}
      onCancel={handleCancel}
    >
      <Form
        form={form2}
        name="forgot_password_form"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        {!isForgotPasswordSuccess && <Form.Item
          label="Enter registered username / email / phone number ( with country code )"
          name="identifier"
          rules={[
            {
              required: true,
              message: "Please input your registered username / email / phone number!",
            },
          ]}
        >
          <Input placeholder="Enter username / email / phone number" />
        </Form.Item>}
        {isForgotPasswordSuccess && <Form.Item
          label="Enter OTP"
          name="otp"
          rules={[
            {
              required: true,
              message: "Please input your otp!",
            },
          ]}
        >
          <Input.OTP length={6} {...sharedProps} placeholder="Enter OTP" />
        </Form.Item>
        }
        <Form.Item
          wrapperCol={{
            offset: 0,
            span: 24,
          }}
        >
          <Button loading={isForgotPasswordLoading || isForgotPasswordOTPLoading} style={{width:"100%"}} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ForgotPasswordModal;
