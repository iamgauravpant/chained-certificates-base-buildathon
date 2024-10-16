import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { openNotificationWithIcon } from "../../utils/openNotificationWithIcon";
import { calculateHash } from "../../utils/calculateHash";

const BACKENDURL =
  import.meta.env.VITE_ENV === "DEV"
    ? import.meta.env.VITE_BACKENDURL_DEV
    : import.meta.env.VITE_BACKENDURL_PROD;

export const register = createAsyncThunk(
  "user/register",
  async (data, thunkAPI) => {
    try {
      let res = await axios.post(`${BACKENDURL}/users/register`, data);
      res.status === 201 &&
        openNotificationWithIcon("success", res.data.message);
      console.log("res code :", res);
      return res.data;
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

export const login = createAsyncThunk("user/login", async (data, thunkAPI) => {
  try {
    let res = await axios.post(`${BACKENDURL}/users/login`, data, {
      withCredentials: true,
    });
    res.status === 200 &&
      openNotificationWithIcon("success", res?.data?.message);
    console.log("res :", res);
    localStorage.setItem("accessToken", res.data.data.accessToken);
    localStorage.setItem("refreshToken", res.data.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(res.data.data.user));
    return res.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.error) ||
      error.message ||
      error.toString();
    openNotificationWithIcon("error", message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    let res = await axios.post(
      `${BACKENDURL}/users/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    console.log("res :", res);
    // res.status===200 && openNotificationWithIcon("success",res?.data?.message);
    return res.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.error) ||
      error.message ||
      error.toString();
    openNotificationWithIcon("error", message);
    return thunkAPI.rejectWithValue(message);
  }
});

export const createEthWallet = createAsyncThunk(
  "user/createEthWallet",
  async (_, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.post(
        `${BACKENDURL}/users/create-wallet`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res of createEthWallet :", res);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      res.status === 201 &&
        openNotificationWithIcon("success", res?.data?.message);
      return res.data;
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

export const updateUserDetails = createAsyncThunk(
  "user/updateUserDetails",
  async (formData, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.post(
        `${BACKENDURL}/users/updateUserDetails`,
        formData,
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
      return res.data;
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

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (data, thunkAPI) => {
    try {
      let res = await axios.post(`${BACKENDURL}/users/forgot-password`, data);
      res.status === 200 &&
        openNotificationWithIcon("success", res?.data?.message);
      return data.identifier;
    } catch (error) {
      console.log("error logged here: ", error);

      const message =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      openNotificationWithIcon("error", message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const sendForgotPasswordOTP = createAsyncThunk(
  "user/sendForgotPasswordOTP",
  async (data, thunkAPI) => {
    try {
      let res = await axios.post(
        `${BACKENDURL}/users/forgot-password-otp`,
        data
      );
      res.status === 200 &&
        openNotificationWithIcon("success", res?.data?.message);
      return res.data;
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

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (data, thunkAPI) => {
    try {
      let res = await axios.post(`${BACKENDURL}/users/reset-password`, data);
      res.status === 200 &&
        openNotificationWithIcon("success", res?.data?.message);
      return res.data;
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

export const verifyCertificate = createAsyncThunk(
  "user/verifyCertificate",
  async (data, thunkAPI) => {
    try {
      let res = await axios.post(`${BACKENDURL}/users/verify`, data);
      console.log("response data :",res);
      const fetchAndCalculateHash = async (ipfsUrl) => {
        const response = await fetch(ipfsUrl);
        const arrayBuffer = await response.arrayBuffer();
        return await calculateHash(arrayBuffer);
      };
      const tokenURI = res.data.data.tokenURI;
      const mintTxHash = res.data.data.mintTxHash;
      const attestationUUID = res.data.data.attestationUUID;
      console.log("mintTxHash :",mintTxHash);
      console.log("attestationUUID :",attestationUUID);
      const certificatePDFHash = await fetchAndCalculateHash(tokenURI);
      return {tokenURI,certificatePDFHash,mintTxHash,attestationUUID};
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
