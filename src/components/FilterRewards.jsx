import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function FilterRewards({ costFilter, setCostFilter }) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: "all", label: "Alle Belohnungen" },
    { value: "Kleine Belohnungen", label: "1–19 Punkte" },
    { value: "Mittlere Belohnungen", label: "20–49 Punkte" },
    { value: "Große Belohnungen", label: "50–100 Punkte" },
  ];

  return (
    <div className="my-10 px-4">
      {/* Desktop / Tablet: Buttons */}
      <div className="hidden sm:flex flex-wrap justify-center gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setCostFilter(option.value)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              costFilter === option.value
                ? "bg-amber-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-amber-500 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Mobile: Dropdown */}
      <div className="sm:hidden relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-amber-600 text-white font-medium rounded-md px-5 py-2.5 inline-flex justify-between items-center"
        >
          {options.find((o) => o.value === costFilter)?.label || "Filter"}
          <FiChevronDown className="ml-2 w-5 h-5" />
        </button>

        {isOpen && (
          <div className="absolute mt-1 w-full bg-white border rounded-md shadow z-10">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setCostFilter(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-amber-600 hover:text-white ${
                  costFilter === option.value
                    ? "bg-amber-500 text-white"
                    : "text-gray-800"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
