import './globals.css'

import Link from 'next/link'

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
  LogOut,
} from 'lucide-react'

export const metadata = {
  title: 'ProveOps',
  description: 'Meter proving software',
}

export default function RootLayout({
  children,
}) {

  return (

    <html lang="en">

      <body>

        <div className="app-layout">

          <aside className="sidebar">

            <Link href="/">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>

            <Link href="/meters">
              <Gauge size={20} />
              <span>Meters</span>
            </Link>

            <Link href="/history">
              <History size={20} />
              <span>History</span>
            </Link>

            <Link href="/add-meter">
              <PlusCircle size={20} />
              <span>Add Meter</span>
            </Link>

            <Link href="/add-company">
              <Building2 size={20} />
              <span>Add Company</span>
            </Link>

            <Link href="/add-technician">
              <Users size={20} />
              <span>Add Technician</span>
            </Link>

            <Link href="/technician-dashboard">
              <ClipboardList size={20} />
              <span>Technician Dashboard</span>
            </Link>

            <Link href="/technician-schedule">
              <CalendarDays size={20} />
              <span>Technician Schedule</span>
            </Link>

            <Link href="/dispatch-board">
              <ClipboardList size={20} />
}