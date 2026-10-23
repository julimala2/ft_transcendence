import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Styling/Modal.module.css";

export function Modal({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const close = () => {
    // Navigate back to the background location or home if none exists
    if (location.state?.backgroundLocation) {
      navigate(location.state.backgroundLocation, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [navigate, location]);

  return createPortal(
    <div className="fixed inset-0 grid place-items-center z-1000  bg-gray-950/50" onClick={close}>
      <div
        className={styles.modalContent}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.modalClose} onClick={close} aria-label="Fermer">
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}