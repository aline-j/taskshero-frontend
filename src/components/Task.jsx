import { useState } from "react";
import UpdateTaskForm from "../components/UpdateTaskForm";
import AssignmentTaskForm from "../components/AssignmentTaskForm";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Task({
  title,
  points,
  group,
  image,
  task_id,
  onTaskDeleted = () => {},
  onTaskEdit = () => {},
  onTaskAssignment = () => {},
  getToken,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  async function handleDelete(task_id) {
    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/tasks/${task_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("HTTP error " + response.status);
      onTaskDeleted(task_id);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  }

  async function handleEdit(formData) {
    try {
      const token = await getToken();
      const response = await fetch(
        `${BASE_URL}/task/${formData.get("task_id")}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) throw new Error("HTTP error " + response.status);

      const updatedTask = await response.json();
      onTaskEdit(updatedTask);
      setShowEditForm(false);
    } catch (err) {
      alert("Something went wrong");
    }
  }

  async function handleAssignment(taskAssignment) {
    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/assign-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskAssignment),
      });
      if (!response.ok) throw new Error("HTTP error " + response.status);
      onTaskAssignment(taskAssignment);
      setShowAssignmentForm(false);
    } catch (err) {
      alert("Fehler beim Zuweisen der Aufgabe.");
    }
  }

  return (
    <>
      <div className="relative w-card-width h-[300px] bg-white shadow rounded-md p-4 flex flex-col sm:w-card-width-md">
        {/* Points Badge */}
        <div className="absolute top-2 right-2 bg-amber-400 text-black text-xs font-semibold px-2 py-1 rounded-full">
          {points} Punkte
        </div>

        {/* Image */}
        <img
          className="w-full h-[160px] object-cover rounded-md"
          src={image}
          alt={image}
        />

        {/* Title */}
        <h3 className="mt-3 mb-1 text-md text-center font-semibold">{title}</h3>

        {/* Action Buttons */}
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button
            className="text-xl p-1 rounded-full transition-transform duration-200 transform scale-x-[-1] hover:-translate-y-0.5"
            onClick={() => setShowAssignmentForm(true)}
          >
            👥
          </button>
          <button
            className="text-xl p-1 rounded-full transition-transform duration-200 transform scale-x-[-1] hover:-translate-y-0.5"
            onClick={() => setShowEditForm(true)}
          >
            ✏️
          </button>
          <button
            className="text-xl p-1 rounded-full transition-transform duration-200 hover:-translate-y-0.5"
            onClick={() => setShowConfirm(true)}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80 text-center">
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
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <UpdateTaskForm
              initialTask={{
                title,
                points,
                group,
                task_id,
                image_mode: "Bildbehalten",
              }}
              onEdit={handleEdit}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <AssignmentTaskForm
              initialTask={{ title, points, group, image, task_id }}
              onEdit={handleAssignment}
              onCancel={() => setShowAssignmentForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
