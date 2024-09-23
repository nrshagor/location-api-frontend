import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Location API | State, Districts & Subdistricts Data",
  description:
    "Access comprehensive location data for Bangladesh with our powerful API. Get country, state, district, and sub-district information instantly.",
  keywords: [
    "Location API",
    "Location API Bangladesh",
    "Location API for Bangladesh",
    "Bangladesh districts API",
    "Subdistricts API Bangladesh",
    "Geographic data API",
    "Global location API",
    "Bangladesh location data",
    "Location API for developers",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`overflow-x-hidden bg-white  ${inter.className}`}
        suppressHydrationWarning
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
