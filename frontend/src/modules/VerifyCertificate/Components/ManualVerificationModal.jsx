import { Button, Col, Form, Input, Modal, Row, Select, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { verifyCertificate } from "../../../redux/actions/user";
import {Typography} from "antd";
import { useState } from "react";
const {Title} = Typography;

// eslint-disable-next-line react/prop-types
const ManualVerificationModal = ({ isModalOpen, handleCancel }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [data,setData] = useState({});
  const {verifyCertificateData, isVerifyCertificateLoading } = useSelector(
    (state) => state.user
  );
  const onFinish = (values) => {
    console.log("Success:", values);
    const data = {
      IssuerAddress : values.issuer_address,
      TokenId : values.token_id,
      CollectionAddress : values.collection_address
    }
    setData(data);
    dispatch(verifyCertificate(data));
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

  const txnPrefixes = [
    { value: "https://sepolia.basescan.org/tx/", label: "Base Sepolia" },
    { value: "https://amoy.polygonscan.com/tx/", label: "Polygon Amoy" },
    { value: "https://basescan.org/tx/", label: "Base Mainnet" },
    { value: "https://polygonscan.com/tx/", label: "Polygon Mainnet" }
  ]

  const attestationPrefixes = [
    { value: "https://base-sepolia.easscan.org/attestation/view/", label: "Base Sepolia" },
    { value: "https://polygon-amoy.easscan.org/attestation/view/", label: "Polygon Amoy" },
    { value: "https://base.easscan.org/attestation/view/", label: "Base Mainnet" },
    { value: "https://polygon.easscan.org/attestation/view/", label: "Polygon Mainnet" }
  ]

  return (
    <Modal
      footer={false}
      maskClosable={false}
      title="Manual Verification of Certificate"
      open={isModalOpen}
      onCancel={handleCancel}
    >
    {
      isVerifyCertificateLoading  &&
      <div
            style={{
              position: "absolute", // Position relative to the parent container
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)", // Light overlay effect
              zIndex: 1000,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Spin size="large" />
              <p>Verifying Authenticity of PDF...</p>
            </div>
          </div>
    } 
    {Object.keys(verifyCertificateData).length === 0 &&
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
          initialValue={"Base Sepolia"}
          rules={[{ required: true, message: 'Please select blockchain network!' }]}
        >
          <Select disabled showSearch placeholder="Select Blockchain Network" onChange={handleChange} options={networkOptions} />
        </Form.Item>
        <Form.Item
        label="Certificate Issuer Address"
        name="issuer_address"
        rules={[
            {
            required: true,
            message: 'Please input certificate issuer address!',
            },
        ]}
        >
            <Input placeholder="Enter Certificate Issuer Address Here"/>
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
          <Button loading={isVerifyCertificateLoading} style={{width:"100%"}} type="primary" htmlType="submit">
            Verify
          </Button>
        </Form.Item>
      </Form>
      }
      {!isVerifyCertificateLoading && verifyCertificateData && Object.keys(verifyCertificateData).length > 0 &&
      <div className="certificate-details">
            <Title level={3} className="certificate-title">
              Certificate Details
            </Title>
            <Row gutter={[16, 16]} className="certificate-row">
              <Col span={8} className="certificate-label">
                <Title level={5}>Certificate Issuer:</Title>
              </Col>
              <Col span={16} className="certificate-value">
                {data.IssuerAddress}
              </Col>
            </Row>
            
            <Row gutter={[16, 16]} className="certificate-row">
              <Col span={8} className="certificate-label">
                <Title level={5}>Author:</Title>
              </Col>
              <Col span={16} className="certificate-value">
                ChainedCertificates
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="certificate-row">
              <Col span={8} className="certificate-label">
                <Title level={5}>Collection Address:</Title>
              </Col>
              <Col span={16} className="certificate-value">
                {data.CollectionAddress}
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="certificate-row">
              <Col span={8} className="certificate-label">
                <Title level={5}>TokenId:</Title>
              </Col>
              <Col span={16} className="certificate-value">
                {data.TokenId}
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="certificate-row">
              <Col span={8} className="certificate-label">
                <Title level={5}>Blockchain Network:</Title>
              </Col>
              <Col span={16} className="certificate-value">
                Base Sepolia
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="certificate-row">
              <Col span={8} className="certificate-label">
                <Title level={5}>Certificate URI:</Title>
              </Col>
              <Col span={16} className="certificate-value">
                <a href={verifyCertificateData.tokenURI} target="_blank">
                {verifyCertificateData.tokenURI}
                </a>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="certificate-row">
              <Col span={8} className="certificate-label">
                <Title level={5}>Mint Proof:</Title>
              </Col>
              <Col span={16} className="certificate-value">
                <a href={txnPrefixes[0].value+verifyCertificateData.mintTxHash} target="_blank">
                {verifyCertificateData.mintTxHash}
                </a>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="certificate-row">
              <Col span={8} className="certificate-label">
                <Title level={5}>Attestation Proof:</Title>
              </Col>
              <Col span={16} className="certificate-value">
                <a href={attestationPrefixes[0].value+verifyCertificateData.attestationUUID} target="_blank">
                {verifyCertificateData.attestationUUID}
                </a>
              </Col>
            </Row>

      </div>
      }

    </Modal>
  );
};

export default ManualVerificationModal;
