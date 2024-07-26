"use client";
import { auth } from "@/app/utils/jwt";
import axios from "axios";
import { getCookie } from "cookie-handler-pro";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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
      setDistricts([]);
      setThanas([]);
    }
  }, [formData.division]);

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
  }, [formData.district]);

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
      const response = await axios.put(url, payload, {
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

        const uploadResponse = await axios.put(uploadUrl, formData, {
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

        const multipleUploadResponse = await axios.put(
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
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={handleInputChange}
        />
        <select
          name="countries"
          value={formData.countries}
          onChange={handleInputChange}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id.toString()}>
              {country.name_en}
            </option>
          ))}
        </select>
        <select
          name="division"
          value={formData.division}
          onChange={handleInputChange}
          disabled={!formData.countries}
        >
          <option value="">Select Division</option>
          {divisions.map((division) => (
            <option key={division.value} value={division.value}>
              {division.label}
            </option>
          ))}
        </select>
        <select
          name="district"
          value={formData.district}
          onChange={handleInputChange}
          disabled={!formData.division}
        >
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district.value} value={district.value}>
              {district.label}
            </option>
          ))}
        </select>
        <select
          name="thana"
          value={formData.thana}
          onChange={handleInputChange}
          disabled={!formData.district}
        >
          <option value="">Select Thana</option>
          {thanas.map((thana) => (
            <option key={thana.value} value={thana.value}>
              {thana.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="buildingAddress"
          placeholder="Building Address"
          value={formData.buildingAddress}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="profilePictureUrl"
          accept="image/*"
          onChange={handleFileChange}
        />
        {previewUrl && (
          <div>
            <Image
              src={previewUrl}
              alt="Profile Preview"
              width={100}
              height={100}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          </div>
        )}
        <input
          type="file"
          name="files"
          accept="image/*"
          multiple
          onChange={handleMultipleFileChange}
        />
        {multiplePreviewUrls?.length > 0 && (
          <div>
            {multiplePreviewUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Preview ${index}`}
                width={100}
                height={100}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ))}
          </div>
        )}
        <button type="submit">Submit</button>
      </form>
      <div>
        <p>Single image:</p>
        <Image
          src={
            `${process.env.NEXT_PUBLIC_URL}/${formData?.profilePictureUrl}` &&
            `/`
          }
          alt="Profile"
          width={100}
          height={100}
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
      </div>
      <div>
        <p>Multiple images:</p>
        <div>
          {uploadedImageUrls.map((url, index) => (
            <Image
              key={index}
              src={`${process.env.NEXT_PUBLIC_URL}/${url}`}
              alt={`Uploaded ${index}`}
              width={100}
              height={100}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                margin: "5px",
              }}
            />
          ))}
        </div>
      </div>
      <Link href="change-password">change-password</Link>
    </div>
  );
};

export default BasicInfo;
