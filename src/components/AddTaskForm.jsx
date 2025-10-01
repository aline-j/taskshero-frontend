import { useState } from "react";
import "./AddTaskForm.css";

export default function AddTaskForm({ onAdd, onCancel }) {
  const [newTask, setNewTask] = useState({
    title: "",
    points: "",
    group: "Kindergartenalter",
  });

  function handleSubmit(e) {
    e.preventDefault();
    onAdd(newTask);

    // reset after submit
    setNewTask({ title: "", points: "", group: "Kindergartenalter" });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task Title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Points"
        value={newTask.points}
        onChange={(e) => setNewTask({ ...newTask, points: e.target.value })}
        required
      />
      <select
        value={newTask.group}
        onChange={(e) => setNewTask({ ...newTask, group: e.target.value })}
      >
        <option value="Kindergartenalter">Kindergartenalter</option>
        <option value="Grundschulalter">Grundschulalter</option>
        <option value="Teenager">Teenager</option>
      </select>

      <div className="form-actions">
        <button type="submit">Hinzufügen</button>
        <button type="button" onClick={onCancel}>
          Abbrechen
        </button>
      </div>
    </form>
  );
}
