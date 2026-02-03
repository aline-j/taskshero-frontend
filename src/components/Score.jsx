import { useEffect } from "react";

export default function Score({ tasks, rewards, onPointsCalculated }) {
  const totalTaskPoints = tasks.reduce((acc, cur) => {
    return acc + (cur.completed ? cur.points : 0);
  }, 0);

  const totalRewardsPoints = rewards.reduce((acc, cur) => {
    return acc + (cur.redeemed ? cur.cost : 0);
  }, 0);

  const totalPoints = totalTaskPoints - totalRewardsPoints;

  // Callback when totalPoints changes
  useEffect(() => {
    if (onPointsCalculated) {
      onPointsCalculated(totalPoints);
    }
  }, [totalPoints, onPointsCalculated]);

  return (
    <div>
      <p className="text-center text-5xl lg:text-6xl font-extrabold text-amber-500 mt-5 mb-10 lg:mb-20">
        ⭐ {totalPoints}
      </p>
    </div>
  );
}
