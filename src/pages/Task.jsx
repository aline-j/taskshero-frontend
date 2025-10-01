import { useState } from "react";
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
      if (!response.ok) throw new Error("HTTP error " + response.status);
      onTaskDeleted(task_id);
    } catch (err) {
      console.error(err);
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
      if (!response.ok) throw new Error("HTTP error " + response.status);
      onTaskEdit(updateTask);
      setShowEditForm(false);
    } catch (err) {
      alert("Something went wrong");
    }
  }

  return (
    <>
      <div className="relative w-card-width h-[300px] bg-white shadow rounded-lg p-4 flex flex-col sm:w-card-width-md">
        {/* Points Badge */}
        <div className="absolute top-2 right-2 bg-amber-400 text-black text-xs font-semibold px-2 py-1 rounded-full">
          {points} Punkte
        </div>

        {/* Image */}
        <img
          className="w-full h-[160px] object-cover rounded-lg"
          src="/images/tasks/Task-Zimmer-aufraeumen.png"
          alt={title}
        />

        {/* Title */}
        <h3 className="mt-3 mb-1 text-lg text-center font-semibold">{title}</h3>

        {/* Action Buttons */}
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button
            className="text-xl p-2 rounded-full transition-all duration-200 hover:bg-white hover:-translate-y-1.5 hover:shadow-lg"
            onClick={() => setShowEditForm(true)}
          >
            ✏️
          </button>
          <button
            className="text-xl p-2 rounded-full transition-all duration-200 hover:bg-white hover:-translate-y-1.5 hover:shadow-lg"
            onClick={() => setShowConfirm(true)}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <p className="font-semibold">
              Bist du sicher, dass du diese Aufgabe löschen möchtest?
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Dieser Vorgang kann nicht rückgängig gemacht werden!
            </p>
            <div className="flex justify-around mt-4">
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDelete(task_id)}
              >
                Ja, löschen
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={() => setShowConfirm(false)}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
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
