import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import Score from "../components/Score";
import ChildTasks from "./ChildTasks";
import ChildRewards from "./ChildRewards";
import UpdateChildForm from "../components/UpdateChildForm";
import { MdEdit } from "react-icons/md";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ChildDetails() {
  const { getToken } = useAuth();
  const { childId } = useParams();

  const [child, setChild] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch child, tasks & rewards
  useEffect(() => {
    if (!childId) return;

    async function fetchAll() {
      try {
        setIsLoading(true);
        const token = await getToken();

        const [childRes, tasksRes, rewardsRes] = await Promise.all([
          fetch(`${BASE_URL}/children/${childId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/children/${childId}/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/children/${childId}/rewards`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!childRes.ok || !tasksRes.ok || !rewardsRes.ok) {
          throw new Error("Error loading data");
        }

        const childData = await childRes.json();
        const tasksData = await tasksRes.json();
        const rewardsData = await rewardsRes.json();

        setChild(childData);
        setTasks(tasksData.tasks);
        setRewards(rewardsData.rewards);
      } catch (err) {
        console.error("Error loading child data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();
  }, [childId, getToken]);

  async function handleEditChild(formData) {
    try {
      const token = await getToken();

      const res = await fetch(`${BASE_URL}/children/${childId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Update fehlgeschlagen");

      const updatedChild = await res.json();
      setChild(updatedChild);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  }

  // Point calculation
  const totalPoints = useMemo(() => {
    const earned = tasks.reduce(
      (sum, task) => sum + (task.completed ? task.points : 0),
      0,
    );

    const spent = rewards.reduce(
      (sum, reward) => sum + (reward.redeemed ? reward.cost : 0),
      0,
    );

    return earned - spent;
  }, [tasks, rewards]);

  if (isLoading) {
    return (
      <p className="text-center text-gray-500 mt-20 animate-pulse">
        Lade Daten…
      </p>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="max-w-7xl mx-auto md:px-14 md:pt-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 text-gray-800">
          {/* Child info */}
          <div className="flex items-center justify-center lg:justify-start gap-4 min-w-0 my-10 md:my-0">
            <img
              className="w-28 h-28 lg:w-32 lg:h-32 rounded-full"
              src={child?.image}
              alt={child?.first_name}
            />
            <h1 className="text-3xl lg:text-5xl font-bold whitespace-nowrap">
              {child?.first_name}
            </h1>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xl p-1 rounded-full transition-transform duration-200 transform hover:scale-200"
              title="Bearbeiten"
            >
              <MdEdit />
            </button>
          </div>

          {/* Score */}
          <div className="flex justify-center lg:justify-end">
            <Score totalPoints={totalPoints} />
          </div>
        </div>
      </div>

      {isEditing && child && (
        <UpdateChildForm
          initialChild={child}
          onEdit={handleEditChild}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {/* Tasks */}
      <ChildTasks tasks={tasks} setTasks={setTasks} />

      {/* Rewards */}
      <ChildRewards
        rewards={rewards}
        setRewards={setRewards}
        totalPoints={totalPoints}
      />
    </>
  );
}
