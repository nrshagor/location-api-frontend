"use client";
import React, { useEffect } from "react";
import { deleteCookie } from "cookie-handler-pro";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js

const LogoutButton = () => {
  const router = useRouter(); // Initialize the useRouter hook

  const handleLogout = async () => {
    // Delete the authentication cookie
    deleteCookie("token");
    // Redirect to the login page
    router.push("/login");
  };

  return <button onClick={() => handleLogout()}>Logout</button>;
};

export default LogoutButton;
