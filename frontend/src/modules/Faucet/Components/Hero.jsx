import { DollarOutlined } from "@ant-design/icons";
import { Button, Divider, Typography } from "antd";
import { useEffect, useState } from "react";
import { getLastFaucetRequestTime, getTransferEthAmount, sendTestnetFunds } from "../../../utils/web3functions";
const { Title } = Typography;
const Hero = () => {
  const [transferEthAmount,setTransferEthAmount] = useState(0);
  const [lastRequestTime,setLastRequestTime] = useState(0);
  const [receiptTxnHash,setReceiptTxnHash] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  
  const requestEthHandler = async() => {
    const ethRequestReceipt = user.ethereumAddress &&  await sendTestnetFunds(user.ethereumAddress);
    if (ethRequestReceipt) {
      setReceiptTxnHash(ethRequestReceipt.hash);
    }
  };
  useEffect(() => {
    const fetchEthAmount = async () => {
      const val = await getTransferEthAmount();
      const val2 = await getLastFaucetRequestTime(user.ethereumAddress)
      setTransferEthAmount(val);
      setLastRequestTime(val2);
    };
    fetchEthAmount();
  }, [user.ethereumAddress]);

  const canRequestAgain = (lastRequestTime) => {
    const oneDayInSeconds = 86400; // Number of seconds in a day
    const currentTime = Math.floor(Date.now() / 1000); // Current Unix epoch time in seconds
    const nextAllowedRequestTime = lastRequestTime + oneDayInSeconds;
  
    return nextAllowedRequestTime >= currentTime;
  };

  const convertUnixToUTC = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    return date.toUTCString(); // Convert to UTC string format
  };
  
  
  return (
    <>
      <Title>
        ChainedCertificates Faucet <DollarOutlined />
      </Title>
      <Divider />
      <Title level={4}>
        Get free testnet faucet funds for testing ChainedCertificates ( {transferEthAmount} ETH per day )
      </Title>
      {lastRequestTime>0 && <Title level={5}>
        You received your daily share on {convertUnixToUTC(lastRequestTime)} . You can claim again after {convertUnixToUTC(lastRequestTime+86400)}.
      </Title> }
      {!receiptTxnHash &&<Button disabled={canRequestAgain(lastRequestTime)} type="primary" size="large" onClick={requestEthHandler}>
        Request ETH
      </Button>}
      <div>
      {receiptTxnHash && <a href={`${import.meta.env.VITE_NETWORK_EXPLORER_BASE_URL}/tx/${receiptTxnHash}`} target="_blank">Transaction Hash : {receiptTxnHash}</a>}
      </div>
    </>
  );
};

export default Hero;
