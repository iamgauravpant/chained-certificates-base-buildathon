import { Divider, Table, Typography } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCertificateCollections } from "../../../redux/actions/certificateIssuer";
import { convertToLocalTime } from "../../../utils/convertToLocalTime";
const { Title } = Typography;

const UserHero = () => {
  const dispatch = useDispatch();
  const { isGetCertificateCollectionsLoading, certificateCollections } =
    useSelector((state) => state.certificateIssuer);
  console.log("certificateCollections :", certificateCollections);
  const columns = [
    {
      title: "Collection Id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Collection Name",
      dataIndex: "collection_name",
      key: "collection_name",
    },
    {
      title: "Collection Symbol",
      dataIndex: "collection_symbol",
      key: "collection_symbol",
    },
    {
      title: "Collection Address",
      dataIndex: "collectionAddress",
      key: "collectionAddress",
      render: (_, item) => {
        return (
          <a
            href={`${import.meta.env.VITE_NETWORK_EXPLORER_BASE_URL}/address/${
              item.collectionAddress
            }`}
            target="_blank"
          >
            {item.collectionAddress.slice(0, 6)}...
            {item.collectionAddress.slice(-4)}
          </a>
        );
      },
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
  ];
  useEffect(() => {
    dispatch(getCertificateCollections());
  }, [dispatch]);
  return (
    <div>
      <Title>Certificate Collections</Title>
      <Divider />
      <Table
        loading={isGetCertificateCollectionsLoading}
        dataSource={certificateCollections}
        columns={columns}
        rowKey={(row) => row._id}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default UserHero;
