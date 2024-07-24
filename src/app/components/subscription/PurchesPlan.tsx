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
  const [userDomain, setUserDomain] = useState<string>(userDomains);
  const [modalContent, setModalContent] = useState("");
  const [planId, setPlanId] = useState<number>();
  const openModal = (content: any) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

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
  console.log(userDomain);
  // get value
  const getValue = (e: any) => {
    setPlanId(e);
    openModal(true);
  };

  const handleSubmit = async (e: any) => {
    try {
      const subscriptionPlayload = {
        ipOrDomain: userDomain,
        userId,
        planId,
      };
      console.log(subscriptionPlayload);
      const token = getCookie("token");
      const setDomainResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/subscription`,
        subscriptionPlayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Submission response:", setDomainResponse.data);
      if (setDomainResponse.status == 201) {
        closeModal();
      }
    } catch (error) {
      console.log("Not Validate User");
    }
    setUserDomain("");
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
        {role == "supperAdmin1" && (
          <div
            className="boxFree"
            key={plans[0]?.id}
            onClick={() => getValue(plans[0]?.id)}
          >
            <p>Name: {plans[0]?.name}</p>
            <p>Limit: {plans[0]?.callLimit}</p>
            <p>Duration In Months: {plans[0]?.durationInMonths}</p>
            <p>Reguler Prices: {plans[0]?.regularPricces}</p>
            <p>Discount: {plans[0]?.discount}</p>
            <p>Current Prices: {plans[0]?.currentPrice}</p>
          </div>
        )}

        {plans.map(
          (plan) =>
            plan.durationInMonths == monthyOrYear && (
              <>
                <div className="boxContainer">
                  {!plan.tag ? (
                    ""
                  ) : (
                    <div className="recommended">{plan.tag}</div>
                  )}

                  <div
                    className="boxPaid"
                    key={plan.id}
                    onClick={() => getValue(plan.id)}
                  >
                    <p>Name: {plan.name}</p>
                    <p>
                      Limit:{" "}
                      {plan.callLimit == -1 ? "Unlimited" : plan.callLimit}
                    </p>
                    <p>Duration In Months: {plan.durationInMonths}</p>
                    <p>Reguler Prices: {plan.regularPricces}</p>
                    <p>Discount: {plan.discount}</p>
                    <p>Current Prices: {plan.currentPrice}</p>
                  </div>
                </div>
              </>
            )
        )}
      </div>

      <CustomModal isOpen={isModalOpen} onClose={closeModal}>
        <h2>You seleted Plan {planId}</h2>
        <input type="text" value={planId} readOnly hidden />

        <input
          type="text"
          placeholder="Enter your domain"
          value={userDomain}
          onChange={handleSetDomain}
        />

        <button onClick={handleSubmit}>Submit</button>
      </CustomModal>
    </div>
  );
};

export default PurchesPlan;
