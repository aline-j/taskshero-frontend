import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Score from "../components/Score";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ChildRewards() {
  const { getToken } = useAuth();
  const { childId } = useParams();
  const [child, setChild] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  const [errorMessage, setErrorMessage] = useState("");

  // Load child
  useEffect(() => {
    async function fetchChild() {
      try {
        const token = await getToken();
        const response = await fetch(`${BASE_URL}/children/${childId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("HTTP error " + response.status);
        const data = await response.json();
        setChild(data);
      } catch (err) {
        console.error("Fehler beim Laden des Kindes:", err);
      }
    }

    if (childId) fetchChild();
  }, [childId, getToken]);

  // Load rewards
  useEffect(() => {
    async function fetchTasksAndRewards() {
      try {
        setIsLoading(true);
        const token = await getToken();
        const rewardsResponse = await fetch(
          `${BASE_URL}/children/${childId}/rewards`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!rewardsResponse.ok)
          throw new Error("HTTP error " + rewardsResponse.status);

        const rewardsData = await rewardsResponse.json();
        const tasksResponse = await fetch(
          `${BASE_URL}/children/${childId}/tasks`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!tasksResponse.ok)
          throw new Error("HTTP error " + tasksResponse.status);

        const tasksData = await tasksResponse.json();
        setRewards(rewardsData.rewards);
        setTasks(tasksData.tasks);
      } catch (err) {
        console.error("Fehler beim Laden der Belohnungen/Aufgaben:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (childId) fetchTasksAndRewards();
  }, [childId, getToken]);

  // Mark reward as redeemed
  async function handleRedeemed(rewardId) {
    const reward = rewards.find((reward) => reward.id === rewardId);
    if (!reward) return;

    if (!reward.redeemed && totalPoints < reward.cost) {
      setErrorMessage(
        "Deine Punkte reichen noch nicht, um diese Belohnung einzulösen!\nHierfür musst du noch ein bisschen fleißiger sein."
      );
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    try {
      const token = await getToken();

      // Optimistic UI update
      setRewards((prev) =>
        prev.map((reward) =>
          reward.id === rewardId
            ? { ...reward, redeemed: !reward.redeemed }
            : reward
        )
      );

      const response = await fetch(
        `${BASE_URL}/children/${childId}/rewards/${rewardId}/redeemed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("HTTP-Fehler " + response.status);
    } catch (err) {
      console.error("Fehler beim Einlösen der Belohnung:", err);
      alert("Ups! Fehler! Wende dich an deine Mama.");

      // Rollback in case of error
      setRewards((prev) =>
        prev.map((reward) =>
          reward.id === rewardId
            ? { ...reward, redeemed: !reward.redeemed }
            : reward
        )
      );
    }
  }

  return (
    <div>
      {isLoading ? (
        <p className="text-center text-gray-500 mt-10">Lade Aufgaben...</p>
      ) : (
        <div>
          <h1 className="text-4xl font-bold my-10 text-center lg:text-5xl lg:my-20">
            {child?.first_name}´s Belohnungen
          </h1>

          <Score
            tasks={tasks}
            rewards={rewards}
            onPointsCalculated={setTotalPoints}
          />

          {/* Feedback Messages */}
          {errorMessage && (
            <p className="text-red-600 text-center font-medium mb-10 transition-opacity duration-500 whitespace-pre-line">
              {errorMessage}
            </p>
          )}

          {rewards.length === 0 ? (
            <p className="text-center text-gray-500">
              Du hast aktuelle keine Belohnungen.
            </p>
          ) : (
            <div>
              {/* Available rewards */}
              <h2 className="font-bold my-10 text-center text-2xl lg:my-20">
                Noch nicht eingelöste Belohnungen
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
                {rewards
                  .filter((reward) => !reward.redeemed)
                  .map((reward) => (
                    <div
                      key={reward.id}
                      className="relative w-card-width h-[300px] bg-white shadow rounded-md p-4 flex flex-col sm:w-card-width-md"
                    >
                      <div className="absolute top-2 right-2 bg-amber-400 text-black text-xs font-semibold px-2 py-1 rounded-full">
                        {reward.cost} Punkte
                      </div>
                      <img
                        className="w-full h-[160px] object-cover rounded-md"
                        src={reward.image}
                        alt={reward.title}
                      />
                      <h3 className="mt-3 mb-1 text-lg text-center font-semibold">
                        {reward.title}
                      </h3>
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <button
                          className="text-xl p-1 rounded-full transition-transform duration-200 hover:-translate-y-0.5"
                          onClick={() => handleRedeemed(reward.id)}
                        >
                          ✔️
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Rewards already redeemed */}
              <h2 className="font-bold my-10 text-center text-2xl lg:my-20">
                Bereits eingelöste Belohnungen
              </h2>
              {rewards.filter((reward) => reward.redeemed).length === 0 ? (
                <p className="text-center text-lg text-gray-600 mt-20">
                  Du hast noch keine Belohnungen eingelöst.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
                  {rewards
                    .filter((reward) => reward.redeemed)
                    .map((reward) => (
                      <div
                        key={`redeemed-${reward.id}`}
                        className="relative w-card-width h-[300px] bg-gray-100 shadow rounded-md p-4 flex flex-col sm:w-card-width-md opacity-50"
                      >
                        <div className="absolute top-2 right-2 bg-amber-400 text-black text-xs font-semibold px-2 py-1 rounded-full">
                          {reward.cost} Punkte
                        </div>
                        <img
                          className="w-full h-[160px] object-cover rounded-md"
                          src={reward.image}
                          alt={reward.title}
                        />
                        <h3 className="mt-3 mb-1 text-lg text-center font-semibold line-through">
                          {reward.title}
                        </h3>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
