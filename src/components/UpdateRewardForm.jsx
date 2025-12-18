import { useState, useRef } from "react";
import ButtonsSaveCancel from "./ButtonsSaveCancel";

export default function UpdateRewardForm({ initialReward, onEdit, onCancel }) {
  const [editedReward, setEditedReward] = useState(initialReward);
  const fileRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("reward_id", editedReward.reward_id);
    formData.append("title", editedReward.title);
    formData.append("cost", editedReward.cost);
    formData.append("image_mode", editedReward.image_mode);

    if (editedReward.image_mode === "Bildupload" && fileRef.current.files[0]) {
      formData.append("file", fileRef.current.files[0]);
    }
    onEdit(formData);
  }

  return (
    <form className="flex flex-wrap gap-3 w-full my-4">
      <input
        type="text"
        placeholder="Name der Belohnung"
        value={editedReward.title}
        onChange={(e) =>
          setEditedReward({ ...editedReward, title: e.target.value })
        }
        className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />

      <input
        type="number"
        placeholder="Punkte für Belohnung"
        value={editedReward.cost}
        onChange={(e) =>
          setEditedReward({ ...editedReward, cost: e.target.value })
        }
        className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />

      <select
        name="image_mode"
        value={editedReward.image_mode}
        onChange={(e) =>
          setEditedReward({ ...editedReward, image_mode: e.target.value })
        }
        className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      >
        <option value="Bildbehalten">Bild behalten</option>
        <option value="Platzhalterbild">Platzhalterbild</option>
        <option value="Bildupload">Bild hochladen</option>
        <option value="Bildgenerierung">Bild generieren</option>
      </select>

      {/* Upload field only if needed */}
      {editedReward.image_mode === "Bildupload" && (
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
  );
}
