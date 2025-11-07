export default function Score({ tasks, rewards }) {
  const totalTaskPoints = tasks.reduce((acc, cur) => {
    return acc + (cur.completed ? cur.points : 0);
  }, 0);

  const totalRewardsPoints = rewards.reduce((acc, cur) => {
    return acc + (cur.redeemed ? cur.cost : 0);
  }, 0);

  const totalPoints = totalTaskPoints - totalRewardsPoints;

  return (
    <div>
      <h3 className="font-bold mt-10 text-center text-2xl lg:mt-20">
        Punktestand
      </h3>

      <p className="text-center text-5xl font-extrabold text-amber-500 mt-5 mb-10 lg:mb-20">
        {totalPoints}
      </p>
    </div>
  );
}
