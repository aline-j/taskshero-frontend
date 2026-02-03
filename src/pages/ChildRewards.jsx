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

  // Load rewards
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
      alert("Ups! Fehler! Wende dich an deine Mama.");

      // Rollback in case of error
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
    <div className="min-h-screen md:px-4 py-10 md:mt-20 text-left">
      {isLoading ? (
        <p className="text-center text-slate-500 mt-20 animate-pulse">
          Lade Belohnungen…
        </p>
      ) : (
        <div className="max-w-7xl mx-auto md:bg-white md:p-14">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Deine Belohnungen
            </h1>
            <p className="text-slate-500 mt-2">
              Sammle Punkte und löse sie gegen tolle Belohnungen ein 🎁
            </p>
          </header>

          {/* Error */}
          {errorMessage && (
            <div className="mb-8 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-center whitespace-pre-line">
              {errorMessage}
            </div>
          )}

          {rewards.length === 0 ? (
            <p className="text-center text-slate-500">
              Du hast aktuell keine Belohnungen.
            </p>
          ) : (
            <>
              {/* Available Rewards */}
              <section className="mb-20">
                <h2 className="text-xl font-semibold text-slate-700 mb-6">
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
                        {/* Cost Badge */}
                        <div className="absolute top-2 right-0 z-10 flex items-center gap-1.5 rounded-l-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                          ⭐ {reward.cost}
                        </div>

                        <img
                          src={reward.image}
                          alt={reward.title}
                          className="h-40 w-full object-cover"
                        />

                        <div className="p-4 flex flex-col gap-3">
                          <h3 className="font-semibold text-slate-800 text-center">
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

              {/* Redeemed Rewards */}
              <section>
                {rewards.filter((reward) => reward.redeemed).length === 0 ? (
                  <p className="text-slate-500">
                    Du hast noch keine Belohnungen eingelöst.
                  </p>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-slate-700 mb-6">
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
                            <div className="relative">
                              <div className="absolute top-2 right-0 z-10 flex items-center gap-1.5 rounded-l-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                                ⭐ {reward.cost}
                              </div>
                              <img
                                src={reward.image}
                                alt={reward.title}
                                className="h-40 w-full object-cover grayscale"
                              />
                            </div>

                            <div className="p-4">
                              <h3 className="text-center text-slate-600 font-medium line-through">
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
        </div>
      )}
    </div>
  );
}
