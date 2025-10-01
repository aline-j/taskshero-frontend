import { useState } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import Login from "../components/Login.jsx";
import Registration from "../components/Registration.jsx";

export default function Auth() {
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg flex flex-col overflow-hidden p-8">
        {/* If registration form should be displayed */}
        {showRegistration ? (
          <>
            <Registration />
            <p className="text-sm text-gray-600 mt-4">
              Schon einen Account?{" "}
              <button
                onClick={() => setShowRegistration(false)}
                className="text-amber-500 hover:underline"
              >
                Hier geht es zum Login
              </button>
            </p>
          </>
        ) : (
          <>
            <Login />

            {/* Different text depending on login status */}
            <SignedOut>
              <p className="text-sm text-gray-600 mt-4">
                Noch keinen Account?{" "}
                <button
                  onClick={() => setShowRegistration(true)}
                  className="text-amber-500 hover:underline"
                >
                  Hier geht es zur Registrierung
                </button>
              </p>
            </SignedOut>

            <SignedIn>
              <p className="text-sm text-gray-600 mt-4">
                Erfolgreich eingeloggt.{" "}
                <Link to="/profile" className="text-amber-500 hover:underline">
                  Hier geht es zu deinem Profil
                </Link>
              </p>
            </SignedIn>
          </>
        )}
      </div>
    </div>
  );
}
