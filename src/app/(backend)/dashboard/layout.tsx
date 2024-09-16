// dashboard/layout.tsx
"use client";

import React, { useState } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const pathname = usePathname(); // Get current path for active link highlight

  const toggleSettingsMenu = () => setIsSettingsOpen(!isSettingsOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative flex min-h-screen overflow-y-hidden">
      {/* Sidebar Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed bottom-4 left-4 z-50 text-white text-xl bg-gray-800 p-2 rounded"
      >
        <FaBarsStaggered />
      </button>

      {/* Sidebar */}
      <aside
        className={`z-10 w-64 bg-gray-800 text-white p-4 space-y-6 fixed top-0 left-0 h-full transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="text-lg font-bold">Dashboard</div>
        <nav className="space-y-4">
          {/* Main Navigation Links */}
          <Link
            href="/dashboard"
            className={`block py-2 px-4 rounded ${
              pathname === "/dashboard" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            Home
          </Link>
          <Link
            href="/dashboard/profile"
            className={`block py-2 px-4 rounded ${
              pathname === "/dashboard/profile"
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            Profile
          </Link>

          {/* Settings with Dropdown */}
          <div>
            <button
              onClick={toggleSettingsMenu}
              className={`w-full text-left flex items-center justify-between py-2 px-4 rounded transition-colors ${
                isSettingsOpen ? "bg-blue-600" : "hover:bg-gray-700"
              }`}
            >
              Settings
              {isSettingsOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
            </button>
            {isSettingsOpen && (
              <div className="pl-6 space-y-2">
                <Link
                  href="/dashboard/change-password"
                  className={`block py-2 px-4 rounded ${
                    pathname === "/dashboard/change-password"
                      ? "bg-blue-600"
                      : "hover:bg-gray-600"
                  }`}
                >
                  Change Password
                </Link>
                {/* Add more nested links as needed */}
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 lg:ml-64">
        {children} {/* Nested Page content will be rendered here */}
      </main>
    </div>
  );
}
