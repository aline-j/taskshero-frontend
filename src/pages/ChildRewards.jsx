import { useAuth } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { FaGift } from "react-icons/fa6";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import CompletedRedeemedAnimation from "../components/CompletedRedeemedAnimation";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ChildRewards({ rewards, setRewards, totalPoints }) {
  const { getToken } = useAuth();
  const { childId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  // Redeem reward
  async function handleRedeemed(rewardId) {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return;

    if (!reward.redeemed && totalPoints < reward.cost) {
      setErrorMessage(
        "Deine Punkte reichen noch nicht, um diese Belohnung einzulösen!\n" +
          "Erledige noch ein paar Aufgaben ★",
      );
      setTimeout(() => setErrorMessage(""), 4000);
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken();

      // Optimistic update
      setRewards((prev) =>
        prev.map((r) =>
          r.id === rewardId ? { ...r, redeemed: !r.redeemed } : r,
        ),
      );

      // Start animation for redeemed reward
      setShowAnimation(true);

      const response = await fetch(
        `${BASE_URL}/child/${childId}/rewards/${rewardId}/redeemed`,
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
      console.error("Fehler beim Einlösen der Belohnung:", err);

      // Rollback
      setRewards((prev) =>
        prev.map((r) =>
          r.id === rewardId ? { ...r, redeemed: !r.redeemed } : r,
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
    <div className="h-auto md:px-4 py-5 text-left">
      <CompletedRedeemedAnimation
        trigger={showAnimation}
        onClose={() => setShowAnimation(false)}
        title="🎉 Viel Spaß mit deiner Belohnung 🎉"
        text="Das hast du gut ausgesucht"
      />
      <div className="max-w-7xl mx-auto md:bg-white md:rounded-b-md md:shadow-md md:px-14 md:py-6">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-600">
            Deine Belohnungen
          </h1>
          <p className="flex items-center justify-center text-gray-500 mt-2 gap-2">
            <span>Sammle Punkte und löse sie gegen tolle Belohnungen ein </span>
            <FaGift />
          </p>
        </header>

        {/* Error */}
        {errorMessage && (
          <div className="mb-8 rounded-md bg-red-50 border border-red-200 p-4 text-red-700 text-center whitespace-pre-line">
            {errorMessage}
          </div>
        )}

        {/* Rewards */}
        {rewards.filter((r) => !r.redeemed).length === 0 ? (
          <p className="text-center text-gray-500">
            Du hast aktuell keine Belohnungen.
          </p>
        ) : (
          <>
            {/* Available rewards */}
            <section className="mb-14">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Verfügbare Belohnungen
              </h2>

              <div className="grid gap-3 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {rewards
                  .filter((reward) => !reward.redeemed)
                  .map((reward) => (
                    <div
                      key={reward.id}
                      className="group relative flex flex-col bg-white rounded-b-md shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      {/* Points Badge */}
                      <div className="absolute top-0 right-0 z-10 flex items-center gap-2 rounded-l-md bg-amber-600 px-2 py-1 text-sm font-semibold text-white">
                        <FaStar />
                        <span>{reward.cost}</span>
                      </div>

                      {/* Adds voice support: Clicking on the reward image will have the title read aloud. */}
                      <div
                        onClick={() => handleSpeak(reward.title)}
                        className="relative"
                      >
                        <img
                          src={reward.image}
                          alt={reward.title}
                          className="h-40 w-full object-cover"
                        />
                        <HiMiniSpeakerWave className="absolute bottom-1 right-1 text-white opacity-0 group-hover:opacity-100" />
                      </div>

                      <div className="p-3 mt-2 flex flex-col flex-1 gap-3">
                        <h3 className="font-medium text-md text-gray-800 text-center flex-1">
                          {reward.title}
                        </h3>

                        <button
                          disabled={isLoading}
                          onClick={() => handleRedeemed(reward.id)}
                          className="w-full rounded-md bg-amber-500 hover:bg-amber-600 text-white font-medium text-md py-2 md:mt-4"
                        >
                          Einlösen
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* Redeemed rewards */}
            {rewards.filter((r) => r.redeemed).length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Bereits eingelöst
                </h2>

                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                  {rewards
                    .filter((reward) => reward.redeemed)
                    .map((reward) => (
                      <div
                        key={`redeemed-${reward.id}`}
                        className="min-w-[180px] sm:min-w-[220px] md:bg-slate-100 bg-white rounded-md opacity-60"
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-center gap-2 mb-3 text-gray-600">
                            <FaStar className="text-lg" />
                            <span className="font-semibold text-lg">
                              {reward.cost}
                            </span>
                          </div>
                          <h3 className="text-center text-gray-600 font-medium line-through">
                            {reward.title}
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
