import { useState, useRef } from "react";
import ButtonsSaveCancel from "./ButtonsSaveCancel";

export default function AddTaskForm({ onAdd, onCancel }) {
  const [newTask, setNewTask] = useState({
    title: "",
    points: "",
    group: "Kindergartenalter",
    image_mode: "Platzhalterbild",
  });
  const fileRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    onAdd({
      ...newTask,
      imageFile:
        newTask.image_mode === "Bildupload" ? fileRef.current.files[0] : null,
    });

    // reset after submit
    setNewTask({
      title: "",
      points: "",
      group: "Kindergartenalter",
      image_mode: "Platzhalterbild",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full my-4 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-3 w-full">
        <input
          name="title"
          type="text"
          placeholder="Name der Aufgabe"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
          className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />

        <input
          name="points"
          type="number"
          placeholder="Punkte für Aufgabe"
          value={newTask.points}
          onChange={(e) => setNewTask({ ...newTask, points: e.target.value })}
          required
          className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />

        <select
          name="group"
          value={newTask.group}
          onChange={(e) => setNewTask({ ...newTask, group: e.target.value })}
          className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        >
          <option value="Kindergartenalter">Kindergartenalter</option>
          <option value="Grundschulalter">Grundschulalter</option>
          <option value="Teenager">Teenager</option>
        </select>

        <select
          name="image_mode"
          value={newTask.image_mode}
          onChange={(e) =>
            setNewTask({ ...newTask, image_mode: e.target.value })
          }
          className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        >
          <option value="Platzhalterbild">Platzhalterbild</option>
          <option value="Bildupload">Bild hochladen</option>
          <option value="Bildgenerierung">Bild generieren</option>
        </select>

        {newTask.image_mode === "Bildupload" && (
          <input
            ref={fileRef}
            name="file"
            type="file"
            required
            accept="image/*"
            className="w-full lg:flex-1 p-2 bg-white border rounded-md"
          />
        )}
      </div>

      <div className="flex justify-center mt-2">
        <ButtonsSaveCancel onSave={handleSubmit} onCancel={onCancel} />
      </div>
    </form>
  );
}
