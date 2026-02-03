import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import Score from "../components/Score";
import ChildRewards from "./ChildRewards";
import ChildTasks from "./ChildTasks";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ChildDetails() {
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
        console.log(childId);

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

  return (
    <>
      <div className="max-w-7xl mx-auto md:p-14">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Child info */}
          <div className="flex items-center justify-center lg:justify-start gap-4 min-w-0 my-10 md:my-0">
            <img
              className="w-28 h-28 lg:w-32 lg:h-32 rounded-full shadow-lg flex-shrink-0"
              src={child?.image}
              alt={child?.first_name}
            />
            <h1 className="text-3xl lg:text-5xl font-bold whitespace-nowrap">
              {child?.first_name}
            </h1>
          </div>

          {/* Score */}
          <div className="flex justify-center lg:justify-end">
            <Score tasks={tasks} rewards={rewards} />
          </div>
        </div>
      </div>

      <ChildTasks />
      <ChildRewards />
    </>
  );
}
