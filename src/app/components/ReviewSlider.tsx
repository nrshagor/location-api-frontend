"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface User {
  id: number;
  firstName: string;
  profilePictureUrl: string;
}

interface Review {
  id: number;
  comment: string | null;
  video: string | null;
  rate: number;
  user: User;
}

const ReviewGrid = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/review`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    };

    fetchReviews();
  }, []);

  if (!reviews.length) return <p>No reviews available.</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">User Reviews</h2>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white p-6 h-80 w-full mx-auto rounded-lg shadow-md"
          >
            <div className="flex items-center mb-4">
              <Image
                src={`${process.env.NEXT_PUBLIC_URL}/${review.user.profilePictureUrl}`}
                alt={review.user.firstName}
                className="w-12 h-12 rounded-full mr-4"
                width={100}
                height={100}
              />
              <div>
                <h3 className="font-semibold text-lg">
                  {review.user.firstName}
                </h3>
                <p className="text-sm text-gray-600">Rate: {review.rate}/5</p>
              </div>
            </div>

            {/* Show video or comment */}
            {review.video ? (
              <div className="mb-4">
                <video className="w-full h-40 rounded-lg" controls>
                  <source
                    src={`${process.env.NEXT_PUBLIC_URL}/videos/${review.video}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              review.comment && (
                <p className="text-gray-700">{review.comment}</p>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewGrid;
