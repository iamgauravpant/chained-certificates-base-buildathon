import { Router } from "express"; // constant rahega
// import {} from "../controllers/certificateIssuer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createCertificateReceiver,getCertificateReceivers,createCertficate, updateCertficateIPFSData, mintCertificate, getCertificates, getData, getCertificateReceiver, attestCertificate } from "../controllers/certificateIssuer.controller.js";

const router = Router(); // ye bhi constant rahega

router.route("/get-data").get(verifyJWT,getData);

router.route("/create-certificate-receiver").post(verifyJWT,createCertificateReceiver);

router.route("/certificate-receivers").get(verifyJWT, getCertificateReceivers);

router.route("/get-certificate-receiver").post(verifyJWT, getCertificateReceiver);

router.route("/create-certificate").post(verifyJWT,createCertficate);

router.route("/update-certificate").patch(verifyJWT,updateCertficateIPFSData);

router.route("/mint-certificate").post(verifyJWT,mintCertificate);

router.route("/attest-certificate").post(verifyJWT,attestCertificate);

router.route("/get-certificates").get(verifyJWT,getCertificates);

export default router; // aur ye bhi constant rahega har route file mein
