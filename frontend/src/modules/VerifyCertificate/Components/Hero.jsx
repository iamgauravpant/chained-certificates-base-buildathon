import {
  Button,
  Col,
  Divider,
  Row,
  Typography,
  message,
  Upload,
  Spin,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import ManualVerificationModal from "./ManualVerificationModal";
import { verifyCertificate } from "../../../redux/actions/user";
import verify_certificate from "../../../assets/verify_certificate.svg";
import { useDispatch, useSelector } from "react-redux";
import { calculateHash } from "../../../utils/calculateHash";
import { openNotificationWithIcon } from "../../../utils/openNotificationWithIcon";
import "./Hero.scss";
import { resetVerifyCertificateStates } from "../../../redux/slices/userSlice";

const { Dragger } = Upload;
const { Title } = Typography;

const Hero = () => {
  const [fileList, setFileList] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keywordsAsJSON, setKeywordsAsJSON] = useState({});
  const [uploadedFileHash, setUploadedFileHash] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const {verifyCertificateData, isVerifyCertificateLoading } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    dispatch(resetVerifyCertificateStates());
  };

  const props = {
    accept: ".pdf",
    multiple: false,
    fileList,
    onRemove: (file) => {
      const newFileList = fileList.filter((f) => f.uid !== file.uid);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isPdf = file.type === "application/pdf";
      if (!isPdf) {
        message.error("You can only upload PDF files!");
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false;
    },
    showUploadList: {
      showRemoveIcon: true,
    },
  };

  const verifyPDF = async () => {
    if (fileList.length === 0) {
      message.error("Please upload a PDF file first!");
      return;
    }

    try {
      setIsVerifying(true);
      const file = fileList[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const title = pdfDoc.getTitle();
      const author = pdfDoc.getAuthor();
      const subject = pdfDoc.getSubject();
      const keywords = pdfDoc.getKeywords();

      setMetadata({
        title,
        author,
        subject,
        keywords,
      });

      const keywordsJSON = JSON.parse(keywords);
      setKeywordsAsJSON(keywordsJSON);

      const uploadedHash = await calculateHash(arrayBuffer);
      setUploadedFileHash(uploadedHash);
    } catch (error) {
      openNotificationWithIcon("error", "Failed to verify PDF.");
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (keywordsAsJSON && Object.keys(keywordsAsJSON).length > 0) {
      dispatch(verifyCertificate(keywordsAsJSON));
    }
  }, [keywordsAsJSON, dispatch]);

  useEffect(() => {
    if (verifyCertificateData.certificatePDFHash) {
      setIsVerifying(false);
      if (uploadedFileHash) {
        if (uploadedFileHash === verifyCertificateData.certificatePDFHash) {
          openNotificationWithIcon(
            "success",
            "Certificate verified successfully"
          );
          setIsVerified(true);
        } else {
          openNotificationWithIcon("error", "Certificate isn't valid");
        }
      }
    }
  }, [verifyCertificateData, uploadedFileHash]);

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
    <>
      <div style={{ position: "relative", minHeight: "400px", width: "100%" }}>
        {/* Spinner container - positioned inside Content */}
        {isVerifying && (
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
        )}
        {!isVerifying && !isVerified && (
          <Row style={{ width: "100%" }}>
            <Col span={12}>
              <img
                src={verify_certificate}
                width={"100%"}
                height={"400px"}
                alt="verify-certificate"
              />
            </Col>
            <Col span={12}>
              <Title>Verify certificate</Title>
              <Title level={4}>
                Upload any certificate created on our platform to automatically
                verify its authenticity
              </Title>
              <div>
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single file upload.
                  </p>
                </Dragger>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "1rem",
                  }}
                >
                  <Button
                    loading={isVerifyCertificateLoading}
                    size="large"
                    type="primary"
                    onClick={verifyPDF}
                  >
                    Verify
                  </Button>
                </div>

                <Divider>OR</Divider>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "1rem",
                  }}
                >
                  <Button onClick={showModal} size="large" type="primary">
                    Click here for Manual Verification
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        )}
        {isVerified && metadata && (
          <div className="certificate-details">
            <Title level={3} className="certificate-title">
              Certificate Details
            </Title>

            <Row gutter={[16, 16]} className="certificate-row">
              <Col span={8} className="certificate-label">
                <Title level={5}>Title:</Title>
              </Col>
              <Col span={16} className="certificate-value">
                {metadata.title || "N/A"}
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="certificate-row">
              <Col span={8} className="certificate-label">
                <Title level={5}>Author:</Title>
              </Col>
              <Col span={16} className="certificate-value">
                {metadata.author || "N/A"}
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="certificate-row">
              <Col span={8} className="certificate-label">
                <Title level={5}>Subject:</Title>
              </Col>
              <Col span={16} className="certificate-value">
                {metadata.subject || "N/A"}
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="certificate-row">
              <Col span={8} className="certificate-label">
                <Title level={5}>Certificate Issuer:</Title>
              </Col>
              <Col span={16} className="certificate-value">
                {keywordsAsJSON.IssuerAddress || "N/A"}
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="certificate-row">
              <Col span={8} className="certificate-label">
                <Title level={5}>Collection Address:</Title>
              </Col>
              <Col span={16} className="certificate-value">
                {keywordsAsJSON.CollectionAddress || "N/A"}
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="certificate-row">
              <Col span={8} className="certificate-label">
                <Title level={5}>TokenId:</Title>
              </Col>
              <Col span={16} className="certificate-value">
                {keywordsAsJSON.TokenId || "N/A"}
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
        )}
      </div>

      {isModalOpen && (
        <ManualVerificationModal
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
        />
      )}
    </>
  );
};

export default Hero;

// {/* Display extracted metadata if available */}
// {metadata && (
//   <div style={{ marginTop: "20px" }}>
//     <h3>Extracted Metadata</h3>
//     <p><strong>Title:</strong> {metadata.title || "N/A"}</p>
//     <p><strong>Author:</strong> {metadata.author || "N/A"}</p>
//     <p><strong>Subject:</strong> {metadata.subject || "N/A"}</p>
//     <p><strong>Keywords:</strong> {metadata.keywords || "N/A"}</p>
//   </div>
// )}
