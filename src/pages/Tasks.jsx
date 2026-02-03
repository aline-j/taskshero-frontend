import { useAuth, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useEffect, useState, useRef } from "react";
import Task from "../components/Task";
import AddTaskForm from "../components/AddTaskForm";
import FilterTasks from "../components/FilterTasks";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Tasks() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [groupFilter, setGroupFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const focusRef = useRef(null);
  const [focusId, setFocusId] = useState(null);
  const [focusCount, setFocusCount] = useState(0);

  useEffect(() => {
    focusRef.current = focusId;
  }, [focusId, focusCount]);

  // Get tasks from the API
  async function getTasks() {
    try {
      setIsLoading(true);
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/tasks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      const formData = new FormData();
      formData.append("title", newTask.title);
      formData.append("points", newTask.points);
      formData.append("group", newTask.group);
      formData.append("image_mode", newTask.image_mode);
      if (newTask.image_mode === "Bildupload" && newTask.imageFile) {
        formData.append("file", newTask.imageFile);
      }
      const token = await getToken();
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("HTTP error " + response.status);

      const { task_id: newTaskId } = await response.json();
      await getTasks();
      setShowForm(false);
      setFocusId(newTaskId);
      setFocusCount((prev) => prev + 1);
      setSuccessMessage("Aufgabe erfolgreich hinzugefügt ✅");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error adding task:", err);
      setErrorMessage("Fehler beim Speichern der neuen Aufgabe ❌");
      setTimeout(() => setErrorMessage(""), 4000);
    } finally {
      setIsLoading(false);
    }
  }

  // Filter logic: if "all", show all tasks, otherwise filter by group
  const filteredTasks =
    groupFilter === "all"
      ? tasks
      : tasks.filter((task) => task.group === groupFilter);

  const sortedTasks = filteredTasks.toSorted((a, b) => a.points - b.points);

  return (
    <div>
      <SignedIn>
        <h1 className="text-4xl font-bold my-10 text-center lg:text-5xl lg:my-20">
          Aufgaben Pool
        </h1>

        {/* Feedback Messages */}
        {successMessage && (
          <p className="text-green-600 text-center font-medium mt-6 transition-opacity duration-500">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-red-600 text-center font-medium mt-6 transition-opacity duration-500">
            {errorMessage}
          </p>
        )}

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 px-4">
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
        <FilterTasks
          groupFilter={groupFilter}
          setGroupFilter={setGroupFilter}
        />

        {/* Grid with the filtered tasks */}
        {isLoading ? (
          <p className="text-center text-gray-500 mt-10">Lade Aufgaben...</p>
        ) : (
          <div className="grid grid-cols-2 mt-20 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {sortedTasks.map((task) => (
              <div
                key={task.task_id}
                ref={(el) => {
                  if (!el) return;
                  if (focusRef.current === task.task_id) {
                    el.scrollIntoView({ block: "center", behavior: "smooth" });
                    focusRef.current = null;
                  }
                }}
              >
                <Task
                  title={task.title}
                  points={task.points}
                  group={task.group}
                  image={task.image}
                  task_id={task.task_id}
                  getToken={getToken}
                  onTaskDeleted={(task_id) => {
                    console.log("Task", task_id, "has been deleted!");
                    getTasks();
                  }}
                  onTaskEdit={(updatedTask) => {
                    console.log("Task", updatedTask, "has been updated!");
                    getTasks();
                    setFocusId(task.task_id);
                    setFocusCount((prev) => prev + 1);
                  }}
                  onTaskAssignment={(taskAssignment) => {
                    console.log("Task", taskAssignment, "has been assigned!");
                    getTasks();
                  }}
                />
              </div>
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
