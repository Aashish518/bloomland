import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import userReducer from "../slices/userSlice";
import formData from "../slices/formData";
import eventReducer from "../slices/eventSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  formData: formData,
  event: eventReducer,
});

export default rootReducer;
