import { Button, Form, Input, Modal, Select } from "antd";

// eslint-disable-next-line react/prop-types
const ManualVerificationModal = ({ isModalOpen, handleCancel }) => {
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleChange = (value) => {
    console.log(`Selected: ${value}`);
  };

  const networkOptions = [
    { value: "base-sepolia", label: "Base Sepolia" },
    { value: "polygon-amoy", label: "Polygon Amoy" },
    { value: "base-mainnet", label: "Base Mainnet" },
    { value: "polygon-mainnet", label: "Polygon Mainnet" }
  ]

  return (
    <Modal
      footer={false}
      maskClosable={false}
      title="Manual Verification of Certificate"
      open={isModalOpen}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        name="basic-form"
        layout="vertical"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Blockchain Network"
          name="network"
          rules={[{ required: true, message: 'Please select blockchain network!' }]}
        >
          <Select showSearch placeholder="Select Blockchain Network" onChange={handleChange} options={networkOptions} />
        </Form.Item>
        <Form.Item
        label="Collection Address"
        name="collection_address"
        rules={[
            {
            required: true,
            message: 'Please input collection address!',
            },
        ]}
        >
            <Input placeholder="Enter Certificate Collection Address Here"/>
        </Form.Item>
        <Form.Item
        label="Token Id"
        name="token_id"
        rules={[
            {
            required: true,
            message: 'Please input token id!',
            },
        ]}
        >
            <Input placeholder="Enter Certificate's Unique Token Id Here"/>
        </Form.Item>

        <Form.Item wrapperCol={{span:24}}>
          <Button style={{width:"100%"}} type="primary" htmlType="submit">
            Verify
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ManualVerificationModal;
