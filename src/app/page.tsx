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
      {/* SEO-friendly Intro */}
      <section className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Comprehensive Location API for Bangladesh
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Welcome to our <strong>Location API</strong>, your one-stop solution
          for real-time geographic data. Designed for developers, our API offers
          precise information about
          <strong>
            {" "}
            Bangladesh&apos;s states, districts, and subdistricts
          </strong>
          , with <strong>global expansion</strong> on the horizon. Whether
          you&apos;re building location-based apps, logistics tools, or mapping
          services, our API ensures you get the data you need fast and
          efficiently.
        </p>
      </section>

      {/* Key Features */}
      <section className="w-full max-w-4xl text-left mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Key Features
        </h2>
        <ul className="list-disc ml-6 text-lg text-gray-700">
          <li>
            <strong>Accurate Data:</strong> Access up-to-date and reliable
            location data for Bangladesh.
          </li>
          <li>
            <strong>Comprehensive Coverage:</strong> From country and state to
            districts and subdistricts, our API provides detailed geographic
            hierarchies.
          </li>
          <li>
            <strong>Easy Integration:</strong> Simple, developer-friendly API
            with JSON responses for quick implementation.
          </li>
          <li>
            <strong>Scalable for Global Expansion:</strong> While we currently
            focus on Bangladesh, we&apos;re preparing to expand our coverage to
            other countries soon.
          </li>
        </ul>
      </section>

      {/* Why Choose Our Location API */}
      <section className="w-full max-w-4xl text-left mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Why Choose Our Location API?
        </h2>
        <ul className="list-disc ml-6 text-lg text-gray-700">
          <li>
            <strong>Real-time Updates:</strong> Receive the most current
            location data for precise mapping and analysis.
          </li>
          <li>
            <strong>Developer Support:</strong> Comprehensive documentation and
            support to help you integrate seamlessly.
          </li>
          <li>
            <strong>Scalability:</strong> Designed to handle large-scale data
            requests as your application grows.
          </li>
          <li>
            <strong>Reliable Infrastructure:</strong> Built for high
            availability and speed, so you can trust our API to deliver when it
            matters.
          </li>
        </ul>
      </section>

      {/* Future Expansion */}
      <section className="w-full max-w-4xl text-left mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Future Expansion
        </h2>
        <p className="text-lg text-gray-700">
          We are continuously expanding our API to include more{" "}
          <strong>global locations</strong>. Stay tuned as we broaden our
          database to provide geographic data for countries worldwide!
        </p>
      </section>

      {/* Call to Action */}
      <section className="w-full max-w-4xl text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Access our Location API now and enhance your app with real-time
          geographic data from <strong>Bangladesh</strong>.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700 transition">
          Get Started Today!
        </button>
      </section>

      {/* Centered CallCount */}
      <div className="mb-8 w-full max-w-4xl text-center ">
        <CallCount />
      </div>

      {/* Language Toggle Button */}
      <button
        className="mb-8 px-4 py-2 text-black bg-gray-200 rounded-lg hover:bg-gray-100 transition duration-300"
        onClick={isShowing}
      >
        Click for{" "}
        {show ? `English` : <span className="text-gray-900">Bangla</span>}
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
    </main>
  );
};

export default Home;
