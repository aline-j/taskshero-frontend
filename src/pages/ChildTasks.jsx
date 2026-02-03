import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ChildTasks({ tasks, setTasks }) {
  const { getToken } = useAuth();
  const { childId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [showTasks, setShowTasks] = useState(false);

  // Complete task
  async function handleCompleted(taskId) {
    try {
      setIsLoading(true);
      const token = await getToken();

      // Optimistic UI update
      setTasks((prev) =>
        prev.map((task) =>
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

      if (!response.ok) {
        throw new Error("HTTP-Fehler " + response.status);
      }
    } catch (err) {
      console.error("Fehler beim Abschließen der Aufgabe:", err);

      // Rollback
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-auto md:px-4 py-10 text-left">
      <div className="max-w-7xl mx-auto md:bg-white md:p-14 border-b-4 border-cyan-600">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-700">
            Deine Aufgaben
          </h1>
          <p className="text-gray-500 mt-2">
            Erledige Aufgaben und sammle Punkte ⭐
          </p>

          <button
            onClick={() => setShowTasks((prev) => !prev)}
            className="md:w-auto px-6 py-3 mt-10 text-md border rounded-md bg-gray-100 hover:shadow-md hover:bg-white"
          >
            {showTasks ? "Aufgaben ausblenden" : "Aufgaben anzeigen"}
          </button>
        </header>

        {showTasks && (
          <>
            {tasks.length === 0 ? (
              <p className="text-center text-gray-500">
                Du hast aktuell keine Aufgaben.
              </p>
            ) : (
              <>
                {/* Open tasks */}
                <section className="mb-20">
                  <h2 className="text-xl font-semibold text-gray-700 mb-6">
                    Offene Aufgaben
                  </h2>

                  <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {tasks
                      .filter((task) => !task.completed)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                          <img
                            src={task.image}
                            alt={task.title}
                            className="h-40 w-full object-cover"
                          />

                          <div className="p-4 flex flex-col gap-3">
                            <p className="text-center font-semibold text-lg text-gray-600 mb-3">
                              ⭐ {task.points}
                            </p>

                            <h3 className="font-semibold text-gray-800 text-center">
                              {task.title}
                            </h3>

                            <button
                              disabled={isLoading}
                              onClick={() => handleCompleted(task.id)}
                              className="mt-auto w-full rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-medium py-2 transition-colors"
                            >
                              Aufgabe erledigt
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>

                {/* Completed tasks */}
                <section>
                  <h2 className="text-xl font-semibold text-gray-700 mb-6">
                    Bereits erledigt
                  </h2>

                  {tasks.filter((t) => t.completed).length === 0 ? (
                    <p className="text-gray-500">
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
                            <div className="p-4">
                              <p className="text-center font-semibold text-lg text-gray-600 mb-3">
                                ⭐ {task.points}
                              </p>
                              <h3 className="text-center text-gray-600 font-medium line-through">
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
          </>
        )}
      </div>
    </div>
  );
}
