import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  const [showRewards, setShowRewards] = useState(false);

  // Load child
  useEffect(() => {
    async function fetchChild() {
      try {
        const token = await getToken();
        const response = await fetch(`${BASE_URL}/child/${childId}`, {
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

  // Load rewards & tasks
  useEffect(() => {
    async function fetchTasksAndRewards() {
      try {
        setIsLoading(true);
        const token = await getToken();

        const rewardsResponse = await fetch(
          `${BASE_URL}/child/${childId}/rewards`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!rewardsResponse.ok)
          throw new Error("HTTP error " + rewardsResponse.status);

        const rewardsData = await rewardsResponse.json();

        const tasksResponse = await fetch(
          `${BASE_URL}/child/${childId}/tasks`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
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
        "Deine Punkte reichen noch nicht, um diese Belohnung einzulösen!\nHierfür musst du noch ein bisschen fleißiger sein.",
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
            : reward,
        ),
      );

      const response = await fetch(
        `${BASE_URL}/child/${childId}/rewards/${rewardId}/redeemed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("HTTP-Fehler " + response.status);
    } catch (err) {
      console.error("Fehler beim Einlösen der Belohnung:", err);

      // Rollback
      setRewards((prev) =>
        prev.map((reward) =>
          reward.id === rewardId
            ? { ...reward, redeemed: !reward.redeemed }
            : reward,
        ),
      );
    }
  }

  return (
    <div className="h-auto md:px-4 py-10 md:mt-10 text-left">
      {isLoading ? (
        <p className="text-center text-gray-500 mt-20 animate-pulse">
          Lade Belohnungen…
        </p>
      ) : (
        <div className="max-w-7xl mx-auto md:bg-white md:p-14 border-b-4 border-amber-600">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-amber-600">
              Deine Belohnungen
            </h1>
            <p className="text-gray-500 mt-2">
              Sammle Punkte und löse sie gegen tolle Belohnungen ein 🎁
            </p>

            <button
              onClick={() => setShowRewards((prev) => !prev)}
              className="md:w-auto px-6 py-3 mt-10 text-md border rounded-md bg-gray-100 hover:shadow-md hover:bg-white"
            >
              {showRewards ? "Belohnungen ausblenden" : "Belohnungen anzeigen"}
            </button>
          </header>

          {/* Error */}
          {errorMessage && (
            <div className="mb-8 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-center whitespace-pre-line">
              {errorMessage}
            </div>
          )}

          {/* Rewards */}
          {showRewards && (
            <>
              {rewards.length === 0 ? (
                <p className="text-center text-gray-500">
                  Du hast aktuell keine Belohnungen.
                </p>
              ) : (
                <>
                  {/* Available rewards */}
                  <section className="mb-20">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6">
                      Verfügbare Belohnungen
                    </h2>

                    <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {rewards
                        .filter((reward) => !reward.redeemed)
                        .map((reward) => (
                          <div
                            key={reward.id}
                            className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                          >
                            <img
                              src={reward.image}
                              alt={reward.title}
                              className="h-40 w-full object-cover"
                            />

                            <div className="p-4 flex flex-col gap-3">
                              {/* Costs */}
                              <p className="text-center font-semibold text-lg text-gray-600 mb-3">
                                ⭐ {reward.cost}
                              </p>
                              <h3 className="font-semibold text-gray-800 text-center">
                                {reward.title}
                              </h3>

                              <button
                                onClick={() => handleRedeemed(reward.id)}
                                className="mt-auto w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 transition-colors"
                              >
                                Einlösen
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>

                  {/* Redeemed rewards */}
                  <section>
                    {rewards.filter((reward) => reward.redeemed).length ===
                    0 ? (
                      <p className="text-gray-500">
                        Du hast noch keine Belohnungen eingelöst.
                      </p>
                    ) : (
                      <>
                        <h2 className="text-xl font-semibold text-gray-700 mb-6">
                          Bereits eingelöst
                        </h2>

                        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                          {rewards
                            .filter((reward) => reward.redeemed)
                            .map((reward) => (
                              <div
                                key={`redeemed-${reward.id}`}
                                className="bg-slate-100 rounded-2xl overflow-hidden opacity-60"
                              >
                                <div className="p-4">
                                  {/* Costs */}
                                  <p className="text-center font-semibold text-lg text-gray-600 mb-3">
                                    ⭐ {reward.cost}
                                  </p>
                                  <h3 className="text-center text-gray-600 font-medium line-through">
                                    {reward.title}
                                  </h3>
                                </div>
                              </div>
                            ))}
                        </div>
                      </>
                    )}
                  </section>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
