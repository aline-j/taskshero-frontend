import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ChildTasks() {
  const { getToken } = useAuth();
  const { childId } = useParams();
  const [child, setChild] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  // Load tasks and rewards
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
        console.error("Fehler beim Laden der Belohnungen:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (childId) fetchTasksAndRewards();
  }, [childId, getToken]);

  // Mark task as completed
  async function handleCompleted(taskId) {
    try {
      const token = await getToken();

      // Optimistic UI update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        ),
      );
      const response = await fetch(
        `${BASE_URL}/child/${childId}/tasks/${taskId}/completed`,
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
      console.error("Fehler beim Abschließen der Aufgabe:", err);

      // Rollback in case of error
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        ),
      );
    }
  }

  return (
    <div className="min-h-screen md:px-4 py-10 text-left">
      {isLoading ? (
        <p className="text-center text-slate-500 mt-20 animate-pulse">
          Lade Aufgaben…
        </p>
      ) : (
        <div className="max-w-7xl mx-auto md:bg-white md:p-14">
          {/* Header */}
          <header className="mb-12 ">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Deine Aufgaben
            </h1>
            <p className="text-slate-500 mt-2">
              Erledige Aufgaben und sammle Punkte ⭐
            </p>
          </header>

          {tasks.length === 0 ? (
            <p className="text-center text-slate-500">
              Du hast aktuell keine Aufgaben.
            </p>
          ) : (
            <>
              {/* Offene Aufgaben */}
              <section className="mb-20">
                <h2 className="text-xl font-semibold text-slate-700 mb-6">
                  Offene Aufgaben
                </h2>

                <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {tasks
                    .filter((task) => !task.completed)
                    .map((task) => (
                      <div
                        key={task.id}
                        className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                      >
                        {/* Points Badge */}
                        <div className="absolute top-2 right-0 z-10 flex items-center gap-1.5 rounded-l-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                          ⭐ {task.points}
                        </div>

                        <img
                          src={task.image}
                          alt={task.title}
                          className="h-40 w-full object-cover"
                        />

                        <div className="p-4 flex flex-col gap-3">
                          <h3 className="font-semibold text-slate-800 text-center">
                            {task.title}
                          </h3>

                          <button
                            onClick={() => handleCompleted(task.id)}
                            className="mt-auto w-full rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 transition-colors"
                          >
                            Aufgabe erledigt
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </section>

              {/* Erledigte Aufgaben */}
              <section>
                <h2 className="text-xl font-semibold text-slate-700 mb-6">
                  Bereits erledigt
                </h2>

                {tasks.filter((task) => task.completed).length === 0 ? (
                  <p className="text-slate-500">
                    Du hast noch keine Aufgaben erledigt.
                  </p>
                ) : (
                  <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {tasks
                      .filter((task) => task.completed)
                      .map((task) => (
                        <div
                          key={`completed-${task.id}`}
                          className="bg-slate-100 rounded-2xl overflow-hidden opacity-60"
                        >
                          <div className="relative">
                            <div className="absolute top-2 right-0 z-10 flex items-center gap-1.5 rounded-l-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-white shadow-sm">
                              ⭐ {task.points}
                            </div>
                            <img
                              src={task.image}
                              alt={task.title}
                              className="h-40 w-full object-cover grayscale"
                            />
                          </div>

                          <div className="p-4">
                            <h3 className="text-center text-slate-600 font-medium line-through">
                              {task.title}
                            </h3>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      )}
    </div>
  );
}
