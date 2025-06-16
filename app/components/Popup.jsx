"use client";

import styles from "@/app/style/popup.module.css";
import { MdCancel as ExitIcon } from "react-icons/md";

export default function PopupComponent({
  BorderRadiusTopLeft = 0,
  BorderRadiusTopRight = 0,
  BorderRadiusBottomRight = 0,
  BorderRadiusBottomLeft = 0,
  IsOpen,
  OnClose,
  Content,
  Width,
  Height,
  Top,
  Right,
  Left,
  Blur,
  Bottom,
  Zindex,
}) {
  if (!IsOpen) {
    return null;
  }

  return (
    <div
      className={styles.popupContainer}
      style={{ zIndex: Zindex, backdropFilter: `blur(${Blur}px)` }}
    >
      <div
        className={styles.popup}
        style={{
          top: `${Top}px`,
          right: `${Right}px`,
          bottom: `${Bottom}px`,
          left: `${Left}px`,
          width: `${Width}px`,
          height: `${Height}px`,
          borderRadius: `${BorderRadiusTopLeft}px ${BorderRadiusTopRight}px ${BorderRadiusBottomRight}px ${BorderRadiusBottomLeft}px`,
        }}
      >
        <div className={styles.popupHeader}>
          <div className={styles.popupExit} onClick={OnClose}>
            <ExitIcon
              className={styles.popupIcon}
              alt="Exit icon"
              aria-label="Exit icon"
            />
          </div>
        </div>
        {Content}
      </div>
    </div>
  );
}
