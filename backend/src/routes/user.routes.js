import { Router } from "express"; // constant rahega
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  createEthereumWallet,
  updateUserDetails,
  createCertificateCollection,
  getCertificateCollections,
  userForgotPassword,
  userForgotPasswordOTP,
  resetUserPassword,
  verifyCertificate
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router(); // ye bhi constant rahega

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/create-wallet").post(verifyJWT, createEthereumWallet);

router
  .route("/updateUserDetails")
  .post(verifyJWT, upload.single("image"), updateUserDetails);

router
  .route("/create-certificate-collection")
  .post(verifyJWT, createCertificateCollection);

router
  .route("/certificate-collections")
  .get(verifyJWT, getCertificateCollections);

// secured routes

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/forgot-password").post(userForgotPassword);

router.route("/forgot-password-otp").post(userForgotPasswordOTP);

router.route("/reset-password").post(resetUserPassword);

router.route("/verify").post(verifyCertificate);

export default router; // aur ye bhi constant rahega har route file mein
