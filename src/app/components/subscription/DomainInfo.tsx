"use client";
import { auth } from "@/app/utils/jwt";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CustomModal from "../CustomModal";
import { getCookie } from "cookie-handler-pro";
import PurchesPlan from "./PurchesPlan";
interface domainList {
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
  const [domainList, setDomainList] = useState<domainList[]>([]);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userDomain, setUserDomain] = useState<string>("");
  const [modalContent, setModalContent] = useState("");
  const [modalContent1, setModalContent1] = useState("");
  const [planId, setPlanId] = useState<number>();
  const openModal = (content: any) => {
    setModalContent(content);
    setIsModalOpen(true);
  };
  const openModal1 = (content: any) => {
    setModalContent1(content);
    setIsModalOpen1(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const closeModal1 = () => setIsModalOpen1(false);

  useEffect(() => {
    const fetchDomainInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/subscription/usage/${userId}`
        );
        setDomainList(response.data);
      } catch (error) {
        //
      }
    };
    fetchDomainInfo();
  }, [userId]);

  // get value
  const getValue = (e: any, domain: any) => {
    setPlanId(e);
    setUserDomain(domain);
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

  // Upgrated
  const upgrated = (e: any) => {
    setUserDomain(e);
    openModal1(true);
  };

  return (
    <div className="">
      {domainList.map((singleDomain, index) => (
        <div key={index}>
          <div className="flex">
            <p key={singleDomain.id}>domain {singleDomain.domain}</p>
            <p>plan {singleDomain.plan}</p>
            <p>
              Limit:
              {singleDomain?.callLimit == -1
                ? "Unlimited"
                : singleDomain?.callLimit}
            </p>
            <p>used {singleDomain.used}</p>
            <p>
              remaining{" "}
              {singleDomain?.callLimit == -1
                ? "Infinity"
                : singleDomain.remaining}
            </p>
            <p>{singleDomain.message}</p>
            <p>{singleDomain.endDate}</p>

            <button
              onClick={() => getValue(singleDomain.planId, singleDomain.domain)}
            >
              Renew
            </button>
            <button onClick={() => upgrated(singleDomain.domain)}>
              Upgrated
            </button>
          </div>
        </div>
      ))}
      <CustomModal isOpen={isModalOpen} onClose={closeModal}>
        <h2>You seleted Plan {planId}</h2>
        <input type="text" value={planId} readOnly hidden />
        <input
          type="text"
          placeholder="Enter your domain"
          readOnly
          value={userDomain}
        />
        <button onClick={handleSubmit}>Submit</button>
      </CustomModal>
      {/* Upgrated */}
      <CustomModal isOpen={isModalOpen1} onClose={closeModal1}>
        <PurchesPlan userDomains={userDomain} />
      </CustomModal>
    </div>
  );
};

export default DomainInfo;
