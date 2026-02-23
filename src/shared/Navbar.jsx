import { useState } from "react";
import { NavLink } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { useChildren } from "../context/ChildrenContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { children } = useChildren();
  const hasChildren = children.length > 0;

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
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white">
            <SignedOut>
              <li>
                <NavLink
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-sm md:p-0 ${
                      isActive ? "text-cyan-600 font-bold" : "text-gray-800"
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
                      isActive ? "text-cyan-600 font-bold" : "text-gray-800"
                    } hover:bg-gray-100 md:hover:bg-transparent md:hover:text-cyan-600 font-bold`
                  }
                >
                  Account
                </NavLink>
              </li>
              <li className="relative group">
                <div className="flex items-center justify-center">
                  <NavLink
                    to="/family"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-2 px-3 md:p-0 font-bold ${
                        isActive ? "text-cyan-600" : "text-gray-800"
                      } hover:text-cyan-600`
                    }
                  >
                    Family
                  </NavLink>
                </div>

                {/* Desktop Dropdown */}
                {hasChildren && (
                  <ul
                    className="
                      absolute top-full left-1/2 z-50
                      hidden md:group-hover:block
                      bg-white shadow-lg
                      min-w-[120px] pt-4
                      transform -translate-x-1/2 p-4"
                  >
                    {children.map((child) => (
                      <li key={child.id}>
                        <NavLink
                          to={`/child/${child.id}`}
                          onClick={() => setIsMenuOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-2 font-bold ${
                              isActive ? "text-cyan-600" : "text-gray-800"
                            } hover:text-cyan-600`
                          }
                        >
                          {child.first_name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Mobile Children Menu */}
                {hasChildren && (
                  <ul className="flex flex-col gap-1 mb-2 md:hidden">
                    {children.map((child) => (
                      <li key={child.id}>
                        <NavLink
                          to={`/child/${child.id}`}
                          onClick={() => setIsMenuOpen(false)}
                          className={({ isActive }) =>
                            `block px-2 py-1 font-medium ${
                              isActive ? "text-cyan-600" : "text-gray-700"
                            } hover:text-cyan-600`
                          }
                        >
                          {child.first_name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <NavLink
                  to="/tasks"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-sm md:p-0 ${
                      isActive ? "text-cyan-600 font-bold" : "text-gray-800"
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
                      isActive ? "text-cyan-600 font-bold" : "text-gray-800"
                    } hover:bg-gray-100 md:hover:bg-transparent md:hover:text-cyan-600 font-bold`
                  }
                >
                  Belohnungen
                </NavLink>
              </li>
            </SignedIn>
          </ul>
        </div>
      </div>
    </nav>
  );
}
