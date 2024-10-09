"use client";

import { useState } from "react";
import GroupSelected from "./components/(HomePage)/GroupSelected";
import GroupSelectedBn from "./components/(HomePage)/GroupSelectedBn";
import CallCount from "./components/callCount";
import SubscriptionPlan from "./components/(HomePage)/SubscriptionPlan";
import ReviewSlider from "./components/ReviewSlider";

const Home: React.FC = () => {
  const [show, setShow] = useState<Boolean>(false); // Initialize with false
  const isShowing = () => {
    setShow((prevShow) => !prevShow); // Toggle between true/false
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* SEO-Friendly Content */}
      <section className="text-center py-8">
        <h1 className="md:text-3xl uppercase text-2xl text-justify font-bold mb-4">
          Locations API - Simplifying Location Data for Developers
        </h1>
        <p className="md:text-lg text-base max-w-3xl text-justify mx-auto mb-6 text-gray-700">
          Our Locations API is designed to help developers working on
          e-commerce, courier services, and other websites that require precise
          user location data. Currently, we provide complete location
          information for Bangladesh, including country, state, district, and
          sub-district. Future updates will include location data from
          additional countries to help you scale globally.
        </p>
        <p className="md:text-lg text-base max-w-3xl text-justify mx-auto text-gray-700">
          Whether you&apos;re building a local or international platform,
          Locations API offers fast, reliable, and easy-to-use location services
          that can seamlessly integrate into your project. Stay ahead of the
          curve by simplifying your location-based data management.
        </p>
      </section>

      {/* CallCount Component */}
      {/* <div className="mb-8 w-full max-w-4xl text-center">
        <CallCount />
      </div> */}

      {/* Language Toggle Button */}
      <button
        className="mb-8 px-4 py-2 text-black bg-gray-200 rounded-lg hover:bg-gray-100 transition duration-300"
        onClick={isShowing}>
        Click for{" "}
        {show ? (
          `English Name For Location`
        ) : (
          <span className="text-gray-900">Bangla Name For Location</span>
        )}
      </button>

      {/* Conditional GroupSelected Display */}
      <div className="w-full max-w-4xl">
        {!show ? <GroupSelected /> : <GroupSelectedBn />}
      </div>

      {/* Centered SubscriptionPlan */}
      <div className="w-full max-w-6xl mt-8">
        <SubscriptionPlan />
      </div>

      {/* Review Slider */}
      <ReviewSlider />

      {/* Key Features Section */}
      <section className="text-center py-8">
        <h2 className="text-3xl font-semibold mb-4">
          Why Choose Locations API?
        </h2>
        <ul className="list-disc list-inside max-w-3xl mx-auto md:text-lg text-base text-left text-gray-700">
          <li>
            Comprehensive location data for countries, states, districts, and
            sub-districts
          </li>
          <li>
            Currently supports Bangladesh, with more countries coming soon
          </li>
          <li>
            Perfect for e-commerce, courier services, and location-based apps
          </li>
          <li>Fast, reliable, and easy-to-integrate API for developers</li>
        </ul>
      </section>
    </main>
  );
};

export default Home;
