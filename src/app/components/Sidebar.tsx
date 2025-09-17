"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { href: "/dashboard", icon: "/icons/dash-icons/1.png", label: "Dashboard" },
  { href: "/animal_bite_record", icon: "/icons/dash-icons/2.png", label: "Animal Bite Record" },
  { href: "/register", icon: "/icons/dash-icons/3.png", label: "Register Patient" },
  { href: "/wristbands", icon: "/icons/dash-icons/4.png", label: "Wristbands" },
  { href: "/checkins", icon: "/icons/dash-icons/5.png", label: "Check-ins" },
  { href: "/billing", icon: "/icons/dash-icons/6.png", label: "Billing/Payment" },
  { href: "/sms", icon: "/icons/dash-icons/7.png", label: "SMS Notifications" },
  { href: "/report", icon: "/icons/dash-icons/8.png", label: "Report & Analysis" },
  { href: "/emergency", icon: "/icons/dash-icons/9.png", label: "Emergency Protocols" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Sidebar classes for responsiveness and stickiness
  const sidebarClass = `sidebar bg-blue-900 text-white min-h-screen w-64 flex flex-col p-4 fixed md:sticky md:top-0 z-40 top-0 left-0 h-full transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`;

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className={`md:hidden fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded focus:outline-none ${open ? 'hidden' : 'block'}`}
        aria-label="Open sidebar menu"
        onClick={() => setOpen(true)}
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {/* Overlay for mobile when sidebar is open */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden" onClick={() => setOpen(false)} aria-label="Close sidebar overlay" />}
      <aside className={sidebarClass} aria-label="Sidebar navigation">
        {/* Close button for mobile */}
        <button
          className="md:hidden self-end mb-4 text-white p-2 rounded focus:outline-none"
          aria-label="Close sidebar menu"
          onClick={() => setOpen(false)}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="logo flex flex-col items-center mb-8">
          <Image src="/icons/meow_white.png" alt="Animal Bite Clinic Logo" width={60} height={60} />
          <h2 className="text-lg font-bold mt-2">Animal Bite Clinic</h2>
        </div>
        <ul className="menu flex-1 flex flex-col gap-2">
          {menuItems.map((item) => (
            <li key={item.href} className={`rounded-lg px-3 py-2 flex items-center gap-3 cursor-pointer transition-colors ${pathname === item.href ? "bg-blue-700 font-semibold" : "hover:bg-blue-800"}`}>
              <Link href={item.href} className="flex items-center gap-3 w-full h-full" onClick={() => setOpen(false)}>
                <Image src={item.icon} alt={item.label + ' icon'} width={24} height={24} />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
