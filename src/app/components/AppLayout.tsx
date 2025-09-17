"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login";
  return (
    <div className="flex min-h-screen">
      {!hideSidebar && (
        <div className="hidden md:block h-screen sticky top-0">
          <Sidebar />
        </div>
      )}
      {/* Sidebar is already fixed for mobile via Sidebar.tsx */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
