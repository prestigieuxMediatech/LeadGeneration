
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

// ================= DASHBOARD LAYOUT =================

const DashboardLayout = () => {
  return (
    <SidebarProvider className="!flex !w-full !min-w-0 !max-w-full overflow-x-clip bg-[#eeece5]">

      <AppSidebar />

      <SidebarInset className="!w-0 !min-w-0 !max-w-full !flex-1 overflow-x-clip bg-[#eeece5]">

        {/* MOBILE HEADER */}

        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white/90 px-4 backdrop-blur-xl lg:hidden">

          <SidebarTrigger />

          <div className="flex items-center gap-2">

            <img
              src="/logo-removebg-preview.png"
              alt="Logo"
              className="size-7 rounded-lg object-cover"
            />

            <span className="text-sm font-semibold">
              My Dashboard
            </span>

          </div>

        </header>

        {/* DASHBOARD CONTENT */}

        <main className="w-full min-w-0 max-w-full flex-1 overflow-x-clip">
          <Outlet />
        </main>

      </SidebarInset>

    </SidebarProvider>
  );
};

// ================= ADMIN ROUTE =================

const AdminRoute = () => {
  const { getCookie } = useContext(LeadContext);

  const token = getCookie("token");
  const role = getCookie("admin");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== "true") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

// ================= APP =================

const App = () => {
  return (
    <Routes>

      {/* PUBLIC */}

      <Route path="/" element={<Email />} />

      {/* PROTECTED */}

      <Route element={<ProtectedRoute />}>

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

          {/* ADMIN ROUTES */}

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

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
};

export default App;
