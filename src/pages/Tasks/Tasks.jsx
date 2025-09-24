import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Task } from "./Task";
import { AddTaskForm } from "../../components/AddTaskForm/AddTaskForm";
import "./Tasks.css";

const BASE_URL = import.meta.env.VITE_API_URL;

export function Tasks() {
  const { userId, sessionId, getToken, isLoaded, isSignedIn, signOut } =
    useAuth();
  const [tasks, setTasks] = useState([]);
  const [groupFilter, setGroupFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  // Get tasks from the API (defined in component scope so it can be reused)
  async function getTasks() {
    try {
      const token = await getToken();
      const res = await fetch(`${BASE_URL}/tasks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("HTTP error " + res.status);

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }

  // Fetch when Clerk is loaded and the user is signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getTasks();
    }
  }, [isLoaded, isSignedIn]);

  // Callback form AddTaskForm
  async function handleAddTask(newTask) {
    try {
      const token = await getToken();
      const res = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) throw new Error("HTTP error " + res.status);

      await getTasks();
      setShowForm(false);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  }

  // Filter logic: if "all", show all tasks, otherwise filter by group
  const filteredTasks =
    groupFilter === "all"
      ? tasks
      : tasks.filter((task) => task.group === groupFilter);

  return (
    <div>
      <h1>Tasks Pool</h1>

      <div className="task-form">
        {/* Button to display the Add Task form */}
        {!showForm && (
          <button onClick={() => setShowForm(true)}>
            Neue Task hinzufügen
          </button>
        )}

        {/* AddTaskForm component */}
        {showForm && (
          <AddTaskForm
            onAdd={handleAddTask}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>

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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredTasks.map((task) => (
          <Task
            key={task.task_id}
            title={task.title}
            points={task.points}
            group={task.group}
            task_id={task.task_id}
            getToken={getToken}
            onTaskDeleted={(task_id) => {
              console.log(
                "Task",
                task_id,
                "has been deleted! I will fetch the fresh data..."
              );
              getTasks();
            }}
            onTaskEdit={(updateTask) => {
              console.log(
                "Task",
                updateTask,
                "has been updated! I will fetch the fresh data..."
              );
              getTasks();
            }}
          />
        ))}
      </div>
    </div>
  );
}
