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
        },
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
      <div className="relative flex flex-col bg-white rounded-md shadow-md hover:shadow-xl">
        {/* Points */}
        <div className="absolute top-0 right-0 flex items-center gap-2 rounded-l-md bg-gray-700 px-2 py-1 text-sm md:text-md font-semibold text-white">
          ⭐ {points}
        </div>
        {/* Image */}
        <img
          src={image}
          alt={title}
          className="h-38 w-full object-cover md:h-48"
        />

        {/* Title */}
        <div className="p-3 h-20 flex flex-col justify-center">
          <h3 className="font-medium md:font-semibold text-md text-gray-800 text-center overflow-hidden">
            {title}
          </h3>
        </div>

        {/* Actions */}
        <div className="flex h-12 justify-center items-center gap-3">
          <button
            onClick={() => setShowAssignmentForm(true)}
            className="rounded-md px-2 md:px-4 md:py-2 text-md font-medium transition-transform duration-200 hover:scale-200"
            title="Zuweisen"
          >
            👥
          </button>

          <button
            onClick={() => setShowEditForm(true)}
            className="rounded-md px-2 md:px-4 md:py-2 text-md font-medium transition-transform duration-200 hover:scale-200"
            title="Bearbeiten"
          >
            ✏️
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="rounded-md px-2 md:px-4 md:py-2 text-md font-medium transition-transform duration-200 hover:scale-200"
            title="Löschen"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-md shadow-xl p-6 w-96 text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Aufgabe löschen?
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Dieser Vorgang kann nicht rückgängig gemacht werden.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-md bg-slate-200 hover:bg-slate-300 text-gray-800"
                onClick={() => setShowConfirm(false)}
              >
                Abbrechen
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
                onClick={() => handleDelete(task_id)}
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-md shadow-xl p-6 w-[420px]">
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

      {showAssignmentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-md shadow-xl p-6 w-[420px]">
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
