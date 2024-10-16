import { Router } from "express"; // constant rahega
import { registerAdmin,loginAdmin, logoutAdmin, getData, getCertificates,getCertificateCollections,getCertificateReceivers,getCertificateIssuers} from "../controllers/admin.controller.js";
import {verifyAdminJWT} from "../middlewares/auth.middleware.js"
const router = Router(); // ye bhi constant rahega

router.route("/register-admin").post(registerAdmin);

router.route("/login-admin").post(loginAdmin);

router.route("/logout-admin").get(verifyAdminJWT,logoutAdmin);

router.route("/get-data").get(verifyAdminJWT,getData);

router.route("/get-certificates").get(verifyAdminJWT,getCertificates);

router.route("/get-certificate-collections").get(verifyAdminJWT,getCertificateCollections);
router.route("/get-certificate-receivers").get(verifyAdminJWT,getCertificateReceivers);
router.route("/get-certificate-issuers").get(verifyAdminJWT,getCertificateIssuers);


export default router; // aur ye bhi constant rahega har route file mein