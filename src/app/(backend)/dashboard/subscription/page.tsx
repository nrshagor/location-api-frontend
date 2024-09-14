import dynamic from "next/dynamic";
import React from "react";
const PurchesPlan = dynamic(
  () => import("@/app/components/subscription/PurchesPlan"),
  {
    ssr: false,
  }
);
const DomainInfo = dynamic(
  () => import("@/app/components/subscription/DomainInfo"),
  {
    ssr: false,
  }
);
const Page = () => {
  return (
    <div>
      <PurchesPlan />
      <DomainInfo />
    </div>
  );
};

export default Page;
