"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

const CallCount = () => {
  const [CountApiCall, SetcountApiCall] = useState<string>("");
  useEffect(() => {
    const fetchCall = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api-call-tracking/localhost`
        );
        const response1 = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api-call-tracking/::1`
        );
        const response2 = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api-call-tracking/::ffff:127.0.0.1`
        );
        const call =
          response?.data[0]?.callCount ||
          0 + response1?.data[0]?.callCount ||
          0 + response2?.data[0]?.callCount ||
          0;
        SetcountApiCall(call);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCall();
  }, [CountApiCall]);
  console.log(CountApiCall);
  return (
    <div>
      <p className="text-lg py-4">
        People call API in there local project {CountApiCall}
      </p>
    </div>
  );
};

export default CallCount;
