import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="page">
      <h1>404</h1>
      <p>This page does not exist.</p>
      <Link to="/" className="text-text font-bold no-underline">
        Menu
      </Link>
    </div>
  );
}
