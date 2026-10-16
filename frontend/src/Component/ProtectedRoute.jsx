import { LeadContext } from "@/Context/LeadContext";

import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const{getCookie}=useContext(LeadContext)
  const token = getCookie('token');

  
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;