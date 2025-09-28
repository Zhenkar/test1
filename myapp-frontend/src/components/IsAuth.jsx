import React from "react";
import { Navigate } from "react-router-dom";

const IsAuth = () => {
  const userName = localStorage.getItem("username");
  const userType = localStorage.getItem("userType");

  return userName == null ? (
    <Navigate to="/login" replace />
  ) : userType == "artist" ? (
    <Navigate to="/digA/home" replace />
  ) : (
    <Navigate to="/digA/home" replace />
  );
};

export default IsAuth;
