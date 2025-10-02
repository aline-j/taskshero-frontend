import { useState } from "react";

export default function UpdateTaskForm({ initialTask, onEdit, onCancel }) {
  const [editedTask, setEditedTask] = useState(initialTask);

  function handleSubmit(e) {
    e.preventDefault();
    onEdit(editedTask);
  }

  return (
    <form className="flex flex-wrap gap-3 w-full my-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={editedTask.title}
        onChange={(e) =>
          setEditedTask({ ...editedTask, title: e.target.value })
        }
        className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <input
        type="number"
        placeholder="Points"
        value={editedTask.points}
        onChange={(e) =>
          setEditedTask({ ...editedTask, points: e.target.value })
        }
        className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <select
        value={editedTask.group}
        onChange={(e) =>
          setEditedTask({ ...editedTask, group: e.target.value })
        }
        className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="Kindergartenalter">Kindergartenalter</option>
        <option value="Grundschulalter">Grundschulalter</option>
        <option value="Teenager">Teenager</option>
      </select>

      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-lg hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow transition"
        >
          Ändern
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 text-lg hover:bg-gray-400 hover:-translate-y-0.5 hover:shadow transition"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
