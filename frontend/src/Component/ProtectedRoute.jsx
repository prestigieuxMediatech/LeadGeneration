import { InvoiceContext } from "../Context/InvoiceContext";
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const{getCookie}=useContext(InvoiceContext)
  const token = getCookie('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;