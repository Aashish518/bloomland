import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { jwtDecode } from "jwt-decode";
import { setToken } from "../../store/slices/authSlice";

const PublicRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  // Validate token before redirecting
  const isValidToken = useMemo(() => {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (err) {
      console.log(err);
      return false;
    }
  }, [token]);

  // Redirect to dashboard if token is valid
  if (!isValidToken) {
    dispatch(setToken(null));
    localStorage.getItem("token") && localStorage.removeItem("token");
    return <Navigate to={"/auth/login"} />;
  }
  return children;
};

export default PublicRoute;
