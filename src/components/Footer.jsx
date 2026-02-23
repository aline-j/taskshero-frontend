import { NavLink } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

export default function Footer() {
  return (
    <footer className="bg-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Navigation */}
          <div className="order-2 md:order-1">
            <h4 className="font-semibold mb-4 text-gray-800">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <SignedOut>
                <li>
                  <NavLink
                    to="/login"
                    className="text-gray-600 hover:text-cyan-600"
                  >
                    Einloggen
                  </NavLink>
                </li>
              </SignedOut>

              <SignedIn>
                <li>
                  <NavLink
                    to="/family"
                    className="text-gray-600 hover:text-cyan-600"
                  >
                    Family
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/tasks"
                    className="text-gray-600 hover:text-cyan-600"
                  >
                    Aufgaben
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/rewards"
                    className="text-gray-600 hover:text-cyan-600"
                  >
                    Belohnungen
                  </NavLink>
                </li>
              </SignedIn>
            </ul>
          </div>

          {/* Brand */}
          <div className="order-1 md:order-2 text-center flex flex-col items-center">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/icons/TasksHero-Icon.png"
                className="h-6 w-auto"
                alt="TasksHero Icon"
              />
              <img
                src="/images/icons/TasksHero-Text.png"
                className="h-6 w-auto"
                alt="TasksHero Logo"
              />
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              <span className="block">Aufgaben werden zum Abenteuer.</span>
              <span className="block">Mehr Motivation.</span>
              <span className="block">Weniger Diskussionen.</span>
            </p>
          </div>

          {/* Legal */}
          <div className="order-3">
            <h4 className="font-semibold mb-4 text-gray-800">Rechtliches</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink
                  to="/impressum"
                  className="text-gray-600 hover:text-cyan-600"
                >
                  Impressum
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/datenschutz"
                  className="text-gray-600 hover:text-cyan-600"
                >
                  Datenschutz
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-12 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} TasksHero. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
