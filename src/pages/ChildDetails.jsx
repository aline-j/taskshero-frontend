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
        console.log(child);
      } catch (err) {
        console.error("Fehler beim Laden des Kindes:", err);
      }
    }

    if (childId) fetchChild();
    console.log(child);
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
      <div className="flex flex-col items-center text-center">
        <img
          className="w-34 h-34 mb-4 rounded-full shadow-lg"
          src={child?.image}
          alt={child?.first_name}
        />

        <h1 className="text-4xl font-bold mb-6 lg:text-5xl">
          {child?.first_name}
        </h1>

        <Score tasks={tasks} rewards={rewards} />
      </div>

      <ChildTasks />
      <ChildRewards />
    </>
  );
}
