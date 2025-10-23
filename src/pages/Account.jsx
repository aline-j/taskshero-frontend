import {
  SignedIn,
  SignedOut,
  useUser,
  useAuth,
  useClerk,
} from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ButtonsSaveCancel from "../components/ButtonsSaveCancel";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Account() {
  const { user, isLoaded } = useUser();
  const { getToken, signOut } = useAuth();
  const { user: clerkUser } = useClerk();

  const [isLoading, setIsLoading] = useState(false);

  const [customUser, setCustomUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    if (!isLoaded || !user) return;
    let mounted = true;

    async function fetchUserData() {
      try {
        setIsLoading(true);
        const token = await getToken();
        const response = await fetch(`${BASE_URL}/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await response.text();
        const data = JSON.parse(text || "{}");

        if (!response.ok) throw new Error("HTTP error " + response.status);

        if (mounted) {
          setCustomUser(data);
          setFormData({
            first_name: data.first_name || user?.firstName,
            last_name: data.last_name || user?.lastName,
          });
        }
      } catch (err) {
        throw new Error(`fetchUserData error: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
    return () => {
      mounted = false;
    };
  }, [isLoaded, user, getToken]);

  async function handleSave() {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const token = await getToken();

      // Update Clerk user
      await clerkUser.update({
        firstName: formData.first_name,
        lastName: formData.last_name,
      });

      // Update backend DB
      const response = await fetch(`${BASE_URL}/update-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("HTTP error " + response.status);

      const updatedUser = await response.json();

      setCustomUser(updatedUser);
      setIsEditing(false);
      setSuccessMessage("Profil erfolgreich aktualisiert ✅");

      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);

      setFormData({
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
      });
    } catch (err) {
      console.error("handleSave error:", err);
      setErrorMessage("Fehler beim Speichern der Änderungen ❌");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <>
      {isLoading ? (
        <p className="text-center text-gray-500 mt-10">Lade Account...</p>
      ) : (
        <SignedIn>
          <div className="flex justify-center text-left">
            <div className="w-full max-w-md flex flex-col overflow-hidden">
              <h1 className="text-4xl font-bold my-10 text-center lg:text-5xl lg:my-20">
                Dein Account
              </h1>

              <div className="space-y-8 w-full">
                {/* Firstname */}
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500">Vorname</p>
                  <hr className="border-gray-300" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-3 py-2"
                    />
                  ) : (
                    <p className="font-medium">{customUser?.first_name}</p>
                  )}
                </div>

                {/* Lastname */}
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500">Nachname</p>
                  <hr className="border-gray-300" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-3 py-2"
                    />
                  ) : (
                    <p className="font-medium">{customUser?.last_name}</p>
                  )}
                </div>

                {/* Mail address */}
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500">E-Mail-Adresse</p>
                  <hr className="border-gray-300" />
                  <p className="font-medium">{customUser?.email}</p>
                </div>

                {/* Password */}
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500">Passwort</p>
                  <hr className="border-gray-300" />
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      Möchtest du dein Passwort ändern?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Messages */}
          {successMessage && (
            <p className="text-green-600 text-center font-medium mt-6 transition-opacity duration-500">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="text-red-600 text-center font-medium mt-6 transition-opacity duration-500">
              {errorMessage}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-12 border-2 border-gray-300 text-gray-500 hover:bg-gray-500 hover:text-white font-medium rounded-md text-sm px-5 py-2.5"
              >
                Bearbeiten
              </button>
            ) : (
              <>
                {isEditing && (
                  <ButtonsSaveCancel
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                  />
                )}
              </>
            )}
          </div>

          <button
            onClick={() => signOut()}
            className="mt-6 border-2 border-gray-300 text-gray-500 hover:bg-gray-500 hover:text-white font-medium rounded-md text-sm px-5 py-2.5"
          >
            Abmelden
          </button>
        </SignedIn>
      )}
    </>
  );
}
