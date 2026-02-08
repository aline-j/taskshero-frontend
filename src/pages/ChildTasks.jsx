import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import CompletedRedeemedAnimation from "../components/CompletedRedeemedAnimation";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ChildTasks({ tasks, setTasks }) {
  const { getToken } = useAuth();
  const { childId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // Complete task
  async function handleCompleted(taskId) {
    try {
      setIsLoading(true);
      const token = await getToken();

      // Optimistic UI update
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        ),
      );

      // Start animation for completed task
      setShowAnimation(true);

      const response = await fetch(
        `${BASE_URL}/children/${childId}/tasks/${taskId}/completed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("HTTP-Fehler " + response.status);
      }
    } catch (err) {
      console.error("Fehler beim Abschließen der Aufgabe:", err);

      // Rollback
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Speaks the provided text using the voice stored in localStorage.
  // Uses the Web Speech API with adjusted rate, pitch, and volume.
  function handleSpeak(text) {
    let currentVoice;
    const currentVoiceName = localStorage.getItem("voice");
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    for (const voice of voices) {
      if (voice.name === currentVoiceName) {
        currentVoice = voice;
      }
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = currentVoice;
    utterance.lang = "de-DE";
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="h-auto md:px-4 py-10 text-left relative">
      {/* Animation for completed task */}
      <CompletedRedeemedAnimation
        trigger={showAnimation}
        onClose={() => setShowAnimation(false)}
        title="🎉 Du bist so fleißig! 🎉"
        text="Die Punkte hast du dir verdient!"
      />
      <div className="max-w-7xl mx-auto md:bg-white md:rounded-b-md md:shadow-md md:px-14 md:py-6">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-700">
            Deine Aufgaben
          </h1>
          <p className="flex flex-col md:flex-row items-center justify-center text-gray-500 mt-2 gap-2">
            <span>Erledige Aufgaben und sammle Punkte</span>
            <FaStar />
          </p>
        </header>

        {tasks.filter((t) => !t.completed).length === 0 ? (
          <p className="text-center text-gray-500">
            Du hast aktuell keine Aufgaben.
          </p>
        ) : (
          <>
            {/* Open tasks */}
            <section className="mb-14">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Offene Aufgaben
              </h2>

              <div className="grid gap-3 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {tasks
                  .filter((task) => !task.completed)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="group relative flex flex-col bg-white rounded-b-md shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                      {/* Points Badge */}
                      <div className="absolute top-0 right-0 z-10 flex items-center gap-2 rounded-l-md bg-cyan-700 px-2 py-1 text-sm font-semibold text-white">
                        <FaStar />
                        <span>{task.points}</span>
                      </div>

                      {/* Adds voice support: Clicking on the task image will have the title read aloud. */}
                      <div
                        onClick={() => handleSpeak(task.description)}
                        className="relative"
                      >
                        <img
                          src={task.image}
                          alt={task.title}
                          className="h-38 w-full object-cover md:h-48"
                        />
                        <HiMiniSpeakerWave className="absolute bottom-1 right-1 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="p-3 mt-2 flex flex-col flex-1 gap-3">
                        <h3 className="font-medium text-md text-gray-800 text-center flex-1">
                          {task.title}
                        </h3>

                        <button
                          disabled={isLoading}
                          onClick={() => handleCompleted(task.id)}
                          className="w-full rounded-md bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-md py-1 md:mt-4"
                        >
                          erledigt
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* Completed tasks */}
            {tasks.filter((t) => t.completed).length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Bereits erledigt
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                  {tasks
                    .filter((task) => task.completed)
                    .map((task) => (
                      <div
                        key={`completed-${task.id}`}
                        className="min-w-[180px] sm:min-w-[220px] md:bg-slate-100 bg-white rounded-md opacity-60"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-center gap-2 mb-3 text-gray-600">
                            <FaStar className="text-lg" />
                            <span className="font-semibold text-lg">
                              {task.points}
                            </span>
                          </div>
                          <h3 className="text-center text-gray-600 font-medium line-through">
                            {task.title}
                          </h3>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
