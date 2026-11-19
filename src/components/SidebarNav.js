"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  Gauge,
  History,
  PlusCircle,
  Users,
  ClipboardList,
  CalendarDays,
  Map,
  Settings,
} from "lucide-react";

import { useOrganization } from "../context/OrganizationContext";
import LogoutButton from "./LogoutButton";

export default function SidebarNav() {

  const {
    profile,
  } = useOrganization();

  const isOrganizationAdmin =
    profile?.role === "Organization Admin";

  return (

    <div className="sidebar-nav">

      {/* OVERVIEW */}

      <div className="sidebar-section">

        <p className="sidebar-heading">
          OVERVIEW
        </p>

        <Link href="/">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

      </div>


      {/* OPERATIONS */}

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


      {/* MANAGEMENT */}

<div className="sidebar-section">

  <p className="sidebar-heading">
    MANAGEMENT
  </p>

  {isOrganizationAdmin && (

    <>
      <Link href="/users">
        <Users size={20} />
        <span>Users</span>
      </Link>

    </>

  )}

  <Link href="/add-meter">
    <PlusCircle size={20} />
    <span>Add Meter</span>
  </Link>

  {isOrganizationAdmin && (

    <Link href="/add-technician">
      <Users size={20} />
      <span>Add Technician</span>
    </Link>

  )}

  {isOrganizationAdmin && (

    <>
      <Link href="/archived-meters">
        <Gauge size={20} />
        <span>Archived Meters</span>
      </Link>

    </>

  )}

</div>


      {/* SYSTEM */}

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

  );
}