"use client";
import TransactionTable from "@/app/components/TransactionTable";
import { auth, DecodedToken } from "@/app/utils/jwt";
import Link from "next/link";
const subcription = "/dashboard/subscription";
import React from "react";

const Page = () => {
  return (
    <div>
      <Link href={subcription}>subcription</Link>
      <TransactionTable />
    </div>
  );
};

export default Page;
