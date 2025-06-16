"use client";

import styles from "@/app/style/paymentpopup.module.css";

export default function PopupComponent({ IsOpen, OnClose, Content }) {
  if (!IsOpen) {
    return null;
  }

  return (
    <div className={styles.popupContainer}>
      <div className={styles.popup}>{Content}</div>
    </div>
  );
}
