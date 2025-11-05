import { useState } from "react";
import ButtonsSaveCancel from "./ButtonsSaveCancel";

export default function UpdateRewardForm({ initialReward, onEdit, onCancel }) {
  const [editedReward, setEditedReward] = useState(initialReward);

  function handleSubmit(e) {
    e.preventDefault();
    onEdit(editedReward);
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

      <ButtonsSaveCancel onSave={handleSubmit} onCancel={onCancel} />
    </form>
  );
}
