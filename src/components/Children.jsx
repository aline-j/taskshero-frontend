import { useEffect, useState } from "react";
import AddChildForm from "./AddChildForm";
import Child from "./Child";
import { useAuth } from "@clerk/clerk-react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Children() {
  const { getToken, isSignedIn } = useAuth();
  const [children, setChildren] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Get children from the API
  async function getChildren() {
    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/children`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("HTTP error: " + response.status);

      const data = await response.json();
      setChildren(data.children);
    } catch (err) {
      console.error("Error fetching children: ", err);
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      getChildren();
    }
  }, [isSignedIn]);

  // Callback AddChildForm
  async function handleAddChild(newChild) {
    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/child`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newChild),
      });

      if (!response.ok) throw new Error("HTTP error " + response.status);

      await getChildren();
      setShowForm(false);
    } catch (err) {
      console.error("Error adding child: ", err);
    }
  }

  return (
    <>
      <div className="max-w-screen-xl mx-auto p-4">
        {/* Grid with children */}
        <div className="flex flex-wrap justify-center gap-4">
          {" "}
          {children.map((child) => (
            <Child
              key={child.id}
              firstname={child.first_name}
              birthday={child.birth_day}
            />
          ))}
        </div>

        {/* Button to display the AddChildForm */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 px-4 mt-12">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full md:w-auto px-6 py-3 text-md border rounded-md hover:shadow-md hover:bg-white"
            >
              Kind hinzufügen
            </button>
          )}

          {/* AddChildForm component */}
          {showForm && (
            <AddChildForm
              onAdd={handleAddChild}
              onCancel={() => setShowForm(false)}
              className="w-full"
            />
          )}
        </div>
      </div>
    </>
  );
}
