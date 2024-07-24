// pages/index.tsx
"use client";

import { useState } from "react";
import GroupSelected from "./components/(HomePage)/GroupSelected";
import GroupSelectedBn from "./components/(HomePage)/GroupSelectedBn";
import CallCount from "./components/callCount";
import SubscriptionPlan from "./components/(HomePage)/SubscriptionPlan";

const Home: React.FC = () => {
  const [show, setShow] = useState(Boolean);
  const isShowing = () => {
    if (show == false) {
      setShow(true);
    } else {
      setShow(false);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-start  p-24">
      <CallCount />

      <button onClick={isShowing}>
        Click for{" "}
        {!show ? <span className="text-green-500">Bangla</span> : `English`}
      </button>
      <div className="flex">
        {!show ? <GroupSelected /> : <GroupSelectedBn />}
      </div>
      <SubscriptionPlan />
    </main>
  );
};

export default Home;
