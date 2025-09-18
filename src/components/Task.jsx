import "./Task.css";

export function Task({ title, points }) {
  return (
    <div className="card">
      {/* Points display */}
      <div className="points">{points}</div>

      {/* Placeholder image */}
      <img
        className="card-image"
        src="/images/tasks/Task-Zimmer-aufraeumen.png"
        alt="Zimmer aufräumen"
      />

      {/* Task title */}
      <h3>{title}</h3>
    </div>
  );
}
