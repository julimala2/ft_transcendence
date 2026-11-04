// import { useState } from "react";

// export default function Component() {
//   const [count, setCount] = useState(0);

//   return (
//     <div className="min-h-screen w-full bg-white fixed top-0 left-0">
//   {/* Emerald Glow Background */}
//   <div
//     className="absolute inset-0 z-0"
//     style={{
//       backgroundImage: `
//         radial-gradient(125% 125% at 50% 90%, #3d1154 60%, #6b278f 100%)
//       `,
//       backgroundSize: "100% 100%",
//     }}
//   />
//   {/* Your Content/Components */}
// </div>

//   );
// };
import { useMemo } from "react";
import "./MoneyRain.css";

// Petit générateur pseudo-aléatoire stable : les starets gardent
// la même position d'un rendu à l'autre (pas de "saut" au re-render).
function rand(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function MoneyRain({ count = 50, value = "100", symbol = "€" }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const duration = 7 + rand(i + 1) * 6; // 7 à 13 s par chute
        return {
          id: i,
          left: rand(i + 11) * 100, // position horizontale en %
          duration,
          delay: -rand(i + 21) * duration, // délai NÉGATIF : l'écran est déjà rempli au chargement
          variant: (i % 4) + 1, // 4 trajectoires différentes
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
          {/* Le scale est sur l'enfant : le parent a déjà son transform animé */}
          <div className="star-face" style={{ transform: `scale(${b.scale})` }}>

          </div>
        </div>
      ))}
    </div>
  );
}