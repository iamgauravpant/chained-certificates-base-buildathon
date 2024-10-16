import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { CertificateCollection } from "../models/certificateCollection.model.js";
import { Certificate } from "../models/certificate.model.js";
import { CertificateReceiver } from "../models/certificateReceiver.model.js";
import { User } from "../models/user.model.js";
const generateAccessAndRefreshTokens = async (adminId) => {
    try {
      const admin = await Admin.findById(adminId);
      const accessToken = admin.generateAccessToken();
      const refreshToken = admin.generateRefreshToken();
      admin.refreshToken = refreshToken;
      await admin.save({ validateBeforeSave: false }); // admin model ko password bhi chahie save hone ke liye , lekin hum password save nahi karana chahte , toh validateBeforeSave ko false set kar denge
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while generating access and refresh tokens"
      );
    }
};

const registerAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (
      [email, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }
  
    const existedAdmin = await Admin.findOne({
      $or: [{ email }],
    });
  
    if (existedAdmin) {
      throw new ApiError(409, "Admin with email or username already exists");
    }
  
    const admin = await Admin.create({
      email,
      password,
      role:"admin"
    });
  
    const createdAdmin = await Admin.findById(admin._id).select(
      "-password -refreshToken"
    ); // we'll return the user object except for password and refreshToken
  
    if (!createdAdmin) {
      throw new ApiError(500, "Something went wrong while registering the Admin");
    }
  
    return res
      .status(201)
      .json(new ApiResponse(200,{admin:createdAdmin}, "Admin Registered Successfully"));
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      throw new ApiError(400, "email is required");
    }
    const admin = await Admin.findOne({
      $or: [{ email }],
    });
    if (!admin) {
      throw new ApiError(404, "Admin does not exist");
    }
    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid Admin Credentials");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      admin._id
    );
  
    const loggedInAdmin = await Admin.findById(admin._id).select(
      "-password -refreshToken "
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
            admin: loggedInAdmin,
            refreshToken,
            accessToken,
          },
          "Admin Logged In Successfully"
        )
      );
});

const logoutAdmin = asyncHandler(async (req, res) => {
    await Admin.findByIdAndUpdate(
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

const getData = asyncHandler(async (req, res) => {

  try {
    const certificateReceiverCount = await CertificateReceiver.countDocuments();
    const certificateCount = await Certificate.countDocuments();
    const certificateCollectionCount = await CertificateCollection.countDocuments();
    const certificateIssuerCount = await User.countDocuments({role:"certificateIssuer"});

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          certificateCount,
          certificateReceiverCount,
          certificateCollectionCount,
          certificateIssuerCount
        },
        "Admin dashboard counts retrieved successfully"
      )
    );
  } catch (error) {
    console.log("Error here: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const getCertificates = asyncHandler(async (req, res) => {
  try {
    const certificates = await Certificate.find();
    const certificateCount = await Certificate.countDocuments();
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          certificates,
          certificateCount,
        },
        "All certificates retrieved successfully"
      )
    );
  } catch (error) {
    console.log("Error here: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const getCertificateReceivers = asyncHandler(async (req, res) => {
  try {
    const certificateReceivers = await CertificateReceiver.find();
    const count = await CertificateReceiver.countDocuments();
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          certificateReceivers,
          count
        },
        "All Certificate Receivers retrieved successfully"
      )
    );
  } catch (error) {
    console.log("Error here: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const getCertificateCollections = asyncHandler(async (req, res) => {
  try {
    const collections = await CertificateCollection.find();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          collections,
          "All Certificate collections retrieved successfully"
        )
      );
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const getCertificateIssuers = asyncHandler(async (req, res) => {
  try {
    const certificateIssuers = await User.find({role:"certificateIssuer"}).select(
      "-password -refreshToken -ethereumPrivateKey"
    );
    const count = await User.countDocuments({role:"certificateIssuer"});
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          certificateIssuers,
          count
        },
        "All Certificate Issuers retrieved successfully"
      )
    );
  } catch (error) {
    console.log("Error here: ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export { registerAdmin, loginAdmin , logoutAdmin, getData, getCertificates, getCertificateReceivers, getCertificateCollections, getCertificateIssuers};