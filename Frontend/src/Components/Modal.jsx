import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

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
    <div className="modal-overlay" onClick={close}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={close} aria-label="Fermer">
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}