"use client";
import { useEffect, useState } from "react";
import styles from "@/app/style/skeleton.module.css";

export default function Loader({ height, width }) {
  const [currentWidth, setCurrentWidth] = useState(width);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768) {
        setCurrentWidth("100%");
      } else {
        setCurrentWidth(width);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  return (
    <div
      className={styles.skeleton}
      style={{ height: height, width: currentWidth }}
    ></div>
  );
}
