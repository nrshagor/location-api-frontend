"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/app/utils/jwt";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const path = usePathname();
  console.log(userRole);
  // Get user ID
  useEffect(() => {
    const userRoleFromAuth = auth()?.role;
    setUserRole(userRoleFromAuth ? String(userRoleFromAuth) : null);
  }, [path]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isadminOpen, setIsadminOpen] = useState(true);

  const pathname = usePathname(); // Get current path for active link highlight

  const adminMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const subscriptionMenuRef = useRef<HTMLDivElement>(null);

  const toggleSettingsMenu = () => setIsSettingsOpen(!isSettingsOpen);
  const toggleSubscriptionMenu = () =>
    setIsSubscriptionOpen(!isSubscriptionOpen);
  const toggleadminMenu = () => setIsadminOpen(!isadminOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="relative flex min-h-full overflow-y-hidden">
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
              pathname === "/dashboard" ? "bg-gray-600" : "hover:bg-gray-700"
            }`}
          >
            Dashboard
          </Link>

          {/* Admin with Dropdown */}
          {userRole == "superAdmin" && (
            <div>
              <button
                onClick={toggleadminMenu}
                className={`w-full text-left flex items-center justify-between py-2 px-4 rounded transition-colors ${
                  isadminOpen ? "bg-gray-600" : "hover:bg-gray-700"
                }`}
              >
                Admin
                {isadminOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
              </button>
              <div
                ref={adminMenuRef}
                className={`pl-6 space-y-2 transition-all duration-500 ease-in-out overflow-hidden ${
                  isadminOpen ? "max-h-[500px]" : "max-h-0"
                }`}
                style={{
                  maxHeight: isadminOpen
                    ? adminMenuRef.current?.scrollHeight
                    : 0,
                }}
              >
                <Link
                  href="/dashboard/admin/TransactionTable"
                  className={`block py-2 px-4 mt-4 rounded ${
                    pathname === "/dashboard/admin/TransactionTable"
                      ? "bg-gray-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  Transaction
                </Link>
              </div>
              <div
                ref={adminMenuRef}
                className={`pl-6 space-y-2 transition-all duration-500 ease-in-out overflow-hidden ${
                  isadminOpen ? "max-h-[500px]" : "max-h-0"
                }`}
                style={{
                  maxHeight: isadminOpen
                    ? adminMenuRef.current?.scrollHeight
                    : 0,
                }}
              >
                <Link
                  href="/dashboard/admin/user-list"
                  className={`block py-2 px-4 mt-4 rounded ${
                    pathname === "/dashboard/admin/user-list"
                      ? "bg-gray-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  User List
                </Link>
              </div>
              <div
                ref={adminMenuRef}
                className={`pl-6 space-y-2 transition-all duration-500 ease-in-out overflow-hidden ${
                  isadminOpen ? "max-h-[500px]" : "max-h-0"
                }`}
                style={{
                  maxHeight: isadminOpen
                    ? adminMenuRef.current?.scrollHeight
                    : 0,
                }}
              >
                <Link
                  href="/dashboard/admin/subscription-plan"
                  className={`block py-2 px-4 mt-4 rounded ${
                    pathname === "/dashboard/admin/subscription-plan"
                      ? "bg-gray-600"
                      : "hover:bg-gray-700"
                  }`}
                >
                  Subscription Plan
                </Link>
              </div>
            </div>
          )}

          {/* Subscription with Dropdown */}
          <div>
            <button
              onClick={toggleSubscriptionMenu}
              className={`w-full text-left flex items-center justify-between py-2 px-4 rounded transition-colors ${
                isSubscriptionOpen ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
            >
              Subscription
              {isSubscriptionOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
            </button>
            <div
              ref={subscriptionMenuRef}
              className={`pl-6 space-y-2 transition-all duration-500 ease-in-out overflow-hidden ${
                isSubscriptionOpen ? "max-h-[500px]" : "max-h-0"
              }`}
              style={{
                maxHeight: isSubscriptionOpen
                  ? subscriptionMenuRef.current?.scrollHeight
                  : 0,
              }}
            >
              <Link
                href="/dashboard/subscription"
                className={`block py-2 px-4 mt-4 rounded ${
                  pathname === "/dashboard/subscription"
                    ? "bg-gray-600"
                    : "hover:bg-gray-700"
                }`}
              >
                Add Domain
              </Link>
              <Link
                href="/dashboard/my-subscription"
                className={`block py-2 px-4 mt-4 rounded ${
                  pathname === "/dashboard/my-subscription"
                    ? "bg-gray-600"
                    : "hover:bg-gray-700"
                }`}
              >
                My Subscription
              </Link>
              {/* Add more nested links as needed */}
            </div>
          </div>

          {/* Settings with Dropdown */}
          <div>
            <button
              onClick={toggleSettingsMenu}
              className={`w-full text-left flex items-center justify-between py-2 px-4 rounded transition-colors ${
                isSettingsOpen ? "bg-gray-600" : "hover:bg-gray-700"
              }`}
            >
              Settings
              {isSettingsOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
            </button>
            <div
              ref={settingsMenuRef}
              className={`pl-6 space-y-2 transition-all duration-500 ease-in-out overflow-hidden ${
                isSettingsOpen ? "max-h-[500px]" : "max-h-0"
              }`}
              style={{
                maxHeight: isSettingsOpen
                  ? settingsMenuRef.current?.scrollHeight
                  : 0,
              }}
            >
              <Link
                href="/dashboard/profile"
                className={`block py-2 px-4 mt-4 rounded ${
                  pathname === "/dashboard/profile"
                    ? "bg-gray-600"
                    : "hover:bg-gray-700"
                }`}
              >
                Profile
              </Link>
              <Link
                href="/dashboard/change-password"
                className={`block py-2 px-4 mt-4 rounded ${
                  pathname === "/dashboard/change-password"
                    ? "bg-gray-600"
                    : "hover:bg-gray-600"
                }`}
              >
                Change Password
              </Link>
              {/* Add more nested links as needed */}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center overflow-y-auto md:overflow-y-hidden min-h-[90vh] bg-gray-100 p-6 lg:ml-64">
        {children} {/* Nested Page content will be rendered here */}
      </main>
    </div>
  );
}
