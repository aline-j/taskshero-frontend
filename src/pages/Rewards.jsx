import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import Reward from "../components/Reward";
import AddRewardForm from "../components/AddRewardForm";
import FilterRewards from "../components/FilterRewards";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Rewards() {
  const { getToken, isSignedIn } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [costFilter, setCostFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Get rewards from API
  async function getRewards() {
    try {
      setIsLoading(true);
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/rewards`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("HTTP error " + response.status);

      const data = await response.json();
      setRewards(data);
    } catch (err) {
      console.log("Error fetching rewards:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch when Clerk is loaded and user is signed in
  useEffect(() => {
    if (isSignedIn) {
      getRewards();
    }
  }, [isSignedIn]);

  // Filter logic: if "all", show all rewards, otherwise filter by cost
  const filteredRewards =
    costFilter === "all"
      ? rewards
      : rewards.filter((reward) => {
          if (costFilter === "Kleine Belohnungen") {
            return reward.cost >= 5 && reward.cost <= 19;
          } else if (costFilter === "Mittlere Belohnungen") {
            return reward.cost >= 20 && reward.cost <= 49;
          } else if (costFilter === "Große Belohnungen") {
            return reward.cost >= 50 && reward.cost <= 100;
          }
        });

  // Callback AddRewardForm
  async function handleAddReward(newReward) {
    try {
      setIsLoading(true);
      const token = await getToken();

      const formData = new FormData();
      formData.append("title", newReward.title);
      formData.append("cost", newReward.cost);
      formData.append("image_mode", newReward.image_mode);

      if (newReward.image_mode === "Bildupload" && newReward.imageFile) {
        formData.append("file", newReward.imageFile);
      }

      const response = await fetch(`${BASE_URL}/rewards`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("HTTP error " + response.status);

      await getRewards();
      setShowForm(false);
      setSuccessMessage("Belohnung erfolgreich hinzugefügt ✅");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error adding reward:", err);
      setErrorMessage("Fehler beim Speichern der neuen Belohnung ❌");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsLoading(false);
    }
  }

  const sortedRewards = filteredRewards.toSorted((a, b) => a.cost - b.cost);

  return (
    <div>
      <SignedIn>
        <h1 className="text-4xl font-bold my-10 text-center lg:text-5xl lg:my-20">
          Belohnungen
        </h1>
        {/* Feedback Messages */}
        {successMessage && (
          <p className="text-green-600 text-center font-medium mt-6 transition-opacity duration-500">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-red-600 text-center font-medium mt-6 transition-opacity duration-500">
            {errorMessage}
          </p>
        )}

        <div className="flex flex-col md:flex-row justify-end items-center gap-4 mb-8 px-4">
          {/* Button to display the AddRewardForm */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="md:w-auto px-6 py-3 text-md border rounded-md hover:shadow-md hover:bg-white"
            >
              Neue Belohnung hinzufügen
            </button>
          )}

          {/* AddRewardForm component */}
          {showForm && (
            <AddRewardForm
              onAdd={handleAddReward}
              onCancel={() => setShowForm(false)}
              className="w-full md:w-auto"
            />
          )}
        </div>

        {/* Dropdown-Filter */}
        <FilterRewards costFilter={costFilter} setCostFilter={setCostFilter} />

        {/* Grid with the filtered rewards */}
        {isLoading ? (
          <p className="text-center text-gray-500 mt-10">Lade Belohnungen...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedRewards.map((reward) => (
              <Reward
                key={reward.reward_id}
                title={reward.title}
                cost={reward.cost}
                image={reward.image}
                reward_id={reward.reward_id}
                getToken={getToken}
                onRewardDeleted={(reward_id) => {
                  console.log("Reward", reward_id, "has been deleted!");
                  getRewards();
                }}
                onRewardEdit={(reward_id) => {
                  console.log("Reward", reward_id, "has been updated!");
                  getRewards();
                }}
                onRewardAssignment={(rewardAssignment) => {
                  console.log("Reward", rewardAssignment, "has been assigned!");
                  getRewards();
                }}
              />
            ))}
          </div>
        )}
      </SignedIn>

      <SignedOut>
        <p className="text-center text-lg text-gray-600 mt-20">
          Bitte melde dich an, um Belohnungen zu sehen.
        </p>
      </SignedOut>
    </div>
  );
}
