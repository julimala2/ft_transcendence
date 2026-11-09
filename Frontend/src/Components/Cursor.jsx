export function Cursor({ username, x, y }) {
  return (
    <div
      style={{
        position: "fixed",
        left: -16,
        top: -22,
        transform: `translate(${x}px, ${y}px)`,
        pointerEvents: "none",
        transition: "transform 0.1s linear",
        zIndex: 9999
      }}
    >
      <span style={{ fontSize: 24 }}>⭐</span>
      {/* <span style={{ fontSize: 12 }}>{username}</span> */}
    </div>
  );
}