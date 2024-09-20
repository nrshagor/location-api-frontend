import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface ToasterProps {
  message: string;
  type: "success" | "error";
  duration?: number; // Optional prop to specify the duration (in ms)
}

const Toaster: React.FC<ToasterProps> = ({
  message,
  type,
  duration = 5000,
}) => {
  const [visible, setVisible] = useState(true);

  // Automatically hide the toaster after the specified duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    // Cleanup the timer if the component is unmounted before the timer ends
    return () => clearTimeout(timer);
  }, [duration]);

  // Close the toaster manually
  const handleClose = () => {
    setVisible(false);
  };

  // Only render if visible
  if (!visible) return null;

  // Determine the background color based on the type (success or error)
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-4 z-50 right-4 w-1full p-4 text-white rounded-lg shadow-lg ${bgColor} flex items-start`}
    >
      <div className="flex-1">
        <p className="font-semibold">
          {type === "success" ? "Success!" : "Error!"}
        </p>
        <p>{message}</p>
      </div>
      <button onClick={handleClose} className="ml-4 text-xl">
        <FaTimes />
      </button>
    </div>
  );
};

export default Toaster;
