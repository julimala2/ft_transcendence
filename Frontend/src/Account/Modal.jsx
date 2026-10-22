import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import styles from "./Styling/Modal.module.css";

export function Modal({ children }) {
  const navigate = useNavigate();
  const close = () => navigate(-1);

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && navigate(-1);
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [navigate]);

  return createPortal(
    <div className={styles.modalOverlay} onClick={close}>
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