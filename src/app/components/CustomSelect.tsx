// components/CustomSelect.tsx

import React, { useState, useEffect, useRef } from "react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  allowClear?: boolean;
  onChange?: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder = "Search to Select",
  allowClear = false,
  onChange,
}) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined
  );
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
      <style jsx>{`
        .custom-select {
          position: relative;
          width: 200px;
        }
        .select-control {
          position: relative;
          display: inline-block;
          width: 100%;
          cursor: pointer;
        }
        .select-control input {
          width: calc(100% - 24px);
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 16px;
          outline: none;
        }
        .clear-icon {
          position: absolute;
          top: 50%;
          right: 8px;
          transform: translateY(-50%);
          cursor: pointer;
          color: #999;
        }
        .options-list {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          z-index: 10;
          width: 100%;
          max-height: 200px;
          overflow-y: auto;
          background-color: #fff;
          border: 1px solid #ccc;
          border-top: none;
          border-radius: 0 0 4px 4px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        .options-list li {
          padding: 8px 16px;
          cursor: pointer;
        }
        .options-list li.selected {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default CustomSelect;
