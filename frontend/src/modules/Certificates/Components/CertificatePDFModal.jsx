import { Modal } from "antd"
import { Document } from 'react-pdf';


// eslint-disable-next-line react/prop-types
const CertificatePDFModal = ({url,isModalOpen,handleCancel}) => {
  console.log("url :",url);
  const fullUrl = `https://beige-jittery-felidae-359.mypinata.cloud/ipfs/${url}`
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