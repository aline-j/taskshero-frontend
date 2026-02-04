import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function FilterTasks({ groupFilter, setGroupFilter }) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: "all", label: "Alle Altersgruppen" },
    { value: "Kindergartenalter", label: "Kindergartenalter" },
    { value: "Grundschulalter", label: "Grundschulalter" },
    { value: "Teenager", label: "Teenager" },
  ];

  return (
    <div className="my-10 px-4">
      {/* Desktop / Tablet: Buttons */}
      <div className="hidden sm:flex flex-wrap justify-center gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setGroupFilter(option.value)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              groupFilter === option.value
                ? "bg-cyan-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-cyan-500 hover:text-white"
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
          className="w-full bg-cyan-600 text-white font-medium rounded-md px-5 py-2.5 inline-flex justify-between items-center"
        >
          {options.find((o) => o.value === groupFilter)?.label || "Filter"}
          <FiChevronDown className="ml-2 w-5 h-5" />
        </button>

        {isOpen && (
          <div className="absolute mt-1 w-full bg-white border rounded-md shadow z-10">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setGroupFilter(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-cyan-600 hover:text-white ${
                  groupFilter === option.value
                    ? "bg-cyan-500 text-white"
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
