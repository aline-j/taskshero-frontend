import { useState } from "react";

export default function Filter({ groupFilter, setGroupFilter }) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to display the label text
  const getLabel = (value) => {
    switch (value) {
      case "all":
        return "Alle Altersgruppen";
      case "Kindergartenalter":
        return "Kindergartenalter";
      case "Grundschulalter":
        return "Grundschulalter";
      case "Teenager":
        return "Teenager";
      default:
        return "Filter";
    }
  };

  function handleSelect(value) {
    setGroupFilter(value);
    setIsOpen(false); // Close Dropdown
  }

  return (
    <div className="relative flex flex-col md:flex-row justify-end items-center gap-4 mb-8 px-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 
               focus:outline-none focus:ring-blue-300 font-medium 
               rounded-md text-md px-5 py-2.5 inline-flex items-center"
      >
        {getLabel(groupFilter)}
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
          <ul className="py-2 px-4 text-md text-gray-700">
            <li>
              <button
                onClick={() => handleSelect("all")}
                className="w-full text-left px-4 py-2 hover:bg-cyan-600 hover:text-white"
              >
                Alle Altersgruppen
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSelect("Kindergartenalter")}
                className="w-full text-left px-4 py-2 hover:bg-cyan-600 hover:text-white"
              >
                Kindergartenalter
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSelect("Grundschulalter")}
                className="w-full text-left px-4 py-2 hover:bg-cyan-600 hover:text-white"
              >
                Grundschulalter
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSelect("Teenager")}
                className="w-full text-left px-4 py-2 hover:bg-cyan-600 hover:text-white"
              >
                Teenager
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
