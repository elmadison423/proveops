"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function AppLayout({
  sidebar,
  children,
}) {
  const pathname = usePathname();

  const router = useRouter();

  async function logout() {

  const { error } =
    await supabase.auth.signOut();

  if (error) {

    console.error(error);

    return;
  }

  router.replace("/login");
}

  const hideSidebar =
    pathname === "/login" ||
    pathname === "/register";

  if (hideSidebar) {
    return children;
  }

  return (
  <div className="app-layout">

    {sidebar}

    <div className="main-content">
      {children}
    </div>

  </div>
);
}