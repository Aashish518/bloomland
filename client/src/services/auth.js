import axios from "axios";
import { authEndpoints } from "./apis";
import { setToken } from "@/store/slices/authSlice";
import { toast } from "react-toastify";

export const login = ({ email, password, navigate }) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(authEndpoints.login, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      dispatch(setToken(response.data.token));
      toast.success(response.data.message);
      navigate("/admin");
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
      throw new Error(error.response.data.message);
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch(setToken(null));
    toast.success("Logged Out Successfully!");
  };
};
