export function Cursor({ username, x, y }) {
  return (
    <div
      className="fixed -left-4 -top-[22px] pointer-events-none z-[9999] transition-transform duration-100 ease-linear"
      style={{
        transform: `translate(${x}px, ${y}px)`
      }}
    >
      <span className="text-2xl">⭐</span>
      {/* <span className="text-sm">{username}</span> */}
    </div>
  );
}