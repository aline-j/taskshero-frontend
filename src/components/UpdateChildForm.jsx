import { useState, useRef } from "react";
import ButtonsSaveCancel from "./ButtonsSaveCancel";
import LoadingThreeDotsJumping from "./LoadingThreeDotsJumping";

export default function UpdateChildForm({ initialChild, onEdit, onCancel }) {
  const [editedChild, setEditedChild] = useState({
    first_name: initialChild.first_name,
    birth_date: initialChild.birth_date,
    image: initialChild.image,
    id: initialChild.id,
    image_mode: "Bildbehalten",
  });

  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("first_name", editedChild.first_name);
    formData.append("birth_date", editedChild.birth_date);
    formData.append("image_mode", editedChild.image_mode);

    if (editedChild.image_mode === "Bildupload" && fileRef.current?.files[0]) {
      formData.append("file", fileRef.current.files[0]);
    }

    try {
      await onEdit(formData);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-lg p-6">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <LoadingThreeDotsJumping />
            <p className="text-center text-gray-500 mt-4 animate-pulse">
              Ich aktualisiere das Kind…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 w-full">
            <input
              type="text"
              placeholder="Name des Kindes"
              value={editedChild.first_name}
              onChange={(e) =>
                setEditedChild({ ...editedChild, first_name: e.target.value })
              }
              className="w-full bg-white p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />

            <input
              type="date"
              value={editedChild.birth_date}
              onChange={(e) =>
                setEditedChild({ ...editedChild, birth_date: e.target.value })
              }
              className="w-full bg-white p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />

            <select
              value={editedChild.image_mode}
              onChange={(e) =>
                setEditedChild({ ...editedChild, image_mode: e.target.value })
              }
              className="w-full bg-white p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            >
              <option value="Bildbehalten">Bild behalten</option>
              <option value="Platzhalterbild">Platzhalterbild</option>
              <option value="Bildupload">Bild hochladen</option>
            </select>

            {editedChild.image_mode === "Bildupload" && (
              <div className="w-full">
                <label
                  htmlFor="fileUpload"
                  className="block w-full p-2 text-center rounded-md border border-gray-300 cursor-pointer bg-gray-100 hover:bg-gray-200 truncate"
                >
                  {fileName || "Bild auswählen"}
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

            <div className="w-full flex justify-center mt-4">
              <ButtonsSaveCancel onSave={handleSubmit} onCancel={onCancel} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
