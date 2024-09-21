"use client";
import { auth } from "@/app/utils/jwt";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomModal from "../CustomModal";
import { getCookie } from "cookie-handler-pro";
import PurchesPlan from "./PurchesPlan";
import { Progress } from "@nextui-org/react";

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
  // Loading and error state
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
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
        `${process.env.NEXT_PUBLIC_URL}/subscription/`,
        subscriptionPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    } finally {
      setLoading(false); // Stop loading after API call
    }
  };

  return (
    <div className="p-6 bg-gray-100 ">
      <h1 className="text-2xl font-bold text-center mb-6">
        Domain Information
      </h1>

      {domainList.length === 0 ? (
        <p className="text-center text-gray-500">No domains available</p>
      ) : (
        <div className="flex flex-wrap justify-center items-center gap-3">
          {domainList.map((singleDomain, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex flex-col space-y-2">
                <p>
                  <span className="font-semibold">Domain:</span>{" "}
                  {singleDomain.domain}
                </p>
                <p>
                  <span className="font-semibold">Plan:</span>{" "}
                  {singleDomain.plan}
                </p>
                <p>
                  <span className="font-semibold">Limit:</span>{" "}
                  {singleDomain.callLimit === -1
                    ? "Unlimited"
                    : singleDomain.callLimit}
                </p>
                {/* <p>
                  <span className="font-semibold">Used:</span>{" "}
                  {singleDomain.used}
                </p>
                <p>
                  <span className="font-semibold">Remaining:</span>{" "}
                  {singleDomain.callLimit === -1
                    ? "Infinity"
                    : singleDomain.remaining}
                </p> */}

                <p>
                  <span className="font-semibold">Message:</span>{" "}
                  {singleDomain.callLimit === -1
                    ? "You have unlimited call remaining"
                    : singleDomain.message}
                </p>
                <p>
                  <span className="font-semibold">End Date:</span>{" "}
                  {new Date(singleDomain.endDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true, // This will format the time in 12-hour format with AM/PM
                  })}
                </p>
                <Progress
                  label="Used"
                  size="md"
                  value={singleDomain.used}
                  maxValue={
                    singleDomain.callLimit === -1
                      ? singleDomain.used + 1000
                      : singleDomain.remaining
                  }
                  formatOptions={{}}
                  showValueLabel={true}
                  classNames={{
                    base: "max-w-md",
                    track: "drop-shadow-md border border-default",
                    indicator: "bg-gradient-to-r from-red-300  to-red-600",
                    label: "tracking-wider font-medium text-default-600",
                    value: "text-foreground/60",
                  }}
                />
                <div className="flex space-x-2 mt-4">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onClick={() =>
                      getValue(singleDomain.planId, singleDomain.domain)
                    }
                  >
                    Renew
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    onClick={() => upgrated(singleDomain.domain)}
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Renew Step 1: Domain Input */}
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Step 1: Enter Domain</h2>
        <input
          type="text"
          placeholder="Enter your domain"
          value={userDomain}
          readOnly
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={handlePlanSelection}
        >
          Next
        </button>
      </CustomModal>

      {/* Modal for Renew Step 2: Transaction Details */}
      <CustomModal
        isOpen={isModalStep2Open}
        onClose={() => setIsModalStep2Open(false)}
      >
        <h2 className="text-xl font-semibold mb-4">
          Step 2: Enter Transaction Details
        </h2>
        <p className="mb-4">
          Plan Amount: <span className="font-bold">{amount}</span>
        </p>
        {(transactionType == "bkash" && (
          <p className="mb-4">Bkash Number: 019295678719</p>
        )) ||
          (transactionType == "bank" && (
            <p className="mb-4">DBBL Account NO: 2861580009817</p>
          )) ||
          (transactionType == "rocket" && (
            <p className="mb-4">Rocket Number: 01929567819</p>
          ))}
        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
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
        <button
          disabled={loading}
          className={`w-full ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } text-white py-2 rounded-lg`}
          onClick={handleRenewSubmit}
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </CustomModal>

      {/* Modal for Upgrade */}
      <CustomModal isOpen={isModalOpen1} onClose={() => setIsModalOpen1(false)}>
        <PurchesPlan
          userDomains={userDomain}
          readOnly={true}
          onClose={() => setIsModalOpen1(false)} // Pass the close handler
        />
      </CustomModal>
    </div>
  );
};

export default DomainInfo;
