import { useState } from "react";
import UpdateRewardForm from "../components/UpdateRewardForm";
import AssignmentRewardForm from "../components/AssignmentRewardForm";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Reward({
  cost,
  title,
  image,
  reward_id,
  getToken,
  onRewardDeleted = () => {},
  onRewardEdit = () => {},
  onRewardAssignment = () => {},
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  async function handleDelete(reward_id) {
    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/rewards/${reward_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("HTTP error " + response.status);
      onRewardDeleted(reward_id);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setShowConfirm(false);
    }
  }

  async function handleEdit(formData) {
    try {
      const token = await getToken();
      const response = await fetch(
        `${BASE_URL}/reward/${formData.get("reward_id")}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );
      if (!response.ok) throw new Error("HTTP error " + response.status);
      const updatedReward = await response.json();
      onRewardEdit(updatedReward);
      setShowEditForm(false);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  }

  async function handleAssignment(rewardAssignment) {
    try {
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/assign-reward`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rewardAssignment),
      });
      if (!response.ok) throw new Error("HTTP error " + response.status);
      onRewardAssignment(rewardAssignment);
      setShowAssignmentForm(false);
    } catch (err) {
      alert("Fehler beim Zuweisen der Belohnung.");
    }
  }

  return (
    <>
      <div className="relative flex flex-col bg-white rounded-md shadow-md hover:shadow-xl">
        {/* Points Badge */}
        <div className="absolute top-0 right-0 flex items-center gap-2 rounded-l-md bg-gray-700 px-2 py-1 text-sm md:text-md font-semibold text-white">
          ⭐ {cost}
        </div>

        {/* Image */}
        <img
          className="h-38 w-full object-cover md:h-48"
          src={image}
          alt={image}
        />

        {/* Title */}
        <div className="p-3 h-20 flex flex-col justify-center">
          <h3 className="font-medium md:font-semibold text-md text-gray-800 text-center overflow-hidden">
            {title}
          </h3>
        </div>

        {/* Actions */}
        <div className="flex h-12 justify-center items-center gap-3">
          <button
            className="rounded-md px-2 md:px-4 md:py-2 text-md font-medium transition-transform duration-200 hover:scale-200"
            onClick={() => setShowAssignmentForm(true)}
            title="Zuweisen"
          >
            👥
          </button>
          <button
            className="rounded-md px-2 md:px-4 md:py-2 text-md font-medium transition-transform duration-200 hover:scale-200"
            onClick={() => setShowEditForm(true)}
            title="Bearbeiten"
          >
            ✏️
          </button>
          <button
            className="rounded-md px-2 md:px-4 md:py-2 text-md font-medium transition-transform duration-200 hover:scale-200"
            onClick={() => setShowConfirm(true)}
            title="Löschen"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignmentForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <AssignmentRewardForm
              initialReward={{ title, cost, reward_id }}
              onEdit={handleAssignment}
              onCancel={() => setShowAssignmentForm(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <UpdateRewardForm
              initialReward={{
                title,
                cost,
                reward_id,
                image_mode: "Bildbehalten",
              }}
              onEdit={handleEdit}
              onCancel={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-80 text-center">
            <p className="font-semibold">
              Bist du sicher, dass du diese Belohnung löschen möchtest?
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Dieser Vorgang kann nicht rückgängig gemacht werden!
            </p>
            <div className="flex justify-around mt-4">
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => handleDelete(reward_id)}
              >
                Ja, löschen
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                onClick={() => setShowConfirm(false)}
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
