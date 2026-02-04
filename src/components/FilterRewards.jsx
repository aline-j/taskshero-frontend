import { useState } from "react";

export default function FilterRewards({ costFilter, setCostFilter }) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to display the label text
  const getLabel = (value) => {
    switch (value) {
      case "all":
        return "Alle Belohnungen";
      case "Kleine Belohnungen":
        return "Kleine Belohnungen";
      case "Mittlere Belohnungen":
        return "Mittlere Belohnungen";
      case "Große Belohnungen":
        return "Große Belohnungen";
      default:
        return "Filter";
    }
  };

  function handleSelect(value) {
    setCostFilter(value);
    setIsOpen(false); // Close Dropdown
  }

  return (
    <div className="relative flex flex-col md:flex-row justify-end items-center gap-4 mb-8 px-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white bg-cyan-600 hover:bg-cyan-700 font-medium rounded-md text-md px-5 py-2.5 inline-flex items-center"
      >
        {getLabel(costFilter)}
        <svg
          className="w-2.5 h-2.5 ml-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full bg-white rounded-md shadow z-10">
          <ul className="py-2 px-4 text-md text-gray-800">
            <li>
              <button
                onClick={() => handleSelect("all")}
                className="w-full text-left px-4 py-2 hover:bg-cyan-600 hover:text-white"
              >
                Alle Belohnungen
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSelect("Kleine Belohnungen")}
                className="w-full text-left px-4 py-2 hover:bg-cyan-600 hover:text-white"
              >
                1-19 Punkte
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSelect("Mittlere Belohnungen")}
                className="w-full text-left px-4 py-2 hover:bg-cyan-600 hover:text-white"
              >
                20-49 Punkte
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSelect("Große Belohnungen")}
                className="w-full text-left px-4 py-2 hover:bg-cyan-600 hover:text-white"
              >
                50-100 Punkte
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
