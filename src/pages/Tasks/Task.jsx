import { useState } from "react";
import "./Task.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export function Task({ title, points, task_id, onTaskDeleted = () => {} }) {
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleDelete(task_id) {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${task_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        alert("Something went wrong");
      } else {
        onTaskDeleted(task_id);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  }

  return (
    <>
      <div className="relative w-card-width h-card-height bg-white shadow rounded p-4 flex flex-col sm:card-width-md">
        {/* Points badge */}
        <div className="absolute top-2 right-2 bg-amber-400 text-black text-xs font-semibold px-2 py-1 rounded-full">
          {points} Punkte
        </div>

        {/* Image */}
        <img
          className="w-full h-[160px] object-cover rounded-[10px]"
          src="/images/tasks/Task-Zimmer-aufraeumen.png"
          alt="Zimmer aufräumen"
        />

        {/* Title */}
        <h3 className="mt-3 mb-1 text-[1.1rem] text-center">{title}</h3>

        {/* Action button */}
        <div className="absolute bottom-2 right-2">
          <button
            className="text-red-500 hover:text-red-700 text-lg"
            onClick={() => setShowConfirm(true)}
            title="Löschen"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Bist du sicher, dass du diese Aufgabe löschen möchtest?</p>
            <p>Dieser Vorgang kann nicht rückgängig gemacht werden!</p>
            <div className="modal-buttons">
              <button onClick={() => handleDelete(task_id)}>Ja, löschen</button>
              <button onClick={() => setShowConfirm(false)}>Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
