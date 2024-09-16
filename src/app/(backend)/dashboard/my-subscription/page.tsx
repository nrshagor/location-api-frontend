import React from "react";
import dynamic from "next/dynamic";
const DomainInfo = dynamic(
  () => import("@/app/components/subscription/DomainInfo"),
  {
    ssr: false,
  }
);
const Page = () => {
  return (
    <div>
      <DomainInfo />
    </div>
  );
};

export default Page;
