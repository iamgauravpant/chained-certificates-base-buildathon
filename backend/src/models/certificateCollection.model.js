import mongoose, { Schema } from "mongoose";
import {
  INFURA_URL,
  NFT_CONTRACT_ABI,
  NFT_CONTRACT_BYTECODE
} from "../constants.js";
import { ContractFactory } from "ethers";
import { ethers } from "ethers";

const certificateCollectionSchema = new Schema(
  {
    collection_name: {
      type: String,
      required: true,
    },
    collection_symbol: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    collectionAddress: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

certificateCollectionSchema.methods.deployCertificateCollection =
  async function (collection_name, collection_symbol, WALLET_SECRET_KEY) {
    const provider = new ethers.JsonRpcProvider(INFURA_URL);
    const wallet = new ethers.Wallet(WALLET_SECRET_KEY);
    const signer = wallet.connect(provider);
    const factory = new ContractFactory(
      NFT_CONTRACT_ABI,
      NFT_CONTRACT_BYTECODE,
      signer
    );
    const contract = await factory.deploy(collection_name, collection_symbol);
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    return contractAddress;
  };

export const CertificateCollection = mongoose.model(
  "CertificateCollection",
  certificateCollectionSchema
);
