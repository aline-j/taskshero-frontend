import { Link } from "react-router-dom";

export default function Child({ firstname, image, id }) {
  return (
    <Link to={`/child/${id}`}>
      <div className="bg-white shadow rounded-md p-4 flex flex-col items-center md:w-[200px] hover:shadow-xl hover:scale-105 transition-all duration-300">
        <img
          className="w-34 h-34 mb-3 rounded-full shadow-lg"
          src={image}
          alt={firstname}
        />
        <h5 className="mt-3 text-lg text-center font-semibold">{firstname}</h5>
      </div>
    </Link>
  );
}
