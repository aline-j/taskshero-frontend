import { FaStar } from "react-icons/fa6";

export default function Score({ totalPoints }) {
  return (
    <div>
      <div className="flex items-center justify-center text-5xl lg:text-6xl font-extrabold mb-10 md:mb-0 gap-3">
        <FaStar />
        <span>{totalPoints}</span>
      </div>
    </div>
  );
}
