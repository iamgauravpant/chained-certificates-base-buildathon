import { Router } from "express"; // constant rahega
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getData,
  getIssuedCertificates,
} from "../controllers/certificateReceiver.controller.js";
const router = Router(); // ye bhi constant rahega

router.route("/get-data").get(verifyJWT, getData);

router.route("/get-issued-certificates").get(verifyJWT, getIssuedCertificates);

export default router; // aur ye bhi constant rahega har route file mein
