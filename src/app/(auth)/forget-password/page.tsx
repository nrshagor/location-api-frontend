"use client";
import CustomModal from "@/app/components/CustomModal";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const route = useRouter();
  const [verificationIdentifier, setVerificationIdentifier] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [formData, setFormData] = useState({
    identifier: "",
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const openModal = (content: string) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrors("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVerificationIdentifierChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationIdentifier(e.target.value);
  };

  const handleForgetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors("");
    setLoading(true);
    try {
      const payload = { identifier: verificationIdentifier };

      const url = `${process.env.NEXT_PUBLIC_URL}/auth/request-password-reset`;
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.message === "Password reset code sent") {
        openModal("Please check your email or phone for the reset code.");
      } else {
        setErrors("Unexpected response from server.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrors(error.response?.data.message || "An error occurred");
        console.log(error.response?.data.message);
      } else {
        setErrors("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setErrors("");
    try {
      const payload = {
        identifier: verificationIdentifier,
        resetCode: formData.resetCode,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      const url = `${process.env.NEXT_PUBLIC_URL}/auth/reset-password`;

      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.message === "Password reset successful") {
        closeModal();
        route.push("/login");
      } else {
        setErrors("Unexpected response from server.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrors(error.response?.data.message || "An error occurred");
      } else {
        setErrors("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (
    field: "newPassword" | "confirmPassword"
  ) => {
    if (field === "newPassword") {
      setShowNewPassword((prev) => !prev);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleForgetPassword} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your email or phone"
            value={verificationIdentifier}
            onChange={handleVerificationIdentifierChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            disabled={loading} // Disable button during loading
          >
            {loading ? "Sending..." : "Send Password Reset Code"}
          </button>
        </form>

        <CustomModal isOpen={isModalOpen} onClose={closeModal}>
          <h2 className="text-lg font-bold mb-4">Reset Your Password</h2>
          <p className="mb-4">{modalContent}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="space-y-4"
          >
            <div className="mb-4 relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute right-3 top-3 text-sm text-blue-500"
              >
                {showNewPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="mb-4 relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm New Password"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-3 top-3 text-sm text-blue-500"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type="text"
              name="resetCode"
              placeholder="Enter Reset Code"
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-500"
            />

            {errors && (
              <Button
                variant="flat"
                color="danger"
                className="capitalize mt-4 text-balance"
                style={{ color: "red" }}
              >
                {errors}
              </Button>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              disabled={loading} // Disable button during loading
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </CustomModal>
      </div>
    </div>
  );
};

export default Page;
