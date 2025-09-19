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
      <div className="card">
        {/* Points display */}
        <div className="points">{points}</div>

        {/* Placeholder image */}
        <img
          className="card-image"
          src="/images/tasks/Task-Zimmer-aufraeumen.png"
          alt="Zimmer aufräumen"
        />

        {/* Task title */}
        <h3>{title}</h3>

        <div className="card-actions">
          <button
            className="icon-btn delete"
            onClick={() => setShowConfirm(true)}
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
