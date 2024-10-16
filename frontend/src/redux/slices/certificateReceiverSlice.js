import { createSlice } from "@reduxjs/toolkit";
import { getData, getIssuedCertificates } from "../actions/certificateReceiver.js";

const initialState = {
  issuedCertificates: [],
  isGetIssuedCertificatesLoading: false,
  certificateCount:0
};

const certificateReceiverSlice = createSlice({
  name: "certificateReceiver",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIssuedCertificates.pending, (state) => {
        state.isGetIssuedCertificatesLoading = true;
        state.issuedCertificates = [];
      })
      .addCase(getIssuedCertificates.fulfilled, (state, { payload }) => {
        state.isGetIssuedCertificatesLoading = false;
        state.issuedCertificates = payload;
      })
      .addCase(getIssuedCertificates.rejected, (state) => {
        state.isGetIssuedCertificatesLoading = false;
        state.issuedCertificates = [];
      })
      .addCase(getData.pending, (state) => {
        state.isGetDataLoading = true;
        state.certificateCount = 0;
      })
      .addCase(getData.fulfilled, (state, { payload }) => {
        state.isGetDataLoading = false;
        state.certificateCount = payload.certificateCount;

      })
      .addCase(getData.rejected, (state) => {
        state.isGetDataLoading = false;
        state.certificateCount = 0;
      })
  },
});
//   export const {  } = certificateReceiverSlice.actions;
export default certificateReceiverSlice.reducer;
