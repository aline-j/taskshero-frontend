import {
  SignedIn,
  SignedOut,
  useUser,
  useAuth,
  useClerk,
} from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Account() {
  const { user, isLoaded } = useUser();
  const { getToken, signOut } = useAuth();
  const { user: clerkUser } = useClerk();

  const [customUser, setCustomUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    familyname: "",
  });

  useEffect(() => {
    if (!isLoaded || !user) return;
    let mounted = true;

    async function fetchUserData() {
      try {
        const token = await getToken();
        const res = await fetch(`${BASE_URL}/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const text = await res.text();
        const data = JSON.parse(text || "{}");

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        if (mounted) {
          setCustomUser(data);
          setFormData({
            first_name: data.first_name || user?.firstName,
            last_name: data.last_name || user?.lastName,
            familyname: data.familyname || customUser?.familyname,
          });
        }
      } catch (err) {
        throw new Error(`fetchUserData error: ${err.message}`);
      }
    }

    fetchUserData();
    return () => {
      mounted = false;
    };
  }, [isLoaded, user, getToken]);

  async function handleSave() {
    setIsSaving(true);
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
      const res = await fetch(`${BASE_URL}/update-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updatedUser = await res.json();

      setCustomUser(updatedUser);
      setIsEditing(false);
      setSuccessMessage("Profil erfolgreich aktualisiert ✅");

      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);

      // Update local state
      setCustomUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("handleSave error:", err);
      setErrorMessage("Fehler beim Speichern der Änderungen ❌");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsSaving(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <>
      <SignedIn>
        <div className="flex justify-center text-left">
          <div className="w-full max-w-md flex flex-col overflow-hidden">
            <h2 className="text-5xl font-bold my-20 text-center">
              Dein Account
            </h2>

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

              {/* Familyname */}
              <div className="flex flex-col">
                <p className="text-sm text-gray-500">Familienname</p>
                <hr className="border-gray-300" />
                {isEditing ? (
                  <input
                    type="text"
                    name="familyname"
                    value={formData.familyname}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  />
                ) : (
                  <p className="font-medium">{customUser?.familyname}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
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
              className="mt-12 focus:outline-none border-2 border-gray-300 text-gray-500 hover:bg-gray-500 hover:text-white focus:ring-4 focus:ring-yellow-300 font-medium rounded-md text-sm px-5 py-2.5"
            >
              Bearbeiten
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`focus:outline-none text-white font-medium rounded-md text-sm px-5 py-2.5 ${
                  isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300"
                }`}
              >
                {isSaving ? "Speichern…" : "Speichern"}
              </button>

              <button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="focus:outline-none text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-md text-sm px-5 py-2.5"
              >
                Abbrechen
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => signOut()}
          className="mt-6 focus:outline-none border-2 border-gray-300 text-gray-500 hover:bg-gray-500 hover:text-white focus:ring-4 focus:ring-yellow-300 font-medium rounded-md text-sm px-5 py-2.5"
        >
          Abmelden
        </button>
      </SignedIn>
    </>
  );
}
