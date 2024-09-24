"use client";
import React, { useState } from "react";
import axios from "axios";
import { getCookie } from "cookie-handler-pro";

const Page = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(""); // Clear any previous errors
    setMessage("");
    const token = getCookie("token");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/auth/change-password`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        setError(error.response?.data?.message || "An error occurred");
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className=" flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[85vw] max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Change Password</h1>

        {/* Error message */}
        {error && (
          <p className="text-center text-red-500 mb-4 font-semibold">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Old Password</label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                placeholder="Enter old password"
                value={formData.oldPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={toggleOldPasswordVisibility}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showOldPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                name="confirmNewPassword"
                placeholder="Confirm new password"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={toggleConfirmNewPasswordVisibility}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmNewPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>

          {/* Success message */}
          {message && (
            <p className="text-center text-green-500 font-semibold">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Page;
