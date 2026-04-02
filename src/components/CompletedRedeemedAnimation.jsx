import { useEffect, useState } from "react";

export default function CompletedRedeemedAnimation({
  trigger,
  onClose,
  title,
  text,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [trigger, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Message */}
      <div className="relative bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center justify-center max-w-xs text-center">
        <h1 className="text-lg md:text-xl font-bold text-cyan-700 mb-2">
          {title}
        </h1>
        <p className="text-gray-700 text-sm md:text-base">{text}</p>
      </div>
    </div>
  );
}
