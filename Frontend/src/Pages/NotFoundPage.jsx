import { Link } from 'react-router-dom';

import layoutStyles from '../Styling/Layout.module.css';

export function NotFoundPage() {
  return (
    <div className="page">
      <h1>404</h1>
      <p>This page does not exist.</p>
      <Link to="/" className={layoutStyles.menuLink}>
        Menu
      </Link>
    </div>
  );
}
