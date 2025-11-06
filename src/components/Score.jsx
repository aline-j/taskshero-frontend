import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Score({ child, childId, tasks }) {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  async function calculateScore() {
    try {
      setIsLoading(true);
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/children/${childId}/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("HTTP error " + response.status);
      const data = await response.json();

      let total = 0;
      for (const task of data.tasks) {
        console.log(task);
        console.log(task.completed);
        console.log(task.points);
        if (task.completed) {
          total += task.points;
        }
      }
      setTotalPoints(total);
    } catch (err) {
      console.log("Fehler bei Berechnung des Punktestandes:", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    calculateScore();
  }, [childId, tasks]);

  return (
    <div>
      <h3 className="font-bold mt-10 text-center text-2xl lg:mt-20">
        Punktestand
      </h3>

      {isLoading ? (
        <p className="text-center text-gray-500">Berechne Punktestand...</p>
      ) : (
        <p className="text-center text-5xl font-extrabold text-amber-500 mt-5 mb-10 lg:mb-20">
          {totalPoints}
        </p>
      )}
    </div>
  );
}
