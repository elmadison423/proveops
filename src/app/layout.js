import './globals.css'

import Link from 'next/link'

import { Toaster }
from 'react-hot-toast'

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
} from 'lucide-react'

import ThemeLoader
from '../components/ThemeLoader'

import { Calendar } from "lucide-react";

export const metadata = {

  title: 'ProveOps',

  description:
    'Operational Intelligence Platform',
}

export default function RootLayout({
  children,
}) {

  return (

    <html lang="en">

      <body>

        <ThemeLoader />

        <div className="app-layout">

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

    <Link href="/calendar">
  <Calendar size={20} />
  <span>Calendar</span>
</Link>

    <Link href="/">
      <span>📊</span>
      <span>Dashboard</span>
    </Link>

    <Link href="/meters">
      <span>🧭</span>
      <span>Meters</span>
    </Link>

    <Link href="/history">
      <span>🕒</span>
      <span>History</span>
    </Link>

    <Link href="/add-meter">
      <span>➕</span>
      <span>Add Meter</span>
    </Link>

    <Link href="/add-company">
      <span>🏢</span>
      <span>Add Company</span>
    </Link>

    <Link href="/add-technician">
      <span>👥</span>
      <span>Add Technician</span>
    </Link>

    <Link href="/technician-dashboard">
      <span>📋</span>
      <span>Technician Dashboard</span>
    </Link>

    <Link href="/technician-schedule">
      <span>📅</span>
      <span>Technician Schedule</span>
    </Link>

    <Link href="/dispatch-board">
      <span>🗂️</span>
      <span>Dispatch Board</span>
    </Link>

    <Link href="/meter-map">
      <span>🗺️</span>
      <span>Meter Map</span>
    </Link>

    <Link href="/settings">
      <span>⚙️</span>
      <span>Settings</span>
    </Link>

    <Link href="/login">
      <span>↪️</span>
      <span>Logout</span>
    </Link>

      </div>
    </div>
  </aside>

          <div className="main-content">

            <Toaster
              position="top-right"
              toastOptions={{
                style: {

                  background:
                    'rgba(15,23,42,0.95)',

                  color: 'white',

                  border:
                    '1px solid rgba(255,255,255,0.08)',

                  borderRadius: '14px',
                },
              }}
            />

            {children}

          </div>

        </div>

      </body>

    </html>
  )
}