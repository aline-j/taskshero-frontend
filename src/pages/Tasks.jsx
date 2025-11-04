import { useAuth, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import Task from "./Task";
import AddTaskForm from "../components/AddTaskForm";
import Filter from "../components/Filter";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Tasks() {
  const { userId, sessionId, getToken, isLoaded, isSignedIn, signOut } =
    useAuth();
  const [tasks, setTasks] = useState([]);
  const [groupFilter, setGroupFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get tasks from the API (defined in component scope so it can be reused)
  async function getTasks() {
    try {
      setIsLoading(true);
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/tasks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("HTTP error " + response.status);

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch when Clerk is loaded and the user is signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      getTasks();
    }
  }, [isLoaded, isSignedIn]);

  // Callback AddTaskForm
  async function handleAddTask(newTask) {
    try {
      setIsLoading(true);
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error("HTTP error " + response.status);

      await getTasks();
      setShowForm(false);
    } catch (err) {
      console.error("Error adding task:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Filter logic: if "all", show all tasks, otherwise filter by group
  const filteredTasks =
    groupFilter === "all"
      ? tasks
      : tasks.filter((task) => task.group === groupFilter);

  return (
    <div>
      <SignedIn>
        <h1 className="text-4xl font-bold my-10 text-center lg:text-5xl lg:my-20">
          Aufgaben Pool
        </h1>

        <div className="flex flex-col md:flex-row justify-end items-center gap-4 mb-8 px-4">
          {/* Button to display the AddTaskForm */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="md:w-auto px-6 py-3 text-md border rounded-md hover:shadow-md hover:bg-white"
            >
              Neue Aufgabe hinzufügen
            </button>
          )}

          {/* AddTaskForm component */}
          {showForm && (
            <AddTaskForm
              onAdd={handleAddTask}
              onCancel={() => setShowForm(false)}
              className="w-full md:w-auto"
            />
          )}
        </div>

        {/* Dropdown-Filter */}
        <Filter groupFilter={groupFilter} setGroupFilter={setGroupFilter} />

        {/* Grid with the filtered tasks */}
        {isLoading ? (
          <p className="text-center text-gray-500 mt-10">Lade Aufgaben...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredTasks.map((task) => (
              <Task
                key={task.task_id}
                title={task.title}
                points={task.points}
                group={task.group}
                image={task.image}
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
                onTaskAssignment={(taskAssignment) => {
                  console.log(
                    "Task",
                    taskAssignment,
                    "has been assigned! I will fetch the fresh data..."
                  );
                  getTasks();
                }}
              />
            ))}
          </div>
        )}
      </SignedIn>

      <SignedOut>
        <p className="text-center text-lg text-gray-600 mt-20">
          Bitte melde dich an, um Aufgaben zu sehen.
        </p>
      </SignedOut>
    </div>
  );
}
