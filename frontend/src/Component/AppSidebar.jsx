
import {
  Home,
  Globe,
  LogOut,
  Sparkles,
  ArrowUpRight,
  MessageCircle,
  ActivityIcon,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { GenerateButton } from "@/components/ui/generate-button";
import { useContext } from "react";
import { LeadContext } from "@/Context/leadContext";
import { Accordion } from "@base-ui/react";
import axios from "axios";

export function AppSidebar() {
  const {
    backendUrl,
    getCookie,
    setCookie,
    navigate,
  } = useContext(LeadContext);

  const role = getCookie("admin");
  const token = getCookie("token");

  console.log(role);

  const logout = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/logout`,
        {},
        { headers: { token } }
      );

      console.log(response);
    } catch (e) {
      console.log(e.message);
    }
  };

  const menuItems = [
    {
      title: "Home",
      icon: Home,
      path: "/",
    },

    ...(role === "true"
      ? [
          {
            title: "WhatsApp Management",
            icon: MessageCircle,
            path: "/connect",
          },
        ]
      : []),

    ...(role === "true"
      ? [
          {
            title: "Add Account",
            icon: ActivityIcon,
            path: "/register",
          },
        ]
      : []),
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="
        border-r
        border-[#d5d0c3]
        bg-[#eeece5]
        shadow-[inset_-2px_0_3px_rgba(0,0,0,0.06),4px_0_12px_rgba(0,0,0,0.06)]
      "
    >
      {/* ================= HEADER ================= */}

      <SidebarHeader
        className="
          px-3
          py-4
          bg-[#eeece5]
          animate-in
          fade-in
          slide-in-from-left-2
          duration-500
        "
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="
                h-16
                rounded-2xl
                px-2
                border
                border-[#d5d0c3]
                bg-[#f5f3ec]
                shadow-[inset_2px_2px_2px_#ffffff,inset_-3px_-3px_5px_rgba(0,0,0,0.05),3px_4px_7px_rgba(0,0,0,0.1)]
                transition-all
                duration-300
                hover:bg-[#fffdf1]
              "
            >
              {/* Logo - original animations preserved */}

              <div
                className="
                  h-16
                  w-40
                  overflow-hidden
                  transition-all
                  duration-500
                  hover:scale-[1.03]
                "
              >
                <img
                  src="/logo-removebg-preview.png"
                  alt="Logo"
                  className="
                    h-full
                    w-full
                    object-contain
                    object-left
                    transition-transform
                    duration-500
                    hover:scale-105
                  "
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ================= CONTENT ================= */}

      <SidebarContent
        className="
          bg-[#eeece5]
          px-3
          animate-in
          fade-in
          slide-in-from-left-3
          duration-700
        "
      >
        {/* Section title */}

        <div
          className="
            mb-3
            rounded-lg
            border
            border-[#dedad0]
            bg-[#e9e6dc]
            px-3
            py-2.5
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-neutral-500
            shadow-[inset_2px_2px_4px_rgba(0,0,0,0.07),inset_-2px_-2px_3px_#ffffff]
          "
        >
          Workspace
        </div>

        {/* ================= NAVIGATION ================= */}

        <SidebarMenu className="gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className="
                    h-11
                    rounded-xl
                    transition-all
                    duration-300
                  "
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `
                      group
                      relative
                      flex
                      items-center
                      gap-3
                      overflow-hidden
                      rounded-xl
                      border
                      transition-all
                      duration-300

                      ${
                        isActive
                          ? `
                            border-neutral-800
                            bg-neutral-950
                            text-white
                            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),inset_-2px_-2px_4px_rgba(0,0,0,0.6),3px_4px_7px_rgba(0,0,0,0.18)]
                          `
                          : `
                            border-[#d5d0c3]
                            bg-[#f5f3ec]
                            text-neutral-600
                            shadow-[inset_1px_1px_2px_#ffffff,inset_-2px_-2px_3px_rgba(0,0,0,0.04),2px_3px_5px_rgba(0,0,0,0.09)]
                            hover:bg-[#fffdf1]
                            hover:text-neutral-950
                            hover:translate-x-1
                          `
                      }
                      `
                    }
                  >
                    {/* Active yellow indicator - unchanged */}

                    <span
                      className="
                        absolute
                        left-0
                        top-1/2
                        h-5
                        w-[3px]
                        -translate-y-1/2
                        rounded-r-full
                        bg-[#fff4b8]
                        opacity-0
                        transition-all
                        duration-300
                        group-[.active]:opacity-100
                      "
                    />

                    {/* Icon - original animations preserved */}

                    <Icon
                      className="
                        relative
                        z-10
                        size-[18px]
                        shrink-0
                        transition-all
                        duration-300
                        group-hover:scale-110
                        group-hover:-rotate-3
                      "
                    />

                    {/* Text */}

                    <span
                      className="
                        relative
                        z-10
                        text-[13px]
                        font-medium
                      "
                    >
                      {item.title}
                    </span>

                    {/* Hover arrow - original animations preserved */}

                    <ArrowUpRight
                      className="
                        ml-auto
                        size-3.5
                        opacity-0
                        translate-x-[-5px]
                        transition-all
                        duration-300
                        group-hover:translate-x-0
                        group-hover:opacity-60
                      "
                    />
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        {/* ================= GENERATE BUTTON ================= */}
        {/* Completely unchanged */}

        <div
          className="mt-5 px-1"
          onClick={() => {
            window.location.href = "/generatelead";
          }}
        >
          <GenerateButton hue={45} />
        </div>

        {/* ================= BUSINESS CARD ================= */}

        <div
          className="
            group
            relative
            mt-7
            overflow-hidden
            rounded-2xl
            border
            border-[#d8c47a]
            bg-[#fff9dc]
            p-4
            shadow-[inset_2px_2px_2px_#ffffff,inset_-3px_-3px_5px_rgba(130,110,40,0.12),3px_5px_9px_rgba(0,0,0,0.1)]
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:border-[#e2d67d]
            hover:bg-[#fff9d8]
            hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]
          "
        >
          {/* Decorative circle - original animation preserved */}

          <div
            className="
              absolute
              -right-6
              -top-6
              size-20
              rounded-full
              border
              border-[#e8d88d]
              bg-[#fff4b8]
              shadow-[inset_2px_2px_3px_#ffffff,inset_-3px_-3px_5px_rgba(130,110,40,0.15)]
              transition-transform
              duration-500
              group-hover:scale-150
            "
          />

          {/* Icon */}

          <div
            className="
              relative
              mb-3
              flex
              size-9
              items-center
              justify-center
              rounded-xl
              border
              border-[#d8c47a]
              bg-[#fff4b8]
              shadow-[inset_2px_2px_2px_#ffffff,inset_-2px_-2px_4px_rgba(130,110,40,0.16),2px_3px_5px_rgba(0,0,0,0.1)]
              transition-all
              duration-300
              group-hover:rotate-6
              group-hover:scale-105
            "
          >
            <Sparkles
              className="
                size-4
                text-neutral-900
                transition-transform
                duration-500
                group-hover:rotate-180
              "
            />
          </div>

          <p
            className="
              relative
              text-xs
              font-semibold
              text-neutral-900
            "
          >
            Grow your business
          </p>

          <p
            className="
              relative
              mt-1
              text-[11px]
              leading-4
              text-neutral-500
            "
          >
            Find new leads and manage your website requests.
          </p>

          {/* Bottom line - original animation preserved */}

          <div
            className="
              mt-3
              h-[2px]
              w-8
              rounded-full
              bg-neutral-950
              transition-all
              duration-500
              group-hover:w-full
            "
          />
        </div>
      </SidebarContent>

      {/* ================= FOOTER ================= */}

      <SidebarFooter
        className="
          border-t
          border-[#d5d0c3]
          bg-[#eeece5]
          p-3
          animate-in
          fade-in
          slide-in-from-bottom-2
          duration-700
        "
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={() => {
                logout();
                setCookie("token", "");
                setCookie("admin", "");
                navigate("/");
              }}
              className="
                group
                h-11
                rounded-xl
                border
                border-[#d5d0c3]
                bg-[#f5f3ec]
                text-neutral-600
                shadow-[inset_1px_1px_2px_#ffffff,inset_-2px_-2px_3px_rgba(0,0,0,0.04),2px_3px_5px_rgba(0,0,0,0.1)]
                transition-all
                duration-300
                hover:bg-[#fffdf1]
                hover:text-neutral-950
              "
            >
              <LogOut
                className="
                  size-[18px]
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                "
              />

              <span className="text-[13px] font-medium">
                Logout
              </span>

            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
