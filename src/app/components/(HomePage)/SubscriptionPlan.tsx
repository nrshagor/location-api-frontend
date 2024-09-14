"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

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

const SubscriptionPlan = () => {
  const [plans, setPlan] = useState<plans[]>([]);
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
      <div className="flex justify-center mb-8">
        <button
          className={`px-4 py-2 mx-2 text-white rounded-lg ${
            monthlyOrYear === 1
              ? "bg-blue-500"
              : "bg-gray-300 hover:bg-blue-500 transition duration-300"
          }`}
          onClick={() => isMonthly(1)}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 mx-2 text-white rounded-lg ${
            monthlyOrYear === 12
              ? "bg-blue-500"
              : "bg-gray-300 hover:bg-blue-500 transition duration-300"
          }`}
          onClick={() => isMonthly(12)}
        >
          Yearly
        </button>
        <button
          className={`px-4 py-2 mx-2 text-white rounded-lg ${
            monthlyOrYear === 24
              ? "bg-blue-500"
              : "bg-gray-300 hover:bg-blue-500 transition duration-300"
          }`}
          onClick={() => isMonthly(24)}
        >
          Two Yearly
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(
          (plan) =>
            plan?.durationInMonths == monthlyOrYear && (
              <div
                key={plan.id}
                className="p-6 bg-white shadow-lg rounded-lg border border-gray-200"
              >
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
                  Regular Price: ${plan.regularPrices}
                </p>
                <p className="text-gray-600 mb-2">Discount: {plan.discount}%</p>
                <p className="text-lg font-bold text-gray-800">
                  Current Price: ${plan.currentPrice}
                </p>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
