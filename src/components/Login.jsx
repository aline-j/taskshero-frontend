import { useState } from "react";
import { useSignIn, SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";

export default function Login() {
  const { signOut } = useAuth();
  const { signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      {/* Only visible when logged in */}
      <SignedIn>
        <button
          onClick={() => signOut()}
          className="focus:outline-none text-white bg-amber-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Sign Out
        </button>
      </SignedIn>

      {/* Only visible when logged out */}
      <SignedOut>
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
            className="focus:outline-none text-white bg-amber-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Log in
          </button>
        </form>
      </SignedOut>
    </div>
  );
}
