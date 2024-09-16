"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomSelect from "../CustomSelect";

interface Option {
  value: string;
  label: string;
}

interface Country {
  id: number;
  name_bn: string;
  stateList: State[];
}

interface State {
  id: number;
  name_bn: string;
}

interface District {
  id: number;
  name_bn: string;
}

interface Subdistrict {
  id: number;
  name_bn: string;
}

const GroupSelectedBn = () => {
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
          `${process.env.NEXT_PUBLIC_URL}/countries`
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find(
        (c) => c.id.toString() === selectedCountry
      );
      if (country) {
        const stateOptions = country.stateList.map((state: State) => ({
          value: state.id.toString(),
          label: state.name_bn,
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
            `${process.env.NEXT_PUBLIC_URL}/state/${selectedState}`
          );
          const data = response.data.districtList.map((item: District) => ({
            value: item.id.toString(),
            label: item.name_bn,
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
            `${process.env.NEXT_PUBLIC_URL}/districts/${selectedDistrict}`
          );
          const data = response.data.subDistrictList.map(
            (item: Subdistrict) => ({
              value: item.id.toString(),
              label: item.name_bn,
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
    <div className="px-4 py-4 flex flex-col lg:flex-col gap-4 items-center">
      <p className="text-lg mb-2">Location Name In Bangla</p>
      {/* Responsive container */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Country Select */}
        <CustomSelect
          options={countries.map((country) => ({
            value: country.id.toString(),
            label: country.name_bn,
          }))}
          placeholder="দেশ নির্বাচন করুন"
          allowClear
          onChange={(value) => {
            setSelectedCountry(value);
            setSelectedState("");
            setSelectedDistrict("");
          }}
        />

        {/* State Select */}
        <CustomSelect
          options={states}
          placeholder="রাজ্য নির্বাচন করুন"
          disabled={!selectedCountry ? true : false}
          allowClear
          onChange={(value) => {
            setSelectedState(value);
            setSelectedDistrict("");
          }}
        />

        {/* District Select */}
        <CustomSelect
          options={districts}
          placeholder="জেলা নির্বাচন করুন"
          disabled={!selectedState ? true : false}
          allowClear
          onChange={(value) => {
            setSelectedDistrict(value);
          }}
        />

        {/* Subdistrict Select */}
        <CustomSelect
          options={subdistricts}
          placeholder="উপজেলা নির্বাচন করুন"
          disabled={!selectedDistrict ? true : false}
          allowClear
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export default GroupSelectedBn;
