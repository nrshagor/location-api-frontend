"use client";
import CustomModal from "@/app/components/CustomModal";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import axios from "axios";
import { setCookie } from "cookie-handler-pro";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Register = () => {
  const router = useRouter();
  const [emailRegistration, setEmailRegistration] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationIdentifier, setVerificationIdentifier] = useState("");
  const [errors, setErrors] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const openModal = () => {
    const identifier = emailRegistration ? formData.email : formData.phone;
    setVerificationIdentifier(identifier); // Set the identifier value
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setVerificationCode("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name == "password" && value.length < 6) {
      setErrors("Password must be at least 6 characters");
    } else {
      setErrors("");
    }
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCode(e.target.value);
  };
  const handleVerification = async () => {
    setIsVerifying(true);
    const url = emailRegistration
      ? `${process.env.NEXT_PUBLIC_URL}/auth/verify-email`
      : `${process.env.NEXT_PUBLIC_URL}/auth/verify-phone`;

    const payload = emailRegistration
      ? { email: verificationIdentifier, verificationCode }
      : { phone: verificationIdentifier, verificationCode };

    try {
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setErrors(response.data.message);
      closeModal();

      await handleLogin();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrors(error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogin = async () => {
    try {
      const loginPayload = {
        identifier: emailRegistration ? formData.email : formData.phone,
        password: formData.password,
      };

      const loginResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/auth/login`,
        loginPayload,
        { headers: { "Content-Type": "application/json" } }
      );

      const token = loginResponse.data.access_token;
      setCookie("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV !== "development",
        expires: 3,
      });
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      openModal();
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsRegistering(true); // Start loading
    const payload = {
      firstName: formData.firstName,
      email: emailRegistration ? formData.email : undefined,
      phone: emailRegistration ? undefined : formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      role: "user",
    };

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/auth/register`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      await handleLogin();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = Array.isArray(error.response?.data.message)
          ? error.response?.data.message[0]
          : error.response?.data.message;
        setErrors(message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsRegistering(false); // Stop loading
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleRegister}>
          {/* <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700">
              <input
                type="radio"
                name="registrationType"
                value="email"
                checked={emailRegistration}
                onChange={() => setEmailRegistration(true)}
                className="mr-2"
              />
              Email Registration
            </label>
            <label className="block font-semibold text-gray-700">
              <input
                type="radio"
                name="registrationType"
                value="phone"
                checked={!emailRegistration}
                onChange={() => setEmailRegistration(false)}
                className="mr-2"
              />
              Phone Registration
            </label>
          </div> */}
          <div className="mb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            {emailRegistration ? (
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            ) : (
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
            )}
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
              className="absolute right-3 top-3 text-sm text-blue-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

            {errors && (
              <Button
                variant="flat"
                color="danger"
                className="capitalize mt-4"
                style={{ color: "red" }}
              >
                {errors}
              </Button>
            )}
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-sm text-blue-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            disabled={isRegistering} // Disable button during loading
          >
            {isRegistering ? "Registering..." : "Register"}{" "}
          </button>
          <p className="mt-4 text-gray-400">
            Already Have an Account. Please
            <Link href="login" className="pl-1 underline text-blue-600">
              Login
            </Link>
          </p>
        </form>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Verification Needed
            </ModalHeader>
            <ModalBody>
              <input
                type={emailRegistration ? "email" : "tel"}
                value={verificationIdentifier} // Show the identifier (email/phone)
                readOnly // Make it read-only
                className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />

              {errors && (
                <Button
                  variant="flat"
                  color="danger"
                  className="capitalize mt-4"
                  style={{ color: "red" }}
                >
                  {errors}
                </Button>
              )}
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onClick={closeModal}>
                Close
              </Button>
              <Button
                color="primary"
                onClick={handleVerification}
                isDisabled={isVerifying} // Disable button during loading
              >
                {isVerifying ? "Submitting..." : "Submit"}{" "}
                {/* Change text during loading */}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default Register;
