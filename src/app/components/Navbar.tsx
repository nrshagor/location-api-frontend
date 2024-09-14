"use client";
import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import LogoutButton from "./LogoutButton";
import { auth } from "../utils/jwt";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NavbarComponent = () => {
  const [userid, setUserid] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const path = usePathname();

  // Get user ID
  useEffect(() => {
    const userIdFromAuth = auth()?.sub;
    setUserid(userIdFromAuth ? String(userIdFromAuth) : null);
  }, [path]);

  // Menu items
  const menuItems = userid
    ? ["Dashboard", "Profile", "Log Out"]
    : ["Login", "Register"];

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      {/* Mobile menu toggle */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      {/* Brand and main navigation */}
      <NavbarContent justify="center" className="sm:hidden pr-3">
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            Home
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            Home
          </Link>
        </NavbarBrand>

        {userid ? (
          <>
            <NavbarItem>
              <Link href="/dashboard">Dashboard</Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/dashboard/profile">Profile</Link>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <Link href="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/register">Register</Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      {/* User action buttons */}
      <NavbarContent justify="end">
        {userid && (
          <NavbarItem>
            <LogoutButton />
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link
              href={`/${item.toLowerCase()}`}
              className="w-full"
              color={item === "Log Out" ? "danger" : "foreground"}
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavbarComponent;
