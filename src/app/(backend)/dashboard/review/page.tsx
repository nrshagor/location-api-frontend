"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Toaster from "@/app/components/Toaster"; // Custom Toaster component
import { usePathname } from "next/navigation";
import { auth } from "@/app/utils/jwt";

const Page = () => {
  const [review, setReview] = useState<{
    comment: string;
    rate: string;
    video: File | null;
  }>({
    comment: "",
    rate: "",
    video: null,
  });
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // State for video URL
  const [userId, setUserId] = useState<number | null>(null);
  const path = usePathname();

  useEffect(() => {
    const userIdFromAuth = auth()?.sub;
    setUserId(userIdFromAuth ? Number(userIdFromAuth) : null);
  }, [path]);

  const [loading, setLoading] = useState(false);
  const [toaster, setToaster] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchReview = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/review?userId=${userId}`
        );
        if (response.data.length > 0) {
          const { comment, rate, video } = response.data[0];
          setReview({ comment, rate, video: null });
          // If video exists, set its URL for preview
          if (video) {
            setVideoUrl(video); // Assuming 'video' is a URL or file path
          }
        }
      } catch (error) {
        setToaster({ message: "Failed to load review", type: "error" });
      }
    };

    fetchReview();
  }, [userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "rate") {
      // Ensure the rate is between 0 and 5
      const rateValue = parseFloat(value);
      if (rateValue > 5) {
        setReview((prev) => ({ ...prev, rate: "5" }));
        setToaster({ message: "Rate cannot be more than 5", type: "error" });
      } else if (rateValue < 0) {
        setReview((prev) => ({ ...prev, rate: "0" }));
      } else {
        setReview((prev) => ({ ...prev, rate: value }));
      }
    } else {
      setReview((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setReview((prev) => ({ ...prev, video: file }));
    if (file) {
      const url = URL.createObjectURL(file); // Create a URL for the video file
      setVideoUrl(url); // Set the video URL for preview
    } else {
      setVideoUrl(null); // Reset video URL if no file is selected
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("comment", review.comment);
    formData.append("rate", review.rate);
    formData.append("user", userId?.toString() || "");
    if (review.video) {
      formData.append("video", review.video);
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_URL}/review`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setToaster({ message: "Review updated successfully", type: "success" });
    } catch (error) {
      setToaster({ message: "Failed to update review", type: "error" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (toaster) {
      const timer = setTimeout(() => {
        setToaster(null);
      }, 5000); // Hide toaster after 5 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [toaster]);
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Your Review</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700"
          >
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            value={review.comment}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="rate"
            className="block text-sm font-medium text-gray-700"
          >
            Rate
          </label>
          <input
            type="number"
            id="rate"
            name="rate"
            step="0.1"
            value={review.rate}
            onChange={handleInputChange}
            max="5"
            min="0"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="video"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Video
          </label>
          <input
            type="file"
            id="video"
            name="video"
            accept="video/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none"
          />
          {review.video && (
            <p className="mt-1 text-sm text-gray-500">
              Selected Video: {review.video.name}
            </p>
          )}
          {videoUrl && (
            <div className="mt-2">
              <video
                className="w-40 border border-gray-300 rounded-md"
                controls
              >
                <source
                  src={`${process.env.NEXT_PUBLIC_URL}/videos/${videoUrl}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 bg-indigo-600 text-white rounded-md ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {toaster && <Toaster message={toaster.message} type={toaster.type} />}
    </div>
  );
};

export default Page;
