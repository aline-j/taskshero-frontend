import { useState, useRef } from "react";
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
    birth_date: initialChild.birth_date,
    image: initialChild.image,
    id: initialChild.id,
  });
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");

  // Handles form submission.
  // Prevents default submission and triggers the edit callback with updated data.
  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", editedChild.first_name);
    formData.append("birth_date", editedChild.birth_date);
    formData.append("image_mode", editedChild.image_mode);

    if (editedChild.image_mode === "Bildupload" && fileRef.current.files[0]) {
      formData.append("file", fileRef.current.files[0]);
    }
    onEdit(formData);
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

      {/* Input field for birthdate (keeps existing value but editable) */}
      <input
        type="text"
        placeholder="Geburtstag des Kindes"
        value={editedChild.birth_date}
        onChange={(e) =>
          setEditedChild({ ...editedChild, birth_date: e.target.value })
        }
        className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />

      <select
        name="image_mode"
        value={editedChild.image_mode}
        onChange={(e) =>
          setEditedChild({ ...editedChild, image_mode: e.target.value })
        }
        className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      >
        <option value="Bildbehalten">Bild behalten</option>
        <option value="Platzhalterbild">Platzhalterbild</option>
        <option value="Bildupload">Bild hochladen</option>
      </select>

      {/* Upload field only if needed */}
      {editedChild.image_mode === "Bildupload" && (
        <div className="w-full">
          <label
            htmlFor="fileUpload"
            className="block w-full p-2 text-center rounded-md border border-gray-300 cursor-pointer bg-gray-100 hover:bg-gray-200 truncate"
          >
            {fileName ? fileName : "Bild auswählen"}
          </label>

          <input
            id="fileUpload"
            ref={fileRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setFileName(e.target.files[0].name);
              }
            }}
          />
        </div>
      )}

      {/* Buttons for saving or cancelling */}
      <ButtonsSaveCancel onSave={handleSubmit} onCancel={onCancel} />
    </form>
  );
}
