"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Avatar, Badge, Tooltip } from "@nextui-org/react";
import { auth } from "@/app/utils/jwt";
import Image from "next/image";
import { MdOutlineVerifiedUser, MdVerifiedUser } from "react-icons/md";
import dynamic from "next/dynamic";

const DomainInfo = dynamic(
  () => import("@/app/components/subscription/DomainInfo"),
  {
    ssr: false,
  }
);
export default function DashboardPage() {
  const [userid, setUserid] = useState<string | null>(null);
  console.log(userid);
  // Get user ID
  useEffect(() => {
    const userIdFromAuth = auth()?.sub;
    setUserid(userIdFromAuth ? String(userIdFromAuth) : null);
  }, [userid]);
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastname: "",
    email: "",
    profilePictureUrl: "",
  });

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_URL}/auth/user-info/${userid}`)
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
  }, [userid]);

  return (
    <div className="container mx-auto p-4">
      <Card className="p-4 max-w-md mx-auto shadow-lg">
        <div className="flex flex-col items-center space-x-1">
          <Avatar
            size="lg"
            src={`${process.env.NEXT_PUBLIC_URL}/${userInfo.profilePictureUrl}`}
            alt={`${userInfo.firstName} ${userInfo.lastname}`}
            className="rounded-full"
            // height={100}
            // width={100}
          />
          <div>
            <h4 className="font-semibold">{`${userInfo.firstName} ${userInfo.lastname}`}</h4>
            <div className="flex flex-row space-x-1 items-center">
              <h4 className="text-gray-500">{userInfo.email}</h4>

              <Tooltip
                showArrow
                placement="top"
                content="Verified"
                classNames={{
                  base: [
                    // arrow color
                    "before:bg-green-400 dark:before:bg-green-300",
                  ],
                  content: [
                    "py-2 px-4 shadow-xl",
                    "text-black bg-gradient-to-br from-green-300 to-green-400",
                  ],
                }}
              >
                <i className="text-green-500">
                  <MdOutlineVerifiedUser />
                </i>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>
      <DomainInfo />
    </div>
  );
}
