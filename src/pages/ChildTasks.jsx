import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ChildTasks({ tasks, setTasks }) {
  const { getToken } = useAuth();
  const { childId } = useParams();

  const [isLoading, setIsLoading] = useState(false);

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
        </header>

        {tasks.filter((t) => !t.completed).length === 0 ? (
          <p className="text-center text-gray-500">
            Du hast aktuell keine Aufgaben.
          </p>
        ) : (
          <>
            {/* Open tasks */}
            <section className="mb-20">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Offene Aufgaben
              </h2>

              <div className="grid gap-3 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {tasks
                  .filter((task) => !task.completed)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="relative flex flex-col bg-white rounded-b-md shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      {/* Points Badge */}
                      <div className="absolute top-0 right-0 flex items-center gap-2 rounded-l-md bg-gray-700 px-2 py-1 text-sm font-semibold text-white">
                        ⭐ {task.points}
                      </div>
                      <img
                        src={task.image}
                        alt={task.title}
                        className="h-38 w-full object-cover md:h-48"
                      />

                      <div className="p-3 mt-2 flex flex-col flex-1 gap-3">
                        <h3 className="font-medium text-md text-gray-800 text-center flex-1">
                          {task.title}
                        </h3>

                        <button
                          disabled={isLoading}
                          onClick={() => handleCompleted(task.id)}
                          className="w-full rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-md py-2 md:mt-4"
                        >
                          erledigt
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* Completed tasks */}
            {tasks.filter((t) => t.completed).length > 0 && (
              <section className="mb-20">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Bereits erledigt
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                  {tasks
                    .filter((task) => task.completed)
                    .map((task) => (
                      <div
                        key={`completed-${task.id}`}
                        className="min-w-[180px] sm:min-w-[220px] md:bg-slate-100 bg-white rounded-md opacity-60 snap-start flex-shrink-0"
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
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
