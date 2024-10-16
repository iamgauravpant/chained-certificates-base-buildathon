import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { CertificateCollection } from "../models/certificateCollection.model.js";
import { Certificate } from "../models/certificate.model.js";
import { CertificateReceiver } from "../models/certificateReceiver.model.js";
import { Token } from "../models/token.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import * as crypto from 'crypto';
import {
  sendForgotPasswordOTP,
  sendResetPasswordLink,
} from "../utils/nodemailerSetup.js";
import { NFTContractReadCall } from "../utils/NFTContractCall.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // user model ko password bhi chahie save hone ke liye , lekin hum password save nahi karana chahte , toh validateBeforeSave ko false set kar denge
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};
const createUserEthereumWallet = async (userId) => {
  try {
    const user = await User.findById(userId);
    const wallet = user.createEthereumWallet();
    return wallet;
  } catch (error) {
    throw new ApiError(500, "Something went wrong while creating wallet");
  }
};

const deployCertCollection = async (
  collection_name,
  collection_symbol,
  userId,
  certificateCollectionId
) => {
  try {
    const user = await User.findById(userId);
    const userPrivateKey = user.ethereumPrivateKey;
    const privateKeyWithout0x = userPrivateKey.slice(2);
    if (!userPrivateKey) {
      throw new ApiError(400, "Please create wallet first");
    }
    const certificateCollection = await CertificateCollection.findById(
      certificateCollectionId
    );
    const collection = await certificateCollection.deployCertificateCollection(
      collection_name,
      collection_symbol,
      privateKeyWithout0x
    );
    return collection;
  } catch (error) {
    throw new ApiError(500, "Something went wrong while deploying collection");
  }
};
// controller bas ek function hota hai

// register user karna ek problem hai , usko steps mein likho , one by one solve karo
const registerUser = asyncHandler(async (req, res) => {
  // form se ya json se data aara hai toh req.body mein milta hai
  const { username, email, fullname, password, role } = req.body;
  if (
    [fullname, email, username, password, role].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    fullname,
    email,
    password,
    role,
    username,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // we'll return the user object except for password and refreshToken

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -ethereumPrivateKey"
  );

  // ye cookie sirf aur sirf server se modifiable hoti hain , frontend se isko modify nahi kar sakte
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None", // chatgpt solution on 14th july
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          refreshToken,
          accessToken,
        },
        "User Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged Out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?.id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const createEthereumWallet = asyncHandler(async (req, res) => {
  const wallet = await createUserEthereumWallet(req.user._id);
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        ethereumAddress: wallet.address,
        ethereumPrivateKey: wallet.privateKey,
      },
    },
    {
      new: true,
    }
  );

  const loggedInUser = await User.findById(req.user._id).select(
    "-password -refreshToken -ethereumPrivateKey"
  );

  return res.status(201).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
      },
      "Wallet Created Successfully"
    )
  );
});

const updateUserDetails = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        phoneNumber: req.body.phoneNumber,
        country: req.body.country,
        avatar: req.body.avatar,
      },
    },
    {
      new: true,
    }
  );
  const loggedInUser = await User.findById(req.user._id).select(
    "-password -refreshToken -ethereumPrivateKey"
  );

  return res.status(201).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
      },
      "User data updated successfully"
    )
  );
});

const createCertificateCollection = asyncHandler(async (req, res) => {
  const user = req.user;
  const { collection_name, collection_symbol } = req.body;
  if (!collection_name || !collection_symbol) {
    return res
      .status(400)
      .json({ error: "collection_name and collection_symbol are required" });
  }

  try {
    const certificateCollection = await CertificateCollection.create({
      collection_name,
      collection_symbol,
      owner: user._id,
    });

    const collection_address = await deployCertCollection(
      collection_name,
      collection_symbol,
      user._id,
      certificateCollection._id
    );
    const updatedCollection = await CertificateCollection.findByIdAndUpdate(
      certificateCollection,
      {
        $set: {
          collectionAddress: collection_address,
        },
      },
      {
        new: true,
      }
    );

    return res.status(201).json(
      new ApiResponse(
        200,
        {
          user: user,
          collection: updatedCollection,
        },
        "Certificate Collection created successfully"
      )
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const getCertificateCollections = asyncHandler(async (req, res) => {
  const user = req.user;
  try {
    const collections = await CertificateCollection.find({ owner: user._id });
    if (!collections) {
      return res
        .status(404)
        .json({ error: "No certificate collections found" });
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { collections },
          "Certificate collections retrieved successfully"
        )
      );
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const userForgotPassword = asyncHandler(async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    throw new ApiError(400, "Identifier is required!");
  }

  const existedUser = await User.findOne({
    $or: [
      { username: identifier },
      { email: identifier },
      { phoneNumber: identifier },
    ],
  }).select("-password -refreshToken -ethereumPrivateKey");

  // If the user doesn't exist, return an error
  if (!existedUser) {
    throw new ApiError(404, "User not found with the given identifier.");
  }

  // If the user exists, generate and send the OTP
  let otp;
  try {
    otp = await sendForgotPasswordOTP(existedUser.email);
  } catch (error) {
    // console.error("Error generating or sending OTP: ", error);
    throw new ApiError(
      500,
      null,
      "Failed to send OTP. Please try again later."
    );
  }
  const existedUserId = existedUser._id;
  const token = await Token.findOne({ userId: existedUserId });
  if(token) {
    await token.deleteOne();
  }
  const newToken = await Token.create({
    userId: existedUser._id,
    otp: otp,
    createdAt: Date.now(),
  });
  // await token.save({ validateBeforeSave: false });
  await newToken.save();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "OTP sent successfully"));
});

const userForgotPasswordOTP = asyncHandler(async (req, res) => {
  const { otp, identifier } = req.body;
  if ([otp, identifier].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [
      { username: identifier },
      { email: identifier },
      { phoneNumber: identifier },
    ],
  }).select("-password -refreshToken -ethereumPrivateKey");
  // If the user doesn't exist, return an error
  if (!existedUser) {
    throw new ApiError(404, "User not found with the given identifier.");
  }
  const existedUserId = existedUser._id;
  const token = await Token.findOne({ userId: existedUserId, otp });
  console.log("token :", token);
  if (!token) {
    // Either token not found or it expired
    throw new ApiError(404, "OTP not found or has expired.");
  }
  const forgotPasswordToken = crypto.randomBytes(32).toString("hex");
  console.log("forgotPasswordToken :",forgotPasswordToken);
  const link = `${process.env.ENV==="dev" ? process.env.FRONTEND_URL_DEV : process.env.FRONTEND_URL_PROD}/password-reset/${existedUser._id}/${forgotPasswordToken}`;
  console.log("reset password link :",link);
  try {
    await sendResetPasswordLink(existedUser.email,link);
  } catch (error) {
    // console.error("Error generating or sending OTP: ", error);
    throw new ApiError(
      500,
      null,
      "Failed to send reset password email. Please try again later."
    );
  }
  token.token = forgotPasswordToken
  await token.save();
  // Token is valid and hasn't expired, proceed with the reset logic
  // You can now delete the token and prompt the user for a new password or further actions
  // await token.deleteOne();

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Password reset link sent to registered email")
    );
});

const resetUserPassword = asyncHandler(async (req, res) => {
  const { userId,token,newPassword } = req.body;
  console.log("userId,token,newPassword :",userId,token,newPassword )
  if ([userId,token,newPassword].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findById(userId).select("-password -refreshToken -ethereumPrivateKey");
  // If the user doesn't exist, return an error
  if (!existedUser) {
    throw new ApiError(404, "User not found.");
  }
  const existedToken = await Token.findOne({ userId: userId,token });
  console.log("token :", existedToken);
  if (!existedToken) {
    // Either token not found or it expired
    throw new ApiError(404, "Token not found or has expired.");
  }
  if(token !== existedToken.token){
    throw new ApiError(404, "Invalid token found");
  }
  existedUser.password = newPassword;
  await existedUser.save();
  await existedToken.deleteOne();

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Password reset successfully")
    );
});

const verifyCertificate = asyncHandler(async (req, res) => {
  const { IssuerAddress,TokenId,CollectionAddress } = req.body;
  if ([IssuerAddress,TokenId,CollectionAddress].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const certificateCollection = await CertificateCollection.findOne({collectionAddress:CollectionAddress});
  if(!certificateCollection) {
    throw new ApiError(404, "Certificate collection not found");
  }
  const issuer = await User.findOne({ethereumAddress:IssuerAddress}).select("-password -refreshToken -ethereumPrivateKey");
  if(!issuer) {
    throw new ApiError(404, "Issuer not found");
  }
  if (!issuer._id.equals(certificateCollection.owner)) {
    throw new ApiError(404, "Issuer is not the owner of the certificate collection");
  }  
  const certificate = await Certificate.findOne({ collectionOwnerId:issuer._id,collectionId:certificateCollection._id,tokenId:TokenId});
  let ownerOfToken,tokenURI;
  try{
    ownerOfToken = await NFTContractReadCall("ownerOf",TokenId,CollectionAddress);
    tokenURI = await NFTContractReadCall("tokenURI",TokenId,CollectionAddress);
  }
  catch(error) {
    throw new ApiError(500, "Failed to verify certificate");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, {
        ownerOfToken,
        tokenURI,
        mintTxHash:certificate.mintTxHash,
        attestationUUID:certificate.attestationUUID
      }, "Certificate Verified Successfully")
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  createEthereumWallet,
  updateUserDetails,
  createCertificateCollection,
  getCertificateCollections,
  userForgotPassword,
  userForgotPasswordOTP,
  resetUserPassword,
  verifyCertificate
};
