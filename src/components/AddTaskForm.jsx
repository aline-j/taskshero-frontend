import { useState } from "react";

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
    <form
      className="flex flex-col lg:flex-row lg:items-center lg:gap-3 gap-3 w-full my-4"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Task Title"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        required
        className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <input
        type="number"
        placeholder="Points"
        value={newTask.points}
        onChange={(e) => setNewTask({ ...newTask, points: e.target.value })}
        required
        className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <select
        value={newTask.group}
        onChange={(e) => setNewTask({ ...newTask, group: e.target.value })}
        className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="Kindergartenalter">Kindergartenalter</option>
        <option value="Grundschulalter">Grundschulalter</option>
        <option value="Teenager">Teenager</option>
      </select>

      <div className="flex gap-2 mt-2 lg:mt-0 lg:ml-auto">
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-green-600 text-white text-md hover:bg-green-700 hover:-translate-y-0.5 hover:shadow transition"
        >
          Hinzufügen
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 text-md hover:bg-gray-400 hover:-translate-y-0.5 hover:shadow transition"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
