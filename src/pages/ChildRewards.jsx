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
  const [isLoading, setIsLoading] = useState(false);

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
    async function fetchRewards() {
      try {
        setIsLoading(true);
        const token = await getToken();
        const response = await fetch(
          `${BASE_URL}/children/${childId}/rewards`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("HTTP error " + response.status);

        const data = await response.json();
        console.log(data.rewards);
        setRewards(data.rewards);
      } catch (err) {
        console.error("Fehler beim Laden der Belohnungen:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (childId) fetchRewards();
  }, [childId, getToken]);

  return (
    <div>
      {isLoading ? (
        <p className="text-center text-gray-500 mt-10">Lade Aufgaben...</p>
      ) : (
        <div>
          <h1 className="text-4xl font-bold my-10 text-center lg:text-5xl lg:my-20">
            {child?.first_name}´s Belohnungen
          </h1>

          <Score childId={childId} child={child} rewards={rewards} />

          {rewards.length === 0 ? (
            <p className="text-center text-gray-500">
              Du hast aktuelle keine Belohnungen.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {rewards.map((reward) => (
                <div
                  key={reward.reward_id}
                  className="relative w-card-width h-[300px] bg-white shadow rounded-md p-4 flex flex-col sm:w-card-width-md"
                >
                  {/* Cost Badge */}
                  <div className="absolute top-2 right-2 bg-amber-400 text-black text-xs font-semibold px-2 py-1 rounded-full">
                    {reward.cost} Punkte
                  </div>

                  {/* Image */}
                  <img
                    className="w-full h-[160px] object-cover rounded-md"
                    src={reward.image}
                    alt={reward.title}
                  />

                  {/* Title */}
                  <h3 className="mt-3 mb-1 text-lg text-center font-semibold">
                    {reward.title}
                  </h3>

                  {/* Action Buttons */}
                  <div className="absolute bottom-2 right-2 flex gap-2">
                    <button
                      className="text-xl p-1 rounded-full transition-transform duration-200 hover:-translate-y-0.5"
                      onClick={() => handleToggleComplete(reward.reward_id)}
                    >
                      ✔️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
