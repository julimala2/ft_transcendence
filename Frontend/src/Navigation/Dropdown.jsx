import { useState } from 'react';
import '../Styling/Dropdown.css';

export function Dropdown({ label, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="dropdown-trigger">{label}</button>
      {open && <div className="dropdown-content">{children}</div>}
    </div>
  );
}