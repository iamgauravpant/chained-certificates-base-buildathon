import Web3 from 'web3';
import {INFURA_URL} from "../constants.js"

// decode transaction event data using web3js methods 
export const decodeTransactionEventData = async(txnHash) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));
    const fullReceipt = await web3.eth.getTransactionReceipt(txnHash);
    const logs = fullReceipt.logs;
    const log0 = logs[0];
    const log0Data = log0.data;
    const inputArray = [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
    ];
    const log0Topic0 = log0.topics.slice(1);
    const decodedData = web3.eth.abi.decodeLog(inputArray,log0Data,log0Topic0);
    const tokenId = decodedData.tokenId;
    return String(tokenId);
}