import { MdCancel as ExitIcon } from "react-icons/md";
import styles from "@/app/style/sideslide.module.css";

export default function SideSlide({
  isOpen,
  onClose,
  children,
  className = "",
  closeOnOverlayClick = true,
  showCloseButton = true,
}) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.sideMain} onClick={handleOverlayClick}>
      <div
        className={`${styles.sideModal} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <div className={styles.sideHeader}>
            <button className={styles.closeMainBtn} onClick={onClose}>
              <ExitIcon
                className={styles.closeIcon}
                alt="Exit icon"
                aria-label="Exit icon"
              />
            </button>
          </div>
        )}
        <div className={styles.sideContent}>{children}</div>
      </div>
    </div>
  );
}
