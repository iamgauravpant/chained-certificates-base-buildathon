import { createSlice } from "@reduxjs/toolkit";
import {
  createEthWallet,
  forgotPassword,
  login,
  register,
  resetPassword,
  sendForgotPasswordOTP,
  updateUserDetails,
  verifyCertificate,
} from "../actions/user";
const initialState = {
  isRegisterLoading: false,
  isRegistrationSuccess: false,
  isLoginLoading: false,
  isLoginSuccess: false,
  isCreateEthWalletLoading: false,
  isEthWalletCreated: false,
  isUpdateUserDetailsLoading: false,
  isUpdateUserDetailsSuccess: false,
  isForgotPasswordLoading:false,
  isForgotPasswordSuccess:false,
  isForgotPasswordOTPLoading:false,
  isForgotPasswordOTPSuccess:false,
  forgotPasswordModalUserIdentifier:"",
  isResetPasswordLoading:false,
  isResetPasswordSuccess:false,
  isVerifyCertificateLoading:false,
  verifyCertificateData:{}
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    resetLoginSuccess: (state) => {
      state.isLoginSuccess = false;
    },
    resetEthWalletState: (state) => {
      state.isEthWalletCreated = false;
    },
    resetUpdateUserState: (state) => {
      state.isUpdateUserDetailsSuccess = false;
    },
    resetForgotPasswordModalStates:(state)=> {
      state.isForgotPasswordLoading=false;
      state.isForgotPasswordSuccess=false;
      state.isForgotPasswordOTPLoading=false;
      state.isForgotPasswordOTPSuccess=false;
      state.forgotPasswordModalUserIdentifier = "";
    },
    resetResetPasswordPageStates:(state)=> {
      state.isResetPasswordLoading=false;
      state.isResetPasswordSuccess=false;
    },
    resetVerifyCertificateStates:(state)=>{
      state.isVerifyCertificateLoading=false;
      state.verifyCertificateData={}
    }
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
      .addCase(createEthWallet.pending, (state) => {
        state.isCreateEthWalletLoading = true;
        state.isEthWalletCreated = false;
      })
      .addCase(createEthWallet.fulfilled, (state) => {
        state.isCreateEthWalletLoading = false;
        state.isEthWalletCreated = true;
      })
      .addCase(createEthWallet.rejected, (state) => {
        state.isCreateEthWalletLoading = false;
        state.isEthWalletCreated = false;
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.isUpdateUserDetailsLoading = true;
        state.isUpdateUserDetailsSuccess = false;
      })
      .addCase(updateUserDetails.fulfilled, (state) => {
        state.isUpdateUserDetailsLoading = false;
        state.isUpdateUserDetailsSuccess = true;
      })
      .addCase(updateUserDetails.rejected, (state) => {
        state.isUpdateUserDetailsLoading = false;
        state.isUpdateUserDetailsSuccess = false;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isForgotPasswordLoading = true;
        state.isForgotPasswordSuccess = false;
        state.forgotPasswordModalUserIdentifier = "";
      })
      .addCase(forgotPassword.fulfilled, (state,{payload}) => {
        state.isForgotPasswordLoading = false;
        state.isForgotPasswordSuccess = true;
        state.forgotPasswordModalUserIdentifier = payload
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.isForgotPasswordLoading = false;
        state.isForgotPasswordSuccess = false;
        state.forgotPasswordModalUserIdentifier = "";
      })
      .addCase(sendForgotPasswordOTP.pending, (state) => {
        state.isForgotPasswordOTPLoading = true;
        state.isForgotPasswordOTPSuccess = false;
      })
      .addCase(sendForgotPasswordOTP.fulfilled, (state) => {
        state.isForgotPasswordOTPLoading = false;
        state.isForgotPasswordOTPSuccess = true;
      })
      .addCase(sendForgotPasswordOTP.rejected, (state) => {
        state.isForgotPasswordOTPLoading = false;
        state.isForgotPasswordOTPSuccess = false;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isResetPasswordLoading = true;
        state.isResetPasswordSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isResetPasswordLoading = false;
        state.isResetPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isResetPasswordLoading = false;
        state.isResetPasswordSuccess = false;
      })
      .addCase(verifyCertificate.pending, (state) => {
        state.isVerifyCertificateLoading = true;
        state.verifyCertificateData = {}
      })
      .addCase(verifyCertificate.fulfilled, (state,{payload}) => {
        state.isVerifyCertificateLoading = false;
        state.verifyCertificateData = payload
      })
      .addCase(verifyCertificate.rejected, (state) => {
        state.isVerifyCertificateLoading = false;
        state.verifyCertificateData = {}
      })
  },
});
export const {
  resetLoginSuccess,
  resetEthWalletState,
  resetUpdateUserState,
  resetForgotPasswordModalStates,
  resetResetPasswordPageStates,
  resetVerifyCertificateStates
} = userSlice.actions;
export default userSlice.reducer;
