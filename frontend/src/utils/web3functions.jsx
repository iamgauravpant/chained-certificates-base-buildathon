import { ethers } from "ethers";

const RPC_URL = import.meta.env.VITE_BASE_SEPOLIA_URL;

export const getUserBalance = async(userAddress)=>{
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const balance = await provider.getBalance(userAddress);
    const balanceInEth= ethers.formatEther(balance);
    console.log("balance in ETH:",balanceInEth);
    balanceInEth.toString()
    const formattedBalance = parseFloat(balanceInEth).toFixed(2);  // Convert to 2 decimal places
    const balanceWithTicker = formattedBalance + " ETH";
    return balanceWithTicker;
}