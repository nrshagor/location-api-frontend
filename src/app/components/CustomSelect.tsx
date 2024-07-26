// components/CustomSelect.tsx

import React, { useState, useEffect, useRef } from "react";
import "../style/CustomSelect.scss";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  allowClear?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
  value?: string; // Add value prop
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder = "Search to Select",
  allowClear = false,
  onChange,
  disabled,
  value, // Add value prop
}) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
    setIsOpen(true);
  };

  const handleSelectOption = (value: string, label: string) => {
    setSelectedValue(value);
    setInputValue(label);
    setIsOpen(false);
    if (onChange) {
      onChange(value);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    // Focus on input field when opening dropdown
    if (!isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    clearSelection();
  };

  const clearSelection = () => {
    setSelectedValue(undefined);
    setInputValue("");
    if (onChange) {
      onChange("");
    }
  };

  useEffect(() => {
    // Reset filtered options when component re-renders
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    setSelectedValue(value);
    if (value) {
      const selectedOption = options.find((option) => option.value === value);
      if (selectedOption) {
        setInputValue(selectedOption.label);
      }
    }
  }, [value, options]);

  return (
    <div className="custom-select">
      <div className="select-control">
        <input
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onClick={toggleDropdown} // Ensure dropdown opens when input clicked
          ref={inputRef} // Reference to input field for focusing
          disabled={disabled}
        />
        {selectedValue !== undefined && allowClear && (
          <span className="clear-icon" onClick={clearSelection}>
            &#x2715;
          </span>
        )}
        {isOpen && (
          <ul className="options-list">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                className={option.value === selectedValue ? "selected" : ""}
                onClick={() => handleSelectOption(option.value, option.label)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
