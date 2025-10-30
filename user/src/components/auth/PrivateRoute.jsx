import { jwtDecode } from "jwt-decode";
import React from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  // Validate token before redirecting
  const isValidToken = useMemo(() => {
    if (!token) return { isValid: false, details: false };

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        return { isValid: false, details: false };
      }
      if (!decoded.details) {
        return { isValid: true, details: false };
      }
      return { isValid: true, details: true };
    } catch (err) {
      console.log(err);
      return { isValid: false, details: false };
    }
  }, [token]);

  // Redirect to dashboard if token is valid
  if (!isValidToken.isValid) {
    return <Navigate to={"/auth/login"} />;
  }
  if (!isValidToken.details) {
    <Navigate to={"/details"} />;
  }
  return children;
};

export default PrivateRoute;
