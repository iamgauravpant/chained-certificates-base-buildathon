import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { CertificateCollection } from "../models/certificateCollection.model.js";
import { Certificate } from "../models/certificate.model.js";
import { CertificateReceiver } from "../models/certificateReceiver.model.js";
import fs from "fs";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const getIssuedCertificates = asyncHandler(async (req, res) => {
  const userEmail = req.user.email;

  try {
    const certificates = await Certificate.find({ receiverEmail: userEmail });
    const certificateCount = await Certificate.countDocuments({
      receiverEmail: userEmail,
    });
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          certificates,
          certificateCount,
        },
        "Issued certificates retrieved successfully"
      )
    );
  } catch (error) {
    console.log("Error here: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
const getData = asyncHandler(async (req, res) => {
  const userEmail = req.user.email;

  try {
    const certificateCount = await Certificate.countDocuments({
      receiverEmail: userEmail,
    });
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          certificateCount,
        },
        "User dashboard counts retrieved successfully"
      )
    );
  } catch (error) {
    console.log("Error here: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
export { getIssuedCertificates, getData };
