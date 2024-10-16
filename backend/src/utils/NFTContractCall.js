import { ethers } from "ethers";
import { Contract } from "ethers";
import { INFURA_URL, NFT_CONTRACT_ABI } from "../constants.js";

export const NFTContractWriteCall = async (NFT_CONTRACT_METHOD,ARGUMENTS,NFT_CONTRACT_ADDRESS,WALLET_SECRET_KEY) => {
    const provider = new ethers.JsonRpcProvider(INFURA_URL);
    const wallet = new ethers.Wallet(WALLET_SECRET_KEY);
    const signer = wallet.connect(provider);
    const contract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
    const receipt = await contract[NFT_CONTRACT_METHOD](...ARGUMENTS);
    console.log(" NFTContractCall receipt :",receipt)
    return receipt;
}

export const NFTContractReadCall = async (NFT_CONTRACT_METHOD,ARGUMENTS,NFT_CONTRACT_ADDRESS) => {
    const provider = new ethers.JsonRpcProvider(INFURA_URL);
    const contract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI,provider);
    const callResult = await contract[NFT_CONTRACT_METHOD](...ARGUMENTS);
    return callResult;
}