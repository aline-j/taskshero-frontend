import { useState } from "react";
import Login from "../components/Login.jsx";
import Registration from "../components/Registration.jsx";

export default function Auth() {
  const [showRegistration, setShowRegistration] = useState(false);

  return (
    <div className="flex justify-center text-left">
      <div className="w-full max-w-md flex flex-col overflow-hidden">
        {/* If registration form should be displayed */}
        {showRegistration ? (
          <>
            <Registration
              showRegistration={showRegistration}
              setShowRegistration={setShowRegistration}
            />
          </>
        ) : (
          <>
            <Login setShowRegistration={setShowRegistration} />
          </>
        )}
      </div>
    </div>
  );
}
