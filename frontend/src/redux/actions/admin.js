import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { openNotificationWithIcon } from "../../utils/openNotificationWithIcon";

const BACKENDURL =  import.meta.env.VITE_ENV==="DEV" ? import.meta.env.VITE_BACKENDURL_DEV : import.meta.env.VITE_BACKENDURL_PROD;

export const register = createAsyncThunk(
  "admin/register",
  async (data, thunkAPI) => {
    try {
      console.log("data for register admin api :", data);
      let res = await axios.post(`${BACKENDURL}/admins/register-admin`, data);
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

export const login = createAsyncThunk("admin/login", async (data, thunkAPI) => {
  try {
    console.log("data for login admin api :", data);
    let res = await axios.post(`${BACKENDURL}/admins/login-admin`, data, {
      withCredentials: true,
    });
    res.status === 200 &&
      openNotificationWithIcon("success", res?.data?.message);
    console.log("res :", res);
    localStorage.setItem("accessToken", res.data.data.accessToken);
    localStorage.setItem("refreshToken", res.data.data.refreshToken);
    localStorage.setItem("admin", JSON.stringify(res.data.data.admin));
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

export const logout = createAsyncThunk("admin/logout", async (_, thunkAPI) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    let res = await axios.get(
      `${BACKENDURL}/admins/logout-admin`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    console.log("res :", res);
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

export const getAdminDashboardData = createAsyncThunk(
  "admin/getAdminDashboardData",
  async (_, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.get(
        `${BACKENDURL}/admins/get-data`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res :", res);
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

export const getAllCertificates = createAsyncThunk(
  "admin/getAllCertificates",
  async (_, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.get(
        `${BACKENDURL}/admins/get-certificates`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res :", res);
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

export const getAllCertificateIssuers = createAsyncThunk(
  "admin/getAllCertificateIssuers",
  async (_, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      let res = await axios.get(
        `${BACKENDURL}/admins/get-certificate-issuers`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res of all certificate issuers :", res.data.data);
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

export const getAllCertificateReceivers = createAsyncThunk(
  "admin/getAllCertificateReceivers",
  async (_, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("accessToken :",accessToken);
    try {
      let res = await axios.get(
        `${BACKENDURL}/admins/get-certificate-receivers`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res of getAllCertificateReceivers :", res);
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

export const getAllCertificateCollections = createAsyncThunk(
  "admin/getAllCertificateCollections",
  async (_, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("accessToken :",accessToken);
    try {
      let res = await axios.get(
        `${BACKENDURL}/admins/get-certificate-collections`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res :", res);
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