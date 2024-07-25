"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "../style/navbar.scss";
import LogoutButton from "./LogoutButton";
import { auth } from "../utils/jwt";
import { usePathname, useRouter } from "next/navigation";
const Navbar = () => {
  const userid = auth()?.sub;
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  }, [path]);

  console.log(userid, "dsafas");
  return (
    <div className="navbar">
      <Link href="/">Home</Link>
      {!userid ? (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">register</Link>
        </>
      ) : (
        <>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/profile">Profile</Link>
          <LogoutButton />
        </>
      )}
      {userid}
    </div>
  );
};

export default Navbar;
