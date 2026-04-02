import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa6";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  function handleStart() {
    if (isSignedIn) {
      navigate("/family");
    } else {
      navigate("/login");
    }
  }

  function handleRegister() {
    if (isSignedIn) {
      navigate("/family");
    } else {
      navigate("/login?mode=register");
    }
  }

  return (
    <div className="max-w-7xl mx-auto md:px-14 md:py-6">
      {/* HERO */}
      <section className="py-12 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Aufgaben werden zum{" "}
            <span className="text-amber-600">Abenteuer</span>
          </motion.h1>

          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Motiviere deine Kinder spielerisch. Punkte sammeln, Belohnungen
            verdienen und gemeinsam wachsen.
          </p>

          <button
            onClick={handleStart}
            className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-md text-lg font-medium shadow-md hover:shadow-xl transition-all"
          >
            Jetzt starten
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="pt-10 pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-14">
            Warum TasksHero?
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Aufgaben verwalten",
                text: "Erstelle Aufgaben mit Punkten und Bildern.",
              },
              {
                title: "Belohnungen definieren",
                text: "Individuelle Rewards motivieren nachhaltig.",
              },
              {
                title: "Punkte-System",
                text: "Sofortige visuelle Erfolgserlebnisse.",
              },
              {
                title: "Vorlesefunktion",
                text: "Texte werden kinderfreundlich vorgelesen.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-md shadow-md hover:shadow-xl transition-all"
              >
                <div className="flex justify-center mb-4 text-amber-600 text-2xl">
                  <FaStar />
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {feature.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-white md:rounded-b-md md:shadow-md">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-14">So funktioniert es</h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              "Familie anlegen & Kinder hinzufügen",
              "Aufgaben zuweisen und Punkte verdienen",
              "Belohnungen einlösen und feiern 🎉",
            ].map((step, index) => (
              <div key={index}>
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-cyan-600 text-white text-xl font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 text-center bg-cyan-600 text-white md:rounded-b-md md:shadow-md">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Starte noch heute mit TasksHero
        </h2>
        <p className="mb-8 text-lg">Mehr Motivation. Weniger Diskussionen.</p>

        <button
          onClick={handleRegister}
          className="bg-white text-cyan-700 px-8 py-3 rounded-md font-semibold shadow-md hover:shadow-xl transition-all"
        >
          Kostenlos ausprobieren
        </button>
      </section>
    </div>
  );
}
