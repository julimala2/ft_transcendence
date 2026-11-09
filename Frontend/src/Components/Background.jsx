import { useMemo } from "react";
import "./MoneyRain.css";

function rand(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function MoneyRain({ count = 30, value = "100", symbol = "€" }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const duration = 7 + rand(i + 1) * 6;
        return {
          id: i,
          left: rand(i + 11) * 100,
          duration,
          delay: -rand(i + 21) * duration,
          variant: (i % 4) + 1,
          scale: 0.7 + rand(i + 31) * 0.6,
          opacity: 0.6 + rand(i + 41) * 0.4,
        };
      }),
    [count]
  );

  return (
    <div className="money-rain" aria-hidden="true">
      {stars.map((b) => (
        <div
          key={b.id}
          className={`star fall-${b.variant}`}
          style={{
            left: `${b.left}%`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            opacity: b.opacity,
          }}
        >
          <div className="star-face" style={{ transform: `scale(${b.scale})` }}>
          </div>
        </div>
      ))}
    </div>
  );
}