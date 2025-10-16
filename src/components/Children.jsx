import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import AddChildForm from "./AddChildForm";
import Child from "./Child";

/**
 * Children component
 * Displays a list of children fetched from the API.
 * Allows adding, editing, and deleting child entries using Clerk authentication.
 */

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Children() {
  const { getToken, isSignedIn } = useAuth();
  const [children, setChildren] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Fetches all children associated with the authenticated user from the API.
  // Updates local state with the retrieved list.
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

  // Fetch children when the user is signed in.
  useEffect(() => {
    if (isSignedIn) {
      getChildren();
    }
  }, [isSignedIn]);

  // Adds a new child via the API and fetches updated data.
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
          {children.map((child) => (
            <Child
              key={child.id}
              firstname={child.first_name}
              birthday={child.birth_day}
              id={child.id}
              getToken={getToken}
              onChildDeleted={(id) => {
                console.log("Child", id, "has been deleted!");
                getChildren();
              }}
              onChildEdit={(updateChild) => {
                console.log("Child", updateChild, "has been updated!");
                getChildren();
              }}
            />
          ))}
        </div>

        {/* Button to display the AddChildForm */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 px-4 mt-12">
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="md:w-auto px-6 py-3 text-md border rounded-md hover:shadow-md hover:bg-white"
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
