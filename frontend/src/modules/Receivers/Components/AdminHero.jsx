import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCertificateReceivers } from "../../../redux/actions/admin";
import { Divider, Table, Typography } from "antd";
const { Title } = Typography;
const AdminHero = () => {
  const dispatch = useDispatch();
  const { certificateReceivers, isGetAllCertificateReceiversLoading } =
    useSelector((state) => state.admin);
  useEffect(() => {
    dispatch(getAllCertificateReceivers());
  }, [dispatch]);
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
  return (
    <>
      <Title>Certificate Receivers</Title>
      <Divider />
      <Table
        loading={isGetAllCertificateReceiversLoading}
        dataSource={certificateReceivers}
        columns={columns}
        rowKey={(row) => row._id}
        scroll={{ x: "max-content" }}
      />
    </>
  );
};

export default AdminHero;
