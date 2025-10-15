import { useState } from "react";

export default function Child({ firstname, birthday }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-card-width h-[300px] bg-white shadow rounded-md p-4 flex flex-col sm:w-card-width-md">
      <div className="flex justify-end relative">
        <button
          onClick={() => setIsOpen(!isOpen)} // Dropdown toggle
          className="text-gray-700 bg-white0 hover:bg-gray-500 hover:text-white font-medium 
               rounded-md text-md px-5 py-2.5 inline-flex items-center"
        >
          <span className="sr-only">Open dropdown</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 3"
          >
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute top-full bg-gray-50 rounded-md shadow z-10">
            <ul className="py-2 px-4 text-md text-gray-700">
              <li className="mb-1">
                <a
                  href="#"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-500 hover:text-white"
                >
                  Ändern
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-500 hover:text-white"
                >
                  Löschen
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center pb-10">
        <img
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
          src="/images/avatars/avatar-boy-1.png"
          alt="Child image"
        />
        <h5 className="mt-3 mb-1 text-lg text-center font-semibold">
          {firstname}
        </h5>
        <div className="flex justify-center gap-2 mt-8 w-full">
          <a
            href="#"
            className="w-1/2 text-center text-white font-medium rounded-md text-sm px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700"
          >
            Aufgaben
          </a>
          <a
            href="#"
            className="w-1/2 text-center text-white font-medium rounded-md text-sm px-5 py-2.5 bg-amber-500 hover:bg-amber-600"
          >
            Belohnungen
          </a>
        </div>
      </div>
    </div>
  );
}
