"use client";
import CustomModal from "@/app/components/CustomModal";
import { Button } from "@nextui-org/react";
import axios, { AxiosError } from "axios";
import { setCookie } from "cookie-handler-pro";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationIdentifier, setVerificationIdentifier] = useState("");
  const [isEmailLogin, setIsEmailLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const openModal = (content: any) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "identifier") setIdentifier(value);
    if (name === "password") setPassword(value);
  };

  const handleVerify = async () => {
    try {
      const payload = isEmailLogin
        ? { email: verificationIdentifier, verificationCode }
        : { phone: verificationIdentifier, verificationCode };

      const url = isEmailLogin
        ? `${process.env.NEXT_PUBLIC_URL}/auth/verify-email`
        : `${process.env.NEXT_PUBLIC_URL}/auth/verify-phone`;

      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      closeModal();
      await handleLogin();
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const loginPayload = { identifier, password };
      const loginResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/auth/login`,
        loginPayload,
        { headers: { "Content-Type": "application/json" } }
      );

      const token = loginResponse.data.access_token;
      setCookie("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV !== "development",
        expires: 3, // 3 days
      });
      router.push("/");
    } catch (error) {
      // Check if the error is an AxiosError
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        setErrorMessage(errorMessage || "An error occurred during login.");

        if (errorMessage === "Email is not verified") {
          setModalContent("Please verify your email.");
          setVerificationIdentifier(identifier);
          setIsEmailLogin(true);
          openModal(true);
        } else if (errorMessage === "Phone is not verified") {
          setModalContent("Please verify your phone.");
          setVerificationIdentifier(identifier);
          setIsEmailLogin(false);
          openModal(true);
        }
      } else {
        console.error("Unexpected error:", error);
        setErrorMessage("Unexpected error occurred. Please try again.");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleLogin();
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700">
              <input
                type="radio"
                name="loginType"
                value="email"
                checked={isEmailLogin}
                onChange={() => setIsEmailLogin(true)}
                className="mr-2"
              />
              Email Login
            </label>
            <label className="block font-semibold text-gray-700">
              <input
                type="radio"
                name="loginType"
                value="phone"
                checked={!isEmailLogin}
                onChange={() => setIsEmailLogin(false)}
                className="mr-2"
              />
              Phone Login
            </label>
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="identifier"
              placeholder={isEmailLogin ? "Email" : "Phone"}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-sm text-blue-500">
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
            Login
          </button>
        </form>

        {errorMessage && (
          <Button
            variant="flat"
            color="danger"
            className="capitalize mt-4"
            style={{ color: "red" }}>
            {errorMessage}
          </Button>
        )}

        <div className="mt-4 text-center">
          <Link href="/forget-password" className="text-sm text-blue-500">
            Forget Password?
          </Link>
        </div>
      </div>

      {/* Verification Modal */}
      <CustomModal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-xl font-semibold mb-4">Verification Needed</h2>
        <p>{modalContent}</p>
        <input
          type="text"
          placeholder={isEmailLogin ? "Enter your email" : "Enter your phone"}
          value={verificationIdentifier}
          onChange={(e) => setVerificationIdentifier(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
        />
        <input
          type="text"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          onClick={handleVerify}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition">
          Submit
        </button>
      </CustomModal>
    </div>
  );
};

export default Login;
