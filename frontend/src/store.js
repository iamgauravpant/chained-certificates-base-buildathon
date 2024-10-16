import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./redux/slices/userSlice";
import certificateIssuerReducer from "./redux/slices/certificateIssuerSlice"
import certificateReceiverReducer from "./redux/slices/certificateReceiverSlice"
import adminReducer from "./redux/slices/adminSlice"

const reducer = combineReducers({
  user: userReducer,
  certificateIssuer: certificateIssuerReducer,
  certificateReceiver: certificateReceiverReducer,
  admin:adminReducer
});

const store = configureStore({
  reducer: reducer,
});
export default store;
