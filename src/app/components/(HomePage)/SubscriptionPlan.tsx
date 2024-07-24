"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "@/app/style/Subcription.scss";
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
const SubscriptionPlan = () => {
  const [plans, setPlan] = useState<plans[]>([]);
  const [monthyOrYear, setMonthlyOrYear] = useState<number>(1);

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
  console.log(plans);
  const isMonthly = (e: number) => {
    setMonthlyOrYear(e);
  };

  return (
    <div className="subscriptionContainer">
      <div className="groupBtn">
        <button
          className={monthyOrYear === 1 ? "active" : ""}
          onClick={() => isMonthly(1)}
        >
          Monthly
        </button>
        <button
          className={monthyOrYear === 12 ? "active" : ""}
          onClick={() => isMonthly(12)}
        >
          Yearly
        </button>
        <button
          className={monthyOrYear === 24 ? "active" : ""}
          onClick={() => isMonthly(24)}
        >
          Two Yearly
        </button>
      </div>

      <div className="groupBox">
        {plans.map(
          (plan) =>
            plan?.durationInMonths == monthyOrYear && (
              <div className="boxPaid" key={plan.id}>
                <div className="">{plan.tag}</div>
                <p>Name: {plan.name}</p>
                <p>
                  Limit: {plan.callLimit == -1 ? "Unlimited" : plan.callLimit}
                </p>
                <p>Duration In Months: {plan.durationInMonths}</p>
                <p>Reguler Prices: {plan.regularPricces}</p>
                <p>Discount: {plan.discount}</p>.{" "}
                <p>Current Prices: {plan.currentPrice}</p>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlan;
