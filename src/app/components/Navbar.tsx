"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "../style/navbar.scss";
import LogoutButton from "./LogoutButton";
import { auth } from "../utils/jwt";
const Navbar = () => {
  const userid = auth()?.sub;

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
