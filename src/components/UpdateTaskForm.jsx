import { useState } from "react";
import ButtonsSaveCancel from "./ButtonsSaveCancel";

export default function UpdateTaskForm({ initialTask, onEdit, onCancel }) {
  const [editedTask, setEditedTask] = useState(initialTask);

  function handleSubmit(e) {
    e.preventDefault();
    onEdit(editedTask);
  }

  return (
    <form className="flex flex-wrap gap-3 w-full my-4">
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

      <ButtonsSaveCancel onSave={handleSubmit} onCancel={onCancel} />
    </form>
  );
}
