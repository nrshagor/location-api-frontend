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

  // console.log("states", states);
  // console.log(states);
  // console.log(states);
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
    <div>
      <p>Location Name In Bangla</p>
      <div className="flex py-2">
        <CustomSelect
          options={countries.map((country) => ({
            value: country.id.toString(),
            label: country.name_bn,
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
          disabled={!selectedCountry ? true : false}
          allowClear
          onChange={(value) => {
            setSelectedState(value);
            setSelectedDistrict("");
          }}
        />

        <CustomSelect
          options={districts}
          placeholder="Select a district"
          disabled={!selectedState ? true : false}
          allowClear
          onChange={(value) => {
            setSelectedDistrict(value);
          }}
        />

        <CustomSelect
          options={subdistricts}
          placeholder="Select a subdistrict"
          disabled={!selectedDistrict ? true : false}
          allowClear
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export default GroupSelectedBn;
