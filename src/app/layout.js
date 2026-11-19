import "./globals.css";

import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { OrganizationProvider } from "../context/OrganizationContext";
import LogoutButton from "../components/LogoutButton";

import {
  LayoutDashboard,
  Gauge,
  History,
  PlusCircle,
  Building2,
  Users,
  ClipboardList,
  CalendarDays,
  Map,
  Settings,
  LogOut,
} from "lucide-react";

import ThemeLoader from "../components/ThemeLoader";
import AppLayout from "../components/AppLayout";
import SidebarNav from "../components/SidebarNav";

export const metadata = {
  title: "ProveOps",
  description: "Operational Intelligence Platform",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>

  <OrganizationProvider>

    <ThemeLoader />

    <AppLayout
          sidebar={
            <aside>

              <div className="sidebar">

                <div className="sidebar-logo">

                  <div className="sidebar-logo-icon">
                    P
                  </div>

                  <div className="sidebar-logo-text">
                    <h2>ProveOps</h2>
                    <p>Intelligence Platform</p>
                  </div>

                </div>

              <SidebarNav />

              </div>

            </aside>
          }
        >

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(15,23,42,0.95)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
              },
            }}
          />

          {children}

           </AppLayout>

  </OrganizationProvider>

      </body>
    </html>
  );
}