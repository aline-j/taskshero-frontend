import { useRef, useEffect, useState } from "react";
import { useMotionValue, animate } from "motion/react";

export default function Score({ totalPoints }) {
  const [displayValue, setDisplayValue] = useState(totalPoints);
  const circleRef = useRef(null);
  const motionVal = useMotionValue(0);

  const size = 140;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    motionVal.set(0);
    const controls = animate(motionVal, totalPoints, {
      type: "tween",
      duration: 1,
      ease: [0.16, 1, 0.3, 1],

      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
        if (circleRef.current) {
          const progress = Math.min(1, latest / (totalPoints || 1));
          const offset = circumference * (1 - progress);
          circleRef.current.style.strokeDashoffset = String(offset);
        }
      },
    });

    return () => controls.stop();
  }, [totalPoints, circumference, motionVal]);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "rotate(-90deg)",
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="transparent"
          strokeWidth={strokeWidth}
        />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#0891b2"
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      <div
        style={{
          color: "#1f2937",
          fontSize: "3rem",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="flex items-center justify-center font-extrabold 0 gap-3">
          {displayValue}
        </div>
      </div>
    </div>
  );
}
