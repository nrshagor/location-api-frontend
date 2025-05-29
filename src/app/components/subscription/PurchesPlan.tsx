"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomModal from "@/app/components/CustomModal";
import { auth } from "@/app/utils/jwt";
import { getCookie } from "cookie-handler-pro";

interface plans {
  callLimit: number;
  durationInMonths: number;
  id: number;
  name: string;
  price: number;
  regularPrices: number;
  discount: number;
  currentPrice: number;
  tag: string;
}

const PurchesPlan = ({ userDomains, onClose, readOnly }: any) => {
  const userId = auth()?.sub;
  const role = auth()?.role;
  const [plans, setPlan] = useState<plans[]>([]);
  const [monthyOrYear, setMonthlyOrYear] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1); // Track modal steps
  const [userDomain, setUserDomain] = useState<string>(userDomains);
  const [transactionType, setTransactionType] = useState<string>("bkash");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0); // Track amount by plan
  const [planId, setPlanId] = useState<number>();

  // Loading and error state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const openModal = (plan: any) => {
    setPlanId(plan.id);
    setAmount(plan.currentPrice); // Set the amount based on plan
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalStep(1); // Reset step on close
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/subscription-plan`
        );
        setPlan(response.data);
      } catch (error) {
        console.error("Error fetching subscription plan:", error);
      }
    };

    fetchPlans();
  }, []);

  const isMonthly = (e: number) => {
    setMonthlyOrYear(e);
  };

  const handleSetDomain = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDomain(e.target.value);
  };

  const handleTransactionTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTransactionType(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    setLoading(true);
    setErrorMessage(""); // Clear any previous errors
    try {
      const subscriptionPayload = {
        ipOrDomain: userDomain,
        userId,
        planId,
        amount,
        transactionType,
        accountNumber,
        transactionId,
      };
      const token = getCookie("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/subscription`,
        subscriptionPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        closeModal();
        onClose();
        // Reset values
        setUserDomain("");
        setPlanId(undefined);
      }
    } catch (error) {
      console.error("Error submitting subscription:", error);
      setErrorMessage("Failed to submit the subscription. Please try again.");
    } finally {
      setLoading(false); // Stop loading after API call
    }
  };

  const goToNextStep = () => {
    setModalStep(2); // Go to step 2 for transaction details
  };

  return (
    <div className="w-full p-4 h-full">
      {/* Plan selection buttons */}
      <h1 className="text-center pb-4 text-3xl font-bold	">Selected A Plan</h1>
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            monthyOrYear === 1 ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => isMonthly(1)}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            monthyOrYear === 12 ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => isMonthly(12)}
        >
          Yearly
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            monthyOrYear === 24 ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => isMonthly(24)}
        >
          Two Yearly
        </button>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(
          (plan) =>
            (plan.durationInMonths === monthyOrYear && (
              <div
                key={plan.id}
                className="bg-white shadow-lg rounded-lg p-4 cursor-pointer transition transform hover:scale-105"
                onClick={() => openModal(plan)}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p>
                  Limit: {plan.callLimit === -1 ? "Unlimited" : plan.callLimit}
                </p>
                <p>Duration: {plan.durationInMonths} months</p>
                <p>Regular Price: {plan.regularPrices} Taka</p>
                <p>Discount: {plan.discount}%</p>
                <p className="text-blue-600 font-bold">
                  Current Price: {plan.currentPrice} Taka
                </p>
              </div>
            )) ||
            (role == "superAdmin" && plan.durationInMonths === 0 && (
              <div
                key={plan.id}
                className="bg-white shadow-lg rounded-lg p-4 cursor-pointer transition transform hover:scale-105"
                onClick={() => openModal(plan)}
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p>
                  Limit: {plan.callLimit === -1 ? "Unlimited" : plan.callLimit}
                </p>
                <p>Duration: {plan.durationInMonths} months</p>
                <p>Regular Price: {plan.regularPrices} Taka</p>
                <p>Discount: {plan.discount}%</p>
                <p className="text-blue-600 font-bold">
                  Current Price: {plan.currentPrice} Taka
                </p>
              </div>
            ))
        )}
      </div>

      {/* Modal for domain and transaction details */}
      <CustomModal isOpen={isModalOpen} onClose={closeModal}>
        {modalStep === 1 ? (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Step 1: Enter Domain</h2>
            <input
              type="text"
              placeholder="Enter your domain"
              value={userDomain}
              readOnly={readOnly}
              onChange={handleSetDomain}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <button
              onClick={goToNextStep}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Next
            </button>
          </div>
        ) : (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">
              Step 2: Enter Transaction Details
            </h2>
            <p className="mb-4">Plan Amount: {amount} Taka</p>
            {(transactionType == "bkash" && (
              <p className="mb-4">Bkash Number: 01929567819</p>
            )) ||
              (transactionType == "bank" && (
                <>
                  <p className="mb-4">Account Name: NOORE RABBI SHAGOR</p>
                  <p className="mb-4">DBBL Account NO: 2861580009817</p>
                  <p className="mb-4">Routing No : 090274183 </p>
                </>
              )) ||
              (transactionType == "rocket" && (
                <p className="mb-4">Rocket Number: 01929567819</p>
              ))}

            <select
              value={transactionType}
              onChange={handleTransactionTypeChange}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            >
              <option value="bkash">Bkash</option>
              <option value="bank">Bank</option>
              <option value="rocket">Rocket</option>
            </select>
            <input
              type="text"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="text"
              placeholder="Enter Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />

            {/* Error message */}
            {errorMessage && (
              <p className="text-red-500 text-center mb-4">{errorMessage}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white py-2 rounded-lg`}
            >
              {loading ? "Processing..." : "Submit"}
            </button>
          </div>
        )}
      </CustomModal>
    </div>
  );
};

export default PurchesPlan;
