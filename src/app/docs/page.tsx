"use client";
import React, { useState } from "react";
import { Button, Card } from "@nextui-org/react";
import { FaBarsStaggered } from "react-icons/fa6";

// List of APIs with titles and descriptions
const apiList = [
  {
    name: "Districts",
    url: "http://localhost:3000/districts/",
    description: "This API fetches the list of districts.",
  },
  {
    name: "Countries",
    url: "http://localhost:3000/countries/",
    description: "This API fetches the list of countries.",
  },
  {
    name: "State",
    url: "http://localhost:3000/state",
    description: "This API fetches the list of states.",
  },
];

const Page: React.FC = () => {
  const [apiData, setApiData] = useState<{ [key: string]: object | null }>({});
  const [error, setError] = useState<{ [key: string]: string | null }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchData = async (apiName: string, url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setApiData((prevData) => ({ ...prevData, [apiName]: data }));
      setError((prevError) => ({ ...prevError, [apiName]: null }));
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError((prevError) => ({ ...prevError, [apiName]: errorMessage }));
      setApiData((prevData) => ({ ...prevData, [apiName]: null }));
    }
  };

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Mobile Toggle Button */}
      <div className="p-4  shadow-lg md:hidden flex justify-between fixed bg-white z-10 items-center w-full">
        <h1 className="text-2xl font-bold">API Documentation</h1>
        <Button onPress={toggleSidebar}>
          <FaBarsStaggered size={24} />
        </Button>
      </div>

      {/* Sidebar for API navigation */}
      <aside
        className={`w-64 p-4 bg-gray-200 h-screen fixed  top-16 z-50 transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <h2 className="font-bold mb-4">APIs</h2>
        <ul className="space-y-2">
          {apiList.map((api) => (
            <li key={api.name}>
              <Button
                className="w-full"
                onPress={() => {
                  handleScroll(api.name.toLowerCase());
                  toggleSidebar(); // Close sidebar on mobile after click
                }}
              >
                {api.name}
              </Button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <div className="flex-grow p-4 mt-16 md:mt-0">
        <h1 className="hidden md:block text-2xl font-bold mb-4">
          API Documentation
        </h1>
        <div className="space-y-8">
          {apiList.map((api) => (
            <div
              key={api.name}
              id={api.name.toLowerCase()}
              className="w-full max-w-lg mx-auto p-6"
            >
              <h2 className="text-xl font-semibold">{api.name}</h2>
              <p className="text-sm mb-2">{api.description}</p>
              <div className="flex flex-col md:flex-row md:items-start items-start justify-between">
                <p className="break-all">{api.url}</p>
                <Button
                  className="mt-2 md:mt-0 md:ml-5"
                  onPress={() => fetchData(api.name, api.url)}
                >
                  Get Data
                </Button>
              </div>

              <div className="mt-4 w-full">
                <h3 className="text-lg font-medium">Response</h3>
                <Card className="mt-2 p-4 bg-gray-100 w-full max-w-lg mx-auto rounded-md">
                  {error[api.name] ? (
                    <p className="text-red-500">{error[api.name]}</p>
                  ) : apiData[api.name] ? (
                    <pre className="text-sm overflow-auto max-h-60 scrollbar-thin scrollbar-thumb-rounded">
                      {JSON.stringify(apiData[api.name], null, 2)}
                    </pre>
                  ) : (
                    <p>No data fetched yet.</p>
                  )}
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
