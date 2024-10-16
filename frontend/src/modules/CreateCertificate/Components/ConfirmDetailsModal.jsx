import { Button, Col, Modal, Row, Steps, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  attestCertificate,
  createCertificate,
  createCertificateReceiver,
  mintAndAttestCertificate,
  uploadCertificateToIPFS,
} from "../../../redux/actions/certificateIssuer";
import ReactToPrint from "react-to-print";
import {
  InboxOutlined,
  PrinterOutlined,
  RocketOutlined,
  SignatureOutlined,
} from "@ant-design/icons";
import {
  resetCreateCertificateReceiverSuccessState,
  resetCreateCertificateSuccessState,
  resetMintSuccessState,
  resetUploadCertificateToIPFS,
  setCurrentViewReviewCertificateModal,
} from "../../../redux/slices/certificateIssuerSlice";
import { useEffect, useState } from "react";
import { message, Upload } from "antd";
import { PDFDocument } from "pdf-lib";
const { Dragger } = Upload;

const { Title } = Typography;

// eslint-disable-next-line react/prop-types
const ConfirmDetailsModal = ({ componentRef, isModalOpen, handleCancel }) => {
  const [file, setFile] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const {
    isMintAndAttestCertificateLoading,
    isMintAndAttestCertificateSuccess,
    isUploadCertificateToIPFSLoading,
    isUploadCertificateToIPFSSuccess,
    createdCertificate,
    isCreateCertificateReceiverSuccess,
    currentViewReviewCertificateModal,
    deployedCertificateCollection,
    certReceiverName,
    certReceiverEmail,
    certReceiverAddress,
    isCreateCertificateReceiverLoading,
    selectedCertificateReceiverType,
    certificateReceiverId,
    isCreateCertificateSuccess,
    isAttestCertificateLoading,
    isAttestCertificateSuccess
  } = useSelector((state) => state.certificateIssuer);
  console.log("createdCertificate :",createdCertificate);
  console.log(
    "currentViewReviewCertificateModal :",
    currentViewReviewCertificateModal
  );
  const dispatch = useDispatch();
  const onChange = (value) => {
    console.log("onChange:", value);
    dispatch(setCurrentViewReviewCertificateModal(value));
  };
  const generateCertificateHandler = async () => {
    selectedCertificateReceiverType === "new" &&
      dispatch(
        createCertificateReceiver({
          collectionId: deployedCertificateCollection._id,
          certReceiverName,
          certReceiverEmail,
          certReceiverAddress,
        })
      );
    selectedCertificateReceiverType === "existing" &&
      dispatch(
        createCertificate({
          receiverId: certificateReceiverId,
          collectionId: deployedCertificateCollection._id,
        })
      );
  };

  const signAttestation = async () => {
    dispatch(attestCertificate({certificateId:createdCertificate._id}))
  }

  const first = (
    <>
      <div
        style={{
          border: "2px dashed black",
          marginBottom: "1rem",
          padding: "2px",
        }}
      >
        <Row>
          <Col
            style={{
              background: "#d4e4ff",
              borderBottom: "2px solid white",
              borderRight: "2px solid white",
            }}
            span={12}
          >
            <Title level={5}>Certificate Collection</Title>
          </Col>
          <Col
            style={{ background: "#d4e4ff", borderBottom: "2px solid white" }}
            span={12}
          >
            <Title level={5}>
              {deployedCertificateCollection.collection_name}
            </Title>
          </Col>
        </Row>
        <Row>
          <Col
            style={{
              background: "#d4e4ff",
              borderBottom: "2px solid white",
              borderRight: "2px solid white",
            }}
            span={12}
          >
            <Title level={5}>Certificate Receiver Name</Title>
          </Col>
          <Col
            style={{ background: "#d4e4ff", borderBottom: "2px solid white" }}
            span={12}
          >
            <Title level={5}>{certReceiverName}</Title>
          </Col>
        </Row>
        <Row>
          <Col
            style={{
              background: "#d4e4ff",
              borderBottom: "2px solid white",
              borderRight: "2px solid white",
            }}
            span={12}
          >
            <Title level={5}>Certificate Receiver Email</Title>
          </Col>
          <Col
            style={{ background: "#d4e4ff", borderBottom: "2px solid white" }}
            span={12}
          >
            <Title level={5}>{certReceiverEmail}</Title>
          </Col>
        </Row>
        <Row>
          <Col
            style={{
              background: "#d4e4ff",
              borderBottom: "2px solid white",
              borderRight: "2px solid white",
            }}
            span={12}
          >
            <Title level={5}>Certificate Receiver Address</Title>
          </Col>
          <Col
            style={{ background: "#d4e4ff", borderBottom: "2px solid white" }}
            span={12}
          >
            <Title level={5}>
              {certReceiverAddress ? certReceiverAddress : "-"}
            </Title>
          </Col>
        </Row>
      </div>
      <div
        style={{ display: "flex", justifyContent: "end", alignItems: "center" }}
      >
        {currentViewReviewCertificateModal === 0 && (
          <Button
            size="large"
            type="primary"
            onClick={generateCertificateHandler}
            loading={isCreateCertificateReceiverLoading}
          >
            Generate Certificate
          </Button>
        )}
      </div>
    </>
  );
  const props = {
    name: "file",
    multiple: false,
    action: "https://api.pinata.cloud/pinning/pinFileToIPFS",
    beforeUpload: (file) => {
      setFile(file);
      return false; // Prevents automatic upload
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleUpload = async () => {
    if (!file) {
      message.error("No file selected for upload");
      return;
    }

    try {
      // Load the existing PDF file
      const existingPdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const dateToday = new Date();
      // Add metadata to the PDF
      pdfDoc.setTitle(`${certReceiverName}'s Certificate`);
      pdfDoc.setAuthor("ChainedCertificates");
      pdfDoc.setSubject(`Issued by ${user.fullname} on ${dateToday}`);
      const jsonObject = {
        "IssuerAddress":user.ethereumAddress,
        "ReceiverAddress": certReceiverAddress,
        "TokenId":createdCertificate.tokenId,
        "CollectionAddress":deployedCertificateCollection.collectionAddress
      }
      const jsonString = JSON.stringify(jsonObject);

      pdfDoc.setKeywords([jsonString]);

      // Serialize the PDF to bytes (Uint8Array)
      const modifiedPdfBytes = await pdfDoc.save();

      // Create a Blob from the modified PDF
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
        type: "application/pdf",
      });

      // Create FormData to upload to IPFS
      const formData = new FormData();
      formData.append("file", modifiedPdfBlob, file.name); // Use the same file name or provide a custom one

      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      // Dispatch the upload action with the modified PDF
      dispatch(
        uploadCertificateToIPFS({
          formData: formData,
          certificateId: createdCertificate._id,
        })
      );
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      message.error("Error while uploading the certificate to IPFS");
    }
  };

  const handleCertificateNFTMintAndAttest = async () => {
    dispatch(
      mintAndAttestCertificate({ certificateId: createdCertificate._id })
    );
  };

  const second = (
    <>
      <Title level={4}>Mint Certificate NFT</Title>
      <Title level={5}>
      Mint Certificate NFT to make it immutable.
      </Title>

      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <Button
          size="large"
          type="primary"
          onClick={handleCertificateNFTMintAndAttest}
          icon={<RocketOutlined size={"large"} />}
          loading={isMintAndAttestCertificateLoading}
        >
          Mint
        </Button>
      </div>
    </>
  );

  const third = (
    <>
      <Title level={4}>Print PDF draft, then upload it to IPFS</Title>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        {/* eslint-disable-next-line react/prop-types */}
        {currentViewReviewCertificateModal === 2 && (
          <ReactToPrint
            trigger={() => (
              <Button size="large" type="primary" icon={<PrinterOutlined />}>
                Print
              </Button>
            )}
            content={() => componentRef.current}
          />
        )}
      </div>

      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag Certificate PDF file to this area to upload
        </p>
        <p className="ant-upload-hint">Support for a single upload only.</p>
      </Dragger>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <Button
          size="large"
          type="primary"
          onClick={handleUpload}
          loading={isUploadCertificateToIPFSLoading}
        >
          Upload to IPFS
        </Button>
      </div>
    </>
  );

  const fourth = (
    <>
      <Title level={4}>Sign an attestation</Title>
      <Title level={5}>Signing an attestation makes authentic relationship between certificate issuer and certificate receiver</Title>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <Button loading={isAttestCertificateLoading} icon={<SignatureOutlined />} type="primary" size="large" onClick={signAttestation}>Sign</Button>
      </div>
    </>
  )
  useEffect(() => {
    const callIt = () => {
      dispatch(setCurrentViewReviewCertificateModal(1));
      dispatch(resetCreateCertificateReceiverSuccessState());
    };
    selectedCertificateReceiverType === "new" && isCreateCertificateReceiverSuccess && callIt();
  }, [dispatch, isCreateCertificateReceiverSuccess,selectedCertificateReceiverType]);

  useEffect(() => {
    const callIt = () => {
      dispatch(setCurrentViewReviewCertificateModal(1));
      dispatch(resetCreateCertificateSuccessState());
    };
    selectedCertificateReceiverType === "existing" && isCreateCertificateSuccess && callIt();
  }, [dispatch, isCreateCertificateSuccess,selectedCertificateReceiverType]);
  useEffect(() => {
    const callIt = () => {
      dispatch(setCurrentViewReviewCertificateModal(3));
      dispatch(resetUploadCertificateToIPFS());
    };
    isUploadCertificateToIPFSSuccess && callIt();
  }, [dispatch, isUploadCertificateToIPFSSuccess]);

  useEffect(() => {
    const callIt = () => {
      dispatch(setCurrentViewReviewCertificateModal(2));
      dispatch(resetMintSuccessState());
    };
    isMintAndAttestCertificateSuccess && callIt();

  }, [isMintAndAttestCertificateSuccess,dispatch]);

  useEffect(() => {
    isAttestCertificateSuccess &&
      setTimeout(() => {
        window.location.reload();
      }, 1000);
  }, [isAttestCertificateSuccess]);

  return (
    <Modal
      width={700}
      title="Review and Confirm Details"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={false}
      maskClosable={false}
    >
      <Steps
        current={currentViewReviewCertificateModal}
        onChange={onChange}
        progressDot
        items={[
          {
            title: "Review Details",
          },
          {
            title: "Mint Certificate NFT",
          },
          {
            title: "Upload Certificate PDF",
          },
          {
            title:"Sign Attestation"
          }
        ]}
      />
      {currentViewReviewCertificateModal === 0 && first}
      {currentViewReviewCertificateModal === 1 && second}
      {currentViewReviewCertificateModal === 2 && third}
      {currentViewReviewCertificateModal===3 && fourth}
    </Modal>
  );
};

export default ConfirmDetailsModal;
