import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Score from "../components/Score";

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

  // Load tasks
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
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
      const response = await fetch(
        `${BASE_URL}/children/${childId}/tasks/${taskId}/completed`,
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
      console.error("Fehler beim Abschließen der Aufgabe:", err);

      // Rollback in case of error
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
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
            {child?.first_name}´s Aufgaben
          </h1>

          <Score tasks={tasks} rewards={rewards} />

          {tasks.length === 0 ? (
            <p className="text-center text-gray-500">
              Du hast aktuelle keine Aufgaben.
            </p>
          ) : (
            <div>
              {/* Tasks ToDo */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
                {tasks
                  .filter((task) => !task.completed)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="relative w-card-width h-[300px] bg-white shadow rounded-md p-4 flex flex-col sm:w-card-width-md"
                    >
                      <div className="absolute top-2 right-2 bg-amber-400 text-black text-xs font-semibold px-2 py-1 rounded-full">
                        {task.points} Punkte
                      </div>
                      <img
                        className="w-full h-[160px] object-cover rounded-md"
                        src={task.image}
                        alt={task.title}
                      />
                      <h3 className="mt-3 mb-1 text-lg text-center font-semibold">
                        {task.title}
                      </h3>
                      <div className="absolute bottom-2 right-2 flex gap-2">
                        <button
                          className="text-xl p-1 rounded-full transition-transform duration-200 hover:-translate-y-0.5"
                          onClick={() => handleCompleted(task.id)}
                        >
                          ✔️
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Tasks already completed */}
              <h2 className="font-bold my-10 text-center text-2xl lg:my-20">
                Bereits erledigte Aufgaben
              </h2>
              {tasks.filter((task) => task.completed).length === 0 ? (
                <p className="text-center text-lg text-gray-600 mt-20">
                  Du hast noch keine Aufgaben erledigt.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
                  {tasks
                    .filter((task) => task.completed)
                    .map((task) => (
                      <div
                        key={`completed-${task.id}`}
                        className="relative w-card-width h-[300px] bg-gray-100 shadow rounded-md p-4 flex flex-col sm:w-card-width-md opacity-50"
                      >
                        <div className="absolute top-2 right-2 bg-amber-400 text-black text-xs font-semibold px-2 py-1 rounded-full">
                          {task.points} Punkte
                        </div>
                        <img
                          className="w-full h-[160px] object-cover rounded-md"
                          src={task.image}
                          alt={task.title}
                        />
                        <h3 className="mt-3 mb-1 text-lg text-center font-semibold line-through">
                          {task.title}
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
