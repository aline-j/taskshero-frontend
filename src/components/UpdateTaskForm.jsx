import { useState, useRef } from "react";
import ButtonsSaveCancel from "./ButtonsSaveCancel";
import LoadingThreeDotsJumping from "./LoadingThreeDotsJumping";

export default function UpdateTaskForm({ initialTask, onEdit, onCancel }) {
  const [editedTask, setEditedTask] = useState(initialTask);
  const fileRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("task_id", editedTask.task_id);
    formData.append("title", editedTask.title);
    formData.append("points", editedTask.points);
    formData.append("group", editedTask.group);
    formData.append("image_mode", editedTask.image_mode);

    if (editedTask.image_mode === "Bildupload" && fileRef.current.files[0]) {
      formData.append("file", fileRef.current.files[0]);
    }

    try {
      await onEdit(formData);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <LoadingThreeDotsJumping />
          <p className="text-center text-slate-500 mt-20 animate-pulse">
            Ich aktualisiere die Aufgabe...
          </p>
        </div>
      ) : (
        <form className="flex flex-wrap gap-3 w-full my-4">
          <input
            type="text"
            placeholder="Task Title"
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />

          <input
            type="number"
            placeholder="Points"
            value={editedTask.points}
            onChange={(e) =>
              setEditedTask({ ...editedTask, points: e.target.value })
            }
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />

          <select
            value={editedTask.group}
            onChange={(e) =>
              setEditedTask({ ...editedTask, group: e.target.value })
            }
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="Kindergartenalter">Kindergartenalter</option>
            <option value="Grundschulalter">Grundschulalter</option>
            <option value="Teenager">Teenager</option>
          </select>

          <select
            name="image_mode"
            value={editedTask.image_mode}
            onChange={(e) =>
              setEditedTask({ ...editedTask, image_mode: e.target.value })
            }
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="Bildbehalten">Bild behalten</option>
            <option value="Platzhalterbild">Platzhalterbild</option>
            <option value="Bildupload">Bild hochladen</option>
            <option value="Bildgenerierung">Bild generieren</option>
          </select>

          {/* Upload field only if needed */}
          {editedTask.image_mode === "Bildupload" && (
            <input
              ref={fileRef}
              name="file"
              type="file"
              className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              required
              accept="image/*"
            />
          )}

          <ButtonsSaveCancel onSave={handleSubmit} onCancel={onCancel} />
        </form>
      )}
    </>
  );
}
