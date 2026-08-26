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

                <div className="sidebar-nav">

                <div className="sidebar-section">

  <p className="sidebar-heading">
    OVERVIEW
  </p>

  <Link href="/">
    <LayoutDashboard size={20} />
    <span>Dashboard</span>
  </Link>

</div>

<div className="sidebar-section">

  <p className="sidebar-heading">
    OPERATIONS
  </p>

  <Link href="/meters">
    <Gauge size={20} />
    <span>Meters</span>
  </Link>

  <Link href="/history">
    <History size={20} />
    <span>History</span>
  </Link>

  <Link href="/technician-dashboard">
    <ClipboardList size={20} />
    <span>Technician Dashboard</span>
  </Link>

  <Link href="/technician-schedule">
    <CalendarDays size={20} />
    <span>Technician Schedule</span>
  </Link>

  <Link href="/dispatch-calendar">
    <CalendarDays size={20} />
    <span>Dispatch Calendar</span>
  </Link>

  <Link href="/dispatch-board">
    <ClipboardList size={20} />
    <span>Dispatch Board</span>
  </Link>

  <Link href="/meter-map">
    <Map size={20} />
    <span>Meter Map</span>
  </Link>

</div>

<div className="sidebar-section">

  <p className="sidebar-heading">
    MANAGEMENT
  </p>

  <Link href="/users">
  <Users size={20} />
  <span>Users</span>
</Link>

  <Link href="/add-meter">
    <PlusCircle size={20} />
    <span>Add Meter</span>
  </Link>

  <Link href="/add-technician">
    <Users size={20} />
    <span>Add Technician</span>
  </Link>

  <Link href="/add-company">
    <Building2 size={20} />
    <span>Add Company</span>
  </Link>

</div>

<div className="sidebar-section">

  <p className="sidebar-heading">
    SYSTEM
  </p>

  <Link href="/settings">
    <Settings size={20} />
    <span>Settings</span>
  </Link>

  <LogoutButton />

</div>

    </div>

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