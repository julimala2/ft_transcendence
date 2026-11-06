export function Cursor({ username, x, y }) {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate(${x}px, ${y}px)`,
        pointerEvents: "none",
        transition: "transform 0.1s linear",
      }}
    >
      <span style={{ fontSize: 24 }}>⭐</span>
      <span style={{ fontSize: 12 }}>{username}</span>
    </div>
  );
}