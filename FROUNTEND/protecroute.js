import React from "react";
import { Navigate } from "react-router-dom";


const ProtectedRouteSimple = ({ children }) => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRouteSimple;