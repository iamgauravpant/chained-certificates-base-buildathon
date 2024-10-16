import { createSlice } from "@reduxjs/toolkit";
import { register,login,logout, getAdminDashboardData, getAllCertificates, getAllCertificateCollections, getAllCertificateIssuers, getAllCertificateReceivers } from "../actions/admin";
const initialState = {
    isRegisterLoading: false,
    isRegistrationSuccess: false,
    isLoginLoading: false,
    isLoginSuccess: false,
    certificateCollectionCount:0,
    certificateCount:0,
    certificateReceiverCount:0,
    certificateIssuerCount:0,  
    allCertificates: [],
    isGetAllCertificatesLoading: false,
    certificateCollections:[],
    isGetAllCertificateCollectionsLoading:false,
    certificateIssuers:[],
    isGetAllCertificateIssuersLoading:false,
    isGetAllCertificateReceiversLoading:false,
    certificateReceivers:[],
};

const adminSlice = createSlice({
    name: "admin",
    initialState: initialState,
    reducers: {
      resetLoginSuccess: (state) => {
        state.isLoginSuccess = false;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(register.pending, (state) => {
          state.isRegisterLoading = true;
          state.isRegistrationSuccess = false;
        })
        .addCase(register.fulfilled, (state, { payload }) => {
          state.isRegisterLoading = false;
          state.isRegistrationSuccess = payload.success;
        })
        .addCase(register.rejected, (state) => {
          state.isRegisterLoading = false;
          state.isRegistrationSuccess = false;
        })
        .addCase(login.pending, (state) => {
          state.isLoginLoading = true;
          state.isLoginSuccess = false;
        })
        .addCase(login.fulfilled, (state, { payload }) => {
          state.isLoginLoading = false;
          state.isLoginSuccess = payload.success;
        })
        .addCase(login.rejected, (state) => {
          state.isLoginLoading = false;
          state.isLoginSuccess = false;
        })
        .addCase(getAdminDashboardData.pending, (state) => {
          state.certificateCollectionCount=0;
          state.certificateCount=0;
          state.certificateReceiverCount=0;
          state.certificateIssuerCount=0;
        })
        .addCase(getAdminDashboardData.fulfilled, (state, { payload }) => {
          state.certificateCollectionCount=payload.certificateCollectionCount;
          state.certificateCount=payload.certificateCount;
          state.certificateReceiverCount=payload.certificateReceiverCount;
          state.certificateIssuerCount=payload.certificateIssuerCount;
        })
        .addCase(getAdminDashboardData.rejected, (state) => {
          state.certificateCollectionCount=0;
          state.certificateCount=0;
          state.certificateReceiverCount=0;
          state.certificateIssuerCount=0;
        })
        .addCase(getAllCertificates.pending, (state) => {
          state.isGetAllCertificatesLoading = true;
          state.allCertificates = [];
        })
        .addCase(getAllCertificates.fulfilled, (state, { payload }) => {
          state.isGetAllCertificatesLoading = false;
          state.allCertificates = payload;
        })
        .addCase(getAllCertificates.rejected, (state) => {
          state.isGetAllCertificatesLoading = false;
          state.allCertificates = [];
        })
        .addCase(getAllCertificateCollections.pending, (state) => {
          state.isGetAllCertificateCollectionsLoading = true;
          state.certificateCollections = [];
        })
        .addCase(getAllCertificateCollections.fulfilled, (state,{payload}) => {
          state.isGetAllCertificateCollectionsLoading = false;
          state.certificateCollections = payload;
  
        })
        .addCase(getAllCertificateCollections.rejected, (state) => {
          state.isGetAllCertificateCollectionsLoading = false; 
          state.certificateCollections = [];
        })
        .addCase(getAllCertificateIssuers.pending, (state) => {
          state.isGetAllCertificateIssuersLoading = true;
          state.certificateIssuers = [];
        })
        .addCase(getAllCertificateIssuers.fulfilled, (state,{payload}) => {
          state.isGetAllCertificateIssuersLoading = false;
          state.certificateIssuers = payload.certificateIssuers;
  
        })
        .addCase(getAllCertificateIssuers.rejected, (state) => {
          state.isGetAllCertificateIssuersLoading = false; 
          state.certificateIssuers = [];
        })
        .addCase(getAllCertificateReceivers.pending, (state) => {
          state.isGetAllCertificateReceiversLoading = true;
          state.certificateReceivers = [];
        })
        .addCase(getAllCertificateReceivers.fulfilled, (state, {payload}) => {
          state.isGetAllCertificateReceiversLoading = false;
          state.certificateReceivers = payload.certificateReceivers;
        })
        .addCase(getAllCertificateReceivers.rejected, (state) => {
          state.isGetAllCertificateReceiversLoading = false;
          state.certificateReceivers = [];
        })
    },
  });
export const {resetLoginSuccess} = adminSlice.actions;
export default adminSlice.reducer;
  