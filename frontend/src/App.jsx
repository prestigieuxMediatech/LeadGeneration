import React, { useContext } from "react";

import { AppSidebar } from "./Component/AppSidebar";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";

import Home from "./Pages/Home";
import LeadGeneration from "./Pages/LeadGeneration";
import LeadDashboard from "./Pages/LeadDashboard";
import WhatsAppConnect from "./Pages/WhatsAppConnect";
import Email from "./Pages/Email";
import Register from "./Pages/Register";

import { LeadContext } from "./Context/LeadContext";
import ProtectedRoute from "./Component/ProtectedRoute";

// Dashboard Layout
const DashboardLayout = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-zinc-50">
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          {/* Mobile Top Bar */}
          <header
            className="
              sticky top-0 z-40 flex h-14 items-center gap-3
              border-b border-zinc-200/80 bg-white/90
              px-4 backdrop-blur-xl lg:hidden
            "
          >
            <SidebarTrigger />

            <div className=" ml-5  w-48 h-12 flex items-center ">
              <img
                src="/logo-removebg-preview.png"
                alt="Logo"
                className="  w-full h-full object-cover"
              />

            
            </div>
          </header>

          <main className="min-h-screen min-w-0 overflow-x-hidden">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

// Admin Protected Route
const AdminRoute = () => {
  const { getCookie } = useContext(LeadContext);

  const role = getCookie("admin");

  if (role !== "true") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

const App = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTE */}
      <Route path="/" element={<Email />} />

      {/* ALL PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>

        {/* Dashboard Layout */}
        <Route element={<DashboardLayout />}>

          <Route
            path="/dashboard"
            element={<LeadDashboard />}
          />

          <Route
            path="/generatelead"
            element={<LeadGeneration />}
          />

          <Route
            path="/home"
            element={<Home />}
          />

          <Route
            path="/email"
            element={<Email />}
          />

          {/* ADMIN ONLY ROUTES */}
          <Route element={<AdminRoute />}>

            <Route
              path="/connect"
              element={<WhatsAppConnect />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

          </Route>

        </Route>

      </Route>

      {/* UNKNOWN ROUTES */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default App;