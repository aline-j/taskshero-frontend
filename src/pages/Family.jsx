import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import ButtonsSaveCancel from "../components/ButtonsSaveCancel";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Family() {
  const { getToken } = useAuth();
  const [userFamily, setUserFamily] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    familyname: "",
  });

  useEffect(() => {
    async function fetchFamily() {
      try {
        const token = await getToken();
        const res = await fetch(`${BASE_URL}/family`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Fehler beim Abrufen der Familie");

        const data = await res.json();
        setUserFamily(data.family_name);
        setFormData({
          familyname: data.family_name || "",
        });
      } catch (err) {
        console.error(err);
        setUserFamily(null);
      }
    }
    fetchFamily();
  }, [getToken]);

  async function handleSave(e) {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/family`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          family_name: formData.familyname,
        }),
      });

      if (!response.ok) throw new Error("HTTP error " + response.status);

      setUserFamily(formData.familyname);
      setIsEditing(false);
      setSuccessMessage("Familienname erfolgreich gespeichert ✅");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Fehler beim Speichern der Änderungen ❌");
      setTimeout(() => setErrorMessage(""), 4000);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="flex justify-center text-left">
      <div className="w-full max-w-md flex flex-col overflow-hidden">
        <h2 className="text-5xl font-bold my-20 text-center">Deine Familie</h2>

        {/* If family exists and not in edit mode */}
        {userFamily && !isEditing ? (
          <div className="flex items-center justify-center gap-3 mb-6">
            <p className="text-xl font-medium">{userFamily}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xl p-1 rounded-full transition-transform duration-200 hover:-translate-y-0.5"
              title="Bearbeiten"
            >
              ✏️
            </button>
          </div>
        ) : (
          // Form
          <form className="space-y-4">
            {!userFamily && (
              <>
                <p className="text-center font-bold text-xl mt-6">
                  Du musst einen Familiennamen definieren!
                </p>
                <p className="text-center font-medium text-md mb-10">
                  Anschließend kannst du deine Kinder anlegen.
                </p>
              </>
            )}
            <input
              className="mt-1 block w-full px-4 py-2 text-center border border-gray-300 rounded-md shadow-sm"
              placeholder="Euer Familienname"
              name="familyname"
              value={formData.familyname}
              type="text"
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 text-center">
              Mindestens 5 Zeichen, muss eindeutig sein.
            </p>

            {successMessage && (
              <p className="text-green-600 text-center font-medium mt-6">
                {successMessage}
              </p>
            )}
            {errorMessage && (
              <p className="text-red-600 text-center font-medium mt-6">
                {errorMessage}
              </p>
            )}

            {/* Action Buttons */}
            <ButtonsSaveCancel
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          </form>
        )}
      </div>
    </div>
  );
}
