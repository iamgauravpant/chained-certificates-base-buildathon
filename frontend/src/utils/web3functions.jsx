import { ethers } from "ethers";
import { Contract } from "ethers";
import { EVMFaucetAddress, EVMFaucetABI } from "../constants/EVMFaucet.js";
import { openNotificationWithIcon } from "./openNotificationWithIcon.jsx";

const RPC_URL = import.meta.env.VITE_BASE_SEPOLIA_URL;

export const getUserBalance = async (userAddress) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const balance = await provider.getBalance(userAddress);
  const balanceInEth = ethers.formatEther(balance);
  console.log("balance in ETH:", balanceInEth);
  balanceInEth.toString();
  const formattedBalance = parseFloat(balanceInEth).toFixed(2); // Convert to 2 decimal places
  const balanceWithTicker = formattedBalance + " ETH";
  return balanceWithTicker;
};

export const getTransferEthAmount = async () => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(
    import.meta.env.VITE_BASE_SEPOLIA_FAUCET_OWNER_PRIVATE_KEY
  );
  const signer = wallet.connect(provider);
  const contract = new Contract(EVMFaucetAddress, EVMFaucetABI, signer);
  const receipt = await contract.transferEthAmount();
  console.log("receipt :", receipt);
  const balanceInEth = ethers.formatEther(receipt);
  console.log(" getTransferEthAmount in ETH :", balanceInEth);
  return balanceInEth;
};

export const getLastFaucetRequestTime = async (userAddress) => {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(
    import.meta.env.VITE_BASE_SEPOLIA_FAUCET_OWNER_PRIVATE_KEY
  );
  const signer = wallet.connect(provider);
  const contract = new Contract(EVMFaucetAddress, EVMFaucetABI, signer);
  const receipt = await contract.requests(userAddress);
  console.log("last request time :", receipt);
  return Number(receipt);
};

export const sendTestnetFunds = async (userAddress) => {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(
      import.meta.env.VITE_BASE_SEPOLIA_FAUCET_OWNER_PRIVATE_KEY
    );
    const signer = wallet.connect(provider);
    const contract = new Contract(EVMFaucetAddress, EVMFaucetABI, signer);
    const receipt = await contract.requestEth(userAddress);
    await receipt.wait();
    console.log("testnet ETH txn receipt :", receipt);
    openNotificationWithIcon("info", "Request submitted");
    return receipt;
  } catch (error) {
    console.log("error logged :", error);
    // Extracting the error reason if available
    const errorMessage = error.reason || error.message || "An error occurred";
    openNotificationWithIcon("error", errorMessage);
  }
};
