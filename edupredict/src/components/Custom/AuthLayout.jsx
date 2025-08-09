import React from "react";
import { Navigate } from "react-router-dom";

const AuthLayout = ({ token, children }) => {
  const auth = localStorage.getItem(token);
  if (auth) {
    return <>{children}</>;
  } else {
    return <Navigate to={"/"} />;
  }
};

export default AuthLayout;
