import { useState } from "react";
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
  });

  // Handles form submission.
  // Prevents default behavior and passes the entered data to the parent component.
  function handleSubmit(e) {
    e.preventDefault();
    onAdd(newChild);
  }

  return (
    <>
      {/* Input form for name and birthdate */}
      <form className="flex flex-col lg:flex-row lg:items-center lg:gap-3 gap-3 w-full my-4">
        <input
          type="text"
          placeholder="Name des Kindes"
          value={newChild.first_name}
          onChange={(e) =>
            setNewChild({ ...newChild, first_name: e.target.value })
          }
          required
          className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />
        <input
          type="date"
          placeholder="Geburtstag des Kindes"
          value={newChild.birth_date}
          onChange={(e) =>
            setNewChild({ ...newChild, birth_date: e.target.value })
          }
          className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />
      </form>

      {/* Buttons for saving or cancelling */}
      <ButtonsSaveCancel onSave={handleSubmit} onCancel={onCancel} />
    </>
  );
}
