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

  return (
    <button
      title="Logout"
      className="flex gap-2 justify-center items-center"
      onClick={() => handleLogout()}>
      {" "}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        width={20}
        height={20}>
        <style>
          {`
        .move {
            animation: moveArrow 1s linear infinite;
        }
        @keyframes moveArrow {
            0% { transform: translateX(0); }
            50% { transform: translateX(10px); }
            100% { transform: translateX(0); }
        }
    `}
        </style>
        <path
          className="move"
          d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
        />
      </svg>
    </button>
  );
};

export default LogoutButton;
