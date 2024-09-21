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
  function formatCount(count: any) {
    if (count >= 1000000000000) {
      return `${(count / 1000000000000).toFixed(1)}T`; // 1 trillion
    } else if (count >= 1000000000) {
      return `${(count / 1000000000).toFixed(1)}B`; // 1 billion
    } else if (count >= 100000000) {
      return `${(count / 100000000).toFixed(1)}M`; // 100 million
    } else if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`; // 1 million
    } else {
      return count.toString(); // Less than 1 million
    }
  }

  return (
    <div>
      <p className="text-gray-800 uppercase py-4 text-2xl md:text-3xl">
        People call API in their local project{" "}
        <span className="font-bold">{formatCount(CountApiCall)}</span> times
      </p>
    </div>
  );
};

export default CallCount;
