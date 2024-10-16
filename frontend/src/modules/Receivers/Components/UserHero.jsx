import { Divider, Table, Typography } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCertificateReceivers } from "../../../redux/actions/certificateIssuer";
const { Title } = Typography;

const UserHero = () => {
  const dispatch = useDispatch();
  const { certificateReceivers, isGetCertificateReceiversLoading } =
    useSelector((state) => state.certificateIssuer);
  console.log("certificateReceivers :", certificateReceivers);
  const columns = [
    {
      title: "Receiver Id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "email",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Ethereum Address",
      dataIndex: "ethereumAddress",
      key: "ethereumAddress",
      render: (_, item) => {
        return item.ethereumAddress ? (
          <a
            href={`${import.meta.env.VITE_NETWORK_EXPLORER_BASE_URL}/address/${
              item.ethereumAddress
            }`}
            target="_blank"
          >
            {item.ethereumAddress.slice(0, 6)}...
            {item.ethereumAddress.slice(-4)}
          </a>
        ) : (
          "-"
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(getCertificateReceivers());
  }, [dispatch]);
  return (
    <>
      <Title>Certificate Receivers</Title>
      <Divider />
      <Table
        loading={isGetCertificateReceiversLoading}
        dataSource={certificateReceivers}
        columns={columns}
        rowKey={(row) => row._id}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default UserHero;
