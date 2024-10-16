import { Divider, Table, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCertificates } from "../../../redux/actions/certificateIssuer";
import { EyeOutlined, LinkOutlined } from "@ant-design/icons";
import CertificatePDFModal from "./CertificatePDFModal";
import { convertToLocalTime } from "../../../utils/convertToLocalTime";
const { Title } = Typography;

const CertificateIssuerHero = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState("");
  const showModal = (url) => {
    setIsModalOpen(true);
    setUrl(url);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { isGetCertificatesLoading, certificates } = useSelector(
    (state) => state.certificateIssuer
  );
  console.log("certificates array logged :", certificates);
  const showCertificatePDFModal = (item) => {
    console.log("item.ipfsDetails.IpfsHash :", item.ipfsDetails.IpfsHash);
    showModal(item.ipfsDetails.IpfsHash);
  };
  const columns = [
    {
      title: "Certificate Id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, item) => convertToLocalTime(item.createdAt)
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (_, item) => convertToLocalTime(item.updatedAt)
    },
    {
      title: "Collection Id",
      dataIndex: "collectionId",
      key: "collectionId",
    },
    {
      title: "Txn Hash",
      dataIndex: "mintTxHash",
      key: "mintTxHash",
      render: (_, item) => {
        return (
          <a
            href={item.mintTxHash ? `${import.meta.env.VITE_NETWORK_EXPLORER_BASE_URL}/tx/${
              item.mintTxHash
            }`:""}
            target={item.mintTxHash ? "_blank":"_self"}            
          >
            { item.mintTxHash ?  item.mintTxHash.slice(0, 6)+"..."+item.mintTxHash.slice(-4):"-"}
          </a>
        );
      },
    },
    {
      title: "Attestation",
      dataIndex: "attestationUUID",
      key: "attestationUUID",
      render: (_, item) => {
        return (
          <a
            href={`${import.meta.env.VITE_ATTESTATION_EXPLORER_BASE_URL}/attestation/view/${
              item.attestationUUID && item.attestationUUID
            }`}
            target="_blank"
          >
            {item.attestationUUID ? item.attestationUUID.slice(0, 6)+"..."+item.attestationUUID.slice(-4):"-"}
          </a>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, item) => {
        return (
          <EyeOutlined
            style={{ color: "blue" }}
            onClick={() =>
              window.open(
                `https://beige-jittery-felidae-359.mypinata.cloud/ipfs/${item.ipfsDetails.IpfsHash}`
              )
            }
          />
        );
      },
    },
  ];
  useEffect(() => {
    dispatch(getCertificates());
  }, [dispatch]);
  return (
    <>
      <Title>Certificates Created</Title>
      <Divider />
      <Table
        loading={isGetCertificatesLoading}
        dataSource={certificates}
        columns={columns}
        rowKey={(row) => row._id}
        scroll={{ x: "max-content" }}
      />
      {isModalOpen && (
        <CertificatePDFModal
          url={url}
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
        />
      )}
    </>
  );
};

export default CertificateIssuerHero;
