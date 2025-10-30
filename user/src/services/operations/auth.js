import axios from "axios";
import {
  setDetailsSubmitted,
  setError,
  setLoading,
  setToken,
} from "../../store/slices/authSlice";
import { authEndpoints } from "../apis";
import { setFormData } from "../../store/slices/formData";
import { toast } from "react-toastify";
import { fetchUser } from "../../store/slices/userSlice";

export const sendOtp = ({ email, password, navigate }) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      await axios.post(authEndpoints.SEND_OTP, { email });
      dispatch(setFormData({ email, password }));
      toast.success("OTP sent to your email");
      navigate("/auth/otp");
    } catch (error) {
      toast.error(
        error.response ? `${error.response.data.message}` : `${error.message}`
      );
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const register = ({ email, password, otp, navigate }) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post(authEndpoints.REGISTER, {
        email: email,
        password: password,
        otp: otp,
      });
      dispatch(setToken(response.data.token));
      localStorage.setItem("token", response.data.token);
      dispatch(setToken(response.data.token));
      toast.success("account created successfully");
      navigate("/details");
    } catch (error) {
      toast.error(
        error.response ? `${error.response.data.message}` : `${error.message}`
      );
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const login = ({ email, password, navigate, selected }) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post(authEndpoints.LOGIN, {
        email: email,
        password: password,
      });
      dispatch(setToken(response.data.token));
      localStorage.setItem("token", response.data.token);
      dispatch(setDetailsSubmitted(response.data.detailsSubmitted));

      toast.success("Logged in successfully");
      if (response.data.detailsSubmitted) {
        if (selected !== "") {
          setTimeout(() => {
            navigate(selected);
          }, 100);
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/details");
      }
    } catch (error) {
      dispatch(setError(error));
      toast.error(
        error.response ? `${error.response.data.message}` : `${error.message}`
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const submitDetails = (data, token, navigate, selected) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post(authEndpoints.SUBMIT_DETAILS, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      dispatch(setToken(response.data.token));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("detailsSubmitted", response.data.detailsSubmitted);
      dispatch(setDetailsSubmitted(response.data.detailsSubmitted));
      toast.success("Details submitted successfully");
      if (selected !== null) {
        navigate(selected);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response ? `${error.response.data.message}` : `${error.message}`
      );
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const forgotPassword = ({ email }) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      await axios.post(authEndpoints.FORGOT_PASS, {
        email: email,
      });
      toast.success("Check your Email to reset password");
    } catch (error) {
      toast.error(
        error.response ? `${error.response.data.message}` : `${error.message}`
      );
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const resetPassword = ({ token, password, navigate }) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.post(authEndpoints.RESET_PASS, {
        token: token,
        password: password,
      });
      dispatch(setToken(response.data.token));
      localStorage.setItem("token", response.data.token);
      toast.success("password changed successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response ? `${error.response.data.message}` : `${error.message}`
      );
      dispatch(setError(error));
    } finally {
      dispatch(setLoading(true));
    }
  };
};

export const googleAuth = async (code) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/google?code=${code}`
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const editUser = ({ data, token }) => {
  return async (dispatch) => {
    try {
      setLoading({
        element: "edit",
        value: true,
      });
      await axios.post(authEndpoints.UPDATE, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Details Updated!");
      dispatch(fetchUser({ token: token }));
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
    } finally {
      setLoading({
        element: null,
        value: false,
      });
    }
  };
};
