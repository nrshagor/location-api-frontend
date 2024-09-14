"use client";
import { auth } from "@/app/utils/jwt";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomModal from "../CustomModal";
import { getCookie } from "cookie-handler-pro";
import PurchesPlan from "./PurchesPlan";

interface DomainList {
  id: number;
  domain: string;
  plan: string;
  planId: number;
  callLimit: number;
  used: number;
  remaining: number;
  message: string;
  endDate: string;
}

const DomainInfo = () => {
  const userId = auth()?.sub;
  const [domainList, setDomainList] = useState<DomainList[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // For domain input modal
  const [isModalStep2Open, setIsModalStep2Open] = useState(false); // For transaction details modal
  const [isModalOpen1, setIsModalOpen1] = useState(false); // For upgrade modal
  const [userDomain, setUserDomain] = useState<string>("");
  const [planId, setPlanId] = useState<number | undefined>();
  const [amount, setAmount] = useState<number>(0);
  const [transactionType, setTransactionType] = useState<string>("bkash");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");

  useEffect(() => {
    const fetchDomainInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/subscription/usage/${userId}`
        );
        setDomainList(response.data);
      } catch (error) {
        console.error("Error fetching domain info:", error);
      }
    };
    fetchDomainInfo();
  }, [userId]);

  const fetchAmount = async (planId: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/subscription-plan/${planId}`
      );
      setAmount(response.data.currentPrice);
    } catch (error) {
      console.error("Error fetching plan amount:", error);
    }
  };

  const getValue = (planId: number, domain: string) => {
    setPlanId(planId);
    setUserDomain(domain);
    setIsModalOpen(true);
  };

  const handlePlanSelection = async () => {
    if (planId) {
      await fetchAmount(planId);
      setIsModalOpen(false);
      setIsModalStep2Open(true);
    }
  };

  const upgrated = (domain: string) => {
    setUserDomain(domain);
    setIsModalOpen1(true);
  };

  const handleRenewSubmit = async () => {
    try {
      const subscriptionPayload = {
        ipOrDomain: userDomain,
        userId,
        planId,
        amount, // Include amount
        transactionType, // Include transactionType
        accountNumber, // Include accountNumber
        transactionId, // Include transactionId
      };

      const token = getCookie("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/subscription/`, // Ensure this endpoint exists
        subscriptionPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(subscriptionPayload);
      if (response.status === 201) {
        console.log("Successfully renewed subscription");
        setUserDomain("");
        setPlanId(undefined);
        setAmount(0);
        setTransactionType("bkash");
        setAccountNumber("");
        setTransactionId("");
        setIsModalStep2Open(false);
        setIsModalOpen(false);
      } else {
        console.log("Renewal failed:", response.statusText);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error renewing subscription:", error.message);
      } else {
        console.log("Unknown error occurred:", error);
      }
    }
  };

  return (
    <div>
      {domainList.map((singleDomain, index) => (
        <div key={index}>
          <div className="flex">
            <p>Domain: {singleDomain.domain}</p>
            <p>Plan: {singleDomain.plan}</p>
            <p>
              Limit:{" "}
              {singleDomain.callLimit === -1
                ? "Unlimited"
                : singleDomain.callLimit}
            </p>
            <p>Used: {singleDomain.used}</p>
            <p>
              Remaining:{" "}
              {singleDomain.callLimit === -1
                ? "Infinity"
                : singleDomain.remaining}
            </p>
            <p>{singleDomain.message}</p>
            <p>{singleDomain.endDate}</p>

            <button
              onClick={() =>
                getValue(singleDomain.planId, singleDomain.domain)
              }>
              Renew
            </button>
            <button onClick={() => upgrated(singleDomain.domain)}>
              Upgrade
            </button>
          </div>
        </div>
      ))}

      {/* Modal for Renew Step 1: Domain Input */}
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Step 1: Enter Domain</h2>
        <input
          type="text"
          placeholder="Enter your domain"
          value={userDomain}
          readOnly
        />
        <button onClick={handlePlanSelection}>Next</button>
      </CustomModal>

      {/* Modal for Renew Step 2: Transaction Details */}
      <CustomModal
        isOpen={isModalStep2Open}
        onClose={() => setIsModalStep2Open(false)}>
        <h2>Step 2: Enter Transaction Details</h2>
        <p>Plan Amount: {amount}</p>
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}>
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
        <button onClick={handleRenewSubmit}>Submit</button>
      </CustomModal>

      {/* Modal for Upgrade */}
      <CustomModal isOpen={isModalOpen1} onClose={() => setIsModalOpen1(false)}>
        <PurchesPlan
          userDomains={userDomain}
          onClose={() => setIsModalOpen1(false)} // Pass the close handler
        />
      </CustomModal>
    </div>
  );
};

export default DomainInfo;
