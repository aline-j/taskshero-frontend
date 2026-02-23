import { useState, useRef } from "react";
import ButtonsSaveCancel from "./ButtonsSaveCancel";

/**
 * AddChildForm component
 * Form for adding a new child with name and birthdate.
 * Calls onAdd when the form is submitted and onCancel when the user aborts.
 */

export default function AddChildForm({ onAdd, onCancel }) {
  // Local state to track input values for a new child
  const [newChild, setNewChild] = useState({
    first_name: "",
    birth_date: "",
    image_mode: "Platzhalterbild",
  });
  const fileRef = useRef(null);

  // Handles form submission.
  // Prevents default behavior and passes the entered data to the parent component.
  function handleSubmit(e) {
    e.preventDefault();
    onAdd({
      ...newChild,
      imageFile:
        newChild.image_mode === "Bildupload" ? fileRef.current.files[0] : null,
    });

    // reset after submit
    setNewChild({
      first_name: "",
      birth_date: "",
      image_mode: "Platzhalterbild",
    });
  }

  return (
    <form className="flex flex-col gap-4 w-sm my-4">
      <input
        type="text"
        placeholder="Name des Kindes"
        value={newChild.first_name}
        onChange={(e) =>
          setNewChild({ ...newChild, first_name: e.target.value })
        }
        required
        className="w-full p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />
      <input
        type="date"
        placeholder="Geburtstag des Kindes"
        value={newChild.birth_date}
        onChange={(e) =>
          setNewChild({ ...newChild, birth_date: e.target.value })
        }
        className="w-full p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />
      <select
        name="image_mode"
        value={newChild.image_mode}
        onChange={(e) =>
          setNewChild({ ...newChild, image_mode: e.target.value })
        }
        className="w-full p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      >
        <option value="Platzhalterbild">Platzhalterbild</option>
        <option value="Bildupload">Bild hochladen</option>
      </select>

      {newChild.image_mode === "Bildupload" && (
        <input
          ref={fileRef}
          name="file"
          type="file"
          className="w-full p-2 bg-white border rounded-md"
          required
          accept="image/*"
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-center w-full mt-2">
        <ButtonsSaveCancel onSave={handleSubmit} onCancel={onCancel} />
      </div>
    </form>
  );
}
