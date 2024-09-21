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
import clsx from "clsx"; // For conditionally applying classes

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
  const menuItems = userid ? ["Dashboard", "Log Out"] : ["Login", "Register"];

  // Function to check if the current path is active
  const isActive = (href: string) => path === href;

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
          <Link
            href="/"
            className={clsx(
              " text-inherit p-2 rounded",
              isActive("/") && "bg-gray-300 font-bold"
            )}>
            Home
          </Link>
        </NavbarBrand>
        <NavbarBrand>
          <Link
            href="/docs"
            className={clsx(
              " text-inherit p-2 rounded",
              isActive("/docs") && "bg-gray-300 font-bold"
            )}>
            Docs
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <Link
            href="/"
            className={clsx(
              " text-inherit p-2 rounded",
              isActive("/") && "bg-gray-300 font-bold"
            )}>
            Home
          </Link>
        </NavbarBrand>
        <NavbarBrand>
          <Link
            href="/docs"
            className={clsx(
              " text-inherit p-2 rounded",
              isActive("/docs") && "bg-gray-300 font-bold"
            )}>
            Docs
          </Link>
        </NavbarBrand>
        <NavbarBrand>
          <Link
            href="/how-to"
            className={clsx(
              " text-inherit p-2 rounded",
              isActive("/how-to") && "bg-gray-300 font-bold"
            )}>
            How To
          </Link>
        </NavbarBrand>

        {userid ? (
          <>
            <NavbarItem>
              <Link
                href="/dashboard"
                className={clsx(
                  "p-2 rounded",
                  isActive("/dashboard") && "bg-gray-300 font-bold"
                )}>
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                href="/dashboard/profile"
                className={clsx(
                  "p-2 rounded",
                  isActive("/dashboard/profile") && "bg-gray-300 font-bold"
                )}>
                Profile
              </Link>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <Link
                href="/login"
                className={clsx(
                  "p-2 rounded",
                  isActive("/login") && "bg-gray-300 font-bold"
                )}>
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                href="/register"
                className={clsx(
                  "p-2 rounded",
                  isActive("/register") && "bg-gray-300 font-bold"
                )}>
                Register
              </Link>
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
        <NavbarMenuItem>
          <Link
            href="/how-to"
            className={clsx(
              " text-inherit p-2 rounded",
              isActive("/how-to") && "bg-gray-300 font-bold"
            )}>
            How To
          </Link>
        </NavbarMenuItem>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link
              href={`/${item.toLowerCase()}`}
              className={clsx(
                "w-full p-2 rounded",
                isActive(`/${item.toLowerCase()}`) && "bg-gray-300 font-bold"
              )}>
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavbarComponent;
