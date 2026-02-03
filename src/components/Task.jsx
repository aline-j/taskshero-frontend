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
      <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 w-card-width h-[300px] md:h-[350px] sm:w-card-width-md overflow-hidden">
        {/* Image */}
        <img
          src={image}
          alt={title}
          className="h-38 w-full object-cover md:h-48"
        />

        {/* Content */}
        <div className="p-4 flex flex-col">
          {/* Points */}
          <p className="text-center font-semibold text-lg text-gray-600 mb-3">
            ⭐ {points}
          </p>
          <h3 className="text-center font-semibold text-gray-800 mb-3">
            {title}
          </h3>
        </div>

        {/* Actions */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowAssignmentForm(true)}
            className="rounded-xl text-white px-3 py-1.5 text-md font-medium transition-transform duration-200 transform scale-100 hover:scale-200"
            title="Zuweisen"
          >
            👥
          </button>

          <button
            onClick={() => setShowEditForm(true)}
            className="rounded-xl text-white px-3 py-1.5 text-md font-medium transition-transform duration-200 transform scale-100 hover:scale-200"
            title="Bearbeiten"
          >
            ✏️
          </button>

          <button
            onClick={() => setShowConfirm(true)}
            className="rounded-xl text-white px-3 py-1.5 text-md font-medium transition-transform duration-200 transform scale-100 hover:scale-200"
            title="Löschen"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-96 text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Aufgabe löschen?
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Dieser Vorgang kann nicht rückgängig gemacht werden.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-gray-800"
                onClick={() => setShowConfirm(false)}
              >
                Abbrechen
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white"
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
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[420px]">
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
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[420px]">
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
