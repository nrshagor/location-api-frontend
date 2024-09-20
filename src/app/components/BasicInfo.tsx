"use client";
import { auth } from "@/app/utils/jwt";
import axios from "axios";
import { getCookie } from "cookie-handler-pro";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface Country {
  id: number;
  name_en: string;
  stateList: State[];
}

interface State {
  id: number;
  name_en: string;
  districtList: District[];
}

interface District {
  id: number;
  name_en: string;
  subDistrictList: Subdistrict[];
}

interface Subdistrict {
  id: number;
  name_en: string;
}

const BasicInfo: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastname: "",
    countries: "",
    division: "",
    district: "",
    thana: "",
    postalCode: "",
    buildingAddress: "",
    profilePictureUrl: "",
  });

  const userId = auth()?.sub;

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [multiplePreviewUrls, setMultiplePreviewUrls] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  const [countries, setCountries] = useState<Country[]>([]);
  const [divisions, setDivisions] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [thanas, setThanas] = useState<Option[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId !== null) {
        try {
          const token = getCookie("token");
          const url = `${process.env.NEXT_PUBLIC_URL}/auth/user-info/${userId}`;

          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = response.data;
          console.log(userData);
          setFormData({
            firstName: userData.firstName,
            lastname: userData.lastname,
            countries: userData.countries,
            division: userData.division,
            district: userData.district,
            thana: userData.thana,
            postalCode: userData.postalCode,
            buildingAddress: userData.buildingAddress,
            profilePictureUrl: userData.profilePictureUrl,
          });
          setUploadedImageUrls(userData.profilePictureUrls || []);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("Error response:", error.response?.data);
          } else {
            console.error("Unexpected error:", error);
          }
        }
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/countries`
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchUserData();
    fetchCountries();
  }, [userId]);

  useEffect(() => {
    if (formData.countries) {
      const country = countries.find(
        (c) => c.id.toString() === formData.countries
      );
      if (country) {
        const stateOptions: Option[] = country.stateList.map(
          (state: State) => ({
            value: state.id.toString(),
            label: state.name_en,
          })
        );
        setDivisions(stateOptions);
      } else {
        setDivisions([]);
      }
      setDistricts([]);
      setThanas([]);
    }
  }, [formData.countries, countries]);

  useEffect(() => {
    if (formData.division) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_URL}/state/${formData.division}`
          );
          const data = response.data.districtList.map((item: District) => ({
            value: item.id.toString(),
            label: item.name_en,
          }));
          setDistricts(data);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };

      fetchDistricts();
    } else {
      // setDistricts([]);
      // setThanas([]);
    }
  }, [formData.division]); // Ensure districts are updated when division is set

  useEffect(() => {
    if (formData.district) {
      const fetchThanas = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_URL}/districts/${formData.district}`
          );
          const data = response.data.subDistrictList.map(
            (item: Subdistrict) => ({
              value: item.id.toString(),
              label: item.name_en,
            })
          );
          setThanas(data);
        } catch (error) {
          console.error("Error fetching thanas:", error);
        }
      };

      fetchThanas();
    } else {
      setThanas([]);
    }
  }, [formData.district]); // Ensure thanas are updated when district is set

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleClick = () => {
    // Programmatically click the hidden input element when the div is clicked
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const selectedFile = droppedFiles[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };
  const handleMultipleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setMultipleFiles(selectedFiles);
      setMultiplePreviewUrls(
        selectedFiles.map((file) => URL.createObjectURL(file))
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        firstName: formData.firstName,
        lastname: formData.lastname,
        countries: formData.countries,
        division: formData.division,
        district: formData.district,
        thana: formData.thana,
        postalCode: formData.postalCode,
        buildingAddress: formData.buildingAddress,
      };

      const url = `${process.env.NEXT_PUBLIC_URL}/auth/update-profile`;
      const token = getCookie("token");

      // Update user information
      const response = await axios.patch(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profile update:", response.data);

      // If a file is selected, upload it
      if (file) {
        const formData = new FormData();
        formData.append("profilePictureUrl", file);

        const uploadUrl = `${process.env.NEXT_PUBLIC_URL}/auth/update-profile-picture`;

        const uploadResponse = await axios.patch(uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Image upload:", uploadResponse.data);

        // Update the state with the new uploaded single image's URL
        setFormData((prevState) => ({
          ...prevState,
          profilePictureUrl: uploadResponse.data.profilePictureUrl,
        }));

        // Clear the single image preview
        setFile(null);
        setPreviewUrl(null);
      }

      // If multiple files are selected, upload them
      if (multipleFiles.length > 0) {
        const multipleFormData = new FormData();
        multipleFiles.forEach((file) => {
          multipleFormData.append("files", file);
        });

        const multipleUploadUrl = `${process.env.NEXT_PUBLIC_URL}/auth/update-profile-pictures`;

        const multipleUploadResponse = await axios.patch(
          multipleUploadUrl,
          multipleFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Multiple image upload:", multipleUploadResponse?.data);

        // Update the state with the new uploaded images' URLs
        setUploadedImageUrls(
          multipleUploadResponse.data.profilePictureUrls || []
        );

        // Clear the multiple images preview
        setMultipleFiles([]);
        setMultiplePreviewUrls([]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          name="countries"
          value={formData.countries}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id.toString()}>
              {country.name_en}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <select
            name="division"
            value={formData.division} // Ensure the value is tied to the state
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Division</option>
            {divisions.map((division) => (
              <option key={division.value} value={division.value}>
                {division.label}
              </option>
            ))}
          </select>

          {/* District Dropdown */}
          <select
            name="district"
            value={formData.district} // Ensure the value is tied to the state
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.value} value={district.value}>
                {district.label}
              </option>
            ))}
          </select>

          {/* Thana Dropdown */}
          <select
            name="thana"
            value={formData.thana} // Ensure the value is tied to the state
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Thana</option>
            {thanas.map((thana) => (
              <option key={thana.value} value={thana.value}>
                {thana.label}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="buildingAddress"
          placeholder="Building Address"
          value={formData.buildingAddress}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div
          className={`border border-dashed rounded-md p-1 w-40 h-40 flex justify-center items-center ${
            dragActive ? "border-blue-500" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        >
          <input
            type="file"
            name="profilePictureUrl"
            accept="image/*"
            ref={inputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Profile Preview"
              width={96}
              height={96}
              className="object-cover rounded-md"
            />
          ) : formData.profilePictureUrl ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_URL}/${formData.profilePictureUrl}`}
              alt="Profile Preview"
              width={100}
              height={100}
              className="object-cover rounded-md"
            />
          ) : (
            <p className="text-gray-500">
              Drag and drop an image, or click to select
            </p>
          )}
        </div>

        {/*  <input
          type="file"
          name="files"
          accept="image/*"
          multiple
          onChange={handleMultipleFileChange}
          className="border border-gray-300 rounded-md"
        />

        {multiplePreviewUrls.length > 0 && (
          <div className="flex space-x-2">
            {multiplePreviewUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Preview ${index}`}
                width={96}
                height={96}
                className="object-cover rounded-md"
              />
            ))}
          </div>
        )} */}

        <button
          type="submit"
          className="w-40 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>

      {/*  <div className="mt-6">
        <p className="font-semibold">Single Image:</p>
        {formData.profilePictureUrl && (
          <Image
            src={`${process.env.NEXT_PUBLIC_URL}/${formData.profilePictureUrl}`}
            alt="Profile"
            width={96}
            height={96}
            className="object-cover rounded-md"
          />
        )}
      </div>

       <div className="mt-6">
        <p className="font-semibold">Multiple Images:</p>
        <div className="flex space-x-2">
          {uploadedImageUrls.map((url, index) => (
            <Image
              key={index}
              src={`${process.env.NEXT_PUBLIC_URL}/${url}`}
              alt={`Uploaded ${index}`}
              width={96}
              height={96}
              className="object-cover rounded-md"
            />
          ))}
        </div> 
      </div>*/}

      <Link
        href="/dashboard/change-password"
        className="mt-4 text-blue-500 underline"
      >
        Change Password
      </Link>
    </div>
  );
};

export default BasicInfo;
