"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface Plans {
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

const SubscriptionPlan = () => {
  const [plans, setPlan] = useState<Plans[]>([]);
  const [monthlyOrYear, setMonthlyOrYear] = useState<number>(1);

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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-center p-4 font-bold md:text-5xl text-large text-gray-600">
        API SUBSCRIPTION PLAN
      </h2>
      {/* Plan Duration Selection */}
      <div className="flex justify-center mb-8 space-x-4">
        <button
          className={`md:px-4 px-2 py-2 text-white rounded-lg transition duration-300 ${
            monthlyOrYear === 1
              ? "bg-blue-500"
              : "bg-gray-300 hover:bg-blue-500"
          }`}
          onClick={() => isMonthly(1)}>
          Monthly
        </button>
        <button
          className={`px-4 py-2 text-white rounded-lg transition duration-300 ${
            monthlyOrYear === 12
              ? "bg-blue-500"
              : "bg-gray-300 hover:bg-blue-500"
          }`}
          onClick={() => isMonthly(12)}>
          Yearly
        </button>
        <button
          className={`px-4 py-2 text-white rounded-lg transition duration-300 ${
            monthlyOrYear === 24
              ? "bg-blue-500"
              : "bg-gray-300 hover:bg-blue-500"
          }`}
          onClick={() => isMonthly(24)}>
          Two Yearly
        </button>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(
          (plan) =>
            plan?.durationInMonths === monthlyOrYear && (
              <div
                key={plan.id}
                className="p-6 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition duration-300">
                <div className="text-center text-blue-600 font-bold mb-4">
                  {plan.tag}
                </div>
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                  {plan.name}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Limit: {plan.callLimit === -1 ? "Unlimited" : plan.callLimit}
                </p>
                <p className="text-gray-600 mb-2">
                  Duration: {plan.durationInMonths} months
                </p>
                <p className="text-gray-600 mb-2">
                  Regular Price: {plan.regularPrices} Taka
                </p>
                <p className="text-gray-600 mb-2">Discount: {plan.discount}%</p>
                <p className="text-lg font-bold text-gray-800">
                  Current Price: {plan.currentPrice} Taka
                </p>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
