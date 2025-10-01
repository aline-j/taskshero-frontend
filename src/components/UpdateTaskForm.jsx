import { useState } from "react";
import "./UpdateTaskForm.css";

export default function UpdateTaskForm({ initialTask, onEdit, onCancel }) {
  const [editedTask, setEditedTask] = useState(initialTask);

  function handleSubmit(e) {
    e.preventDefault();
    onEdit(editedTask);
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={editedTask.title}
        onChange={(e) =>
          setEditedTask({ ...editedTask, title: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Points"
        value={editedTask.points}
        onChange={(e) =>
          setEditedTask({ ...editedTask, points: e.target.value })
        }
      />
      <select
        value={editedTask.group}
        onChange={(e) =>
          setEditedTask({ ...editedTask, group: e.target.value })
        }
      >
        <option value="Kindergartenalter">Kindergartenalter</option>
        <option value="Grundschulalter">Grundschulalter</option>
        <option value="Teenager">Teenager</option>
      </select>

      <div className="form-actions">
        <button type="submit">Ändern</button>
        <button type="button" onClick={onCancel}>
          Abbrechen
        </button>
      </div>
    </form>
  );
}
