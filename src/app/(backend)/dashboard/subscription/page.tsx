import dynamic from "next/dynamic";
import React from "react";
const PurchesPlan = dynamic(
  () => import("@/app/components/subscription/PurchesPlan"),
  {
    ssr: false,
  }
);

const Page = () => {
  return (
    <div>
      <PurchesPlan />
    </div>
  );
};

export default Page;
