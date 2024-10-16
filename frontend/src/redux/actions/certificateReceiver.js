import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { openNotificationWithIcon } from "../../utils/openNotificationWithIcon";

const BACKENDURL =  import.meta.env.VITE_ENV==="DEV" ? import.meta.env.VITE_BACKENDURL_DEV : import.meta.env.VITE_BACKENDURL_PROD;

export const getData = createAsyncThunk(
  "certificateIssuer/getData",
  async (_, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("accessToken :", accessToken);
    try {
      let res = await axios.get(
        `${BACKENDURL}/certificateReceivers/get-data`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
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


export const getIssuedCertificates = createAsyncThunk(
  "certificateIssuer/getIssuedCertificates",
  async (_, thunkAPI) => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("accessToken :", accessToken);
    try {
      let res = await axios.get(
        `${BACKENDURL}/certificateReceivers/get-issued-certificates`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      console.log("res of getIssuedCertificates :", res);
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
