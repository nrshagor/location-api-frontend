import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 fixed w-full bottom-0">
      <div className="container mx-auto flex flex-col md:flex-row justify-center gap-20 items-center">
        <div className="mb-4 md:mb-0">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/docs" className="hover:underline">
                Docs
              </Link>
            </li>

            <li>
              <Link href="/how-to" className="hover:underline">
                How To
              </Link>
            </li>
          </ul>
        </div>
        <div className="mb-4 md:mb-0">
          <p className="text-center md:text-left">
            Contact us:{" "}
            <a href="mailto:codenrs.com@gmail.com" className="underline">
              codenrs.com@gmail.com
            </a>
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm">
            &copy; 2024 - {new Date().getFullYear()} All rights reserved by{" "}
            <Link href="https://www.nrshagor.com/" target="_blank">
              N R SHAGOR.
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
