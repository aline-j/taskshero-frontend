import { useState } from "react";
import { NavLink } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-gray-200 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="/images/icons/TasksHero-Icon.png"
            className="h-8"
            alt="TasksHero Icon"
          />
          <img
            src="/images/icons/TasksHero-Text.png"
            className="h-8"
            alt="TasksHero Logo"
          />
        </a>

        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-md md:hidden hover:bg-gray-100"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? (
            // Close (X) Icon
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger Icon
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-md bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
            <SignedOut>
              <li>
                <NavLink
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-sm md:p-0 ${
                      isActive ? "text-cyan-600 font-bold" : "text-gray-900"
                    } hover:bg-gray-100 md:hover:bg-transparent md:hover:text-cyan-600 font-bold`
                  }
                >
                  Einloggen
                </NavLink>
              </li>
            </SignedOut>

            <SignedIn>
              <li>
                <NavLink
                  to="/account"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-sm md:p-0 ${
                      isActive ? "text-cyan-600 font-bold" : "text-gray-900"
                    } hover:bg-gray-100 md:hover:bg-transparent md:hover:text-cyan-600 font-bold`
                  }
                >
                  Account
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/family"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-sm md:p-0 ${
                      isActive ? "text-cyan-600 font-bold" : "text-gray-900"
                    } hover:bg-gray-100 md:hover:bg-transparent md:hover:text-cyan-600 font-bold`
                  }
                >
                  Family
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/tasks"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-sm md:p-0 ${
                      isActive ? "text-cyan-600 font-bold" : "text-gray-900"
                    } hover:bg-gray-100 md:hover:bg-transparent md:hover:text-cyan-600 font-bold`
                  }
                >
                  Aufgaben
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/rewards"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-sm md:p-0 ${
                      isActive ? "text-cyan-600 font-bold" : "text-gray-900"
                    } hover:bg-gray-100 md:hover:bg-transparent md:hover:text-cyan-600 font-bold`
                  }
                >
                  Rewards
                </NavLink>
              </li>
            </SignedIn>
          </ul>
        </div>
      </div>
    </nav>
  );
}
