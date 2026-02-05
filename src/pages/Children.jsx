import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import AddChildForm from "../components/AddChildForm";
import Child from "../components/Child";
import { FaUserPlus } from "react-icons/fa";

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
  const [familyName, setFamilyName] = useState("");

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

  // Retrieves the family name of the authenticated user.
  // Called first, before loading children.
  async function fetchFamilyName() {
    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/family`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("HTTP error: " + response.status);
      const data = await response.json();
      setFamilyName(data.family_name);
    } catch (err) {
      console.error("Error fetching family name: ", err);
    }
  }

  // First load Family Name
  useEffect(() => {
    if (isSignedIn) {
      fetchFamilyName();
    }
  }, [isSignedIn]);

  // Then only load children if familyName is present
  useEffect(() => {
    if (isSignedIn && familyName) {
      getChildren();
    }
  }, [isSignedIn, familyName]);

  // Adds a new child via the API and fetches updated data.
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

      const response = await fetch(`${BASE_URL}/child`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
              birthdate={child.birth_date}
              image={child.image}
              id={child.id}
              getToken={getToken}
              onChildDeleted={() => {
                console.log("Child has been deleted!");
                getChildren();
              }}
              onChildEdit={() => {
                console.log("Child has been updated!");
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
              className="md:w-auto px-6 py-3 text-md border rounded-md hover:shadow-md hover:bg-white flex items-center gap-2"
            >
              <FaUserPlus />
              <span>Kind hinzufügen</span>
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
