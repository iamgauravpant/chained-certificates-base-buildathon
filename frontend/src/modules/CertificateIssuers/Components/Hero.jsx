import { useDispatch, useSelector } from "react-redux";
import { Divider, Table, Typography } from "antd";
import { useEffect } from "react";
import { getAllCertificateIssuers } from "../../../redux/actions/admin";
import { convertToLocalTime } from "../../../utils/convertToLocalTime";
const { Title } = Typography;
const Hero = () => {
  const dispatch = useDispatch();
  const { certificateIssuers, isGetAllCertificateIssuersLoading } = useSelector(
    (state) => state.admin
  );
  useEffect(() => {
    dispatch(getAllCertificateIssuers());
  }, [dispatch]);
  const columns = [
    {
      title: "Issuer Id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Contact Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Ethereum Address",
      dataIndex: "ethereumAddress",
      key: "ethereumAddress",
      render: (_, item) => {
        return (
          <a
            href={`${import.meta.env.VITE_NETWORK_EXPLORER_BASE_URL}/address/${
              item.ethereumAddress
            }`}
            target="_blank"
          >
            {item.ethereumAddress.slice(0, 6)}...
            {item.ethereumAddress.slice(-4)}
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

  return (
    <div>
      <Title>Certificate Issuers</Title>
      <Divider />
      <Table
        loading={isGetAllCertificateIssuersLoading}
        dataSource={certificateIssuers}
        columns={columns}
        rowKey={(row) => row._id}
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Hero;
