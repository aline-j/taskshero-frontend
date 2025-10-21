import { useState } from "react";
import UpdateChildForm from "../components/UpdateChildForm";

/**
 * Child component
 * Renders a card for a single child with name and birthdate.
 * Offers actions to edit or delete the child via modals.
 * Relies on authentication from Clerk to perform API requests.
 */

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Child({
  initialChild,
  firstname,
  birthdate,
  id,
  getToken,
  onChildDeleted = () => {},
  onChildEdit = () => {},
}) {
  // Controls dropdown menu visibility
  const [isOpen, setIsOpen] = useState(false);
  // Controls the delete confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  // Controls the edit form modal
  const [showEditForm, setShowEditForm] = useState(false);

  // Deletes a child by ID from the API and triggers parent refresh callback.
  async function handleDelete(id) {
    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/children/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response) throw new Error("HTTP error: " + response.status);
      onChildDeleted(id);
    } catch (err) {
      console.error(err);
      alert("Sommething went wrong");
    }
  }

  // Updates a child’s data via API and triggers parent refresh callback.
  async function handleEdit(updatedChild) {
    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/children/${updatedChild.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedChild),
      });

      if (!response) throw new Error("HTTP error: " + response.status);
      onChildEdit(updatedChild);
      setShowEditForm(false);
    } catch (err) {
      console.error(err);
      alert("Sommething went wrong");
    }
  }

  return (
    <div className="relative w-card-width h-[300px] bg-white shadow rounded-md p-4 flex flex-col sm:w-card-width-md">
      <div className="flex justify-end relative">
        <button
          // Dropdown trigger button for actions (Edit/Delete)
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 bg-white0 hover:bg-gray-500 hover:text-white font-medium 
               rounded-md text-md px-5 py-2.5 inline-flex items-center"
        >
          <span className="sr-only">Open dropdown</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 3"
          >
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
        </button>

        {/* Dropdown menu with "Edit" and "Delete" options */}
        {isOpen && (
          <div className="absolute top-full bg-gray-50 rounded-md shadow z-10">
            <ul className="py-2 px-4 text-md text-gray-700">
              <li className="mb-1">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-500 hover:text-white"
                  onClick={() => setShowEditForm(true)}
                >
                  Ändern
                </button>
              </li>
              <li>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-500 hover:text-white"
                  onClick={() => setShowConfirm(true)}
                >
                  Löschen
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80 text-center">
            <p className="font-semibold">
              Bist du sicher, dass du dieses Kind löschen möchtest?
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Dieser Vorgang kann nicht rückgängig gemacht werden!
            </p>
            <div className="flex justify-around mt-4">
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  handleDelete(id);
                }}
              >
                Ja, löschen
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={() => {
                  setShowConfirm(false);
                  setIsOpen(false);
                }}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal with UpdateChildForm */}
      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <UpdateChildForm
              initialChild={{
                first_name: firstname,
                birth_date: birthdate,
                id,
              }}
              // Trigger API update and close modal
              onEdit={(editedChild) => {
                handleEdit(editedChild);
                setIsOpen(false);
              }}
              // Close modal without saving
              onCancel={() => {
                setShowEditForm(false);
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Child card with avatar, name, and actions buttons */}
      <div className="flex flex-col items-center pb-10">
        <img
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
          src="/images/avatars/avatar-boy-1.png"
          alt="Child image"
        />
        <h5 className="mt-3 mb-1 text-lg text-center font-semibold">
          {firstname}
        </h5>
        <div className="flex justify-center gap-2 mt-8 w-full">
          <a
            href="#"
            className="w-1/2 text-center text-white font-medium rounded-md text-sm px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700"
          >
            Aufgaben
          </a>
          <a
            href="#"
            className="w-1/2 text-center text-white font-medium rounded-md text-sm px-5 py-2.5 bg-amber-500 hover:bg-amber-600"
          >
            Belohnungen
          </a>
        </div>
      </div>
    </div>
  );
}
