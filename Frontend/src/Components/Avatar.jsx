export function Avatar({ src, username, size = 40 }) {
  const initial = username?.[0]?.toUpperCase() ?? '?';

  if (src) {
    return (
      <img
        src={src}
        alt={username}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center bg-accent text-white font-semibold select-none"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
    >
      {initial}
    </div>
  );
}
