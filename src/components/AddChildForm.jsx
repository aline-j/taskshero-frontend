import { useState } from "react";
import ButtonsSaveCancel from "./ButtonsSaveCancel";

export default function AddChildForm({ onAdd, onCancel }) {
  const [newChild, setNewChild] = useState({
    first_name: "",
    birth_day: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    onAdd(newChild);
  }

  return (
    <>
      <form className="flex flex-col lg:flex-row lg:items-center lg:gap-3 gap-3 w-full my-4">
        <input
          type="text"
          placeholder="Name des Kindes"
          value={newChild.firstname}
          onChange={(e) =>
            setNewChild({ ...newChild, first_name: e.target.value })
          }
          required
          className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />
        <input
          type="date"
          placeholder="Geburtstag des Kindes"
          value={newChild.birthday}
          onChange={(e) =>
            setNewChild({ ...newChild, birth_day: e.target.value })
          }
          className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />
      </form>
      <ButtonsSaveCancel onSave={handleSubmit} onCancel={onCancel} />
    </>
  );
}
