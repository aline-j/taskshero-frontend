import { useState } from "react";
import "./Task.css";
import UpdateTaskForm from "../components/UpdateTaskForm";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Task({
  initialTask,
  title,
  points,
  group,
  task_id,
  onTaskDeleted = () => {},
  onTaskEdit = () => {},
  getToken,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  async function handleDelete(task_id) {
    try {
      const token = getToken ? await getToken() : null;
      const response = await fetch(`${BASE_URL}/tasks/${task_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      } else {
        onTaskDeleted(task_id);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  }

  async function handleEdit(updateTask) {
    try {
      const token = getToken ? await getToken() : null;
      const response = await fetch(`${BASE_URL}/task/${updateTask.task_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updateTask),
      });
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      // notify parent to refresh tasks
      onTaskEdit(updateTask);
      setShowEditForm(false);
    } catch (err) {
      alert("Something went wrong");
    }
  }

  return (
    <>
      <div className="relative w-card-width h-[300px] bg-white shadow rounded p-4 flex flex-col sm:w-card-width-md">
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
          <div className="card-actions">
            <button
              className="icon-btn edit"
              onClick={() => setShowEditForm(true)}
            >
              ✏️
            </button>
            <button
              className="icon-btn delete"
              onClick={() => setShowConfirm(true)}
            >
              🗑️
            </button>
          </div>
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

      {/* Task edit modal */}
      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal">
            <UpdateTaskForm
              initialTask={{ title, points, group, task_id }}
              onEdit={handleEdit}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
