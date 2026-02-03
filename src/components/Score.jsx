export default function Score({ totalPoints }) {
  return (
    <div>
      <p className="text-center text-5xl lg:text-6xl font-extrabold text-amber-500 mb-10 md:mb-0">
        ⭐ {totalPoints}
      </p>
    </div>
  );
}
