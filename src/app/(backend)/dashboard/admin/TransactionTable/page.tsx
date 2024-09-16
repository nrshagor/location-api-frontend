import dynamic from "next/dynamic";
import React from "react";
const TransactionTable = dynamic(
  () => import("@/app/components/TransactionTable"),
  {
    ssr: false,
  }
);
const Page = () => {
  return (
    <div>
      <TransactionTable />
    </div>
  );
};

export default Page;
