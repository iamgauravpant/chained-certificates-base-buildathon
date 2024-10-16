import mongoose, { Schema } from "mongoose";
import { INFURA_URL, NFT_CONTRACT_ABI } from "../constants.js";
import { ethers } from "ethers";
import { Contract } from "ethers";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

const ipfsDataSchema = new Schema({
  IpfsHash: {
    type: String,
    required: true,
  },
  PinSize: {
    type: Number,
    required: true,
  },
  Timestamp: {
    type: Date,
    required: true,
  },
});

const certificateSchema = new Schema(
  {
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiverEmail: {
      type: String,
      required: true,
    },
    ipfsDetails: {
      type: ipfsDataSchema,
    },
    collectionOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    mintTxHash: {
      type: String,
    },
    tokenId: {
      type: String
    },
    attestationUUID: {
      type: String,
    },
  },
  { timestamps: true }
);

certificateSchema.methods.mintCertificate = async function (
  NFT_CONTRACT_ADDRESS,
  TO_ADDRESS,
  WALLET_SECRET_KEY
) {
  console.log(
    "NFT_CONTRACT_ADDRESS,TO_ADDRESS, WALLET_SECRET_KEY :",
    NFT_CONTRACT_ADDRESS,
    TO_ADDRESS,
    WALLET_SECRET_KEY
  );
  const provider = new ethers.JsonRpcProvider(INFURA_URL);
  const wallet = new ethers.Wallet(WALLET_SECRET_KEY);
  const signer = wallet.connect(provider);
  const contract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
  const mintReceipt = await contract.safeMint(TO_ADDRESS);
  console.log("mintReceipt :", mintReceipt);
  await mintReceipt.wait();
  return mintReceipt;
};

certificateSchema.methods.setCertificateTokenURI = async function (
  NFT_CONTRACT_ADDRESS,
  TOKEN_ID,
  TOKEN_URI,
  WALLET_SECRET_KEY
) {
  console.log(
    "NFT_CONTRACT_ADDRESS,TOKEN_ID,TOKEN_URI,WALLET_SECRET_KEY :",
    NFT_CONTRACT_ADDRESS,
    TOKEN_ID,
    TOKEN_URI,
    WALLET_SECRET_KEY
  );
  const provider = new ethers.JsonRpcProvider(INFURA_URL);
  const wallet = new ethers.Wallet(WALLET_SECRET_KEY);
  const signer = wallet.connect(provider);
  const contract = new Contract(NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI, signer);
  const setTokenURIReceipt = await contract.setTokenURI(TOKEN_ID,TOKEN_URI);
  console.log("setTokenURIReceipt :", setTokenURIReceipt);
  await setTokenURIReceipt.wait();
  return setTokenURIReceipt;
};

// collection - NFT_CONTRACT_ADDRESS
// receiver - TO_ADDRESS ( FROM_ADDRESS if TO_ADDRESS was not given )
// issuer - FROM_ADDRESS
// id - tokenId
// ipfsurl - TOKEN_URI
certificateSchema.methods.attestCertificate = async function (
  FROM_ADDRESS,
  TO_ADDRESS,
  NFT_CONTRACT_ADDRESS,
  TOKEN_ID,
  TOKEN_URI,
  WALLET_SECRET_KEY
) {
  console.log(
    "FROM_ADDRESS,TO_ADDRESS,NFT_CONTRACT_ADDRESS,TOKEN_ID,TOKEN_URI, WALLET_SECRET_KEY :",
    FROM_ADDRESS,
    TO_ADDRESS,
    NFT_CONTRACT_ADDRESS,
    TOKEN_ID,
    TOKEN_URI,
    WALLET_SECRET_KEY
  );
  const provider = new ethers.JsonRpcProvider(INFURA_URL);
  const wallet = new ethers.Wallet(WALLET_SECRET_KEY);
  const signer = wallet.connect(provider);
  console.log("EAS_CONTRACT_ADDRESS : ", process.env.EAS_CONTRACT_ADDRESS);
  console.log("SCHEMA_UUID : ", process.env.SCHEMA_UUID);
  const eas = new EAS(process.env.EAS_CONTRACT_ADDRESS);
  // Signer must be an ethers-like signer.
  await eas.connect(signer);
  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder(
    "address issuer,address receiver,uint256 id,address collection,string ipfsurl"
  );
  const encodedData = schemaEncoder.encodeData([
    { name: "issuer", value: FROM_ADDRESS, type: "address" },
    { name: "receiver", value: TO_ADDRESS, type: "address" },
    { name: "id", value: TOKEN_ID, type: "uint256" },
    { name: "collection", value: NFT_CONTRACT_ADDRESS, type: "address" },
    { name: "ipfsurl", value: TOKEN_URI, type: "string" },
  ]);
  const tx = await eas.attest({
    schema: process.env.SCHEMA_UUID,
    data: {
      recipient: FROM_ADDRESS,
      expirationTime: 0,
      revocable: false, // Be aware that if your schema is not revocable, this MUST be false
      data: encodedData,
    },
  });
  const newAttestationUID = await tx.wait();
  console.log("attestation txn :", tx);
  console.log("New attestation UID:", newAttestationUID);
  return newAttestationUID;
};

export const Certificate = mongoose.model("Certificate", certificateSchema);
