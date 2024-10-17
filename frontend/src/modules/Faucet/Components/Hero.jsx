import { DollarOutlined } from "@ant-design/icons";
import { Button, Divider, Typography,Spin } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransferEthAmount, sendTestnetFunds } from "../../../redux/actions/certificateIssuer";
import { openNotificationWithIcon } from "../../../utils/openNotificationWithIcon";

const { Title } = Typography;
const Hero = () => {
  const dispatch = useDispatch();
  const {isGetTransferEthAmountLoading,transferEthAmount,isGetLastFaucetRequestTimeLoading,lastFaucetRequestTime,isSendTestnetFundsLoading,isSendTestnetFundsSuccess,sendTestnetFundsTxnHash} = useSelector(state=>state.certificateIssuer);
  console.log("lastFaucetRequestTime :",lastFaucetRequestTime)
  const requestEthHandler = () => {
    dispatch(sendTestnetFunds());
  };

  useEffect(()=>{
    dispatch(getTransferEthAmount());
  },[dispatch])

  const canRequestAgain = (lastFaucetRequestTime) => {
    const oneDayInSeconds = 86400; // Number of seconds in a day
    const currentTime = Math.floor(Date.now() / 1000); // Current Unix epoch time in seconds
    const nextAllowedRequestTime = lastFaucetRequestTime + oneDayInSeconds;
  
    return nextAllowedRequestTime >= currentTime;
  };

  const convertUnixToUTC = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
    return date.toUTCString(); // Convert to UTC string format
  };

  useEffect(()=>{
    isSendTestnetFundsSuccess && openNotificationWithIcon("info","Refresh the page to see updated balance.")
  })
  
  
  return (
    <>{isGetTransferEthAmountLoading ? <Spin fullscreen/>:
    <>
      <Title>
        ChainedCertificates Faucet <DollarOutlined />
      </Title>
      <Divider />
      <Title level={4}>
        Get free testnet faucet funds for testing ChainedCertificates ( {transferEthAmount} ETH per day )
      </Title>
      {lastFaucetRequestTime>0 && <Title level={5}>
        You received your daily share on {convertUnixToUTC(lastFaucetRequestTime)} . You can claim again after {convertUnixToUTC(lastFaucetRequestTime+86400)}.
      </Title> }
      <Button loading={isSendTestnetFundsLoading} disabled={canRequestAgain(lastFaucetRequestTime)} type="primary" size="large" onClick={requestEthHandler}>
        Request ETH
      </Button>
      <div>
      {sendTestnetFundsTxnHash && <Title level={5}>Transaction Hash :  <a href={`${import.meta.env.VITE_NETWORK_EXPLORER_BASE_URL}/tx/${sendTestnetFundsTxnHash}`} target="_blank">{sendTestnetFundsTxnHash}</a></Title>}
      </div>
      </>
    }</>
  );
};

export default Hero;
