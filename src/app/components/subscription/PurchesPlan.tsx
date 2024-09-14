"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "@/app/style/Subcription.scss";
import CustomModal from "@/app/components/CustomModal";
import { auth } from "@/app/utils/jwt";
import { getCookie } from "cookie-handler-pro";

interface plans {
  callLimit: number;
  durationInMonths: number;
  id: 1;
  name: string;
  price: number;
  regularPricces: number;
  discount: number;
  currentPrice: number;
  tag: string;
}

const PurchesPlan = ({ userDomains }: any) => {
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
      console.log("Submission response:", response.data);
      if (response.status === 201) {
        closeModal();
        // Reset values
        setUserDomain("");
        setPlanId(undefined);
      }
    } catch (error) {
      console.log("Error submitting subscription:", error);
    }
  };

  const goToNextStep = () => {
    setModalStep(2); // Go to step 2 for transaction details
  };

  return (
    <div className="subscriptionContainer">
      <div className="groupBtn">
        <button
          className={monthyOrYear === 1 ? "active" : ""}
          onClick={() => isMonthly(1)}>
          Monthly
        </button>
        <button
          className={monthyOrYear === 12 ? "active" : ""}
          onClick={() => isMonthly(12)}>
          Yearly
        </button>
        <button
          className={monthyOrYear === 24 ? "active" : ""}
          onClick={() => isMonthly(24)}>
          Two Yearly
        </button>
      </div>

      <div className="groupBox">
        {plans.map(
          (plan) =>
            plan.durationInMonths === monthyOrYear && (
              <div className="boxContainer" key={plan.id}>
                <div className="boxPaid" onClick={() => openModal(plan)}>
                  <p>Name: {plan.name}</p>
                  <p>
                    Limit:{" "}
                    {plan.callLimit === -1 ? "Unlimited" : plan.callLimit}
                  </p>
                  <p>Duration In Months: {plan.durationInMonths}</p>
                  <p>Regular Prices: {plan.regularPricces}</p>
                  <p>Discount: {plan.discount}%</p>
                  <p>Current Price: {plan.currentPrice}</p>
                </div>
              </div>
            )
        )}
      </div>

      <CustomModal isOpen={isModalOpen} onClose={closeModal}>
        {modalStep === 1 ? (
          <>
            <h2>Step 1: Enter Domain</h2>
            <input
              type="text"
              placeholder="Enter your domain"
              value={userDomain}
              onChange={handleSetDomain}
            />
            <button onClick={goToNextStep}>Next</button>
          </>
        ) : (
          <>
            <h2>Step 2: Enter Transaction Details</h2>
            <p>Plan Amount: {amount}</p>
            <select
              value={transactionType}
              onChange={handleTransactionTypeChange}>
              <option value="bkash">Bkash</option>
              <option value="bank">Bank</option>
            </select>
            <input
              type="text"
              placeholder="Enter Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
          </>
        )}
      </CustomModal>
    </div>
  );
};

export default PurchesPlan;
