import { createSlice } from "@reduxjs/toolkit";
import {
  attestCertificate,
  createCertificate,
  createCertificateReceiver,
  deployCertificateCollection,
  getCertificateCollections,
  getCertificateReceiver,
  getCertificateReceivers,
  getCertificates,
  getData,
  getLastFaucetRequestTime,
  getTransferEthAmount,
  mintAndAttestCertificate,
  sendTestnetFunds,
  updateCertificateData,
  uploadCertificateToIPFS,
} from "../actions/certificateIssuer.js";
const initialState = {
  createCertificateCurrentView: 0,
  isGetCertificateCollectionsLoading:false,
  certificateCollections:[],
  isDeployCertificateCollectionLoading:false,
  isDeployCertificateCollectionSuccess:false,
  deployedCertificateCollection:{},
  selectedCertificateCollectionType:"create",
  certificateReceiverId:'',
  certReceiverName: '',
  certReceiverEmail: '',
  certReceiverAddress: '',
  isGetCertificateReceiversLoading:false,
  certificateReceivers:[],
  isCreateCertificateReceiverLoading:false,
  createdCertificateReceiver:{},
  isCreateCertificateLoading:false,
  currentViewReviewCertificateModal:0,
  isCreateCertificateReceiverSuccess:false,
  createdCertificate:{},
  isCreateCertificateSuccess:false,
  isUpdateCertificateDataLoading:false,
  updatedCertificate:{},
  isUploadCertificateToIPFSLoading:false,
  isUploadCertificateToIPFSSuccess:false,
  isMintAndAttestCertificateLoading:false,
  isMintAndAttestCertificateSuccess:false,
  isGetCertificatesLoading:false,
  certificates:[],
  certificateCollectionCount:0,
  certificateCount:0,
  certificateReceiverCount:0,
  selectedCertificateReceiverType:"new",
  isAttestCertificateLoading:false,
  isAttestCertificateSuccess:false,
  isGetTransferEthAmountLoading:false,
  transferEthAmount:0,
  isGetLastFaucetRequestTimeLoading:false,
  lastFaucetRequestTime:0,
  isSendTestnetFundsLoading:false,
  isSendTestnetFundsSuccess:false,
  sendTestnetFundsTxnHash:""
};

const certificateIssuerSlice = createSlice({
  name: "certificateIssuer",
  initialState: initialState,
  reducers: {
    setCreateCertificateCurrentView: (state, { payload }) => {
      state.createCertificateCurrentView = payload;
    },
    setSelectedCertificateCollectionType: (state,{payload})=>{
      state.selectedCertificateCollectionType = payload;
    },
    setCertificateReceiverType: (state,{payload})=>{
      state.selectedCertificateReceiverType = payload;
    },
    setDeployedCertificateCollection: (state,{payload})=>{
      state.deployedCertificateCollection = payload;
    },
    setReceiverDetailsFormData: (state, {payload}) => {
      state.certificateReceiverId = payload.certificateReceiverId;
      state.certReceiverAddress = payload.certReceiverAddress;
      state.certReceiverEmail = payload.certReceiverEmail;
      state.certReceiverName = payload.certReceiverName;
    },
    setCurrentViewReviewCertificateModal:(state,{payload}) => {
      state.currentViewReviewCertificateModal = payload;
    },
    resetCreateCertificateReceiverSuccessState:(state) => {
      state.isCreateCertificateReceiverSuccess = false;
    },
    resetCreateCertificateSuccessState:(state) => {
      state.isCreateCertificateSuccess = false;
    },
    resetUploadCertificateToIPFS:(state)=>{
      state.isUploadCertificateToIPFSSuccess = false;
    },
    resetMintSuccessState:(state)=>{
      state.isMintAndAttestCertificateSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(deployCertificateCollection.pending, (state) => {
        state.isDeployCertificateCollectionLoading = true;
        state.isDeployCertificateCollectionSuccess = false;
        state.deployedCertificateCollection = {};
      })
      .addCase(deployCertificateCollection.fulfilled, (state,{payload}) => {
        state.isDeployCertificateCollectionLoading = false;
        state.isDeployCertificateCollectionSuccess = true;
        state.deployedCertificateCollection = payload;
      })
      .addCase(deployCertificateCollection.rejected, (state) => {
        state.isDeployCertificateCollectionLoading = false;
        state.isDeployCertificateCollectionSuccess = false;
        state.deployedCertificateCollection = {};
      })
      .addCase(getCertificateCollections.pending, (state) => {
        state.isGetCertificateCollectionsLoading = true;
        state.certificateCollections = [];
      })
      .addCase(getCertificateCollections.fulfilled, (state,{payload}) => {
        state.isGetCertificateCollectionsLoading = false;
        state.certificateCollections = payload;

      })
      .addCase(getCertificateCollections.rejected, (state) => {
        state.isGetCertificateCollectionsLoading = false; 
        state.certificateCollections = [];
      })
      .addCase(getCertificateReceivers.pending, (state) => {
        state.isGetCertificateReceiversLoading = true;
        state.certificateReceivers = [];
      })
      .addCase(getCertificateReceivers.fulfilled, (state, {payload}) => {
        state.isGetCertificateReceiversLoading = false;
        state.certificateReceivers = payload;
      })
      .addCase(getCertificateReceivers.rejected, (state) => {
        state.isGetCertificateReceiversLoading = false;
        state.certificateReceivers = [];
      })
      .addCase(createCertificateReceiver.pending, (state) => {
        state.isCreateCertificateReceiverLoading = true;
        state.isCreateCertificateReceiverSuccess = false;
        state.createdCertificateReceiver = {};
      })
      .addCase(createCertificateReceiver.fulfilled, (state, {payload}) => {
        state.isCreateCertificateReceiverLoading = false;
        state.isCreateCertificateReceiverSuccess = true;
        state.createdCertificateReceiver = payload;
      })
      .addCase(createCertificateReceiver.rejected, (state) => {
        state.isCreateCertificateReceiverLoading = false;
        state.isCreateCertificateReceiverSuccess = false;
        state.createdCertificateReceiver = {};
      })
      .addCase(createCertificate.pending, (state) => {
        state.isCreateCertificateLoading = true;
        state.createdCertificate = {}
        state.isCreateCertificateSuccess = false;
      })
      .addCase(createCertificate.fulfilled, (state, {payload}) => {
        state.isCreateCertificateLoading = false;
        state.createdCertificate = payload;
        state.isCreateCertificateSuccess = true;
      })
      .addCase(createCertificate.rejected, (state) => {
        state.isCreateCertificateLoading = false;
        state.createdCertificate = {};
        state.isCreateCertificateSuccess = false;
      })
      .addCase(uploadCertificateToIPFS.pending, (state) => {
        state.isUploadCertificateToIPFSLoading = true;
        state.isUploadCertificateToIPFSSuccess = false;
      })
      .addCase(uploadCertificateToIPFS.fulfilled, (state) => {
        state.isUploadCertificateToIPFSSuccess = true;
        state.isUploadCertificateToIPFSLoading = false;
      })
      .addCase(uploadCertificateToIPFS.rejected, (state) => {
        state.isUploadCertificateToIPFSSuccess = false;
        state.isUploadCertificateToIPFSLoading = false;
      })
      .addCase(updateCertificateData.pending, (state) => {
        state.isUpdateCertificateDataLoading = true;
        state.updatedCertificate = {};
      })
      .addCase(updateCertificateData.fulfilled, (state, {payload}) => {
        state.isUpdateCertificateDataLoading = false;
        state.updatedCertificate = payload;
      })
      .addCase(updateCertificateData.rejected, (state) => {
        state.isUpdateCertificateDataLoading = false;
        state.updatedCertificate = {};
      })
      .addCase(mintAndAttestCertificate.pending, (state) => {
        state.isMintAndAttestCertificateLoading = true;
        state.isMintAndAttestCertificateSuccess = false;
      })
      .addCase(mintAndAttestCertificate.fulfilled, (state,{payload}) => {
        state.isMintAndAttestCertificateLoading = false;
        state.isMintAndAttestCertificateSuccess = true;
        state.createdCertificate = payload;
      })
      .addCase(mintAndAttestCertificate.rejected, (state) => {
        state.isMintAndAttestCertificateLoading = false;
        state.isMintAndAttestCertificateSuccess = false;
      })
      .addCase(attestCertificate.pending, (state) => {
        state.isAttestCertificateLoading = true;
        state.isAttestCertificateSuccess = false;
      })
      .addCase(attestCertificate.fulfilled, (state) => {
        state.isAttestCertificateLoading = false;
        state.isAttestCertificateSuccess = true;
      })
      .addCase(attestCertificate.rejected, (state) => {
        state.isAttestCertificateLoading = false;
        state.isAttestCertificateSuccess = false;
      })
      .addCase(getCertificates.pending, (state) => {
        state.isGetCertificatesLoading = true;
        state.certificates = [];
      })
      .addCase(getCertificates.fulfilled, (state,{payload}) => {
        state.isGetCertificatesLoading = false;
        state.certificates = payload;
      })
      .addCase(getCertificates.rejected, (state) => {
        state.isGetCertificatesLoading = false;
        state.certificates = [];
      })
      .addCase(getData.pending, (state) => {
        state.isGetDataLoading = true;
        state.certificateCollectionCount = 0;
        state.certificateCount = 0;
        state.certificateReceiverCount = 0;
      })
      .addCase(getData.fulfilled, (state,{payload}) => {
        state.isGetDataLoading = false;
        state.certificateCollectionCount = payload.certificateCollectionCount;
        state.certificateCount = payload.certificateCount;
        state.certificateReceiverCount = payload.certificateReceiverCount;
      })
      .addCase(getData.rejected, (state) => {
        state.isGetDataLoading = false;
        state.certificateCollectionCount = 0;
        state.certificateCount = 0;
        state.certificateReceiverCount = 0;
      })
      .addCase(getCertificateReceiver.pending, (state) => {
        state.isGetCertificateReceiversLoading = true;
        state.certificateReceivers = [];
      })
      .addCase(getCertificateReceiver.fulfilled, (state,{payload}) => {
        state.isGetCertificateReceiversLoading = false;
        state.certificateReceivers = payload;
      })
      .addCase(getCertificateReceiver.rejected, (state) => {
        state.isGetCertificateReceiversLoading = false;
        state.certificateReceivers = [];
      })
      .addCase(getTransferEthAmount.pending, (state) => {
        state.isGetTransferEthAmountLoading = true;
        state.transferEthAmount = 0;
      })
      .addCase(getTransferEthAmount.fulfilled, (state,{payload}) => {
        state.isGetTransferEthAmountLoading = false;
        state.transferEthAmount = payload;
      })
      .addCase(getTransferEthAmount.rejected, (state) => {
        state.isGetTransferEthAmountLoading = false;
        state.transferEthAmount = 0;
      })
      .addCase(getLastFaucetRequestTime.pending, (state) => {
        state.isGetLastFaucetRequestTimeLoading = true;
        state.lastFaucetRequestTime = 0;
      })
      .addCase(getLastFaucetRequestTime.fulfilled, (state,{payload}) => {
        state.isGetLastFaucetRequestTimeLoading = false;
        state.lastFaucetRequestTime = payload;
      })
      .addCase(getLastFaucetRequestTime.rejected, (state) => {
        state.isGetLastFaucetRequestTimeLoading = false;
        state.lastFaucetRequestTime = 0;
      })
      .addCase(sendTestnetFunds.pending, (state) => {
        state.isSendTestnetFundsLoading = true;
        state.isSendTestnetFundsSuccess = false;
        state.sendTestnetFundsTxnHash = "";
      })
      .addCase(sendTestnetFunds.fulfilled, (state,{payload}) => {
        state.isSendTestnetFundsLoading = false;
        state.sendTestnetFundsTxnHash = payload;
        state.isSendTestnetFundsSuccess = true;
      })
      .addCase(sendTestnetFunds.rejected, (state) => {
        state.isSendTestnetFundsLoading = false;
        state.isSendTestnetFundsSuccess = false;
        state.sendTestnetFundsTxnHash = "";
      })
  },
});
export const {
  setCreateCertificateCurrentView,
  setSelectedCertificateCollectionType,
  setCertificateReceiverType,
  setDeployedCertificateCollection,
  setReceiverDetailsFormData,
  setCurrentViewReviewCertificateModal,
  resetCreateCertificateReceiverSuccessState,
  resetUploadCertificateToIPFS,
  resetCreateCertificateSuccessState,
  resetMintSuccessState
} = certificateIssuerSlice.actions;
export default certificateIssuerSlice.reducer;
