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
        }
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
      <div className="relative w-card-width h-[300px] bg-white shadow rounded-md p-4 flex flex-col sm:w-card-width-md">
        {/* Points Badge */}
        <div className="absolute top-2 right-2 bg-amber-400 text-black text-xs font-semibold px-2 py-1 rounded-full">
          {cost} Punkte
        </div>

        {/* Image */}
        <img
          className="w-full h-[160px] object-cover rounded-md"
          src={image}
          alt={image}
        />

        {/* Title */}
        <h3 className="mt-3 mb-1 text-md text-center font-semibold">{title}</h3>

        {/* Action Buttons */}
        <div className="absolute bottom-2 right-2 flex gap-2">
          <button
            className="text-xl p-1 rounded-full transition-transform duration-200 transform scale-x-[-1] hover:-translate-y-0.5"
            onClick={() => setShowAssignmentForm(true)}
          >
            👥
          </button>
          <button
            className="text-xl p-1 rounded-full transition-transform duration-200 transform scale-x-[-1] hover:-translate-y-0.5"
            onClick={() => setShowEditForm(true)}
          >
            ✏️
          </button>
          <button
            className="text-xl p-1 rounded-full transition-transform duration-200 hover:-translate-y-0.5"
            onClick={() => setShowConfirm(true)}
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
