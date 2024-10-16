import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const ViewCertificatePDFMetadata = () => {
  const [file, setFile] = useState(null); // Store uploaded file
  const [metadata, setMetadata] = useState(null);

  // Function to handle the PDF verification and extract metadata
  const verifyPDF = async () => {
    if (!file) {
      message.error("Please upload a PDF file first!");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Extract metadata
      const title = pdfDoc.getTitle();
      const author = pdfDoc.getAuthor();
      const subject = pdfDoc.getSubject();
      const keywords = pdfDoc.getKeywords();

      // Set metadata state
      setMetadata({
        title,
        author,
        subject,
        keywords,
      });
    } catch (error) {
      message.error("Failed to read PDF metadata");
      console.error("Error reading PDF:", error);
    }
  };

  // AntD Dragger component properties
  const uploadProps = {
    beforeUpload: (file) => {
      const isPdf = file.type === "application/pdf";
      if (!isPdf) {
        message.error("You can only upload PDF files!");
      }
      return isPdf || Upload.LIST_IGNORE;
    },
    customRequest: ({ file, onSuccess }) => {
      setFile(file); // Store the file for later verification
      onSuccess("ok"); // Simulate a successful upload
      message.success("PDF file uploaded successfully!");
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>PDF Metadata Viewer</h2>

      {/* Dragger PDF Upload */}
      <Dragger {...uploadProps} showUploadList={false}>
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">Support for a single PDF file upload.</p>
      </Dragger>

      {/* Verify Button */}
      <Button
        type="primary"
        style={{ marginTop: "20px" }}
        onClick={verifyPDF}
        disabled={!file} // Disable button if no file is uploaded
      >
        Verify and Extract Metadata
      </Button>

      {/* Display Metadata */}
      {metadata && (
        <div style={{ marginTop: "20px" }}>
          <h3>Metadata</h3>
          <p>
            <strong>Title:</strong> {metadata.title || "N/A"}
          </p>
          <p>
            <strong>Author:</strong> {metadata.author || "N/A"}
          </p>
          <p>
            <strong>Subject:</strong> {metadata.subject || "N/A"}
          </p>
          <p>
            <strong>Keywords:</strong> {metadata.keywords || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewCertificatePDFMetadata;
