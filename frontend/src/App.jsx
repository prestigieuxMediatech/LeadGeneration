
import React, { useContext } from "react";

import { AppSidebar } from "./Component/AppSidebar";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Route, Routes, Outlet } from "react-router-dom";

import Home from "./Pages/Home";
import LeadGeneration from "./Pages/LeadGeneration";
import LeadDashboard from "./Pages/LeadDashboard";
import WhatsAppConnect from "./Pages/WhatsAppConnect";
import Email from "./Pages/Email";
import { LeadContext } from "./Context/leadContext";
import Register from "./Pages/Register";


// Dashboard layout (Sidebar only for dashboard pages)
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

          {/* Dashboard Pages */}
          <main className="min-h-screen min-w-0 overflow-x-hidden">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

const App = () => {
  const {getCookie}=useContext(LeadContext)
  const role= getCookie('admin');
  return (
    <Routes>
      {/* Public Route - No Sidebar */}
      <Route path="/" element={<Email />} />
     

      {/* Routes With Sidebar */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<LeadDashboard />} />

        <Route path="/generatelead" element={<LeadGeneration />} />

      { role === "true" &&( <Route path="/connect" element={<WhatsAppConnect />} />)}
           
 {/* { role === "true" &&( <Route path="/register" element={<Register />} />
         )} */}

         <Route path="/register" element={<Register />}/>
           
            
        <Route path="/home" element={<Home />} />

        <Route path="/email" element={<Email />} />
      </Route>
    </Routes>
  );
};

export default App;
