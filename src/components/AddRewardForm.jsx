import { useState, useRef } from "react";
import ButtonsSaveCancel from "./ButtonsSaveCancel";

export default function AddRewardForm({ onAdd, onCancel }) {
  const [newReward, setNewReward] = useState({
    title: "",
    cost: "",
    image_mode: "Platzhalterbild",
  });
  const fileRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    onAdd({
      ...newReward,
      imageFile:
        newReward.image_mode === "Bildupload" ? fileRef.current.files[0] : null,
    });

    // reset after submit
    setNewReward({
      title: "",
      cost: "",
      image_mode: "Platzhalterbild",
    });
  }

  return (
    <form
      className="flex flex-col lg:flex-row lg:items-center lg:gap-3 gap-3 w-full my-4"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Name der Belohnung"
        value={newReward.title}
        onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
        required
        className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />

      <input
        type="number"
        placeholder="Punkte für Belohnung"
        value={newReward.cost}
        onChange={(e) => setNewReward({ ...newReward, cost: e.target.value })}
        required
        className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      />

      <select
        name="image_mode"
        value={newReward.image_mode}
        onChange={(e) =>
          setNewReward({ ...newReward, image_mode: e.target.value })
        }
        className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
      >
        <option value="Platzhalterbild">Platzhalterbild</option>
        <option value="Bildupload">Bild hochladen</option>
        <option value="Bildgenerierung">Bild generieren</option>
      </select>

      {/* Upload field only if needed */}
      {newReward.image_mode === "Bildupload" && (
        <input
          ref={fileRef}
          name="file"
          type="file"
          className="w-full lg:flex-1 p-2 bg-white border rounded-md"
          required
          accept="image/*"
        />
      )}

      <ButtonsSaveCancel onSave={handleSubmit} onCancel={onCancel} />
    </form>
  );
}
