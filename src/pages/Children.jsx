import { useChildren } from "../context/ChildrenContext";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import AddChildForm from "../components/AddChildForm";
import Child from "../components/Child";
import { FaUserPlus } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Children() {
  const { children, reloadChildren, isLoading } = useChildren();
  const { getToken } = useAuth();
  const [showForm, setShowForm] = useState(false);

  async function handleAddChild(newChild) {
    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("first_name", newChild.first_name);
      formData.append("birth_date", newChild.birth_date);
      formData.append("image_mode", newChild.image_mode);

      if (newChild.image_mode === "Bildupload" && newChild.imageFile) {
        formData.append("file", newChild.imageFile);
      }

      const response = await fetch(`${BASE_URL}/children`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("HTTP error");

      reloadChildren(); // ⭐ zentral
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading) {
    return <p className="text-center mt-10">Kinder werden geladen…</p>;
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="flex justify-center gap-4">
        {children.map((child) => (
          <Child
            key={child.id}
            id={child.id}
            firstname={child.first_name}
            image={child.image}
          />
        ))}
      </div>

      <div className="flex justify-center mt-12">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 border rounded-md flex gap-2"
          >
            <FaUserPlus /> Kind hinzufügen
          </button>
        ) : (
          <AddChildForm
            onAdd={handleAddChild}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
}
