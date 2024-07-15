// pages/index.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomSelect from "./components/CustomSelect";

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
}

interface District {
  id: number;
  name_en: string;
}

interface Subdistrict {
  id: number;
  name_en: string;
}

const Home: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [subdistricts, setSubdistricts] = useState<Option[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://location-api.nrshagor.com/countries"
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);
  console.log("countries", countries);
  console.log("states", states);
  console.log(states);
  console.log(states);
  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find(
        (c) => c.id.toString() === selectedCountry
      );
      if (country) {
        const stateOptions = country.stateList.map((state: State) => ({
          value: state.id.toString(),
          label: state.name_en,
        }));
        setStates(stateOptions);
      } else {
        setStates([]);
      }
      setDistricts([]);
      setSubdistricts([]);
    }
  }, [selectedCountry, countries]);

  useEffect(() => {
    if (selectedState) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            `https://location-api.nrshagor.com/state/${selectedState}`
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
      setSubdistricts([]);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchSubdistricts = async () => {
        try {
          const response = await axios.get(
            `https://location-api.nrshagor.com/districts/${selectedDistrict}`
          );
          const data = response.data.subDistrictList.map(
            (item: Subdistrict) => ({
              value: item.id.toString(),
              label: item.name_en,
            })
          );
          setSubdistricts(data);
        } catch (error) {
          console.error("Error fetching subdistricts:", error);
        }
      };

      fetchSubdistricts();
    } else {
      setSubdistricts([]);
    }
  }, [selectedDistrict]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello Next</h1>
      <CustomSelect
        options={countries.map((country) => ({
          value: country.id.toString(),
          label: country.name_en,
        }))}
        placeholder="Select a country"
        allowClear
        onChange={(value) => {
          setSelectedCountry(value);
          setSelectedState("");
          setSelectedDistrict("");
        }}
      />

      <CustomSelect
        options={states}
        placeholder="Select a state"
        allowClear
        onChange={(value) => {
          setSelectedState(value);
          setSelectedDistrict("");
        }}
      />

      <CustomSelect
        options={districts}
        placeholder="Select a district"
        allowClear
        onChange={(value) => {
          setSelectedDistrict(value);
        }}
      />

      <CustomSelect
        options={subdistricts}
        placeholder="Select a subdistrict"
        allowClear
        onChange={() => {}}
      />
    </main>
  );
};

export default Home;
