import { useState } from "react";
import { useSignIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Login({ setShowRegistration }) {
  const { signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const signInState = await signIn.create({
        strategy: "password",
        identifier: email,
        password,
      });
      if (signInState.status === "complete") {
        await setActive({ session: signInState.createdSessionId });
        navigate("/family");
      } else {
        alert("SignInState: " + signInState.status);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  return (
    <SignedOut>
      {/* Only visible when logged out */}
      <h1 className="text-4xl font-bold my-10 text-center lg:text-5xl lg:my-20">
        Login
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium text-gray-700">Email</label>
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
            Einloggen
          </button>
        </div>

        {/* Different text depending on login status */}
        <div className="flex justify-center gap-4 mt-8">
          <p className="text-sm text-center text-gray-600 mt-4">
            Noch keinen Account?{" "}
            <button
              onClick={() => setShowRegistration(true)}
              className="text-amber-500 hover:underline"
            >
              Hier geht es zur Registrierung
            </button>
          </p>
        </div>
      </form>
    </SignedOut>
  );
}
