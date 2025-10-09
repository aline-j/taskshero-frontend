import { useState } from "react";
import { useSignIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
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
    <div className="p-8 bg-gray-50">
      {/* Only visible when logged out */}
      <SignedOut>
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className="focus:outline-none text-white bg-amber-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-md text-sm px-5 py-2.5"
          >
            Einloggen
          </button>
        </form>
      </SignedOut>
    </div>
  );
}
