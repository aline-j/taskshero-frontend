import { useState } from "react";
import { useSignUp, SignedOut, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Registration() {
  const { getToken } = useAuth();
  const { signUp, setActive } = useSignUp();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showRegistration, setShowRegistration] = useState(false);

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const signUpState = await signUp.create({
        firstName: firstname,
        lastName: lastname,
        emailAddress: email,
        password: password,
      });

      if (signUpState.status === "missing_requirements") {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setPendingVerification(true);
        alert("Wir haben dir einen Code an deine E-Mail geschickt!");
      } else if (signUpState.status === "complete") {
        await setActive({ session: signUpState.createdSessionId });

        const token = await getToken();
        await fetch(`${BASE_URL}/sync-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error(err);
      alert(
        "Etwas ist schiefgelaufen: " + err.errors?.[0]?.message ?? err.message
      );
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });

        const token = await getToken();
        await fetch(`${BASE_URL}/sync-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        navigate("/family");
      } else {
        alert("Verification failed: " + attempt.status);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <SignedOut>
      <h2 className="text-5xl font-bold my-20 text-center">Registrierung</h2>

      {!pendingVerification ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">
            Vorname
          </label>
          <input
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Dein Vorname"
            value={firstname}
            type="text"
            onChange={(e) => setFirstname(e.target.value)}
          />

          <label className="block text-sm font-medium text-gray-700">
            Nachname
          </label>
          <input
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Dein Nachname"
            value={lastname}
            type="text"
            onChange={(e) => setLastname(e.target.value)}
          />

          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Deine Email-Adresse"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-sm font-medium text-gray-700">
            Passwort
          </label>
          <input
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Dein Passwort"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Action Button */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              type="submit"
              className="focus:outline-none text-white bg-amber-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-md text-sm px-5 py-2.5"
            >
              Account erstellen
            </button>
          </div>

          {/* Different text depending on registration status */}
          <div className="flex justify-center gap-4 mt-8">
            <p className="text-sm text-center text-gray-600 mt-4">
              Schon einen Account?{" "}
              <button
                onClick={() => setShowRegistration(false)}
                className="text-amber-500 hover:underline"
              >
                Hier geht es zum Login
              </button>
            </p>
          </div>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleVerify}>
          <label className="block text-sm font-medium text-gray-700">
            Bestätigungscode
          </label>
          <input
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Code aus der E-Mail"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {/* Action Button */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              type="submit"
              className="focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-md text-sm px-5 py-2.5"
            >
              Code bestätigen
            </button>
          </div>
        </form>
      )}
    </SignedOut>
  );
}
