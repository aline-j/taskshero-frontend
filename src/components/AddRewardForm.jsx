import { useState, useRef } from "react";
import ButtonsSaveCancel from "./ButtonsSaveCancel";
import LoadingThreeDotsJumping from "./LoadingThreeDotsJumping";

export default function AddRewardForm({ onAdd, onCancel }) {
  const [newReward, setNewReward] = useState({
    title: "",
    cost: "",
    image_mode: "Platzhalterbild",
  });

  const fileRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onAdd({
        ...newReward,
        imageFile:
          newReward.image_mode === "Bildupload"
            ? fileRef.current.files[0]
            : null,
      });

      // reset after submit
      setNewReward({
        title: "",
        cost: "",
        image_mode: "Platzhalterbild",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center gap-2">
          <LoadingThreeDotsJumping />
          <p className="text-center text-gray-500 mt-20 animate-pulse">
            Ich erstelle die neue Belohnung...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full my-4 flex flex-col gap-4"
        >
          <div className="flex flex-col lg:flex-row gap-3 w-full">
            <input
              name="title"
              type="text"
              placeholder="Name der Belohnung"
              value={newReward.title}
              onChange={(e) =>
                setNewReward({ ...newReward, title: e.target.value })
              }
              required
              className="w-full lg:flex-1 p-2 bg-white rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />

            <input
              name="cost"
              type="number"
              placeholder="Punkte für Belohnung"
              value={newReward.cost}
              onChange={(e) =>
                setNewReward({ ...newReward, cost: e.target.value })
              }
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

            {newReward.image_mode === "Bildupload" && (
              <input
                ref={fileRef}
                name="file"
                type="file"
                required
                accept="image/*"
                className="w-full lg:flex-1 p-2 bg-white border rounded-md"
              />
            )}
          </div>

          <div className="flex justify-center mt-2">
            <ButtonsSaveCancel onSave={handleSubmit} onCancel={onCancel} />
          </div>
        </form>
      )}
    </>
  );
}
