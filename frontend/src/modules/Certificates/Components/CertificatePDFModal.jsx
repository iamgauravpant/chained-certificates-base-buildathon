import { Modal } from "antd"
import { Document } from 'react-pdf';


// eslint-disable-next-line react/prop-types
const CertificatePDFModal = ({url,isModalOpen,handleCancel}) => {
  console.log("url :",url);
  const fullUrl = `${import.meta.env.VITE_PINATA_GATEWAY_URL}${url}`
  console.log("fullUrl ",fullUrl);
  return (
    <Modal title="View Certificate" open={isModalOpen} onCancel={handleCancel} footer={false} >
      <Document
        file={fullUrl}
        loading="Please Wait..."
      />
    </Modal>
  )
}

export default CertificatePDFModal