import { useState } from "react";
import ButtonsSaveCancel from "./ButtonsSaveCancel";

/**
 * UpdateChildForm component
 * Form for editing an existing child's information.
 * Initializes the state with current data and calls onEdit when submitted.
 */

export default function UpdateChildForm({ initialChild, onEdit, onCancel }) {
  // Local state mirrors the existing child’s data for editing
  const [editedChild, setEditedChild] = useState({
    first_name: initialChild.first_name,
    birth_day: initialChild.birth_day,
    id: initialChild.id,
  });

  // Handles form submission.
  // Prevents default submission and triggers the edit callback with updated data.
  function handleSubmit(e) {
    e.preventDefault();
    onEdit(editedChild);
  }

  return (
    <form className="flex flex-wrap gap-3 w-full my-4">
      {/* Input field for child’s first name */}
      <input
        type="text"
        placeholder="Name des Kindes"
        value={editedChild.first_name}
        onChange={(e) =>
          setEditedChild({ ...editedChild, first_name: e.target.value })
        }
        className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />

      {/* Input field for birthday (keeps existing value but editable) */}
      <input
        type="text"
        placeholder="Geburtstag des Kindes"
        value={editedChild.birth_day}
        onChange={(e) =>
          setEditedChild({ ...editedChild, birth_day: e.target.value })
        }
        className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />

      {/* Buttons for saving or cancelling */}
      <ButtonsSaveCancel onSave={handleSubmit} onCancel={onCancel} />
    </form>
  );
}
