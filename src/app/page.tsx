// pages/index.tsx
"use client";

import { useState } from "react";
import GroupSelected from "./components/(HomePage)/GroupSelected";
import GroupSelectedBn from "./components/(HomePage)/GroupSelectedBn";
import CallCount from "./components/callCount";
import SubscriptionPlan from "./components/(HomePage)/SubscriptionPlan";

const Home: React.FC = () => {
  const [show, setShow] = useState<Boolean>(false); // Initialize with false
  const isShowing = () => {
    setShow((prevShow) => !prevShow); // Toggle between true/false
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Centered CallCount */}
      {/* <div className="mb-8 w-full max-w-4xl">
        <CallCount />
      </div> */}

      {/* Language Toggle Button */}
      <button
        className="mb-8 px-4 py-2  text-black bg-gray-200 rounded-lg hover:bg-gray-100 transition duration-300"
        onClick={isShowing}
      >
        Click for{" "}
        {show ? `English` : <span className="text-gray-900">Bangla</span>}
      </button>

      {/* Conditional GroupSelected Display */}
      <div className="w-full max-w-4xl">
        {!show ? <GroupSelected /> : <GroupSelectedBn />}
      </div>

      {/* Centered SubscriptionPlan */}
      <div className="w-full max-w-6xl mt-8">
        <SubscriptionPlan />
      </div>
    </main>
  );
};

export default Home;
