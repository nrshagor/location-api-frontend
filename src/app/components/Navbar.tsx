"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";
import { auth } from "../utils/jwt";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [userid, setUserid] = useState<string | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const path = usePathname();

  // Get user ID
  useEffect(() => {
    const userIdFromAuth = auth()?.sub;
    setUserid(userIdFromAuth ? String(userIdFromAuth) : null);
  }, [path]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center text-white">
      <Link href="/" className="text-xl">
        Home
      </Link>
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={toggleMobileMenu}
      >
        &#9776;
      </button>
      <div
        className={`flex-col md:flex md:flex-row md:items-center ${
          isMobileMenuOpen ? "flex" : "hidden"
        }`}
      >
        {!userid ? (
          <>
            <Link href="/login" className="mt-2 md:mt-0 md:ml-4">
              Login
            </Link>
            <Link href="/register" className="mt-2 md:mt-0 md:ml-4">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="mt-2 md:mt-0 md:ml-4">
              Dashboard
            </Link>
            <Link href="/dashboard/profile" className="mt-2 md:mt-0 md:ml-4">
              Profile
            </Link>
            <LogoutButton />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
