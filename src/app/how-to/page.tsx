"use client";
import React, { useState } from "react";
import Image from "next/image";

const steps = [
  {
    step: 1,
    description: "Login Your Account",
    img: "/how-to/step1.png",
  },
  {
    step: 2,
    description: "Go to Add Domain Manu and Selected a Plan",
    img: "/how-to/step2.png",
  },
  {
    step: 3,
    description: "Enter Your Domain",
    img: "/how-to/step3.png",
  },
  {
    step: 4,
    description: "Enter Your Transaction ID and Account Number",
    img: "/how-to/step4.png",
  },
  {
    step: 5,
    description: "Check Your domain Information in My Domain Manu",
    img: "/how-to/step5.png",
  },
  {
    step: 6,
    description: "You can Renew Your domain",
    img: "/how-to/step6.png",
  },
  {
    step: 7,
    description: "You can also Upgrade Your Plan",
    img: "/how-to/step7.png",
  },
];

const Page = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Function to open the modal with the selected image
  const openModal = (img: string) => {
    setSelectedImage(img);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-8">
        How to Subscribe Domain
      </h1>
      <div className="space-y-12">
        {steps.map((step) => (
          <div
            key={step.step}
            className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6"
          >
            <div className="w-full md:w-1/2">
              {/* Clicking on the image will open the modal */}
              <Image
                src={step.img}
                alt={`Step ${step.step}`}
                width={500}
                height={300}
                className="rounded-lg shadow-lg object-cover w-full cursor-pointer"
                onClick={() => openModal(step.img)}
              />
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="text-xl font-semibold mb-2">Step {step.step}</h2>
              <p className="text-gray-700">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for image zoom */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative">
            {/* Close button */}
            <button
              className="absolute top-0 right-0 bg-black text-white text-3xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>

            {/* Zoomed image */}
            <Image
              src={selectedImage}
              alt="Zoomed Image"
              width={800}
              height={500}
              className="rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
