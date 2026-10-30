import { useState } from "react";

export default function Component() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen w-full bg-white fixed top-0 left-0">
  {/* Emerald Glow Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #3d1154 60%, #6b278f 100%)
      `,
      backgroundSize: "100% 100%",
    }}
  />
  {/* Your Content/Components */}
</div>

  );
};
