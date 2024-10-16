import { EyeOutlined } from "@ant-design/icons";
import { Divider, Table, Typography } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCertificates } from "../../../redux/actions/admin";
import { convertToLocalTime } from "../../../utils/convertToLocalTime";

const { Title } = Typography;

const AdminHero = () => {
  const dispatch = useDispatch();
  const { isGetAllCertificatesLoading, allCertificates } = useSelector(
    (state) => state.admin
  );
  console.log("issuedCertificates :", allCertificates);
  useEffect(() => {
    dispatch(getAllCertificates());
  }, [dispatch]);

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
            href={`${import.meta.env.VITE_NETWORK_EXPLORER_BASE_URL}/tx/${
              item.mintTxHash
            }`}
            target="_blank"
          >
            {item.mintTxHash.slice(0, 6)}...{item.mintTxHash.slice(-4)}
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
              item.attestationUUID
            }`}
            target="_blank"
          >
            {item.attestationUUID.slice(0, 6)}...{item.attestationUUID.slice(-4)}
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
  return (
    <>
      <Title>Certificates Issued</Title>
      <Divider />
      <Table
        loading={isGetAllCertificatesLoading}
        dataSource={allCertificates && allCertificates.certificates}
        columns={columns}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default AdminHero;
