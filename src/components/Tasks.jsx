import { useEffect, useState } from "react";
import { Task } from "./Task";
import "./Tasks.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [groupFilter, setGroupFilter] = useState("all");

  // Get tasks from the API when loading the component
  useEffect(() => {
    async function getTasks() {
      try {
        const res = await fetch(`${BASE_URL}/tasks`);
        if (!res.ok) throw new Error("HTTP error " + res.status);

        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Error:", err);
      }
    }

    getTasks();
  }, []);

  // Filter logic: if "all", show all tasks, otherwise filter by group
  const filteredTasks =
    groupFilter === "all"
      ? tasks
      : tasks.filter((task) => task.group === groupFilter);

  return (
    <div>
      <h1>Tasks Pool</h1>

      {/* Filter buttons for age groups */}
      <div className="filters">
        <button onClick={() => setGroupFilter("all")}>Alle Altersgrupen</button>
        <button onClick={() => setGroupFilter("Kindergartenalter")}>
          Kindergartenalter
        </button>
        <button onClick={() => setGroupFilter("Grundschulalter")}>
          Grundschulalter
        </button>
        <button onClick={() => setGroupFilter("Teenager")}>Teenager</button>
      </div>

      {/* Grid with the filtered tasks */}
      <div className="cards">
        {filteredTasks.map((task) => (
          <Task
            key={task.task_id}
            title={task.title}
            points={task.points}
            group={task.group}
          />
        ))}
      </div>
    </div>
  );
}
