import { useState } from "react";
import ButtonsSaveCancel from "./ButtonsSaveCancel";

export default function AddRewardForm({ onAdd, onCancel }) {
  const [newReward, setNewReward] = useState({
    title: "",
    cost: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    onAdd(newReward);
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

      <ButtonsSaveCancel onSave={handleSubmit} onCancel={onCancel} />
    </form>
  );
}
