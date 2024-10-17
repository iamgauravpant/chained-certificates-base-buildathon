import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { CertificateCollection } from "../models/certificateCollection.model.js";
import { Certificate } from "../models/certificate.model.js";
import { CertificateReceiver } from "../models/certificateReceiver.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { decodeTransactionEventData } from "../utils/decodeTransactionEventData.js";
import { notifyCertificateReceiver } from "../utils/nodemailerSetup.js";

const getData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const certificateReceiverCount = await CertificateReceiver.countDocuments({
      certificateIssuer: userId,
    });
    const certificateCount = await Certificate.countDocuments({
      collectionOwnerId: userId,
    });
    const certificateCollectionCount =
      await CertificateCollection.countDocuments({ owner: userId });
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          certificateCount,
          certificateReceiverCount,
          certificateCollectionCount,
        },
        "Certificate Issuer details retrieved successfully"
      )
    );
  } catch (error) {
    console.log("Error here: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const createCertificateReceiver = asyncHandler(async (req, res) => {
  const user = req.user;
  const { certReceiverName, certReceiverEmail, certReceiverAddress } = req.body;
  console.log(
    "certReceiverName, certReceiverEmail,certReceiverAddress",
    certReceiverName,
    certReceiverEmail,
    certReceiverAddress
  );
  if (!certReceiverName || !certReceiverEmail) {
    return res
      .status(400)
      .json({ error: "certReceiverEmail and certReceiverEmail are required" });
  }

  try {
    // Check if a receiver with the given email already exists for the current issuer
    const existingReceiver = await CertificateReceiver.findOne({
      email: certReceiverEmail,
      certificateIssuer: user._id,
    });

    if (existingReceiver) {
      return res.status(
        401).json({
        error:"Receiver already exists!"
      }
      );

    }

    const certificateReceiver = await CertificateReceiver.create({
      name: certReceiverName,
      email: certReceiverEmail,
      ethereumAddress: certReceiverAddress,
      certificateIssuer: user._id,
    });

    return res.status(201).json(
      new ApiResponse(
        200,
        {
          certificateReceiver,
        },
        "Certificate Receiver created successfully"
      )
    );
  } catch (error) {
    console.log("error her e: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const getCertificateReceivers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const certificateReceivers = await CertificateReceiver.find({
      certificateIssuer: userId,
    });
    const count = await CertificateReceiver.countDocuments({ userId: userId });
    // if (!certificateReceivers) {
    //   return res.status(404).json({ error: "No certificate receivers found for this user" });
    // }
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          certificateReceivers,
          count,
        },
        "Certificate Receivers retrieved successfully"
      )
    );
  } catch (error) {
    console.log("Error here: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const getCertificateReceiver = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { identifier } = req.body;
  try {
    const existedCertificateReceivers = await CertificateReceiver.find({
      email: { $regex: identifier, $options: "i" },
      certificateIssuer: userId,
    });

    console.log("existedCertificateReceivers :", existedCertificateReceivers);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          certficiateReceivers: existedCertificateReceivers,
        },
        "Certificate Receivers retrieved successfully"
      )
    );
  } catch (error) {
    console.log("Error here: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const createCertficate = asyncHandler(async (req, res) => {
  const { receiverId, collectionId } = req.body;
  console.log("receiverId,collectionId", receiverId, collectionId);
  if (!receiverId || !collectionId) {
    return res.status(400).json({
      error: "receiverId, collectionOwnerId and collectionId are required",
    });
  }
  try {
    // Check if the certificate already exists for this receiverId and collectionId
    const existingCertificate = await Certificate.findOne({
      receiverId,
      collectionId,
    });

    if (existingCertificate) {
      return res.status(400).json({
        error: "Receiver already owns a certificate from this collection!",
      });
    }

    const receiver = await CertificateReceiver.findById(receiverId);
    const certificate = await Certificate.create({
      receiverId,
      receiverEmail: receiver.email,
      collectionOwnerId: req.user._id,
      collectionId,
    });
    return res.status(201).json(
      new ApiResponse(
        200,
        {
          certificate,
        },
        "Certificate created successfully"
      )
    );
  } catch (error) {
    console.log("error her e: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const updateCertficateIPFSData = asyncHandler(async (req, res) => {
  const certificateIssuer = req.user;
  const { certificateId, IpfsHash, PinSize, Timestamp } = req.body;
  console.log(
    "certificateId,IpfsHash,PinSize,Timestamp ",
    certificateId,
    IpfsHash,
    PinSize,
    Timestamp
  );
  if (!certificateId || !IpfsHash || !PinSize || !Timestamp) {
    return res.status(400).json({
      error: "certificateId, IpfsHash, PinSize and Timestamp are required",
    });
  }
  try {
    const certificate = await Certificate.findById(certificateId);

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    const certificateCollection = await CertificateCollection.findById(
      certificate.collectionId
    );

    if (!certificateCollection) {
      return res
        .status(404)
        .json({ error: "Certificate Collection not found" });
    }

    const tokenId = certificate.tokenId;

    // Update ipfsDetails
    certificate.ipfsDetails = {
      IpfsHash,
      PinSize,
      Timestamp,
    };

    // Save the updated certificate
    const updatedCertificate = await certificate.save();

    try {
      const NFT_CONTRACT_ADDRESS = certificateCollection.collectionAddress;
      const issuer = await User.findById(certificateIssuer._id);
      const url =
        "https://beige-jittery-felidae-359.mypinata.cloud/ipfs/" + IpfsHash;
      const setTokenURIReceipt = await certificate.setCertificateTokenURI(
        NFT_CONTRACT_ADDRESS,
        tokenId,
        url,
        issuer.ethereumPrivateKey
      );
      console.log("setTokenURIReceipt :",setTokenURIReceipt)
    } catch (error) {
      console.log("error here: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          certificate: updatedCertificate,
        },
        "Certificate updated successfully"
      )
    );
  } catch (error) {
    console.log("error here: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const mintCertificate = asyncHandler(async (req, res) => {
  const certificateIssuer = req.user;
  const { certificateId } = req.body;
  console.log("certificateId from frontend :", certificateId);
  if (!certificateId) {
    return res.status(400).json({ error: "certificateId is required" });
  }
  const certificate = await Certificate.findById(certificateId);
  const receiver = await CertificateReceiver.findById(certificate.receiverId);
  const issuer = await User.findById(certificateIssuer._id);
  const certificateCollection = await CertificateCollection.findById(
    certificate.collectionId
  );
  if (receiver.ethereumAddress) {
    try {
      const NFT_CONTRACT_ADDRESS = certificateCollection.collectionAddress;

      const mintCertificateReceipt = await certificate.mintCertificate(
        NFT_CONTRACT_ADDRESS,
        receiver.ethereumAddress,
        issuer.ethereumPrivateKey
      );
      // FROM_ADDRESS,TO_ADDRESS,NFT_CONTRACT_ADDRESS,TOKEN_ID,TOKEN_URI, WALLET_SECRET_KEY
      const tokenId = await decodeTransactionEventData(
        mintCertificateReceipt.hash
      );
      const updatedCertificate = await Certificate.findByIdAndUpdate(
        certificateId,
        {
          $set: {
            mintTxHash: mintCertificateReceipt.hash,
            tokenId: tokenId,
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            certificate: updatedCertificate,
          },
          "Certificate minted successfully"
        )
      );
    } catch (error) {
      console.log("error here: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (!receiver.ethereumAddress) {
    try {
      const certificateCollection = await CertificateCollection.findById(
        certificate.collectionId
      );
      const NFT_CONTRACT_ADDRESS = certificateCollection.collectionAddress;

      const mintCertificateReceipt = await certificate.mintCertificate(
        NFT_CONTRACT_ADDRESS,
        certificateIssuer.ethereumAddress,
        issuer.ethereumPrivateKey
      );
      console.log(
        "mintCertificateReceipt in controller :",
        mintCertificateReceipt
      );
      // FROM_ADDRESS,TO_ADDRESS,NFT_CONTRACT_ADDRESS,TOKEN_ID,TOKEN_URI, WALLET_SECRET_KEY
      const tokenId = await decodeTransactionEventData(
        mintCertificateReceipt.hash
      );

      const updatedCertificate = await Certificate.findByIdAndUpdate(
        certificateId,
        {
          $set: {
            mintTxHash: mintCertificateReceipt.hash,
            tokenId: tokenId,
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            certificate: updatedCertificate,
          },
          "Certificate minted successfully"
        )
      );
    } catch (error) {
      console.log("error here : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

const attestCertificate = asyncHandler(async (req, res) => {
  const certificateIssuer = req.user;
  const { certificateId } = req.body;
  console.log("certificateId from frontend :", certificateId);
  if (!certificateId) {
    return res.status(400).json({ error: "certificateId is required" });
  }
  const certificate = await Certificate.findById(certificateId);
  const receiver = await CertificateReceiver.findById(certificate.receiverId);
  const issuer = await User.findById(certificateIssuer._id);
  const certificateCollection = await CertificateCollection.findById(
    certificate.collectionId
  );
  if (receiver.ethereumAddress) {
    try {
      const NFT_CONTRACT_ADDRESS = certificateCollection.collectionAddress;
      const tokenId = certificate.tokenId;
      const certificateIPFSDetails = certificate.ipfsDetails;
      console.log("certificateIPFSDetails :", certificateIPFSDetails);
      const url =
        "https://beige-jittery-felidae-359.mypinata.cloud/ipfs/" +
        certificateIPFSDetails.IpfsHash;
      console.log("url of certificate :", url);
      const attestCertificateUUID = await certificate.attestCertificate(
        issuer.ethereumAddress,
        receiver.ethereumAddress,
        NFT_CONTRACT_ADDRESS,
        tokenId,
        url,
        issuer.ethereumPrivateKey
      );
      console.log(
        "attestCertificateUUID in controller :",
        attestCertificateUUID
      );
      const updatedCertificate = await Certificate.findByIdAndUpdate(
        certificateId,
        {
          $set: {
            attestationUUID: attestCertificateUUID,
          },
        },
        {
          new: true,
        }
      );
      const mintTxHash = certificate.mintTxHash;
      const attestationURL = `https://base-sepolia.easscan.org/attestation/view/${attestCertificateUUID}`;
      const mintURL = `https://sepolia.basescan.org/tx/${mintTxHash}`;
      const content = `
      <h1>${issuer.fullname} just issued a certificate to you.</h1>
      <p><b>Certificate Collection Name :</b> ${certificateCollection.collection_name}</p>
      <p><b>Certificate Collection Symbol :</b> ${certificateCollection.collection_symbol}</p>
      <p><b>Certificate's Unique TokenId :</b> ${certificate.tokenId}</p>
      <p><b>Certificate Mint Proof :</b>  <a style="color:blue;" href=${mintURL} target="_blank">${mintURL}</a></p>
      <p><b>Certificate Attestation Proof :</b> <a style="color:blue;" href=${attestationURL} target="_blank">${attestationURL}</a></p>
      <br/>
      <br/>
      <br/>
      <br/>
      <p><b>NOTE :</b></p>
      <p>Login to ChainedCertificates App with this email to get access to your certificate.</p>
      `;
      try {
        console.log("trying to send user email :");
        await notifyCertificateReceiver(receiver.email, content);
      } catch (error) {
        console.log("error logged here !!! :", error);
      }
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            certificate: updatedCertificate,
          },
          "Certificate attested successfully"
        )
      );
    } catch (error) {
      console.log("error here: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (!receiver.ethereumAddress) {
    try {
      const certificateCollection = await CertificateCollection.findById(
        certificate.collectionId
      );
      const NFT_CONTRACT_ADDRESS = certificateCollection.collectionAddress;

      const certificateIPFSDetails = certificate.ipfsDetails;
      console.log("certificateIPFSDetails :", certificateIPFSDetails);
      const url =
        "https://beige-jittery-felidae-359.mypinata.cloud/ipfs/" +
        certificateIPFSDetails.IpfsHash;
      console.log("url of certificate :", url);
      const attestCertificateUUID = await certificate.attestCertificate(
        issuer.ethereumAddress,
        issuer.ethereumAddress,
        NFT_CONTRACT_ADDRESS,
        certificate.tokenId,
        url,
        issuer.ethereumPrivateKey
      );
      console.log(
        "attestCertificateUUID in controller :",
        attestCertificateUUID
      );

      const updatedCertificate = await Certificate.findByIdAndUpdate(
        certificateId,
        {
          $set: {
            attestationUUID: attestCertificateUUID,
          },
        },
        {
          new: true,
        }
      );
      const mintTxHash = certificate.mintTxHash;
      const attestationURL = `https://base-sepolia.easscan.org/attestation/view/${attestCertificateUUID}`;
      const mintURL = `https://sepolia.basescan.org/tx/${mintTxHash}`;
      const content = `
      <h1>${issuer.fullname} just issued a certificate to you.</h1>
      <p><b>Certificate Collection Name :</b> ${certificateCollection.collection_name}</p>
      <p><b>Certificate Collection Symbol :</b> ${certificateCollection.collection_symbol}</p>
      <p><b>Certificate's Unique TokenId :</b> ${certificate.tokenId}</p>
      <p><b>Certificate Mint Proof :</b>  <a style="color:blue;" href=${mintURL} target="_blank">${mintURL}</a></p>
      <p><b>Certificate Attestation Proof :</b> <a style="color:blue;" href=${attestationURL} target="_blank">${attestationURL}</a></p>
      <br/>
      <br/>
      <br/>
      <br/>
      <p><b>NOTE :</b></p>
      <p>Login to ChainedCertificates App with this email to get access to your certificate.</p>
      `;
      try {
        console.log("trying to send user email :");
        await notifyCertificateReceiver(receiver.email, content);
      } catch (error) {
        console.log("error logged here !!! :", error);
      }

      return res.status(200).json(
        new ApiResponse(
          200,
          {
            certificate: updatedCertificate,
          },
          "Certificate attested successfully"
        )
      );
    } catch (error) {
      console.log("error her e: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

const getCertificates = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    // Find certificates where the collectionOwnerId matches the user's id
    const certificates = await Certificate.find({ collectionOwnerId: userId });
    const count = await Certificate.countDocuments({
      collectionOwnerId: userId,
    });

    // If no certificates are found, you can choose to return an empty array
    // if (certificates.length === 0) {
    //   return res.status(404).json({ error: "No certificates found for this user" });
    // }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          certificates,
          count,
        },
        "Certificates retrieved successfully"
      )
    );
  } catch (error) {
    console.log("Error here: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export {
  createCertificateReceiver,
  getCertificateReceivers,
  createCertficate,
  updateCertficateIPFSData,
  mintCertificate,
  attestCertificate,
  getCertificates,
  getData,
  getCertificateReceiver,
};
