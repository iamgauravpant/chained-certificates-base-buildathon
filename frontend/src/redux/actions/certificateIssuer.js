import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { openNotificationWithIcon } from "../../utils/openNotificationWithIcon";
import { setCreateCertificateCurrentView } from "../slices/certificateIssuerSlice";
import { ethers } from "ethers";
import { Contract } from "ethers";
import { EVMFaucetAddress, EVMFaucetABI } from "../../constants/EVMFaucet.js";

const BACKENDURL =
  import.meta.env.VITE_ENV === "DEV"
    ? import.meta.env.VITE_BACKENDURL_DEV
    : import.meta.env.VITE_BACKENDURL_PROD;
const PINATA_UPLOAD_URL = import.meta.env.VITE_PINATA_UPLOAD_URL;
const PINATAJWT = import.meta.env.VITE_PINATAJWT;
const RPC_URL = import.meta.env.VITE_BASE_SEPOLIA_URL;

export const deployCertificateCollection = createAsyncThunk(
  "certificateIssuer/deployCertificateCollection",
  async (data, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.post(
        `${BACKENDURL}/users/create-certificate-collection`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res :", res);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      res.status === 201 &&
        openNotificationWithIcon("success", res?.data?.message);
      res.status === 201 &&
        thunkAPI.dispatch(setCreateCertificateCurrentView(1));
      return res.data.data.collection;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      openNotificationWithIcon("error", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCertificateCollections = createAsyncThunk(
  "certificateIssuer/getCertificateCollections",
  async (_, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("accessToken :", accessToken);
    try {
      let res = await axios.get(`${BACKENDURL}/users/certificate-collections`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      const collectionsArray = res.data.data.collections;
      return collectionsArray;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      openNotificationWithIcon("error", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createCertificateReceiver = createAsyncThunk(
  "certificateIssuer/createCertificateReceiver",
  async (data, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.post(
        `${BACKENDURL}/certificateIssuers/create-certificate-receiver`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res of createCertificateReceiver :", res);
      const receiverId = res.data.data.certificateReceiver._id;
      // res.status === 201 &&
      // openNotificationWithIcon("success", res?.data?.message);
      const newData = { receiverId, collectionId: data.collectionId };
      console.log("formData first :", data.formData);
      res.status === 201 && thunkAPI.dispatch(createCertificate(newData));
      return res.data.data.certificateReceiver;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      openNotificationWithIcon("error", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCertificateReceivers = createAsyncThunk(
  "certificateIssuer/getCertificateReceivers",
  async (_, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.get(
        `${BACKENDURL}/certificateIssuers/certificate-receivers`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res of getCertificateReceivers :", res);
      // res.status === 200 &&
      //   openNotificationWithIcon("success", "Certificate receivers retrieved successfully");
      return res.data.data.certificateReceivers;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      openNotificationWithIcon("error", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCertificateReceiver = createAsyncThunk(
  "certificateIssuer/getCertificateReceiver",
  async (data, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.post(
        `${BACKENDURL}/certificateIssuers/get-certificate-receiver`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      // res.status === 200 &&
      //   openNotificationWithIcon("success", "Certificate receivers retrieved successfully");
      return res.data.data.certficiateReceivers;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      openNotificationWithIcon("error", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createCertificate = createAsyncThunk(
  "certificateIssuer/createCertificate",
  async (data, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.post(
        `${BACKENDURL}/certificateIssuers/create-certificate`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res of createCertificate :", res);
      return res.data.data.certificate;
      // res.status === 201 &&
      //   openNotificationWithIcon("success", res?.data?.message);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      openNotificationWithIcon("error", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const uploadCertificateToIPFS = createAsyncThunk(
  "certificateIssuer/uploadCertificateToIPFS",
  async (data, thunkAPI) => {
    try {
      console.log("formData last :", data);
      let res = await axios.post(PINATA_UPLOAD_URL, data.formData, {
        headers: {
          Authorization: `Bearer ${PINATAJWT}`,
        },
      });
      console.log("res of upload to IPFS :", res);
      res.status === 200 &&
        await thunkAPI.dispatch(
          updateCertificateData({
            certificateId: data.certificateId,
            ...res.data,
          })
        );
      // res.status===200 && openNotificationWithIcon("success","Uploaded certificate to IPFS successfully")
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      openNotificationWithIcon("error", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateCertificateData = createAsyncThunk(
  "certificateIssuer/updateCertificateData",
  async (data, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("data for my api logged :", data);
    const { certificateId, IpfsHash, PinSize, Timestamp } = data;
    try {
      let res = await axios.patch(
        `${BACKENDURL}/certificateIssuers/update-certificate`,
        { certificateId, IpfsHash, PinSize, Timestamp },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res of updateCertificateData my api :", res);
      openNotificationWithIcon("success", res?.data?.message);
      return res.data.data.certificate;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      openNotificationWithIcon("error", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const mintAndAttestCertificate = createAsyncThunk(
  "certificateIssuer/mintAndAttestCertificate",
  async (data, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("data for mint and attest certificate API :", data);
    try {
      let res = await axios.post(
        `${BACKENDURL}/certificateIssuers/mint-certificate`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res of mintAndAttestCertificate :", res);
      res.status === 200 &&
        openNotificationWithIcon("success", res?.data?.message);
      return res.data.data.certificate;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      openNotificationWithIcon("error", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const attestCertificate = createAsyncThunk(
  "certificateIssuer/attestCertificate",
  async (data, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("data for attest certificate API :", data);
    try {
      let res = await axios.post(
        `${BACKENDURL}/certificateIssuers/attest-certificate`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res of mintAndAttestCertificate :", res);
      res.status === 200 &&
        openNotificationWithIcon("success", res?.data?.message);
      return res.data.data.certificate;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      openNotificationWithIcon("error", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCertificates = createAsyncThunk(
  "certificateIssuer/getCertificates",
  async (_, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.get(
        `${BACKENDURL}/certificateIssuers/get-certificates`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res of getCertificates :", res);
      // res.status === 200 &&
      //   openNotificationWithIcon("success", "Certificate receivers retrieved successfully");
      return res.data.data.certificates;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      openNotificationWithIcon("error", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getData = createAsyncThunk(
  "certificateIssuer/getData",
  async (_, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.get(`${BACKENDURL}/certificateIssuers/get-data`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });
      console.log("res of getData :", res);

      return res.data.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      openNotificationWithIcon("error", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTransferEthAmount = createAsyncThunk(
  "certificateIssuer/getTransferEthAmount",
  async (_, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new Contract(EVMFaucetAddress, EVMFaucetABI, provider);
      const receipt = await contract.transferEthAmount();
      console.log("receipt :", receipt);
      const balanceInEth = ethers.formatEther(receipt);
      console.log(" getTransferEthAmount in ETH :", balanceInEth);
      thunkAPI.dispatch(getLastFaucetRequestTime(user.ethereumAddress))
      return balanceInEth;
    } catch (error) {
      // Extracting the error reason if available
      const errorMessage = error.reason || error.message || "An error occurred";
      openNotificationWithIcon("error", errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const getLastFaucetRequestTime = createAsyncThunk(
  "certificateIssuer/getLastFaucetRequestTime",
  async (data, thunkAPI) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new Contract(EVMFaucetAddress, EVMFaucetABI, provider);
      const receipt = await contract.requests(data);
      return Number(receipt);
    } catch (error) {
      // Extracting the error reason if available
      const errorMessage = error.reason || error.message || "An error occurred";
      openNotificationWithIcon("error", errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const sendTestnetFunds = createAsyncThunk(
  "certificateIssuer/sendTestnetFunds",
  async (_, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const wallet = new ethers.Wallet(
        import.meta.env.VITE_BASE_SEPOLIA_FAUCET_OWNER_PRIVATE_KEY
      );
      const signer = wallet.connect(provider);
      const contract = new Contract(EVMFaucetAddress, EVMFaucetABI, signer);
      const receipt = await contract.requestEth(user.ethereumAddress);
      await receipt.wait();
      openNotificationWithIcon("success", "Request submitted successfully");
      return receipt.hash;
      } catch (error) {
      // Extracting the error reason if available
      const errorMessage = error.reason || error.message || "An error occurred";
      openNotificationWithIcon("error", errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
