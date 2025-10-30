import React, { useState } from "react";
import Logo from "../assets/BL_Orangelogo.png";
import Google from "../assets/google.png";
import { useGoogleLogin } from "@react-oauth/google";
import { ReactComponent as Mail } from "../assets/mail.svg";
import { ReactComponent as Eye } from "../assets/eye.svg";
import { ReactComponent as EyeSlash } from "../assets/eye-off.svg";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
  setDetailsSubmitted,
  setError,
  setLoading,
  setToken,
} from "../store/slices/authSlice";
import { toast } from "react-toastify";
import {
  forgotPassword,
  googleAuth,
  login,
  register,
  resetPassword,
  sendOtp,
} from "../services/operations/auth";
// import axios from "axios";

const Form = ({ type = "login" }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const formData = useSelector((state) => state.formData);
  const params = useParams();
  const { loading, error, selected } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (type === "login") {
      // dispatch(setLoading(true));
      dispatch(
        login({ email, password, navigate, selected: selected?.toString() })
      );
    } else if (type === "signup") {
      // dispatch(setLoading(true));

      if (password !== confirmPassword) {
        dispatch(setError("passwords don't match"));
        toast.warn("passwords don't match");
        // dispatch(setLoading(false));

        return;
      }
      dispatch(sendOtp({ email, password, navigate }));
    } else if (type === "forgot-password") {
      // dispatch(setLoading(true));
      dispatch(forgotPassword({ email }));
    } else if (type === "reset-password") {
      // dispatch(setLoading(true));

      if (password !== confirmPassword) {
        // dispatch(setLoading(true));
        toast.error("passwords don't match");
        return;
      }
      if (password === "") {
        toast.error("password not strong");
        // dispatch(setLoading(true));
        return;
      }
      const resetToken = params.token;
      dispatch(resetPassword({ token: resetToken, password: password }));
    } else if (type === "otp") {
      if (formData.email === "" || formData.password === "" || otp === "") {
        toast.error("No data provided");
        return;
      }
      dispatch(
        register({
          email: formData.email,
          password: formData.password,
          otp: otp,
          navigate: navigate,
        })
      );
    }
  };

  const responseGoogle = async (authResult) => {
    try {
      setLoading(true);
      if (authResult["code"]) {
        const result = await googleAuth(authResult.code);
        const token = result.data.token;

        localStorage.setItem("token", token);
        dispatch(setToken(token));
        dispatch(setDetailsSubmitted(result.data.detailsSubmitted));
        if (result.data.detailsSubmitted) {
          if (selected) {
            setTimeout(() => {
              navigate(selected);
            }, 100);
          } else {
            navigate("/dashboard");
          }
        } else {
          navigate("/details");
        }
      } else {
        throw new Error(authResult);
      }
    } catch (e) {
      console.log("Error while Google Login...", e);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="w-full max-w-md bg-white rounded-lg px-10 h-full flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex pb-3">
            <img src={Logo} alt="logo" className="w-fit h-12" />
          </div>

          {/* Header */}
          <p className="flex flex-col ml-0 text-lg font-bold text-gray-700">
            {type === "login"
              ? "Login to your Account"
              : type === "signup"
              ? "Create an Account"
              : type === "forgot-password"
              ? "Forgot Password"
              : type === "reset-password"
              ? "Reset Password"
              : type === "otp"
              ? "Enter OTP"
              : ""}
          </p>
          <p className="text-gray-500 text-xs mb-6">
            {type === "login"
              ? "See what is going on with your business"
              : type === "signup"
              ? "Create an account to get started"
              : type === "forgot-password"
              ? "Enter your email to reset your password"
              : type === "reset-password"
              ? "Enter your new password"
              : type === "otp"
              ? "Enter the OTP sent to your email"
              : ""}
          </p>

          {(type === "login" || type === "signup") && (
            <>
              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white mb-3"
              >
                <img src={Google} alt="google" className="w-4 h-4 mr-2" />
                <span className="text-gray-600 text-xs">
                  Continue with Google
                </span>
              </button>

              {/* Or Divider */}
              <div className="flex items-center justify-center my-4">
                <span className="border-t border-gray-300 flex-grow"></span>
                <span className="px-3 text-xs text-gray-500">
                  {type === "login"
                    ? "or Sign in with Email"
                    : "or Sign up with Email"}
                </span>
                <span className="border-t border-gray-300 flex-grow"></span>
              </div>
            </>
          )}

          {/* Email Input */}
          {type !== "otp" && type !== "reset-password" && (
            <>
              <div className="mb-4 ">
                <label
                  htmlFor="email"
                  className="block text-xs font-extralight text-[#A1A1A1] mb-1"
                >
                  Email
                </label>
                <div className="flex items-center border border-[#DED2D9] rounded-md">
                  <Mail
                    width={20}
                    height={20}
                    className="ml-2 mr-2 font-light"
                  />
                  <input
                    type="email"
                    id="email"
                    className="w-full px-1 py-2  focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm [&:-webkit-autofill]:bg-white [&:-webkit-autofill:hover]:bg-white [&:-webkit-autofill:focus]:bg-white"
                    placeholder="mail@abc.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // autoComplete="off"
                  />
                </div>
                {error && error.type === "email" && (
                  <p className="text-red-500 text-xs mt-1">{error.message}</p>
                )}
              </div>
            </>
          )}

          {/* Password Input */}
          {(type === "login" ||
            type === "signup" ||
            type === "reset-password") && (
            <>
              <div className="mb-4 ">
                <label
                  htmlFor="password"
                  className="block text-xs font-extralight text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-3 py-2 border border-[#DED2D9] rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm [&:-webkit-autofill]:bg-white [&:-webkit-autofill:hover]:bg-white [&:-webkit-autofill:focus]:bg-white"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlash width={20} height={20} />
                    ) : (
                      <Eye width={20} height={20} />
                    )}
                  </button>
                </div>
                {error && error.type === "password" && (
                  <p className="text-red-500 text-xs mt-1">{error.message}</p>
                )}
              </div>
            </>
          )}

          {(type === "signup" || type === "reset-password") && (
            <div className="mb-4 ">
              <label
                htmlFor="confirm_password"
                className="block text-xs font-extralight text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm_password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
                  placeholder="••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlash width={20} height={20} />
                  ) : (
                    <Eye width={20} height={20} />
                  )}
                </button>
                {error && error.type === "confirmPassword" && (
                  <p className="text-red-500 text-xs mt-1">{error.message}</p>
                )}
              </div>
            </div>
          )}

          {type === "otp" && (
            <div className="mb-4 ">
              <label
                htmlFor="otp"
                className="block text-xs font-extralight text-gray-700 mb-1"
              >
                OTP
              </label>
              <div className="flex items-center border border-[#DED2D9] rounded-md">
                <input
                  type="text"
                  id="otp"
                  className="w-full px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-sm"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                {error && error.type === "otp" && (
                  <p className="text-red-500 text-xs mt-1">{error.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Remember Me and Forgot Password */}
          {type === "login" && (
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  type="checkbox"
                  className="h-4 w-4  accent-[#E16B33] rounded"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-xs text-[#A1A1A1]"
                >
                  Remember Me
                </label>
              </div>
              <a
                href="#"
                className="text-xs text-[#E16B33] hover:text-[#E16B33]"
              >
                Forgot Password?
              </a>
            </div>
          )}

          {/* Login Button */}
          {loading ? (
            <div className="flex justify-center my-5">
              <ClipLoader color="black" />
            </div>
          ) : (
            <button
              type="submit"
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white ${
                loading ? "bg-[#F9A26B]" : "bg-[#E16B33]"
              } hover:bg-[#E16B33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E16B33] ${
                type === "otp" ? "mb-2" : "mb-6"
              } text-sm font-semibold`}
              onClick={handleSubmit}
            >
              {loading ? (
                <ClipLoader color="white" speedMultiplier={0.5} />
              ) : type === "login" ? (
                "Login"
              ) : type === "signup" ? (
                "Sign Up"
              ) : type === "forgot-password" ? (
                "Submit"
              ) : type === "reset-password" ? (
                "Submit"
              ) : type === "otp" ? (
                "Submit"
              ) : (
                ""
              )}
            </button>
          )}

          {type === "otp" && (
            <button
              // type="submit"
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-[#E16B33] bg-[#FFE6C9] hover:bg-[#FFE6C9] focus:outline-none ${
                type === "otp" ? "mb-2" : "mb-6"
              } text-sm font-semibold`}
            >
              Resend OTP
            </button>
          )}
        </div>

        {/* Create Account Link */}
        {type !== "otp" && type !== "reset-password" && (
          <>
            <div className="text-center flex justify-center gap-x-2">
              <span className="text-sm text-gray-600">
                {type === "login"
                  ? "Not Registered Yet? "
                  : "Already have an account? "}
              </span>
              <div
                onClick={() => {
                  type === "login"
                    ? navigate("/auth/signup")
                    : navigate("/auth/login");
                }}
                className="text-sm cursor-pointer text-[#E16B33] hover:text-[#E16B33]"
              >
                {type === "login" ? "Create an account" : "Login"}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Form;
