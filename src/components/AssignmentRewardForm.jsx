import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AssignmentRewardForm({ initialReward, onCancel }) {
  const { getToken } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load children
  useEffect(() => {
    async function getChildren() {
      try {
        setIsLoading(true);
        const token = await getToken();
        const response = await fetch(`${BASE_URL}/children`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("HTTP error: " + response.status);

        const data = await response.json();
        setChildren(data.children);
      } catch (err) {
        console.error("Error fetching children: ", err);
        setMessage("Fehler beim Laden der Kinder.");
      } finally {
        setIsLoading(false);
      }
    }

    getChildren();
  }, []);

  // Checkbox-Handler
  const handleCheckboxChange = (childId) => {
    setSelectedChildren((prev) =>
      prev.includes(childId)
        ? prev.filter((id) => id !== childId)
        : [...prev, childId]
    );
  };

  // Send assignment
  async function handleSubmit(e) {
    e.preventDefault();
    if (selectedChildren.length === 0) {
      setMessage("Bitte mindestens ein Kind auswählen.");
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/assign-reward`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reward_id: initialReward.reward_id,
          child_ids: selectedChildren,
        }),
      });

      if (!response.ok) throw new Error("Fehler beim Zuweisen der Aufgabe");

      setMessage("Aufgabe erfolgreich zugewiesen ✅");
      setTimeout(() => onCancel(), 800);
    } catch (err) {
      console.error(err);
      setMessage("Fehler beim Zuweisen der Aufgabe.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-white rounded-md p-4"
    >
      <h2 className="text-lg font-semibold text-center">
        Belohnung zuordnen:
        <br />
        <span className="text-cyan-600">{initialReward.title}</span>
      </h2>

      {/* List of children */}
      {isLoading ? (
        <p className="text-center text-gray-600">Lade Kinder...</p>
      ) : (
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto p-2">
          {children.map((child) => (
            <label
              key={child.id}
              className="flex items-center gap-3 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedChildren.includes(child.id)}
                onChange={() => handleCheckboxChange(child.id)}
                className="w-5 h-5 accent-amber-500"
              />
              <span className="text-gray-800 font-medium">
                {child.first_name}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* Feedback message */}
      {message && (
        <p className="text-center text-sm text-gray-700 mt-1">{message}</p>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-3">
        <button
          type="submit"
          className="text-white font-medium rounded-md text-sm px-5 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-green-300"
        >
          Zuordnen
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium rounded-md text-sm px-5 py-2.5"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
